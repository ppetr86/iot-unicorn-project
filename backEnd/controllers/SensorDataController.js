const asyncWrapper = require("../middleware/Async");
const {StatusCodes} = require("http-status-codes");
const UserDao = require("../dao/UserDao");
const UserSchema = require("../entities/db/UserSchema");
const {SensorData} = require("../entities/schemaToClass/MongooseSchemaToClass");

const createSensorData = asyncWrapper(async (req, res, next) => {

    const hardwarioCode = getHardwarioCode(req.body);
    const userId = req.user.id;

    const receivedData = req.body.value;

    console.log("received message: " + JSON.stringify(req.body))
    console.log("----------")

    const test = await UserSchema.findOneAndUpdate(
        {
            _id: userId,
            'terrariums.sensors.hardwarioCode': hardwarioCode,
        },
        {
            $push: {'terrariums.$.sensors.$.data': {timestamp: new Date(), value: receivedData, type: "temperature"}}
        },
        {new: true})
        .then(() => {
            console.log('Data pushed successfully');
        })
        .catch((error) => {
            console.error(error);

        });

    res.status(StatusCodes.ACCEPTED);
});

const getHardwarioCode = (reqPayload) => {

    const array = reqPayload.topic.split("/");
    return `${reqPayload.sensorId}-${array[array.length - 1]}`;
}

module.exports = {
    createSensorData: createSensorData,
};
