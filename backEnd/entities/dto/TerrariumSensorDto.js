class TerrariumDto {
    constructor(name, animalType, description, targets, hardwarioCode, data) {
        this.name = name;
        this.animalType = animalType;
        this.description = description;
        this.targets = targets;
        this.hardwarioCode = hardwarioCode;
        this.data = data;
    }
}

module.exports = {TerrariumDto: TerrariumDto};