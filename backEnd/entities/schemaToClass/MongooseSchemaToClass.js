class TerrariumData {
    constructor(value, type) {
        this.timestamp = new Date();
        this.value = value;
        this.type = type;
    }
}

class TerrariumTarget {
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
        this.name = name;
        this.animalType = animalType;
        this.description = description;
        this.hardwarioCode = hardwarioCode;
        this.data=data;
    }
}

module.exports = {TerrariumData, TerrariumTarget, Terrarium};