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
router.get('/inbox', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','Admin','inbox.html'));

});

router.get('/carparks', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','Admin','blockSpace.html'));
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

router.get('/getRequest', (req, res) => {

    const requestId = req.query.requestId;

    console.log(requestId)

    let request;

    let data = fs.readFileSync(path.join(__dirname,'..','requests.json'), {encoding: 'utf8', flag:'r'});
    data = JSON.parse(data);


    for (let i = 0; i < data.length; i++) {
        if (data[i].id == requestId) {
            request = data[i];
            break;
        }
    }

    console.log(request);

    res.status(200).json(request);
});


//updates drivers original request to either true or false. Depending on if it was approved.
router.patch('/requests/response', jsonParser, (req, res) => {

    let data = fs.readFileSync(path.join(__dirname,'..','requests.json'), {encoding: 'utf8', flag:'r'});
    let requests = JSON.parse(data);

    for(i = 0; i < requests.length; i++) {
        if (requests[i].id === req.body.requestId) {
            requests[i].approved = req.body.approved;
            break;
        }
    }
    data = JSON.stringify(requests,null, '\t');
    fs.writeFileSync(path.join(__dirname,'..','requests.json'), data,"utf-8");

    res.status(200).json("Success");;
});


//autoAssigns a carpark space 
router.get('/autoAssignSpace', jsonParser, (req,res) => {

    
    const ticketStartTime = req.query.aTime;
    const ticketEndTime = req.query.dTime;
    const carpark = req.query.carpark;

    let data = fs.readFileSync(path.join(__dirname,'..','tickets.json'), {encoding: 'utf8', flag:'r'});
    let tickets = JSON.parse(data);

    //an array to store all the carpark spaces that are occupied during the new ticket time
    let takenSpots = [];

    //finds all the taken spots in a car park for the given times
    for (i = 0; i < tickets.length; i++) {

        if ((tickets[i].arrivalTime <= ticketEndTime) && (ticketStartTime <= tickets[i].departureTime) && ( tickets[i].carPark == carpark)) {
            takenSpots.push(tickets[i].parkingSpace);
        }
    }

    console.log(takenSpots);

    data = fs.readFileSync(path.join(__dirname,'..','carpark_db.json'), {encoding: 'utf8', flag:'r'});
    let carparks = JSON.parse(data);

    let assignedSpot = null;

    for(i = 0; i < carparks.locations.length; i++) {
        if (carparks.locations[i].name == carpark) {
            for (j = 0 ; j < carparks.locations[i].space.length; j++) {

                //finds first spot in the requested carpark that doesnt equal a taken space or is currently blocked by an admin
                if(!(takenSpots.includes(carparks.locations[i].space[j].ID) || (carparks.locations[i].space[j].occupier == "Blocked By Admin"))) {
                    console.log(carparks.locations[i].space[j].ID);
                    assignedSpot = {
                        carpark : carpark,
                        parkingSpace: carparks.locations[i].space[j].ID
                    }

                    //break out of both inner and outer loop
                    i = carparks.locations.length;
                    break;
                }
            }
        }
    }

    if (assignedSpot != null) {
        res.status(200).json(assignedSpot);
    }
    else {
        res.status(200).json(assignedSpot);
    }

})


//returns all the free spaces in the carpark
router.patch('/updateSpace',jsonParser, (req, res) => {


    let data = fs.readFileSync(path.join(__dirname,'..','carpark_db.json'), {encoding: 'utf8', flag:'r'});
    let carparks = JSON.parse(data);
    for(i = 0; i < carparks.locations.length; i++) {
        if (carparks.locations[i].name == req.body.carpark) {
            for (j = 0 ; j < carparks.locations[i].space.length; j++) {
                //changes the carpark to either available or unavailable
                if (carparks.locations[i].space[j].ID == req.body.parkingSpaceID) {
                    carparks.locations[i].space[j].available = req.body.available;
                    carparks.locations[i].space[j].occupier = req.body.occupier;
                }
            }

            if(req.body.available) {
                carparks.locations[i].freespaces++;
            }
            else {
                carparks.locations[i].freespaces--; 
            }
        }
    }
    data = JSON.stringify(carparks,null, '\t');
    fs.writeFileSync(path.join(__dirname,'..','carpark_db.json'), data,"utf-8");

    res.status(200).json("Space has been Blocked");
});


module.exports = router;