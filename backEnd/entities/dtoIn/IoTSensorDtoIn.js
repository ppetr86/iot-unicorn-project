const Joi = require('joi');

const IotSensorDtoIn = Joi.object({
    id: Joi.string(),
    name: Joi.string(),
    targetLivingConditions: Joi.object({
        temperature: Joi.number().required(),
        humidity: Joi.number().required(),
        lightIntensity: Joi.number().required(),
    }).required(),
});

module.exports = IotSensorDtoIn;