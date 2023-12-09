const Joi = require('joi');

const AnimalKindValidationIn = Joi.object({
    animalType: Joi.string().required().min(1).max(255).trim(),
    description: Joi.string().trim().min(20).max(255).trim(),
    targetLivingConditions: Joi.array().items(
        Joi.object({
            humidity: Joi.object({
                min: Joi.number().min(0),
                max: Joi.number().min(Joi.ref('min')),
            }),
            temperature: Joi.object({
                min: Joi.number().min(-273.15), // Absolute zero in Celsius
                max: Joi.number().min(Joi.ref('min')),
            }),
            lightIntensity: Joi.object({
                min: Joi.number().min(0),
                max: Joi.number().min(Joi.ref('min')),
            }),
        })
    ),
});

module.exports = AnimalKindValidationIn;
