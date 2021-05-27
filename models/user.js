// User Schema
const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
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
        required: true,
        min: 6
    },
    date: {
        type: Date,
        default: Date.now()
    }

})

// Exporting the schema
module.exports = mongoose.model('User', userSchema)
