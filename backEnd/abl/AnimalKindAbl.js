"use strict";
const AnimalKind = require('../entities/db/AnimalKindSchema');
const BaseAbl = require("./BaseAbl");

class AnimalKindAbl extends BaseAbl {
    constructor() {
        super(AnimalKind);
    }
}

module.exports = new AnimalKindAbl();
