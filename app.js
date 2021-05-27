// Packages
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const url = process.env.DB_CONNECT

// Started Express Framework
const app = express()

// Connecting to Database
// Avoiding warning by using useNewUrlParser
mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology: true})
const con = mongoose.connection

// Will log Connected once Connection is ready
con.on('open', function(){
    console.log('Connected')
})

// Telling express that we want to use json format
app.use(express.json())

const praanRouter = require('./routes/api.ts')
const userRouter = require('./routes/users.js')
app.use(express.json({limit: '50mb'}));
//app.use(express.urlencoded({limit: '50mb'}));
// Middleware - will send all request to praanRouter and will forward request to api.ts
app.use('/api', praanRouter)
app.use('/users', userRouter)

app.listen(9000, function(){
    console.log('server started')
})