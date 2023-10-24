const Joi = require('joi');

const UserCreateDtoIn = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    roles: Joi.array().items(Joi.string()),
    password: Joi.string().required(),
});

module.exports = UserCreateDtoIn;