const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','Driver','check_in.html'));
});

router.post('/check', jsonParser, (req, res) => {
    let data = fs.readFileSync(path.join(__dirname,'..','users_db.json'), {encoding: 'utf8', flag:'r'});
    let users = JSON.parse(data);
    for(i = 0; i < users.user.length; i++) {
        if (users.user[i].email === req.body.the_ban_email) {
            users.user.splice(i, 1);
            break;
        }
    }

    data = JSON.stringify(users,null, '\t');
    fs.writeFileSync(path.join(__dirname,'..','users_db.json'), data,"utf-8");
    console.log("Hello anyone");
    res.status(200).json(req.body.the_ban_email);
});

module.exports = router;