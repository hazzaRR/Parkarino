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

router.post('/add-credit',jsonParser, (req, res) => {
    
    var email = req.body.email
    var credit = req.body.wallet
    credit = parseInt(credit);
    let complete = false;
    console.log("RECIEVED BY ROUTER email : " + email);
    console.log("RECIEVED BY ROUTER credit : " + credit);

    let data = fs.readFileSync(path.join(__dirname,'..','users_db.json'), {encoding: 'utf8', flag:'r'});
    let users = JSON.parse(data);

    for(i = 0; i < (users.user).length; i++) {
        if (users.user[i].email == email){
            complete = true;
            console.log("found " + email + " setting credit to " + parseInt(users.user[i].wallet) + " " + credit);
            users.user[i].wallet = parseInt(users.user[i].wallet) + credit;
            complete = true;
        }
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


module.exports = router;