const express = require('express');
const path = require('path');
const fs = require('fs');

const bodyParser = require('body-parser');

const router = express.Router();
//create jsonParser so that data can be converted to json.
const jsonParser = bodyParser.json();


//tickets routes
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','Driver','ticket.html'));
});

router.post('/createTicket', jsonParser, (req, res) => {

    console.log(req.body);

    let data = fs.readFileSync(path.join(__dirname,'..','tickets.json'), {encoding: 'utf8', flag:'r'});
    let tickets = JSON.parse(data);


    req.body.ticketId = tickets.length;

    tickets.push(req.body);
    data = JSON.stringify(tickets,null, '\t');
    fs.writeFileSync(path.join(__dirname,'..','tickets.json'), data,"utf-8");

    res.status(200).json("success!");

});

module.exports = router;