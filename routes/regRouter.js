const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','registration.html'));
});

router.post('/',jsonParser, (req, res) => {
    let success = false;
    const data = fs.readFileSync(path.join(__dirname,'..','db.csv'), {encoding: 'utf8', flag:'r'});
    const users = data.split('\r');
    let exists;
    for(i = 1; i < users.length; i++) {
        const user = users[i].split(',');
        if (user[1] === req.body.email || user[2] ==req.body.username){
            exists = true;
        }
    }
    if(!exists){
        fs.appendFileSync(path.join(__dirname,'..','db.csv'), +data.length+","+
                                                                    req.body.email+","+
                                                                    req.body.username+","+
                                                                    req.body.name+","+
                                                                    req.body.password+","+
                                                                    req.body.registration+","+
                                                                    req.body.street+","+
                                                                    req.body.city+","+
                                                                    req.body.postcode+","+
                                                                    req.body.userType+","+"100"+"\r"
                                                                    );
    }
    console.log(req.body.email)
    if (success) {
        return res.status(200);
    }
    else {
        return res.status(300);
    }
});
module.exports = router;