const express = require('express');
const path = require('path');
const fs = require('fs');


const router = express.Router();

const bodyParser = require('body-parser');
//create jsonParser so that data can be converted to json.
const jsonParser = bodyParser.json();


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','Request','makeRequest.html'));
});


router.post('/',jsonParser, (req, res) => {

    console.log(req.body);
    // console.log(req.body.driverId);
    // console.log(req.body.location);
    // console.log(req.body.arrivalDate);
    // console.log(req.body.arrivalTime);
    // console.log(req.body.departureDate);
    // console.log(req.body.departureTime);

    const data = fs.readFileSync(path.join(__dirname,'..','db.csv'), {encoding: 'utf8', flag:'r'});

    res.status(200).json("success!");
});

module.exports = router;
