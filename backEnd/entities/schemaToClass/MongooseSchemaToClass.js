class SensorData {
    constructor(temperature, humidity, lightIntensity) {
        this.timestamp = new Date();
        this.temperature = temperature;
        this.humidity = humidity;
        this.lightIntensity = lightIntensity;
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
    constructor(hardwarioCode, name, targets, data) {
        this.hardwarioCode = hardwarioCode;
        this.name = name;
        this.targets = targets;
        this.data = data;
    }
}

class Terrarium {
    constructor(name, animalType, description, sensors) {
        this.name = name;
        this.animalType = animalType;
        this.description = description;
        this.sensors = sensors;
    }
}

module.exports = {SensorData, SensorTarget, Sensor, Terrarium};