const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','addCredit.html'));
});



router.post('/',jsonParser, (req, res) => {

    var email = req.body.email
    var credit = req.body.wallet
    credit = parseInt(credit);
    let complete = false;
    console.log("RECIEVED BY ROUTER email : " + email);
    console.log("RECIEVED BY ROUTER credit : " + credit);
    

    const data = fs.readFileSync(path.join(__dirname,'..','db.csv'), {encoding: 'utf8', flag:'r'});
    
    const users = data.split('\r');

    fs.appendFileSync(path.join(__dirname,'..','temp_db.csv'), "ID,Email Address,Username,Name,Password,Registration,Street,City,Postcode,User Type,Wallet" ,{encoding: "utf8", flag: "a+", mode: 0o666});
    for(i = 1; i < users.length; i++) {
        const user = users[i].split(',');
        
        userDetails = user;
        
        if (user[1] == email) { //if session user is found in db
            console.log(parseInt(user[10]) + credit);
            userDetails[10] = parseInt(user[10]) + credit
            complete = true;
        }
        //json to csv ready format
        userDetails = JSON.stringify(userDetails);
        formattedUserDetails = userDetails.replace(/['"]/g,'');
        formattedUserDetails = formattedUserDetails.replace(/[\[\]']/g,'');
        console.log(formattedUserDetails);

        fs.appendFileSync(path.join(__dirname,'..','temp_db.csv'), "\n" + formattedUserDetails.substring(2),{encoding: "utf8", flag: "a+", mode: 0o666});
    }
    //copy over temp db to real
    fs.renameSync('temp_db.csv', 'db.csv');

        //let rowsArr = rows.map(line=>line.split(','));
        //let out = rowsArr.filter(line=>parseInt(line[1]) !== email).join("\n");
        //fs.writeFileSync(__dirname,'..','db.csv', out);

    if (complete == true) 
    {
        return res.status(200).json(email);
    }
    else 
    {
        return res.status(401).json("You are not registered, log in or register!");
    }
});


module.exports = router;