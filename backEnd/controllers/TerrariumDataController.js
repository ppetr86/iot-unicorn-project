const asyncWrapper = require("../middleware/Async");
const {StatusCodes} = require("http-status-codes");
const terrariumService = require("../services/TerrariumService");
const {ResponseObjDto} = require("../entities/ResponseObjDto");

const createTerrariumData = asyncWrapper(async (req, res, next) => {

    const hardwarioCode = req.body.sensorId.trim();
    const userId = req.user.id;
    const type = req.body.topic.toLowerCase().trim();
    const measuredData = req.body.value;
    if (await terrariumService.createTerrariumData(hardwarioCode, userId, type, measuredData)) {
        res.status(StatusCodes.ACCEPTED).json(new ResponseObjDto("terrarium data push succeeded", "success"));
    } else {
        console.error("Invalid data type received from hardwarioCode: " + hardwarioCode)
        res.status(StatusCodes.BAD_REQUEST).json(new ResponseObjDto("terrarium data push failed", "error"));
    }
});

module.exports = {
    createTerrariumData,
};
