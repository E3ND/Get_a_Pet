const mongoose = require('mongoose')
const { Schema } = mongoose

// Table Users
// timestamps: Mark creation and update date
const User = mongoose.model(
    'User',
    new Schema({
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        password: {
            type: String,
            required: true
        },

        image: {
            type: String,
        },

        phone: {
            type: String,
            required: true
        },
    }, { timestamps: true })
)

module.exports = User