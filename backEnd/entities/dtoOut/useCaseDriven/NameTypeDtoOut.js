const {NameDtoOut} = require("./NameDtoOut");

class NameTypeDtoOut extends NameDtoOut {
    constructor(dbDocument) {
        super(dbDocument);
        this.type = dbDocument?.type;
    }
}

module.exports = {NameTypeDtoOut};