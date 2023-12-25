const jwt = require('jsonwebtoken')
const asyncWrapper = require("./Async");
const {CustomApiError} = require("../errors/CustomApiError");
const {StatusCodes} = require("http-status-codes");
const {promisify} = require("util");
const User = require("../entities/db/UserSchema");
const UserSchema = require("../entities/db/UserSchema");
const mongoose = require("mongoose");

const protectWithAuthenticationToken = asyncWrapper(async (req, res, next) => {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];

    if (!token)
        return next(new CustomApiError('You are not logged in! Log in to get access.', StatusCodes.UNAUTHORIZED));

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id)
        .select('firstName lastName email roles passwordChangedAt ');

    if (!currentUser)
        return next(new CustomApiError('The user belonging to this token does no longer exist.',
            StatusCodes.UNAUTHORIZED));

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat))
        return next(CustomApiError('User recently changed password! Please log in again.',
            StatusCodes.UNAUTHORIZED));

    delete currentUser.password;
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();//must do next with middlewares
});

const authorize = (rolesArray) => asyncWrapper(async (req, res, next) => {
    if (!rolesArray)
        next();
    if (!rolesArray.filter(value => req.user.roles.includes(value)).length) {
        return next(new CustomApiError(`User id ${req.user._id} is not authorized to access this resource`));
    }
    next();
});

const adminOrOwnerAccessOrThrow = asyncWrapper(async (req, res, next) => {
    if (!req.user.roles.includes("ROLE_ADMIN") && req.user.id !== req.params.id) {
        return next(new CustomApiError(`Only admin and owning user have access to resource id: ${req.params.id}`,
            StatusCodes.UNAUTHORIZED));
    }
    next();
});

const adminAccessOrThrow = asyncWrapper(async (req, res, next) => {
    if (!req.user.roles.includes('ROLE_ADMIN'))
        return next(new CustomApiError("Only admin can access this resource.", StatusCodes.UNAUTHORIZED));
    next();
});

const adminifyThrow = asyncWrapper(async (req, res, next) => {
    if (!req.user.roles.includes("ROLE_ADMIN") && req.body.roles.includes("ROLE_ADMIN"))
        return next(new CustomApiError('You can not make yourself admin :)', StatusCodes.UNAUTHORIZED));
    next();
});


const requestingUserIsTheSameAsPathUserOrThrow = asyncWrapper(async (req, res, next) => {
    if (req.params.id !== req.user._id.toString())
        return next(new CustomApiError('You can not manipulate a terrarium for other user.', StatusCodes.UNAUTHORIZED));
    next();
});

const onlyUserRoleCanBeCreated = asyncWrapper(async (req, res, next) => {
    if (req.body.roles.length !== 1 || req.body.roles[0].toUpperCase() !== 'ROLE_USER')
        return next(new CustomApiError('Only user with a `ROLE_USER` can be created.', StatusCodes.UNAUTHORIZED));
    next();
});

const requestingUserHasAccessToTerrarium = asyncWrapper(async (req, res, next) => {
    const userId = req.params.id;
    const terrariumId = req.params.terrariumId;

    // Check if the terrariumId exists within the terrariums array
    const count = await UserSchema.countDocuments({
        _id: userId,
        terrariums: terrariumId
    });

    if (count === 0)
        return next(new CustomApiError(`User does not have access to this resource`, StatusCodes.BAD_REQUEST));
    next();
});

const isUserIdValid = asyncWrapper(async (req, res, next) => {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new CustomApiError("Invalid userId", StatusCodes.BAD_REQUEST));
    }
    next();
});

const isTerrariumIdValid = asyncWrapper(async (req, res, next) => {
    const terrariumId = req.params.terrariumId;
    if (!mongoose.Types.ObjectId.isValid(terrariumId)) {
        return next(new CustomApiError("Invalid terrariumId", StatusCodes.BAD_REQUEST));
    }
    next();
});

module.exports = {
    protectWithAuthenticationToken,
    authorize,
    adminOrOwnerAccessOrThrow,
    adminAccessOrThrow,
    adminifyThrow,
    requestingUserIsTheSameAsPathUserOrThrow,
    onlyUserRoleCanBeCreated,
    requestingUserHasAccessToTerrarium,
    isTerrariumIdValid,
    isUserIdValid
}
