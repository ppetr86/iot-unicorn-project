class TerrariumDto {
    constructor(name, animalType, description, targetLivingConditions, hardwarioCode, data) {
        this.name = name;
        this.animalType = animalType;
        this.description = description;
        this.targetLivingConditions = targetLivingConditions;
        this.hardwarioCode = hardwarioCode;
        this.data = data;
    }
}

module.exports = {TerrariumDto: TerrariumDto};