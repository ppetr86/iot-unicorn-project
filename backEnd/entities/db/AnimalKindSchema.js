const mongoose = require('mongoose');
const {Schema} = mongoose;

const AnimalKindSchema = new Schema({
    animalType: {
        type: String,
        required: true,
        nullable: false,
        unique: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: 255,
        minLength: 20,
    },
    //optimalni hodnoty kterych chceme dosahovat pri chovu
    livingConditions:
        {
            type: Object,
            required: true,
            nullable: false,
            validate: [
                {
                    validator: function (conditions) {
                        return conditions.humidity.min <= conditions.humidity.max &&
                            conditions.temperature.min <= conditions.temperature.max &&
                            conditions.lightIntensity.min <= conditions.lightIntensity.max;
                    },
                    message: 'Minimum conditions must be less than or equal to maximum conditions.',
                },
            ],
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

module.exports = mongoose.model('AnimalKind', AnimalKindSchema);