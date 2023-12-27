class TerrariumData {
    constructor(value, type) {
        this.timestamp = new Date();
        this.value = value;
        this.type = type;
    }
}

class TargetLivingConditions {
    constructor(temperatureMin,temperatureMax , humidityMin, humidityMax, lightIntensityMin, lightIntensityMax) {

        this.temperature = {};
        this.temperature.min = temperatureMin;
        this.temperature.max = temperatureMax;

        this.humidity = {};
        this.humidity.min = humidityMin;
        this.humidity.max = humidityMax;

        this.lightIntensity = {};
        this.lightIntensity.min = lightIntensityMin;
        this.lightIntensity.max = lightIntensityMax;
    }
}

class Terrarium {
    constructor(targetLivingConditions, name, animalType, description, hardwarioCode,data) {
        this.targetLivingConditions = targetLivingConditions;
        this.name = name.trim();
        this.animalType = animalType.trim();
        this.description = description.trim();
        this.hardwarioCode = hardwarioCode.trim();
        this.data=data;
    }
}

module.exports = {TerrariumData, TargetLivingConditions, Terrarium};