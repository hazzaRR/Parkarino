const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','maps','map.html'));
});

router.get('/getPins', (req, res) => {
    let data = fs.readFileSync(path.join(__dirname,'..','carpark_db.json'), {encoding: 'utf8', flag:'r'});
    data = JSON.parse(data);
    res.status(200).json(data.locations);
});

module.exports = router;