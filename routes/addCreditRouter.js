const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const users_db = path.join(__dirname,'..','users_db.json');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','addCredit.html'));
});



router.post('/',jsonParser, (req, res) => {
    
    //var email = req.body.email
    //ar credit = req.body.wallet
    //credit = parseInt(credit);
    //let complete = false;
    //console.log("RECIEVED BY ROUTER email : " + email);
    //console.log("RECIEVED BY ROUTER credit : " + credit);
    
    let email = 'MonroeLane@cosmosis.com';

    let data = fs.readFileSync(path.join(__dirname,'..','users_db.json'), {encoding: 'utf8', flag:'r'});
    let users = JSON.parse(data);

    for(i = 0; i < users.length; i++) {
        console.log(users["user"][i].email);
        if (users["user"][i].email == email || users["user"][i].username == req.body.username){
            complete = true;
            console.log("found");
            return res.status(200);
        }
    }
    data = JSON.stringify(users,null, '\t');
    console.log(data);
    return res.status(200);
    /*
    for(i = 0; i < users.length; i++)
    {
        console.log(users["user"][i].email);
        if (users["user"][i].email == req.body.email)
        {
            console.log("found user" );
        }
    }
    */

        /*
    complete = true;
    if (complete == true) 
    {
        return res.status(200).json(email);
    }
    else 
    {
        return res.status(401).json("You are not registered, log in or register!");
    }
    */
});


module.exports = router;