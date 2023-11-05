const asyncWrapper = require("../../middleware/Async");
const {StatusCodes} = require("http-status-codes");

const createSensorData = asyncWrapper(async (req, res, next) => {

    switch (req.params?.sensorType) {
        case 'accelerometer':
            console.log("accelerometer")
            //TODO:implement me
            break;
        case 'thermometer':
            console.log("thermometer")
            //TODO:implement me
            break;
        case 'button':
            console.log("button")
            //TODO:implement me
            break;
        case 'test':
            console.log("test")
            break;
    }

    if (req.headers.authorization)
        console.log(req.headers.authorization)
    console.log("received message: " + JSON.stringify(req.body))
    console.log("----------")

    res.status(StatusCodes.CREATED).json({
        status: "success",
        data: "payload processed"
    });
});

module.exports = {
    createSensorData: createSensorData,
};

