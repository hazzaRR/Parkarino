const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();



//payment routes
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','Driver','payment.html'));
});


router.patch('/chargeAccount', jsonParser, (req, res) => {

    const userID = req.body.userId;
    const ticketCost = req.body.ticketCost;

    let data = fs.readFileSync(path.join(__dirname,'..','users_db.json'), {encoding: 'utf8', flag:'r'});
    let users = JSON.parse(data);

    for(let i = 0; i < users.user.length; i++) {
        if (users.user[i]._id === userID ){
            users.user[i].wallet = users.user[i].wallet - ticketCost
        }
    }

    data = JSON.stringify(users,null, '\t');
    fs.writeFileSync(path.join(__dirname,'..','users_db.json'), data,"utf-8");
    
    res.status(200).json("Success");

});

module.exports = router;
