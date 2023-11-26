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
const getTerrariumData = async (req, res, next, filter, projection) => {
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

        const data = user.terrariums.map((t) => new Terrarium(t.targetLivingConditions, t.name, t.animalType, t.description, t.hardwarioCode, t.data));

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
        const terrariumId = req.params.tid;
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
        const message = `Error deleting terrarium id: ${tid}. Message: ${error.message}`;
        console.error(message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ResponseObjDto(message, "fail"));
    }
};

const getAllUserTerrariums = asyncWrapper(async (req, res, next) => {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new CustomApiError("Invalid userId", StatusCodes.BAD_REQUEST));
    }

    await getTerrariumData(req, res, next, null, {terrariums: 1});
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

const deleteUserTerrarium = asyncWrapper(async (req, res, next) => {
    const userId = req.params.id;
    const terrariumId = req.params.tid;

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
    await getTerrariumData(req, res, next, {'terrariums.hardwarioCode': hardwarioCode}, {'terrariums.$': 1});
});

const getTerrariumByTerrariumId = asyncWrapper(async (req, res, next) => {
    await getTerrariumData(req, res, next, {'terrariums._id': req.params.terrariumId}, {'terrariums.$': 1});
});

const getTerrariumDataByTerrariumId = asyncWrapper(async (req, res, next) => {
    await getTerrariumData(req, res, next, {'terrariums._id': req.params.terrariumId}, {'terrariums.$': 1});
});

module.exports = {
    getAllUserTerrariums,
    getTerrariumByHardwarioCode,
    getTerrariumByTerrariumId,
    getTerrariumDataByTerrariumId,
    createUserTerrarium,
    deleteUserTerrarium
};
