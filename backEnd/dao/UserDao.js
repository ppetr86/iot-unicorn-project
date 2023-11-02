"use strict";
const User = require("../entities/db/UserSchema");
const BaseDao = require("./BaseDao");

class UserDao extends BaseDao {
    constructor() {
        super(User);
    }
}

module.exports = new UserDao();
