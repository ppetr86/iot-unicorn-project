const mongoose = require('mongoose');
const {fa} = require("@faker-js/faker");
const {Schema} = mongoose;

const AnimalKindSchema = new Schema({
    animalType: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: 255,
        minLength: 20,
    },
    //optimalni hodnoty kterych chceme dosahovat pri chovu
    targetLivingConditions: {
        type: Object,
        required:true,
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
    //define on every schema so that we could get e.g. last document
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

AnimalKindSchema.path('targetLivingConditions').validate(validateMinMax, 'Condition max must be greater equal condition min.');

function validateMinMax(conditions) {
    return conditions.humidity.min <= conditions.humidity.max &&
        conditions.temperature.min <= conditions.temperature.max &&
        conditions.lightIntensity.min <= conditions.lightIntensity.max;

}

module.exports = mongoose.model('AnimalKind', AnimalKindSchema);