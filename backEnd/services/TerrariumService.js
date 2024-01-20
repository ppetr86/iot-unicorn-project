"use strict";
const {CustomApiError} = require("../errors/CustomApiError");
const {StatusCodes} = require("http-status-codes");
const {ResponseObjDto} = require("../entities/ResponseObjDto");
const UserSchema = require("../entities/db/UserSchema");
const TerrariumSchema = require("../entities/db/TerrariumSchema");
const {Terrarium} = require("../entities/schemaToClass/MongooseSchemaToClass");
const TerrariumValidationIn = require("../entities/dtoIn/validation/TerrariumValidationIn");
const {TerrariumDtoIn} = require("../entities/dtoIn/ClassDtosIn");
const emailService = require("../services/EmailService");


class TerrariumService {
    constructor() {
        //key = hardwarioCode, value = objekt s terarium id a targetLivingConditions
        this.cacheByHardwarioCode = new Map();
    }

    async editTerrariumByIdAndUserId(req, res, next) {
        const userId = req.params.id;
        const terrariumId = req.params.terrariumId;

        this.validateUserIdAndTerrariumId(userId, terrariumId, next);

        //TODO: tady je otazka jestli chceme dovolit manipulovat i ta data
        const terrariumIn = new TerrariumDtoIn(req.body);

        const {error} = TerrariumValidationIn.validate(terrariumIn);

        if (error) {
            return next(new CustomApiError(`Terrarium validation failed: ${error.message}`, StatusCodes.BAD_REQUEST));
        }

        try {
            const updatedTerrarium = await TerrariumSchema.findOneAndUpdate(
                {_id: terrariumId},
                terrariumIn
            );

            if (!updatedTerrarium) {
                return next(new CustomApiError(`Terrarium with id ${terrariumId} not found`, StatusCodes.NOT_FOUND));
            }

            res.status(StatusCodes.OK).json({
                status: "success",
                message: "Terrarium updated successfully",
                data: updatedTerrarium,
            });
        } catch (error) {
            console.error("Error updating terrarium:", error);
            return next(new CustomApiError("Internal server error", StatusCodes.INTERNAL_SERVER_ERROR));
        }
    }


