const express = require('express');
const router = express.Router();

const {
    loginUser,
    forgotPassword,
    resetPassword,
    updatePassword
} = require('../../controllers/dataDriven/authController');

const {
    protect,
} = require('../../middleware/Authentication');

router.route('/login').post(loginUser)

router.route('/forgotPassword').post(forgotPassword)

router.route('/resetPassword/:token').post(resetPassword);

router.route('/updatePassword').patch(protect, updatePassword);

module.exports = router;
