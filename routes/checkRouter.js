const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','Driver','check_in.html'));
});

router.post('/check1', jsonParser, (req, res) => {
    let data = fs.readFileSync(path.join(__dirname,'..','tickets.json'), {encoding: 'utf8', flag:'r'});
    let data2 = fs.readFileSync(path.join(__dirname,'..','carpark_db.json'), {encoding: 'utf8', flag:'r'});
    let tickets = JSON.parse(data);
    let i;
    let j;
    let parks = JSON.parse(data2);
    let currentTicket;
    for(i = 0; i < tickets.length; i++){
        if (tickets[i].ticketId == req.body.ticket){
            tickets[i].checked_in=true;
            currentTicket = tickets[i];
        }
    }
    for(j=0;j<parks.locations.length;j++){
        if (currentTicket.carPark==parks.locations[j].name){

            for (z=0;z<parks.locations[j].space.length;z++)
                if (parks.locations[j].space[z].ID == currentTicket.parkingSpace) {
                    parks.locations[j].space[z].occupier = currentTicket.driverId;
                    parks.locations[j].space[z].available = false;
                }
        }
    }

    data = JSON.stringify(tickets,null, '\t');
    data2 = JSON.stringify(parks,null, '\t');
    fs.writeFileSync(path.join(__dirname,'..','tickets.json'), data,"utf-8");
    fs.writeFileSync(path.join(__dirname,'..','carpark_db.json'), data2,"utf-8");

    console.log("Hello anyone");
    res.status(200);
});

router.post('/check2', jsonParser, (req, res) => {
    let data = fs.readFileSync(path.join(__dirname,'..','tickets.json'), {encoding: 'utf8', flag:'r'});
    let data2 = fs.readFileSync(path.join(__dirname,'..','carpark_db.json'), {encoding: 'utf8', flag:'r'});
    let tickets = JSON.parse(data);
    let i;
    let j;
    let parks = JSON.parse(data2);
    let currentTicket;
    for(i = 0; i < tickets.length; i++){
        if (tickets[i].ticketId == req.body.ticket){
            tickets[i].checked_out=true;
            currentTicket = tickets[i];
        }
    }
    for(j=0;j<parks.locations.length;j++){
        if (currentTicket.carPark==parks.locations[j].name){

            for (z=0;z<parks.locations[j].space.length;z++)
                if (parks.locations[j].space[z].ID == currentTicket.parkingSpace) {
                    parks.locations[j].space[z].occupier = null;
                    parks.locations[j].space[z].available = true;
                }
        }
    }

    data = JSON.stringify(tickets,null, '\t');
    data2 = JSON.stringify(parks,null, '\t');
    fs.writeFileSync(path.join(__dirname,'..','tickets.json'), data,"utf-8");
    fs.writeFileSync(path.join(__dirname,'..','carpark_db.json'), data2,"utf-8");
    console.log("Hello anyone");
    res.status(200);
});

module.exports = router;