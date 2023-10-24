class AnimalKindDtoOut {
    constructor(dbDocument) {
        this.id = dbDocument?._id;
        this.animalType = dbDocument?.animalType;
        this.description = dbDocument?.description;
        this.livingConditions = dbDocument?.livingConditions;
    }
}

module.exports = {AnimalKindDtoOut: AnimalKindDtoOut};
