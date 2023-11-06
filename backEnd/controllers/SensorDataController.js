const asyncWrapper = require("../middleware/Async");
const {StatusCodes} = require("http-status-codes");
const UserDao = require("../dao/UserDao");

const createSensorData = asyncWrapper(async (req, res, next) => {
    console.log(req.headers);
    const hardwarioCode = getHardwarioCode(req.body);
    // TODO: const userId = getUserId(req);

    switch (req.params?.sensorType) {
        case 'accelerometer':
            console.log("accelerometer")
            //TODO:implement me
            break;
        case 'thermometer':
            console.log("thermometer")
            // TODO: add mongoose query for inserting received thermometer data into user collection by hardwario code
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

const getHardwarioCode = (reqPayload) => `${reqPayload.sensorId}-${reqPayload.topic}`;

module.exports = {
    createSensorData: createSensorData,
};
