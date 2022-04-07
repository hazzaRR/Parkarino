const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const carpark_db = path.join(__dirname,'..','carpark_db.json');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','viewCarpark.html'));
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
        carparksData.push((carparks.locations[i].location));
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

module.exports = router;