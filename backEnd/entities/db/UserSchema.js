const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const {Schema} = mongoose;

const emailRegExp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const validateEmail = email => emailRegExp.test(email);

const UserSchema = new Schema({
        firstName: {
            type: String,
            trim: true,
            maxlength: 100,
            minLength: 2,
            required: true
        },
        lastName: {
            type: String,
            trim: true,
            maxlength: 100,
            minLength: 2,
            required: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required:true,
            validate: [validateEmail, 'Please fill a valid email address'],
            index: true
        },
        roles: {
            type: [{
                type: String
            }],
            enum: ['ROLE_ADMIN', 'ROLE_USER'],
            required: true
        },
        password: {
            type: String,
            required: true,
            maxlength: 10,
            minLength: 4,
            select: false
        },
        passwordChangedAt: {
            type: Date,
            select: false
        },
        passwordResetToken: {
            type: String,
            select: false
        },
        passwordResetExpires: {
            type: Date,
            select: false,
        },
        isDeactivated: {
            type: Boolean,
            default: false
        },
        //define on every schema so that we could get e.g. last document
        createdAt: {
            type: Date,
            default: Date.now,
        },
        //user related info end

        //embedded objects in mongoose are assigned _id by default
        terrariums: [
            {
                name: {
                    type: String,
                    index: true
                },
                animalType: String,
                description: String,
                //optimalni hodnoty kterych chceme dosahovat pri chovu
                targets: {
                    type: Object,
                    required: true,
                    humidity: {
                        min: {
                            type: Number,
                            min: 0,
                            max: 100
                        },
                        max: {
                            type: Number,
                            min: 0,
                            max: 100
                        }
                    },
                    temperature: {
                        min: {
                            type: Number,
                            min: -100,
                            max: 100
                        },
                        max: {
                            type: Number,
                            min: -100,
                            max: 100
                        }
                    },
                    lightIntensity: {
                        min: {
                            type: Number,
                            min: 0,
                            max: 100
                        },
                        max: {
                            type: Number,
                            min: 0,
                            max: 100
                        }
                    }
                },
                sensors: [
                    {
                        hardwarioCode: {
                            type: String,
                            maxlength: 36,
                            minLength: 1,
                            sparse: true,
                            unique: true,
                            index: true
                        },
                        name: {type: String, index: true},
                        data: [
                            {
                                timestamp: Date,
                                value: Number,
                                type: {
                                    type: String,
                                    enum: ['temperature', 'humidity', 'lightIntensity']
                                }
                            },
                        ],
                    },
                ],
            },
        ],
    })
;

UserSchema.path('terrariums.targets').validate(validateMinMax, 'Target max must be greater or equal to Target min.');

function validateMinMax(targets) {
    return targets.humidity.min <= targets.humidity.max &&
        targets.temperature.min <= targets.temperature.max &&
        targets.lightIntensity.min <= targets.lightIntensity.max;

}

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password, 10);

    next();
});

UserSchema.methods.isProvidedPasswordMatchingPersisted = async function (providedPassword, persistedPassword) {
    return await bcrypt.compare(providedPassword, persistedPassword);
};

UserSchema.statics.isExistingByEmail = async function (email) {
    const duplicateUser = await this.exists({email: email});
    return !!duplicateUser;

}

UserSchema.methods.collectValidationErrors = function () {
    const error = this.validateSync();
    if (error) {
        return error.message;
    }
    return "";
}

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

UserSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

UserSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew)
        return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

UserSchema.statics.keys = function () {
    return this.schema.obj;
}

module.exports = mongoose.model('User', UserSchema);