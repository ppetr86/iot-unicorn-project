class AnimalKindDtoIn {
    constructor(value) {
        this.animalType = value.animalType;
        this.description = value.description;
        this.targetLivingConditions = new TargetLivingConditions(value.targetLivingConditions);
    }
}

class TargetLivingConditions {
    constructor(value) {
        this.humidity = new MinMax(value.humidity);
        this.temperature = new MinMax(value.temperature);
        this.lightIntensity = new MinMax(value.lightIntensity);
    }
}

class MinMax {
    constructor(value) {
        this.min = value.min;
        this.max = value.max;
    }
}

class TerrariumData {
    constructor(value) {
        this.timestamp = value?.timestamp ? value.timestamp : new Date();
        this.value = value.value;
        this.type = value.type.trim();
    }
}

class LoginDtoIn {
    constructor(value) {
        this.email = value.email.trim();
        this.password = value.password;
    }
}

class TerrariumDtoIn {
    constructor(value) {
        this.name = value.name.trim();
        this.animalType = value.animalType.trim();
        this.description = value.description.trim();
        this.targetLivingConditions = new TargetLivingConditions(value.targetLivingConditions);
        this.hardwarioCode = value.hardwarioCode;
        if (value.data && Array.isArray(value.data) && value.data.length > 0)
            this.data = new TerrariumData(value.data);
    }
}

class UserPutDtoIn {
    constructor(value) {
        this.firstName = value.firstName.trim();
        this.lastName = value.lastName.trim();
        this.email = value.email.trim();
        this.roles = value.roles.map(each => each.trim());
    }
}

class UserCreateDtoIn {
    constructor(value) {
        this.firstName = value.firstName.trim();
        this.lastName = value.lastName.trim();
        this.email = value.email.trim();
        this.roles = value.roles.map(each => each.trim());
        this.password = value.password;
    }
}

module.exports = {
    AnimalKindDtoIn,
    TargetLivingConditions,
    MinMax,
    TerrariumData,
    LoginDtoIn,
    TerrariumDtoIn,
    UserPutDtoIn,
    UserCreateDtoIn,
};