class SensorData {
    constructor(value, type) {
        this.timestamp = new Date();
        this.value = value;
        this.type = type;
    }
}

class SensorTarget {
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

class Sensor {
    constructor(hardwarioCode, name, data) {
        this.hardwarioCode = hardwarioCode;
        this.name = name;
        this.data = data;
    }
}

class Terrarium {
    constructor(targets, name, animalType, description, sensors) {
        this.targets = targets;
        this.name = name;
        this.animalType = animalType;
        this.description = description;
        this.sensors = sensors;
    }
}

module.exports = {SensorData, SensorTarget, Sensor, Terrarium};