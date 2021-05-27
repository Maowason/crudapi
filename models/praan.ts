/*
    This program file has the schema for the Database
*/

const mongoose = require('mongoose')


// Praan Schema
const praanSchema = new mongoose.Schema({

    device:{
        type: String,
        required: true
    },
    // To handle timestamp request coming from the uploaded csv datasets
    t:{
        type: String,
        required: false
    },
    w:{
        type: Number,
        required: true
    },
    h:{
        type: String,
        required: true
    },
    p1:{
        type: Number,
        required: true
    },
    p25:{
        type: Number,
        required: true
    },
    p10:{
        type: Number,
        required: true
    }
},
// Will add createdAt and updatedAt to the database
{ timestamps: true })

// Exporting the schema
module.exports = mongoose.model('Praan', praanSchema)