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
                userDetails = {
                    id: user[1],
                    email: user[2],
                    name: user[3],
                    password: user[4],
                    registration: user[5],
                    street: user[6],
                    city: user[7],
                    postcode: user[8],
                    userType: user[9]
                }
                isValid = true;
                break;
            }
        }
      })
      if (isValid === true) {
        res.status(200).json(userDetails);
        res.sendFile(path.join(__dirname, '..', 'public','index.html'));
      }
      else {
          res.status()
      }
});


module.exports = router;