const express = require('express');
const path = require('path');
const fs = require('fs');


const router = express.Router();

const bodyParser = require('body-parser');
//create jsonParser so that data can be converted to json.
const jsonParser = bodyParser.json();


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','Driver','makeRequest.html'));
});


router.post('/',jsonParser, (req, res) => {

    console.log(req.body);

    let data = fs.readFileSync(path.join(__dirname,'..','requests.json'), {encoding: 'utf8', flag:'r'});
    let requests = JSON.parse(data);


    req.body.id = requests.length;

    requests.push(req.body);
    data = JSON.stringify(requests,null, '\t');
    fs.writeFileSync(path.join(__dirname,'..','requests.json'), data,"utf-8");

    res.status(200).json("success!");
});

module.exports = router;
