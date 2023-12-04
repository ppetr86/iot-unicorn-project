const express = require('express');
const router = express.Router();

const {
    loginUser,
    loginUserToIotSensors,
    forgotPassword,
    resetPassword,
    updatePassword,
    getIotIdentificationToken
} = require('../controllers/authController');

const {
    protectWithAuthenticationToken,
} = require('../middleware/AuthenticationMiddleware');

router.route('/login').post(loginUser)

router.route('/login-iot').post(loginUserToIotSensors)

router.route('/forgotPassword').post(forgotPassword)

router.route('/resetPassword/:token').post(resetPassword);

router.route('/updatePassword').patch(protectWithAuthenticationToken, updatePassword);

router.route('/iot-token').get(protectWithAuthenticationToken, getIotIdentificationToken);

module.exports = router;
