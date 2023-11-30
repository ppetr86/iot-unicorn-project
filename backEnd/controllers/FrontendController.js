const asyncWrapper = require("../middleware/Async");
const {StatusCodes} = require("http-status-codes");
const UserSchema = require("../entities/db/UserSchema");
const mongoose = require("mongoose");
const {CustomApiError} = require("../errors/CustomApiError");
const {Terrarium} = require("../entities/schemaToClass/MongooseSchemaToClass");
const {ResponseObjDto} = require("../entities/ResponseObjDto");
const TerrariumDtoIn = require("../entities/dtoIn/TerrariumDtoIn");
const {signIotIdentificationToken} = require("./authController");

//TODO: refactor to include it in some service class
const getTerrarium = async (req, res, next, filter, projection) => {
    try {
        const userId = req.params.id;
        const terrariumId = req.params.terrariumId;

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
            return res.status(StatusCodes.NOT_FOUND).json(new ResponseObjDto(message, "fail"));
        }

        const data = user.terrariums
            .map((t) =>
                new Terrarium(t.targetLivingConditions, t.name, t.animalType, t.description, t.hardwarioCode, t.data));

        res.status(StatusCodes.OK).json(new ResponseObjDto(data, "success"));
    } catch (error) {
        const message = `Error retrieving terrarium data: ${error.message}`;
        console.error(message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ResponseObjDto(message, "fail"));
    }
};

//TODO: refactor to include it in some service class
const createTerrarium = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const terrarium = new Terrarium(req.body.targetLivingConditions,
            req.body.name,
            req.body.animalType,
            req.body.description,
            req.body.hardwarioCode,
            null);

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
            const token = signIotIdentificationToken(userId);
            res.status(StatusCodes.CREATED).json({
                status: 'success',
                token,
                data: terrarium,
            });
        }
    } catch (error) {
        const message = `Error saving new terrarium:  ${error.message}`;
        console.error(message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ResponseObjDto(message, "fail"));
    }
};

const deleteTerrarium = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const terrariumId = req.params.terrariumId;
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

const getAllUserTerrariums = asyncWrapper(async (req, res, next) => {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new CustomApiError("Invalid userId", StatusCodes.BAD_REQUEST));
    }

    await getTerrarium(req, res, next, null, {terrariums: 1});
});

const putUserTerrariumByTerrariumId = asyncWrapper(async (req, res, next) => {
    const userId = req.params.id;
    const terrariumId = req.params.terrariumId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new CustomApiError("Invalid userId", StatusCodes.BAD_REQUEST));
    }

    if (!mongoose.Types.ObjectId.isValid(terrariumId)) {
        return next(new CustomApiError("Invalid terrariumId", StatusCodes.BAD_REQUEST));
    }

    const existingTerrarium = await UserSchema.findOne({
        _id: userId,
        "terrariums.name": req.body.name,
        "terrariums._id": { $ne: terrariumId }, // Exclude the current terrarium from the check
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
        arrayFilters: [{ "t._id": terrariumId }],
        new: true,
    };

    try {
        const updatedUser = await UserSchema.findOneAndUpdate(
            { _id: userId, "terrariums._id": terrariumId },
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
});

const createUserTerrarium = asyncWrapper(async (req, res, next) => {
    // je potreba zajistit, aby uzivatel vytvarel terrarium pouze pro sebe a ne pro jineho
    const userId = req.params.id;

    const {error} = TerrariumDtoIn.validate(req.body);
    if (error) {
        return next(new CustomApiError('TerrariumDtoIn is in wrong format.', StatusCodes.BAD_REQUEST));
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new CustomApiError("Invalid userId", StatusCodes.BAD_REQUEST));
    }
    await createTerrarium(req, res, next);
});

const deleteUserTerrariumById = asyncWrapper(async (req, res, next) => {
    const userId = req.params.id;
    const terrariumId = req.params.terrariumId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new CustomApiError("Invalid userId", StatusCodes.BAD_REQUEST));
    }

    if (!mongoose.Types.ObjectId.isValid(terrariumId)) {
        return next(new CustomApiError("Invalid terrariumId", StatusCodes.BAD_REQUEST));
    }

    await deleteTerrarium(req, res, next);
});

const getTerrariumByHardwarioCode = asyncWrapper(async (req, res, next) => {
    const hardwarioCode = req.params.hardwarioCode;
    await getTerrarium(req, res, next, {'terrariums.hardwarioCode': hardwarioCode}, {'terrariums.$': 1});
});

const getTerrariumByTerrariumId = asyncWrapper(async (req, res, next) => {
    await getTerrarium(req, res, next, {'terrariums._id': req.params.terrariumId}, {'terrariums.$': 1});
});

const getTerrariumDataByTerrariumId = asyncWrapper(async (req, res, next) => {
    await getTerrariumData(req, res, next, {'terrariums._id': req.params.terrariumId}, {'terrariums.$': 1});
});

const getTerrariumData = async (req, res, next, filter, projection) => {
    try {
        // Use the existing getTerrarium method to get the terrarium data
        await getTerrarium(req, res, next, filter, projection);

        // Extract the data property from the response
        const data = res.locals.response.data.map((terrarium) => terrarium.data);

        // Send the extracted data in the response
        res.status(StatusCodes.OK).json(new ResponseObjDto(data, "success"));
    } catch (error) {
        // already handled by the getTerrarium method
    }
};


module.exports = {
    getAllUserTerrariums,
    getTerrariumByHardwarioCode,
    getTerrariumByTerrariumId,
    getTerrariumDataByTerrariumId,
    createUserTerrarium,
    deleteUserTerrariumById,
    putUserTerrariumByTerrariumId
};
