const Joi = require('joi');

const LoginDtoIn = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
});

module.exports = LoginDtoIn;