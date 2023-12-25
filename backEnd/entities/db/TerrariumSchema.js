const mongoose = require('mongoose');
const {Schema} = mongoose;

const TerrariumSchema = new Schema({

    name: {
        type: String,
        index: true,
    },
    animalType: String,
    description: String,
    //optimalni hodnoty kterych chceme dosahovat pri chovu
    targetLivingConditions: {
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
    hardwarioCode: {
        type: String,
        maxlength: 36,
        minLength: 1,
        sparse: true,
        unique: true,
        index: true
    },
    data: [
        {
            timestamp: Date,
            value: Number,
            type: {
                type: String,
                enum: ['temperature', 'danger', 'feeding', 'drinking']
            },
        },
    ],
});

TerrariumSchema.path('targetLivingConditions').validate(validateMinMax, 'Max must be greater or equal to min.');

function validateMinMax(targetLivingConditions) {
    return targetLivingConditions.humidity.min <= targetLivingConditions.humidity.max &&
        targetLivingConditions.temperature.min <= targetLivingConditions.temperature.max &&
        targetLivingConditions.lightIntensity.min <= targetLivingConditions.lightIntensity.max;

}


module.exports = mongoose.model('TerrariumSchema', TerrariumSchema);