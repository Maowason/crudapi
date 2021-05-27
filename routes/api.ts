/*
    Program file for the overall routing
*/

const express = require('express')
const router = express.Router()
// Handle of Schema
const Praan = require('../models/praan.ts')
const User = require('../models/user.js')
const csv = require('csv-parser')
const multer = require('multer')
const fs = require('fs')
const verify = require('../verifyToken')

// Sending async request so it does not block the process
// This is for a basic post request
router.post('/', verify, async(req,res) => {
    const praan = new Praan({
        device: req.body.device,
        t: req.body.t,
        w: req.body.w,   
        h: req.body.h,
        p1: req.body.p1,
        p25: req.body.p25,
        p10: req.body.p10,
        createdAt: req.body.createdAt,
        updatedAt: req.body.updatedAt
    })

    try{
        const a1 = await praan.save()
        res.json(a1)
    }
    catch(err){
        res.status(500).send('Error' + err)
    }
})

// Will handle a basic get request and will return the entire Database
router.get('/', verify, async(req,res) => {
    try{
        const api = await Praan.find()
        res.json(api)
    }
    catch(err){
        res.status(500).send('Error'+err)
    }
})


// Route to pull data for specific devices
router.get('/:device_name', verify, async(req,res)=>{
    try{
        const device_name = req.params.device_name
        const praan = await Praan.find({device:device_name})
        // praan.device = req.body.device
        // const a1 = await praan.save()
        res.send(praan)
    }
    catch(err){
        res.status(500).send('Error'+err)
    }
})

// Route to pull pm1 values separately for all specified device
router.get('/:device_name/p1', verify, async(req,res)=>{
    try{
        const device_name = req.params.device_name
        const praan = await Praan.find({device:device_name}).select('p1')
        res.send(praan)
    }
    catch(err){
        res.status(500).send('Error'+err)
    }
})

// Route to pull pm2.5, values separately for all specified device
router.get('/:device_name/p25', verify, async(req,res)=>{
    try{
        const device_name = req.params.device_name
        const praan = await Praan.find({device:device_name}).select('p25')
        res.send(praan)
    }
    catch(err){
        res.status(500).send('Error'+err)
    }
})

// Route to pull pm1, pm2.5, and pm10 values separately for all specified device
router.get('/:device_name/p10', verify, async(req,res)=>{
    try{
        const device_name = req.params.device_name
        const praan = await Praan.find({device:device_name}).select('p10')
        res.send(praan)
    }
    catch(err){
        res.send('Error'+err)
    }
})

// Filter the data according to a time-range. 
// Eg. http://localhost:9000/api/date/2020-04-20/2021-05-27
router.get('/date/:startDate/:endDate', verify, async(req,res) => {
    try{
        const startDate = req.params.startDate
        const endDate = req.params.endDate
        // console.log(startDate, endDate)
        const api = await Praan.find({
            createdAt: {
                $gte: new Date(new Date(startDate).setHours(0o0, 0o0, 0o0)),
                $lt: new Date(new Date(endDate).setHours(23, 59, 59))
            }
        })
        res.json(api)
    }
    catch(err){
        res.status(500).send('Error'+err)
    }
})

// Route to delete a device. Need to pass the ID of that device.
router.delete('/:id', verify, async(req,res)=>{
    try{
        const praan = await Praan.findById(req.params.id)
        praan.sub = req.body.sub
        const a1 = await praan.remove()
        res.json(a1)
    }
    catch(err){
        res.status(500).send('Error'+err)
    }
})

// Will upload the csv to the dest folder. To keep track of csv's uploaded.
const upload = multer({ dest: 'tmp/test/csv' });
const readFile = (fileName) => new Promise((resolve, reject) => {
    const stream = [];
    fs.createReadStream(fileName).pipe(csv())
        .on('data', (data) => stream.push(data))
        .on('end', () => {
        resolve(stream);
    });
});

// Route to upload bulk data from a given excel sheet
router.post('/upload', verify, upload.single('file'), async (req, res, next) => {
    try{
        const fileContents = await readFile(req.file.path)
        fs.writeFileSync('output.json', JSON.stringify(fileContents))
        let outputData = fs.readFileSync('output.json')
        let output = JSON.parse(outputData)
        await Praan.insertMany(output)
        res.send('Successfully Pushed Changes to the Database 😊')
    }
    catch(e){
        res.status(500).send('Error! Upload the correct file!');
    }

});

// Exporting module so it will be accessible in app.js
module.exports = router