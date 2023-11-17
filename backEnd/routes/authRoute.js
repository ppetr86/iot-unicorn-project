const express = require('express');
const router = express.Router();

const {
    loginUser,
    loginUserToIotSensors,
    forgotPassword,
    resetPassword,
    updatePassword
} = require('../controllers/authController');

const {
    protectWithAuthenticationToken,
} = require('../middleware/AuthenticationMiddleware');

router.route('/login').post(loginUser)

router.route('/login-iot').post(loginUserToIotSensors)

router.route('/forgotPassword').post(forgotPassword)

router.route('/resetPassword/:token').post(resetPassword);

router.route('/updatePassword').patch(protectWithAuthenticationToken, updatePassword);

module.exports = router;
