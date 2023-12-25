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
            required: true,
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

        // @ManyToMany
        terrariums: [{type: Schema.Types.ObjectId, ref: 'TerrariumSchema'}],
    });

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