const Joi = require('joi');

const UserCreateValidationIn = Joi.object({
    firstName: Joi.string().required().trim(),
    lastName: Joi.string().required().trim(),
    email: Joi.string().email().required().trim().email(),
    roles: Joi.array().items(Joi.string().trim().uppercase()),
    password: Joi.string().required(),
});

module.exports = UserCreateValidationIn;