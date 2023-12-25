"use strict";
const {CustomApiError} = require("../errors/CustomApiError");
const {StatusCodes} = require("http-status-codes");
const {ResponseObjDto} = require("../entities/ResponseObjDto");
const UserSchema = require("../entities/db/UserSchema");
const TerrariumSchema = require("../entities/db/TerrariumSchema");
const {Terrarium} = require("../entities/schemaToClass/MongooseSchemaToClass");
const TerrariumValidationIn = require("../entities/dtoIn/validation/TerrariumValidationIn");
const {TerrariumDtoIn} = require("../entities/dtoIn/ClassDtosIn");

class TerrariumService {
    constructor() {
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
                // Handle the case where the user is not found (optional)
                return;
            }

            res.status(StatusCodes.OK).json(new ResponseObjDto(null, "success, terrarium deleted"));
        } catch (error) {
            const message = `Error deleting terrarium id: ${terrariumId}. Message: ${error.message}`;
            console.error(message);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ResponseObjDto(message, "fail"));
        }
    };

    async getTerrariumData(req, res, next, filter, projection) {
        try {
            await this.getTerrarium(req, res, next, filter, projection);
            const data = res.locals.response.data.map((terrarium) => terrarium.data);

            res.status(StatusCodes.OK).json(new ResponseObjDto(data, "success"));
        } catch (error) {
            // already handled by the getTerrarium method
        }
    };

    async getTerrarium(req, res, next, filter, projection) {
        const terrariumId = req.params.terrariumId;
        try {
            const data = await TerrariumSchema.findById(terrariumId);

            res.status(StatusCodes.OK).json(new ResponseObjDto(data, 'success'));
        } catch (error) {
            const message = `Error retrieving terrarium data: ${error.message}`;
            console.error(message);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ResponseObjDto(message, 'fail'));
        }
    }
}

module.exports = new TerrariumService();
