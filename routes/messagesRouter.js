const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const _db = path.join(__dirname,'..','messages.json');
const users_db = path.join(__dirname,'..','users_db.json');


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','Messaging','message.html'));
});


router.get('/get-users', (req, res) => {
    //let complete = false;
    // message history database
    let msg_data = fs.readFileSync(_db, {encoding: 'utf8', flag:'r'});
    let msgHist = JSON.parse(msg_data);
    //registered users database
    let user_data = fs.readFileSync(users_db, {encoding: 'utf8', flag:'r'});
    let allUsers = JSON.parse(user_data);

    let msgHistUsers = []
    //compile active users (i.e. with a conversation history)
    for (let i = 0; i < msgHist.conversations.length; i++)
    {
        // see if user has unread messages - append to push as a notif
        details = ""
        
        for (let j = 0; j < msgHist.conversations[i].history.length; j++)
        {
            console.log(msgHist.conversations[i].history[j].read)
            if(msgHist.conversations[i].history[j].read == false){details = "~~ new unread messages"; break}
        }
        msgHistUsers.push((msgHist.conversations[i].user + details));
    }
    for (let i = 0; i < allUsers.user.length; i++)
    {
        if(!hasMessageHist(allUsers.user[i].email))
        {
            msgHistUsers.push(allUsers.user[i].email + "~~ no message history")
        }
    }

    //msgHistUsers.sort(getActivityOrder(msgHistUsers));

    //return a combined json of users
    data = JSON.stringify(msgHistUsers, null, '\t');
    console.log(data)
    return res.status(200).json(data);
});

//add a message to a database
router.post('/add-message',jsonParser, (req, res) => {
    if(req.body.sender == null){console.log(req.body.sender == null); msg = {alert : "not logged in"}; return res.status(200).json(msg);}
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
            complete = true
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
            complete = true
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
    if(req.body.email == null){console.log(req.body.email == null); msg = {alert : "not logged in"}; return res.status(200).json(msg);}
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

function hasMessageHist(email)
{
    let msg_data = fs.readFileSync(_db, {encoding: 'utf8', flag:'r'});
    let msgHist = JSON.parse(msg_data);

    msgHistUsers = {}
    //compile active users (i.e. with a conversation history)
    for (let i = 0; i < msgHist.conversations.length; i++)
    {
       if(msgHist.conversations[i].user == email){return true}
    }
    return false;
}

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
function getActivityOrder(prop)
{
    return function(a,b)
    {
        if (a[prop].length > b[prop].length)
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