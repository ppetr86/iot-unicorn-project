const asyncWrapper = require("../middleware/Async");
const {StatusCodes} = require("http-status-codes");
const UserSchema = require("../entities/db/UserSchema");
const {CustomApiError} = require("../errors/CustomApiError");
const {Terrarium} = require("../entities/schemaToClass/MongooseSchemaToClass");
const TerrariumDtoIn = require("../entities/dtoIn/TerrariumDtoIn");
const terrariumService = require("../services/TerrariumService");

const getAllUserTerrariums = asyncWrapper(async (req, res, next) => {
    await terrariumService.getTerrariums(req, res, next, null);
});

const putUserTerrariumByTerrariumId = asyncWrapper(async (req, res, next) => {
    await terrariumService.editTerrariumByIdAndUserId(req,res,next);
});

const createUserTerrarium = asyncWrapper(async (req, res, next) => {
    await terrariumService.createTerrarium(req, res, next);
});

const deleteUserTerrariumById = asyncWrapper(async (req, res, next) => {
    await terrariumService.deleteTerrarium(req, res, next);
});

const getTerrariumByHardwarioCode = asyncWrapper(async (req, res, next) => {
    const hardwarioCode = req.params.hardwarioCode;
    await terrariumService.getTerrarium(req, res, next, {'terrariums.hardwarioCode': hardwarioCode}, {'terrariums.$': 1});
});

const getTerrariumByTerrariumId = asyncWrapper(async (req, res, next) => {
    await terrariumService.getTerrarium(req, res, next, {'terrariums._id': req.params.terrariumId}, {'terrariums.$': 1});
});

const getTerrariumDataByTerrariumId = asyncWrapper(async (req, res, next) => {
    await terrariumService.getTerrariumData(req, res, next, {'terrariums._id': req.params.terrariumId}, {'terrariums.$': 1});
});


module.exports = {
    getAllUserTerrariums,
    getTerrariumByHardwarioCode,
    getTerrariumByTerrariumId,
    getTerrariumDataByTerrariumId,
    createUserTerrarium,
    deleteUserTerrariumById,
    putUserTerrariumByTerrariumId
};
