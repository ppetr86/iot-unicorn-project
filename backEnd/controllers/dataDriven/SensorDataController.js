const asyncWrapper = require("../../middleware/Async");

const createSensorData = asyncWrapper(async (req, res, next) => {
    //TODO:implement me
    console.log("test received: " + req.body)
});

module.exports = {
    createSensorData: createSensorData,
};