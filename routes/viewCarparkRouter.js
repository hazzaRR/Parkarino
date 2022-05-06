const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const carpark_db = path.join(__dirname,'..','carpark_db.json');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','Driver','viewCarpark.html'));
});

//for specific carpark - not done yet
router.get('/carpark-info',jsonParser, (req, res) => {
    
    var carpark = req.body.carpark
    let complete = false;
    console.log("Recieved by router -> carpark : " + carpark);

    let data = fs.readFileSync(path.join(__dirname,'..','carpark_db.json'), {encoding: 'utf8', flag:'r'});
    let users = JSON.parse(data);
    carparkData = [];

    for(i = 0; i < (carparkDb).length; i++) {
        if (users.user[i].email == email){
            complete = true;
            console.log("found " + email + " setting credit to " + parseInt(users.user[i].wallet) + " " + credit);
            users.user[i].wallet = parseInt(users.user[i].wallet) + credit;
            newData.push((users.user[i]));
            complete = true;
        }
        newData.push((users.user[i]));
    }
    data = JSON.stringify(users,null, '\t');
    fs.writeFileSync(path.join(__dirname,'..','users_db.json'), data,"utf-8");
   
    if (complete == true) 
    {
        return res.status(200).json(email);
    }
    else 
    {
        return res.status(401).json("~ you must log in or register to  add credit to your account ~");
    }
});

//for returning all carparks (for html select form options)
router.get('/all-carparks',jsonParser, (req, res) => {
    let complete = false;
    let data = fs.readFileSync(carpark_db, {encoding: 'utf8', flag:'r'});
    let carparks = JSON.parse(data);
    carparksData = [];
    for(i = 0; i < carparks.locations.length; i++) {
        carparksData.push((carparks.locations[i].name));
    }
    complete = true
    data = JSON.stringify(carparksData,null, '\t');
    
    if (complete == true) 
    {
        return res.status(200).json(data);
    }
    else 
    {
        return res.status(401).json(data);
    }
});


//returns all the free spaces in the carpark
router.get('/spaces',jsonParser, (req, res) => {

    const selectedCarpark = req.query.carpark;

    let complete = false;

    let data = fs.readFileSync(carpark_db, {encoding: 'utf8', flag:'r'});
    let carparks = JSON.parse(data);
    carparkSpacesData = [];
    for(i = 0; i < carparks.locations.length; i++) {
        if (carparks.locations[i].name == selectedCarpark) {
            for (j = 0 ; j < carparks.locations[i].space.length; j++) {
                if (carparks.locations[i].space[j].available == true) {
                    carparkSpacesData.push(carparks.locations[i].space[j].ID);
                }
            }
        }
    }
    complete = true
    data = JSON.stringify(carparkSpacesData);
    
    if (complete == true) 
    {
        return res.status(200).json(data);
    }
    else 
    {
        return res.status(401).json(data);
    }
});

//returns all the free spaces in the carpark
router.get('/Freespaces',jsonParser, (req, res) => {

});

//returns all the occupied spaces in the carpark
router.get('/occupiedSpaces',jsonParser, (req, res) => {

    let data = fs.readFileSync(carpark_db, {encoding: 'utf8', flag:'r'});
    let carparks = JSON.parse(data);

    carparkSpacesData = [];

    let parkingSpaceDetails;

    for(i = 0; i < carparks.locations.length; i++) {
        for (j = 0 ; j < carparks.locations[i].space.length; j++) {
            if (carparks.locations[i].space[j].available == false) {
                parkingSpaceDetails = {
                    carparkName : carparks.locations[i].name,
                    parkingSpaceID: carparks.locations[i].space[j].ID,
                    occupiedBy: carparks.locations[i].space[j].occupier
                }
                carparkSpacesData.push(parkingSpaceDetails);
            }
        }
    }

    res.status(200).json(carparkSpacesData);
});

module.exports = router;