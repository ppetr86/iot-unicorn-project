"use strict";
const AnimalKind = require('../entities/db/AnimalKindSchema');
const BaseDao = require("./BaseDao");

class AnimalKindDao extends BaseDao {
    constructor() {
        super(AnimalKind);
    }
}

module.exports = new AnimalKindDao();
