const Joi = require('joi');

const UserPutValidationIn = Joi.object({
    firstName: Joi.string().trim().required().trim(),
    lastName: Joi.string().trim().required().trim(),
    email: Joi.string().trim().email().required().trim(),
    roles: Joi.array().items(Joi.string()),
});

module.exports = UserPutValidationIn;