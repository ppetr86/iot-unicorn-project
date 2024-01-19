"use strict";
const jwt = require("jsonwebtoken");

class AuthService {
    constructor() {
    }

    signLoginToken(id, roles) {
        return jwt.sign({id, roles}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
    };

    signIotIdentificationToken(id) {
        return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
    };

}

module.exports = new AuthService();
