const mongoose = require('mongoose')
const { Schema } = mongoose

// Table Pets
// timestamps: Mark creation and update date
const Pet = mongoose.model(
    'Pet',
    new Schema({
        name: {
            type: String,
            required: true
        },

        age: {
            type: Number,
            required: true
        },

        weight: {
            type: Number,
            required: true
        },

        color: {
            type: String,
            required: true
        },

        images: {
            type: Array,
            required: true
        },

        available: {
            type: Boolean
        },
        
        user: Object,
        adopter: Object

    }, { timestamps: true })
)

module.exports = Pet