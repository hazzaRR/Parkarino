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


router.post('/',jsonParser, (req, res) => {

    console.log(req.body.email);
    console.log(req.body.password);

      let userDetails = {};
      let isValid = false;

      const data = fs.readFileSync(path.join(__dirname,'..','db.csv'), {encoding: 'utf8', flag:'r'});

      const users = data.split('\r');

      for(i = 1; i < users.length; i++) {
        const user = users[i].split(',');
        if (user[1] === req.body.email && user[3] === req.body.password) {

            userDetails = {
                id: user[0],
                email: user[1],
                name: user[2],
                userType: user[8]
            }
            isValid = true;
            break;
        }
    }
    
      if (isValid === true) {
        return res.status(200).json(userDetails);
      }
      else {
        return res.status(401).json("Incorrect username or password");
    }
});


module.exports = router;