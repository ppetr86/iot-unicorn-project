const Joi = require('joi');

const UserPutDtoIn = Joi.object({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    roles: Joi.array().items(Joi.string()),
});

module.exports = UserPutDtoIn;