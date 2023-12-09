const Joi = require('joi');

const TerrariumValidationIn = Joi.object({
    name: Joi.string().required().trim(),
    animalType: Joi.string().trim(),
    description: Joi.string().trim(),
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
    hardwarioCode: Joi.string().min(1).max(36).required().trim(),
    data: Joi.array().items(Joi.object({
        timestamp: Joi.date(),
        value: Joi.number(),
        type: Joi.string().trim().valid('temperature', 'danger', 'feeding', 'drinking'),
    }).default([])),
});

module.exports = TerrariumValidationIn;