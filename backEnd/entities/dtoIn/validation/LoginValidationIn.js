const Joi = require('joi');

const LoginValidationIn = Joi.object({
    email: Joi.string().required().trim().email(),
    password: Joi.string().required()
});

module.exports = LoginValidationIn;