const Joi = require('joi');

const TerrariumDtoIn = Joi.object({
    name: Joi.string().required(),
    animalType: Joi.string(),
    description: Joi.string(),
    targetLivingConditions: Joi.object({
        humidity: Joi.object({
            min: Joi.number().min(0).max(100),
            max: Joi.number().min(0).max(100),
        }).required(),
        temperature: Joi.object({
            min: Joi.number().min(-100).max(100),
            max: Joi.number().min(-100).max(100),
        }).required(),
        lightIntensity: Joi.object({
            min: Joi.number().min(0).max(100),
            max: Joi.number().min(0).max(100),
        }).required(),
    }).required(),
    hardwarioCode: Joi.string().min(1).max(36).required(),
    data: Joi.array().items(Joi.object({
        timestamp: Joi.date(),
        value: Joi.number(),
        type: Joi.string().valid('temperature', 'danger', 'feeding', 'drinking'),
    }).default([])),
});

module.exports = TerrariumDtoIn;