    async getTerrariums(req, res, next) {
        const userId = req.params.id;
        try {
            const userTerrariums = await UserSchema
                .findById(userId)
                .select('terrariums')
                .populate("terrariums");

            if (!userTerrariums) {
                const message = `UserId: ${userId} not found or has no terrariums.`;
                console.error(message);
                return res.status(StatusCodes.NOT_FOUND).json(new ResponseObjDto(message, 'fail'));
            }

            const data = userTerrariums.terrariums.map((t) =>
                new Terrarium(t.targetLivingConditions, t.name, t.animalType, t.description, t.hardwarioCode, t.data)
            );

            res.status(StatusCodes.OK).json(new ResponseObjDto(data, 'success'));
        } catch (error) {
            const message = `Error retrieving terrariums of userId: ${userId}. Message: ${error.message}`;
            console.error(message);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ResponseObjDto(message, 'fail'));
        }
    }

    async createTerrarium(req, res, next) {
        try {
            const terrarium = new Terrarium(req.body.targetLivingConditions,
                req.body.name,
                req.body.animalType,
                req.body.description,
                req.body.hardwarioCode,
                []);

            const {error} = TerrariumValidationIn.validate(terrarium);
            if (error) {
                return next(new CustomApiError(`Terrarium validation failed: ${error.message}`, StatusCodes.BAD_REQUEST));
            }

            const isHardwarioCodeUsed = await TerrariumSchema.findOne({
                "hardwarioCode": req.body.hardwarioCode,
            });

            if (isHardwarioCodeUsed) {
                return next(new CustomApiError(`HardwarioCode ${req.body.hardwarioCode} in use.`, StatusCodes.CONFLICT));
            }

            const result = await new TerrariumSchema(terrarium).save();

            if (result) {
                //
                UserSchema.findOneAndUpdate(
                    { _id: req.params.id },
                    { $push: { terrariums: result._id } },
                    { new: true }
                )
                    .then(user => {
                        if (user) {
                            console.log('Terrarium added successfully:', user);
                        } else {
                            console.log('User not found');
                        }
                    })
                    .catch(error => {
                        console.error('Error adding terrarium:', error);
                    });

                res.status(StatusCodes.CREATED).json({
                    status: 'success',
                    data: terrarium,
                });
            }
        } catch (error) {
            const message = `Error saving new terrarium:  ${error.message}`;
            console.error(message);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ResponseObjDto(message, "fail"));
        }
    };

    async deleteTerrarium(req, res, next) {
        const terrariumId = req.params.terrariumId;
        try {
            const deletedTerrarium = await TerrariumSchema.findByIdAndDelete(terrariumId);

            if (!deletedTerrarium) {
                console.log('Terrarium not found');
                return;
            }

            UserSchema.updateMany(
                { 'terrariums': terrariumId },
                { $pull: { terrariums: terrariumId } }
            )
                .then(result => {
                    const numModified = result.nModified;
                    console.log(`${numModified} users updated successfully.`);
                })
                .catch(error => {
                    console.error('Error removing terrarium from users:', error);
                });

            res.status(StatusCodes.OK).json(new ResponseObjDto(null, "success, terrarium deleted"));
        } catch (error) {
            const message = `Error deleting terrarium id: ${terrariumId}. Message: ${error.message}`;
            console.error(message);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ResponseObjDto(message, "fail"));
        }
    };

    async findByHardwarioCode(hardwarioCode) {
        return TerrariumSchema.findOne({hardwarioCode});
    };

    async findById(id) {
        return TerrariumSchema.findById(id);
    }

    async createTerrariumData(hardwarioCode, userId, type, measuredData, measuredAt) {

        //TODO: dalo by se to udelat lepe, exportovat stejnou instanci a v index.js to po nastartovani inicializovat
        await this.loadCache();
        type = type.split("/")[2];
        if (('temperature' === type || 'humidity' === type || 'lightIntensity' === type //
            || 'danger' === type || 'drinking' === type || 'feeding' === type) && !isNaN(measuredData)) {

            const dateMeasuredAt = new Date(measuredAt);
            const receivedData = {
                timestamp: dateMeasuredAt,
                value: measuredData,
                type: type
            };

            if (('temperature' === type || 'humidity' === type || 'lightIntensity' === type)
                && !this.isDataInMinMax(hardwarioCode, measuredData, type)) {
                emailService.sendEmail(hardwarioCode, measuredData, this.cacheByHardwarioCode.get(hardwarioCode), type);
            }

            TerrariumSchema.findOneAndUpdate(
                {
                    'hardwarioCode': hardwarioCode,
                },
                {
                    $push: {
                        'data': receivedData,
                    },
                },
                {new: true}
            )
                .then(() => {
                    console.log(`Data of ${type} pushed successfully @ ` + new Date());
                })
                .catch((error) => {
                    console.error('Failed to push data', error);
                });
            return true;
        }
        return false;
    }

    isDataInMinMax(hardwarioCode, measuredData, type) {
        const value = this.cacheByHardwarioCode.get(hardwarioCode).targetLivingConditions;
        return measuredData > value[type].min && measuredData < value[type].max;
    }

    async loadCache() {
        if (this.cacheByHardwarioCode.size === 0) {
            const terrariums = await TerrariumSchema
                .find()
                .select({targetLivingConditions: 1, hardwarioCode: 1, _id: 1});

            terrariums.map(each => {
                const targetLivingConditions = each.targetLivingConditions;
                const id = each._id;
                const value = {_id: id, targetLivingConditions: targetLivingConditions}
                this.cacheByHardwarioCode.set(each.hardwarioCode, value);
            });
        }
    };

}

module.exports = new TerrariumService();
