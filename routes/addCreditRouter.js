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
    
    var email = req.body.email
    var credit = req.body.wallet
    credit = parseInt(credit);
    //let complete = false;
    //console.log("RECIEVED BY ROUTER email : " + email);
    //console.log("RECIEVED BY ROUTER credit : " + credit);
    
    //fake login for testing
    email = 'MonroeLane@cosmosis.com';

    let data = fs.readFileSync(path.join(__dirname,'..','users_db.json'), {encoding: 'utf8', flag:'r'});
    let users = JSON.parse(data);
    newData = [];

    for(i = 0; i < (users.user).length; i++) {
        //console.log(users.user[i].email);
        if (users.user[i].email == email){
            complete = true;
            console.log("found " + email + " setting credit to " + parseInt(users.user[i].wallet) + credit);
            users.user[i].wallet = parseInt(users.user[i].wallet) + credit;
            newData.push((users.user[i]));
            complete = true;
        }
        newData.push((users.user[i]));
    }
    data = JSON.stringify(users,null, '\t');
    //console.log(data);
    fs.writeFileSync(path.join(__dirname,'..','users_db.json'), data,"utf-8");
   
    if (complete == true) 
    {
        return res.status(200).json(credit);
    }
    else 
    {
        return res.status(401).json("You are not registered, log in or register!");
    }
});


module.exports = router;