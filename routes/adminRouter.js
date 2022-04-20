const express = require('express');
const path = require('path');
const fs = require('fs');

const bodyParser = require('body-parser');

const router = express.Router();
//create jsonParser so that data can be converted to json.
const jsonParser = bodyParser.json();


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','Admin','adminIndex.html'));
});

router.get('/requests', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','Admin','manageRequest.html'));

});

router.get('/requests/manageRequests', (req, res) => {

    let requests = [];

    let data = fs.readFileSync(path.join(__dirname,'..','requests.json'), {encoding: 'utf8', flag:'r'});
    data = JSON.parse(data);


    for (let i = 0; i < data.length; i++) {
        if (data[i].approved === null ) {
            requests.push(data[i]);
        }
    }

    res.status(200).json(requests);
});

router.patch('/requests/response', jsonParser, (req, res) => {

    let request;

    let data = fs.readFileSync(path.join(__dirname,'..','requests.json'), {encoding: 'utf8', flag:'r'});
    let requests = JSON.parse(data);

    for(i = 0; i < requests.length; i++) {
        if (requests[i].id === req.body.requestId) {
            requests[i].approved = req.body.approved;
            request = requests[i];
            break;
        }
    }
    data = JSON.stringify(requests,null, '\t');
    fs.writeFileSync(path.join(__dirname,'..','requests.json'), data,"utf-8");

    res.status(200).json(request);;
});


module.exports = router;