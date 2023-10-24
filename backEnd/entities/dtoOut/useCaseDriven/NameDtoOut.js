class NameDtoOut {
    constructor(dbDocument) {
        this.name = dbDocument?.name;
    }
}

module.exports = {NameDtoOut};