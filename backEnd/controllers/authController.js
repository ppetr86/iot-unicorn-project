const asyncWrapper = require("../middleware/Async");
const {CustomApiError} = require("../errors/CustomApiError");
const {StatusCodes} = require("http-status-codes");
const User = require("../entities/db/UserSchema");
const crypto = require("crypto");
const LoginDtoIn = require("../entities/dtoIn/LoginDtoIn");
const {UserDtoOut, UserDtoOutWithIdNameEmail} = require("../entities/dtoOut/UserDtoOut");
const authService = require("../services/AuthService");


const loginUser = asyncWrapper(async (req, res, next) => {
    await authenticateAndRespond(req, res, next, true);
});

const loginUserToIotSensors = asyncWrapper(async (req, res, next) => {
    await authenticateAndRespond(req, res, next, false);
});

const authenticateAndRespond = async (req, res, next, includeUserData) => {
    const {email, password} = req.body;

    const {error} = LoginDtoIn.validate(req.body);
    if (error) {
        return next(new CustomApiError('Email or password in wrong format', StatusCodes.BAD_REQUEST));
    }

    const projection = includeUserData
        ? '-isDeactivated -terrariums -createdAt +password'
        : '-firstName -lastName -email -roles -isDeactivated -terrariums -createdAt +password';

    const dbDocument = await User.findOne({email}).select(projection);

    if (!dbDocument || !(await dbDocument.isProvidedPasswordMatchingPersisted(password, dbDocument.password))) {
        return next(new CustomApiError(`Email or password incorrect`, StatusCodes.UNAUTHORIZED));
    }

    const token = includeUserData ? //
        authService.signLoginToken(dbDocument?._id, dbDocument?.roles.toString()) //
        : authService.signIotIdentificationToken(dbDocument?._id);

    res.status(StatusCodes.CREATED).json({
        status: 'success',
        token,
        data: includeUserData ? new UserDtoOutWithIdNameEmail(dbDocument) : undefined,
    });
};

const forgotPassword = asyncWrapper(async (req, res, next) => {
    // 1) dbDocument
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        return next(new CustomApiError('There is no user with email address.', StatusCodes.NOT_FOUND));
    }

    // 2) reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});

    // 3) print token to console...
    console.log(`${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`);
    res.status(200).json({
        status: 'success',
        resetToken: resetToken
    });
});

const resetPassword = asyncWrapper(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new CustomApiError('Token is invalid or has expired', StatusCodes.BAD_REQUEST));
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
});

const createSendToken = (user, statusCode, res) => {
    const token = authService.signLoginToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 100),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production')
        cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    // Remove password
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: new UserDtoOut(user)
    });
};

const updatePassword = asyncWrapper(async (req, res, next) => {

    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.isProvidedPasswordMatchingPersisted(req.body.passwordCurrent, user.password)))
        return next(new CustomApiError('Your current password is wrong.', StatusCodes.UNAUTHORIZED));

    user.password = req.body.password;
    await user.save();
    // User.findByIdAndUpdate will NOT work as intended!
    // don't use update on anything password related
    // pre-save middleware would not work either

    createSendToken(user, StatusCodes.OK, res);
})

const getIotIdentificationToken = asyncWrapper(async (req, res, next) => {
    try {
        //TODO: consider adding PathVariable which will verify existing using terrarium for
        const userId = req.user.id;
        const iotToken = authService.signIotIdentificationToken(userId);

        res.status(200).json({
            status: 'success',
            data: iotToken
        });
    } catch (err) {
        return next(new CustomApiError("IoT token generation failed", StatusCodes.UNAUTHORIZED));
    }
})

module.exports = {
    loginUser,
    loginUserToIotSensors,
    forgotPassword,
    resetPassword,
    updatePassword,
    getIotIdentificationToken
}
