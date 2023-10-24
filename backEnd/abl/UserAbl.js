"use strict";
const User = require("../entities/db/UserSchema");
const BaseAbl = require("./BaseAbl");

class UserAbl extends BaseAbl {
    constructor() {
        super(User);
    }
}

module.exports = new UserAbl();
