const express = require('express');
const path = require('path');
const fs = require('fs');

const bodyParser = require('body-parser');

const router = express.Router();
//create jsonParser so that data can be converted to json.
const jsonParser = bodyParser.json();


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','login.html')); 
});


//this needs to be changed :/
router.post('/',jsonParser, (req, res) => {

    console.log(req.body.email);
    console.log(req.body.password);

    let userDetails;
    let isValid = false;

    //need to change this :/
    fs.readFile(path.join(__dirname,'..','db.csv'), 'utf8' , (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        const users = data.split('\r');

        for(i = 1; i < users.length; i++) {
            const user = users[i].split(',');
            if (user[1] === req.body.email && user[3] === req.body.password) {
                //this for some reason doesnt change the actual variables
                userDetails = {
                    id: user[0],
                    email: user[1],
                    name: user[2],
                    password: user[3],
                    registration: user[4],
                    street: user[5],
                    city: user[6],
                    postcode: user[7],
                    userType: user[8]
                }
                isValid = true;
                break;
            }
        }
      })

      console.log(userDetails);
      console.log(isValid);

      //the responses need to be changed 
      if (isValid === true) {
        res.status(200).json(userDetails);
        res.sendFile(path.join(__dirname, '..', 'public','index.html'));
      }
      else {
          res.status(403);
      }
});


module.exports = router;