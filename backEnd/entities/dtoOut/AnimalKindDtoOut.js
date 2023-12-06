class AnimalKindDtoOut {
    constructor(dbDocument) {
        this.id = dbDocument?._id;
        this.animalType = dbDocument?.animalType;
        this.description = dbDocument?.description;
        this.targetLivingConditions = dbDocument?.targetLivingConditions;
    }
}

module.exports = {AnimalKindDtoOut: AnimalKindDtoOut};
