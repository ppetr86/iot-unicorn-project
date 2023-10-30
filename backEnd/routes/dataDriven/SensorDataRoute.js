const express = require('express');
const router = express.Router();

const {
    createSensorData,
} = require('../../controllers/dataDriven/SensorDataController');

router.route('/')
    .post(createSensorData);

module.exports = router;