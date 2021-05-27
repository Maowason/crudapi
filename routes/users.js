/*
    Program file for the overall routing
*/

const express = require('express')
const router = express.Router()

// Handle of Schema
const User = require('../models/user')
const {registerValidation, loginValidation} = require('../validation.ts')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', async(req,res) => {

    // Validating the input from user
    // Putting req.body as arg to registerValidation function
    // which will then validate the input for the registeration
    const {error} = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // Check if user already in Database
    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist) return res.status(400).send('Email already in the Database')

    // Time to Hash the Password
    // Will generate a salt
    const salt = await bcrypt.genSalt(10)
    // Will hash the password and add the generated salt
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    try{
        const savedUser = await user.save()
        // Just sending back ID of user
        res.send({user: user._id})
    }
    catch(err){
        res.status(400).send(err)
    }
})

router.post('/login', async (req, res) => {
    // Validating the input from user
    // Putting req.body as arg to loginValidation function
    // which will then validate the input for the login
    const {error} = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // Check if email exists
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send('Email or Password Incorrect!')

    // Check if Password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('Email or Password Incorrect!')

    // Creating and assingning the Token (JWT)
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    //adding token to header
    res.header('auth-token', token).send(token)
})


// Exporting module so it will be accessible in app.js
module.exports = router