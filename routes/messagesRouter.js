const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const _db = path.join(__dirname,'..','messages.json');


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','Messaging','message.html'));
});

//add a message to a database
router.post('/add-message',jsonParser, (req, res) => {
    let complete = false;
    let found = false;
    let data = fs.readFileSync(_db, {encoding: 'utf8', flag:'r'});
    let messaging = JSON.parse(data);

    sender = req.body.sender
    recipient = req.body.recipient
    //if new message is from an admin
    if (req.body.type == "admin")
    {
        destination = recipient
    }
    else //if sender is normal user, goes to admin by defualt
    {
        destination = sender
    }
    
    console.log(req.body)

    for(let i = 0; i < messaging.conversations.length; i++) {
        if(messaging.conversations[i].user == destination ) // if there is already a history of messages to add to, add here
        {
            req.body.id = messaging.conversations[i].history.length+1;
            messaging.conversations[i].history.push(req.body);
            delete req.body.sender
            delete req.body.recipient
            data = JSON.stringify(messaging,null, '\t');
            fs.writeFileSync(path.join(__dirname,'..','messages.json'), data,"utf-8");
            found = true
        }
    }
    if(!found) // no history found so start a history for this user(destination)
        {
            req.body.id = 0;
            newEntry = {"user" : destination, "history": [{"id": req.body.id, "type" : req.body.type, "date" : req.body.date, "read" : req.body.read, "message" : req.body.message}]}
            console.log(newEntry)
            messaging.conversations.push(newEntry);
            delete req.body.sender
            delete req.body.recipient
            data = JSON.stringify(messaging,null, '\t');
            fs.writeFileSync(path.join(__dirname,'..','messages.json'), data,"utf-8");
        }
    console.log(data)
    if (complete) 
    {
        return res.status(200).json(data);
    }
    else 
    {
        return res.status(401).json(data);
    }
});

// retrieve message history of a given user and return them to be displayed in chat
router.post('/message-history',jsonParser, (req, res) => {
    let complete = false;
    let data = fs.readFileSync(_db, {encoding: 'utf8', flag:'r'});
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
        //console.log(messageHistory)
    }
    data = JSON.stringify(messageHistory,null, '\t');
    //console.log(data)
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