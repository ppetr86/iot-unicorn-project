"use strict";
const {CustomApiError} = require("../errors/CustomApiError");
const {StatusCodes} = require("http-status-codes");
const userDao = require("../dao/UserDao");

class UserService {
    constructor() {
    }

    async addTerrariumToAnotherUserId(req, res, next) {
        const userId = req.params.id;
        const terrariumId = req.params.terrariumId;
        const result = await userDao.findByIdAndUpdateArray(userId, "terrariums", terrariumId);
        if (!result) {
            return next(new CustomApiError(`Terrarium validation failed: ${error.message}`, StatusCodes.BAD_REQUEST));
        }

        res.status(StatusCodes.ACCEPTED).json({
            status: "success",
            message: "Terrarium added successfully",
            data: result,
        });
    }
}

module.exports = new UserService();
