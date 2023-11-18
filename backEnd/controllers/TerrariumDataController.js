const asyncWrapper = require("../middleware/Async");
const {StatusCodes} = require("http-status-codes");
const UserSchema = require("../entities/db/UserSchema");

const createTerrariumData = asyncWrapper(async (req, res, next) => {

    const hardwarioCode = req.body.sensorId;
    const userId = req.user.id;
    const type = req.body.topic.toLowerCase().trim();
    if (('temperature' === type || 'humidity' === type || 'lightIntensity' === type)
        && isNaN(req.body.value)) {
        const receivedData = {
            timestamp: new Date(),
            value: req.body.value,
            type: type
        };

        UserSchema.findOneAndUpdate(
            {
                _id: userId,
                'terrariums.hardwarioCode': hardwarioCode,
            },
            {
                $push: {
                    'terrariums.$.data': receivedData,
                },
            },
            {new: true}
        )
            .then(() => {
                console.log('Data pushed successfully');
            })
            .catch((error) => {
                console.error('Failed to push data', error);
            });

        res.status(StatusCodes.ACCEPTED);
    } else {
        console.error("Invalid data type received from hardwarioCode: " + hardwarioCode)
    }
});

module.exports = {
    createTerrariumData,
};
