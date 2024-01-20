const asyncWrapper = require("../middleware/Async");
const terrariumService = require("../services/TerrariumService");
const {StatusCodes} = require("http-status-codes");
const {ResponseObjDto} = require("../entities/ResponseObjDto");
const userDao = require("../dao/UserDao");

const getAllUserTerrariums = asyncWrapper(async (req, res, next) => {
    await terrariumService.getTerrariums(req, res, next, null);
});

const getUserWithAllUserTerrariums = asyncWrapper(async (req, res, next) => {

    try {
        const data = await userDao.get(req.params.id, {populate: "terrariums"});
        res.status(StatusCodes.OK).json(new ResponseObjDto(data, 'success'));
    } catch (error) {
        const message = `Error retrieving terrarium: ${error.message}`;
        console.error(message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ResponseObjDto(message, 'fail'));
    }

});

const putUserTerrariumByTerrariumId = asyncWrapper(async (req, res, next) => {
    await terrariumService.editTerrariumByIdAndUserId(req, res, next);
});

const createUserTerrarium = asyncWrapper(async (req, res, next) => {
    await terrariumService.createTerrarium(req, res, next);
});

const deleteUserTerrariumById = asyncWrapper(async (req, res, next) => {
    await terrariumService.deleteTerrarium(req, res, next);
});

const getTerrariumByHardwarioCode = asyncWrapper(async (req, res, next) => {
    const hardwarioCode = req.params.hardwarioCode;
    try {
        const terrarium = await terrariumService.findByHardwarioCode(hardwarioCode);
        res.status(StatusCodes.OK).json(new ResponseObjDto(terrarium, 'success'));
    } catch (error) {
        const message = `Error retrieving terrarium: ${error.message}`;
        console.error(message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ResponseObjDto(message, 'fail'));
    }
});

const getTerrariumByTerrariumId = asyncWrapper(async (req, res, next) => {
    try {
        const terrarium = await terrariumService.findById(req.params.terrariumId);
        res.status(StatusCodes.OK).json(new ResponseObjDto(terrarium, 'success'));
    } catch (error) {
        const message = `Error retrieving terrarium: ${error.message}`;
        console.error(message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ResponseObjDto(message, 'fail'));
    }
});

const getTerrariumDataByTerrariumId = asyncWrapper(async (req, res, next) => {
    try {
        const terrarium = await terrariumService.findById(req.params.terrariumId);
        const data = terrarium.data;
        res.status(StatusCodes.OK).json(new ResponseObjDto(data, 'success'));
    } catch (error) {
        const message = `Error retrieving terrarium data: ${error.message}`;
        console.error(message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ResponseObjDto(message, 'fail'));
    }
});


module.exports = {
    getAllUserTerrariums,
    getTerrariumByHardwarioCode,
    getTerrariumByTerrariumId,
    getTerrariumDataByTerrariumId,
    createUserTerrarium,
    deleteUserTerrariumById,
    putUserTerrariumByTerrariumId,
    getUserWithAllUserTerrariums
};
