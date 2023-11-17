const jwt = require('jsonwebtoken')
const asyncWrapper = require("./Async");
const {CustomApiError} = require("../errors/CustomApiError");
const {StatusCodes} = require("http-status-codes");
const {promisify} = require("util");
const UserDao = require("../dao/UserDao");
const mongoose = require('mongoose');

const userIdByIotToken = new Map();

const protectWithIoTToken = asyncWrapper(async (req, res, next) => {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];

    if (!token)
        return next(new CustomApiError('You are not logged in! Log in to get access.', StatusCodes.UNAUTHORIZED));

    // 2) Check if the token is in the cache
    const userId = userIdByIotToken.get(token);

    if (userId) {
        // Token found in the cache, no need to re-verify
        req.user = {id: userId};
        next();
    } else {
        // 3) IoT token
        try {
            const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

            //if we get some invalid format dont bother checking if it is in db..
            if (!mongoose.Types.ObjectId.isValid(decoded)) {
                return next(new CustomApiError("Invalid token", StatusCodes.UNAUTHORIZED));
            }

            // 4) Check if user still exists
            const isUserExisting = await UserDao.isExisting({_id: decoded.id});

            if (!isUserExisting) {
                return next(new CustomApiError("Provided key can not be associated with an existing user"), StatusCodes.UNAUTHORIZED);
            }

            // Cache the token for future use
            userIdByIotToken.set(token, decoded.id);

            req.user = {id: decoded.id};
            next();
        } catch (error) {
            return next(new CustomApiError("Invalid token", StatusCodes.UNAUTHORIZED));
        }
    }
});

module.exports = {
    protectWithIoTToken,
}
