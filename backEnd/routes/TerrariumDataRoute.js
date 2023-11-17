const express = require('express');
const router = express.Router();

const {
    createTerrariumData,
} = require('../controllers/TerrariumDataController');

const {
    protectWithIoTToken,
} = require("../middleware/IotAuthenticationAndCachingMiddleware");

router.route("/")
    .post(protectWithIoTToken, createTerrariumData);

module.exports = router;