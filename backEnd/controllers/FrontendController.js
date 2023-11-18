const asyncWrapper = require("../middleware/Async");
const { StatusCodes } = require("http-status-codes");
const UserSchema = require("../entities/db/UserSchema");
const mongoose = require("mongoose");
const { CustomApiError } = require("../errors/CustomApiError");
const { Terrarium } = require("../entities/schemaToClass/MongooseSchemaToClass");
const { ResponseObjDto } = require("../entities/ResponseObjDto");

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

        const data = user.terrariums.map((t) => new Terrarium(t.targets, t.name, t.animalType, t.description, t.hardwarioCode, t.data));

        res.status(StatusCodes.OK).json(new ResponseObjDto(data, "success"));
    } catch (error) {
        const message = `Error retrieving terrarium data: ${error.message}`;
        console.error(message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ResponseObjDto(message, "fail"));
    }
};

const getAllUserTerrariums = asyncWrapper(async (req, res, next) => {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new CustomApiError("Invalid userId", StatusCodes.BAD_REQUEST));
    }

    await getTerrariumData(req, res, next, null, { terrariums: 1 });
});

const getTerrariumByHardwarioCode = asyncWrapper(async (req, res, next) => {
    const hardwarioCode = req.params.hardwarioCode;
    await getTerrariumData(req, res, next, { 'terrariums.hardwarioCode': hardwarioCode }, { 'terrariums.$': 1 });
});

const getTerrariumByTerrariumId = asyncWrapper(async (req, res, next) => {
    await getTerrariumData(req, res, next, { 'terrariums._id': req.params.terrariumId }, { 'terrariums.$': 1 });
});

const getTerrariumDataByTerrariumId = asyncWrapper(async (req, res, next) => {
    await getTerrariumData(req, res, next, { 'terrariums._id': req.params.terrariumId }, { 'terrariums.$': 1 });
});

module.exports = {
    getAllUserTerrariums,
    getTerrariumByHardwarioCode,
    getTerrariumByTerrariumId,
    getTerrariumDataByTerrariumId,
};
