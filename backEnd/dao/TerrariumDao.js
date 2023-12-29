"use strict";
const TerrariumSchema = require('../entities/db/TerrariumSchema');
const BaseDao = require("./BaseDao");

class TerrariumDao extends BaseDao {
    constructor() {
        super(TerrariumSchema);
    }
}

module.exports = new TerrariumDao();
