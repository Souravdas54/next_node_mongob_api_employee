const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: "please enter your email Id",
        unique: true,
        min: 10,
        max: 50

    },
    phone: {
        type: String,
        required: 'please enter your phone number',
        min: 10,
        max: 12
    },
    city: {
        type: String,
        required: true,
        min: 3,
        max: 30
    },

    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'], // Allow these string values
        default: 'Inactive',
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Employee', UserSchema)