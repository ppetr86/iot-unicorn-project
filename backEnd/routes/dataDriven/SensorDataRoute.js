const express = require('express');
const router = express.Router();

const {
    createSensorData,
} = require('../../controllers/dataDriven/SensorDataController');

router.route('/:sensorType')
    .post(createSensorData);

module.exports = router;