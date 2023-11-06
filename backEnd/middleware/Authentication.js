const jwt = require('jsonwebtoken')
const asyncWrapper = require("./Async");
const {CustomApiError} = require("../errors/CustomApiError");
const {StatusCodes} = require("http-status-codes");
const {promisify} = require("util");
const User = require("../entities/db/UserSchema");
const UserDao = require("../dao/UserDao")

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

const tokenCache = new Map();

const protectWithIoTToken = asyncWrapper(async (req, res, next) => {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];

    if (!token)
        return next(new CustomApiError('You are not logged in! Log in to get access.', StatusCodes.UNAUTHORIZED));

    // 2) Check if the token is in the cache
    const userId = tokenCache.get(token);

    if (userId) {
        // Token found in the cache, no need to re-verify
        req.user = { id: userId };
        next();
    } else {
        // 3) Verification token
        try {
            const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

            // 4) Check if user still exists
            const isUserExisting = await UserDao.isExisting({ _id: decoded.id });

            if (!isUserExisting) {
                return next(new CustomApiError("Provided key can not be associated with an existing user"));
            }

            // Cache the token for future use
            tokenCache.set(token, decoded.id);

            req.user = { id: decoded.id };
            next();
        } catch (error) {
            return next(new CustomApiError("Invalid token", StatusCodes.UNAUTHORIZED));
        }
    }
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

module.exports = {
    protectWithAuthenticationToken,
    protectWithIoTToken,
    authorize,
    adminOrOwnerAccessOrThrow,
    adminAccessOrThrow,
    adminifyThrow
}
