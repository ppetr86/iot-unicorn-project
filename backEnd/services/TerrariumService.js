"use strict";
const mongoose = require('mongoose');
const {CustomApiError} = require("../errors/CustomApiError");
const {StatusCodes} = require("http-status-codes");
const {ResponseObjDto} = require("../entities/ResponseObjDto");
const UserSchema = require("../entities/db/UserSchema");
const {Terrarium} = require("../entities/schemaToClass/MongooseSchemaToClass");
const TerrariumDtoIn = require("../entities/dtoIn/TerrariumDtoIn");

class TerrariumService {
    constructor() {
    }

    async editTerrariumByIdAndUserId(req, res, next) {
        const userId = req.params.id;
        const terrariumId = req.params.terrariumId;

        terrariumService.validateUserIdAndTerrariumId(userId, terrariumId, next);

        //TODO: tady je otazka jestli chceme dovolit manipulovat i ta data
        const terrarium = new Terrarium(req.body.targetLivingConditions,
            req.body.name,
            req.body.animalType,
            req.body.description,
            req.body.hardwarioCode,
            req.body.data);

        const {error} = TerrariumDtoIn.validate(terrarium);

        if (error) {
            return next(new CustomApiError(`Terrarium validation failed: ${error.message}`, StatusCodes.BAD_REQUEST));
        }

        const existingTerrarium = await UserSchema.findOne({
            _id: userId,
            "terrariums.name": req.body.name,
            "terrariums._id": {$ne: terrariumId}, // Exclude the current terrarium from the check
        });

        if (existingTerrarium) {
            return next(new CustomApiError(`Terrarium with name ${req.body.name} already exists for user with id ${userId}`, StatusCodes.CONFLICT));
        }

        const update = {
            $set: {
                "terrariums.$[t].name": req.body.name,
                "terrariums.$[t].animalType": req.body.animalType,
                "terrariums.$[t].description": req.body.description,
                "terrariums.$[t].hardwarioCode": req.body.hardwarioCode,
                "terrariums.$[t].targetLivingConditions": req.body.targetLivingConditions,
                "terrariums.$[t].data": req.body.data,
            },
        };

        const options = {
            arrayFilters: [{"t._id": terrariumId}],
            new: true,
        };

        try {
            const updatedUser = await UserSchema.findOneAndUpdate(
                {_id: userId, "terrariums._id": terrariumId},
                update,
                options
            );

            if (!updatedUser) {
                return next(new CustomApiError(`Terrarium with id ${terrariumId} not found for user with id ${userId}`, StatusCodes.NOT_FOUND));
            }

            res.status(StatusCodes.OK).json({
                status: "success",
                message: "Terrarium updated successfully",
                data: updatedUser.terrariums.find(t => t._id.toString() === terrariumId),
            });
        } catch (error) {
            console.error("Error updating terrarium:", error);
            return next(new CustomApiError("Internal server error", StatusCodes.INTERNAL_SERVER_ERROR));
        }
    }


    async getTerrariums(req, res, next) {
        const userId = req.params.id;
        try {

            this.validateUserId(userId, next);

            const userTerrariums = await UserSchema.findOne({_id: userId}).select('terrariums');

            if (!userTerrariums) {
                const message = `UserId: ${userId} not found or the has no terrariums.`;
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
            const userId = req.params.id;
            this.validateUserId(userId, next);

            //Mongoose does not automatically enforce unique constraints on subdocuments when using $push.
            const terrarium = new Terrarium(req.body.targetLivingConditions,
                req.body.name,
                req.body.animalType,
                req.body.description,
                req.body.hardwarioCode,
                []);

            const {error} = TerrariumDtoIn.validate(terrarium);
            if (error) {
                return next(new CustomApiError(`Terrarium validation failed: ${error.message}`, StatusCodes.BAD_REQUEST));
            }

            const existingTerrarium = await UserSchema.findOne({
                _id: userId,
                "terrariums.name": req.body.name,
            });

            if (existingTerrarium) {
                return next(new CustomApiError(`Terrarium with name ${req.body.name} already exists for user with id ${userId}`, StatusCodes.CONFLICT));
            }

            const result = await UserSchema.findOneAndUpdate(
                {_id: userId},
                {$push: {terrariums: terrarium}},
                {new: true}
            );

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
        try {

            const userId = req.params.id;
            const terrariumId = req.params.terrariumId;
            this.validateUserIdAndTerrariumId(userId, terrariumId, next);
            const result = await UserSchema.findOneAndUpdate(
                {_id: userId},
                {$pull: {terrariums: {_id: terrariumId}}},
                {new: true}
            );

            if (!result) {
                console.log('User not found');
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
        try {
            const userId = req.params.id;
            const terrariumId = req.params.terrariumId;
            this.validateUserIdAndTerrariumId(userId, terrariumId, next);

            const user = await UserSchema.findOne(
                {
                    _id: userId,
                    ...filter,
                },
                projection
            );

            if (!user || !user.terrariums || user.terrariums.length === 0) {
                const message = `NOT FOUND: Terrarium id: ${terrariumId} of a userId: ${userId}`;
                console.error(message);
                return res.status(StatusCodes.NOT_FOUND).json(new ResponseObjDto(message, 'fail'));
            }

            const data = user.terrariums.map((t) =>
                new Terrarium(t.targetLivingConditions, t.name, t.animalType, t.description, t.hardwarioCode, t.data)
            );

            res.status(StatusCodes.OK).json(new ResponseObjDto(data, 'success'));
        } catch (error) {
            const message = `Error retrieving terrarium data: ${error.message}`;
            console.error(message);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ResponseObjDto(message, 'fail'));
        }
    }

    validateUserId(userId, next) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return next(new CustomApiError("Invalid userId", StatusCodes.BAD_REQUEST));
        }
    }

    validateTerrariumId(terrariumId, next) {
        if (!mongoose.Types.ObjectId.isValid(terrariumId)) {
            return next(new CustomApiError("Invalid terrariumId", StatusCodes.BAD_REQUEST));
        }
    }

    validateUserIdAndTerrariumId(userId, terrariumId, next) {
        this.validateUserId(userId, next);
        this.validateTerrariumId(terrariumId, next);
    }
}

module.exports = new TerrariumService();
