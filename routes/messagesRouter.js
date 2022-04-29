const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const carpark_db = path.join(__dirname,'..','messages.json');


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','Messaging','message.html'));
});

router.post('/message-history',jsonParser, (req, res) => {
    let complete = false;
    let data = fs.readFileSync(carpark_db, {encoding: 'utf8', flag:'r'});
    let messaging = JSON.parse(data);

    thisUser = req.body.email
    convos = messaging.conversations
    for(i = 0; i < convos.length; i++) {
        if (convos[i].user == thisUser)
        {
            messageHistory = convos[i].history
            messageHistory.sort(getDateOrder("date"));

            complete = true
            break
        }
        else
        {
            messageHistory = {alert : "no history"}
            complete = true
        }
        console.log(messageHistory)
    }
    data = JSON.stringify(messageHistory,null, '\t');
    console.log(data)
    if (complete == true) 
    {
        return res.status(200).json(data);
    }
    else 
    {
        return res.status(401).json(data);
    }
});

function getDateOrder(prop)
{
    return function(a,b)
    {
        if (a[prop] > b[prop])
        {
            return 1;
        } else if (a[prop] < b[prop])
            {
                return -1;
            }
            return 0;
    }
}
module.exports = router;