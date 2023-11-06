const express = require('express');
const router = express.Router();

const {
    createSensorData,
} = require('../controllers/SensorDataController');
const {protectWithIoTToken} = require("../middleware/Authentication");

router.route('/:sensorType')
    .post(protectWithIoTToken, createSensorData);

module.exports = router;