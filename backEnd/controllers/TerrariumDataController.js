const asyncWrapper = require("../middleware/Async");
const {StatusCodes} = require("http-status-codes");
const UserSchema = require("../entities/db/UserSchema");
const terrariumService = require("../services/TerrariumService");


const createTerrariumData = asyncWrapper(async (req, res, next) => {

    const hardwarioCode = req.body.sensorId.trim();
    const userId = req.user.id;
    const type = req.body.topic.toLowerCase().trim();
    const measuredData = req.body.value;
    if (await terrariumService.createTerrariumData(hardwarioCode, userId, type, measuredData)) {
        res.status(StatusCodes.ACCEPTED);
    } else {
        console.error("Invalid data type received from hardwarioCode: " + hardwarioCode)
    }
});

module.exports = {
    createTerrariumData,
};
