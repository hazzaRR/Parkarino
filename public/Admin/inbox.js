//const path = require('path');
//const messagePath = path.join(__dirname,'..','public','Messaging','message.js')
//import {Messaging, Message, displayMessages, createMessage} from './Messaging/message.js' // used for presenting messages
import { Messaging, Message, displayMessages, createMessage } from '/Messaging/message.js';

async function loadUsers(event)
{
    const activeUsers_res = await fetch('/messages/get-users', { method: 'GET'});
    const activeUsers_json = await activeUsers_res.json();

    let activeUsers_str = activeUsers_json.replace(/[\[\]'"]+/g,''); // strip all specials except comma,spaces
    const options = activeUsers_str.split(",");
    //console.log(activeUsers_str);
    console.log(activeUsers_json.status)
    if (activeUsers_res.status == 200)
    {
        options.forEach(item => addOptions(item)); // add new select option for each car park
    }
    else {
        return
        //document.getElementById('messageUserForm').innerHTML = "there are no users :( ~";
    }
    
}

async function messageUser(event)
{
    const selection = document.querySelector('#messageUserForm');
    let info = {
        email: selection.elements.namedItem('select_user').value
    }
    console.log("trying to reach user : " + selection.elements.namedItem('select_user').value)
    const serializedMessage = JSON.stringify(info);

    // posts to server at given endpoint
    const messageHistory_res = await fetch('/messages/message-history', { method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        body: serializedMessage
                    }
                )

    const messageHistory_json = await messageHistory_res.json();

    const conversation = new Messaging(1);
    const options = {year: 'numeric', month: 'numeric', day: 'numeric' };
    //console.log(sessionStorage.getItem('name'))
    let messageHistory = messageHistory_json;
    console.log(messageHistory);
    if(messageHistory_res.status == 200)
    {
        if(messageHistory.alert == "not logged in")
        {
            let para = document.createElement("p");
            para.innerText = "You must be logged in to view the message page!";
            var element = document.getElementById("alert_box");
            element.appendChild(para);
        }
        else if (messageHistory.alert != "no history") // If legitimate user and has a history
        {
            let messageHistory = JSON.parse(messageHistory_json);
            //console.log(messageHistory)
            for(let i = 0; i < messageHistory.length; i++) 
            {
                var message = messageHistory[i]
                //console.log(messageHistory_json[i])
                var date = new Date(message.date * 1000);
                var sender = "admin"; 
                var recipient = sessionStorage.getItem("name");
                if(message.type == "driver")
                {
                    var sender = sessionStorage.getItem("name"); 
                    var recipient = "admin";
                }
            
                let raw_str = message.id + " " + message.message + " " + String(date.toLocaleDateString(undefined, options)) + " " + String(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) + " " + message.read + " " + sender + " " + recipient
                console.log(raw_str)
                let msg = new Message(message.id, message.message, String(date.toLocaleDateString(undefined, options)), String(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), message.read, sender, recipient)
                conversation.sendMessage(msg);
            }
        }
        else if(messageHistory.alert == "no history")
        {
            let para = document.createElement("p");
            para.innerText = "Start a conversation...";
            var element = document.getElementById("alert_box");
            element.appendChild(para);
        }
    }
    //const message1 = new Message(7, "Thats all booked :)", "19/03/2022", "14:01", true, "user", 1);
    //conversation.sendMessage(message1);
    displayMessages(conversation);
}

function addOptions(item)
{
    console.log(item)
    let ops = document.getElementById("get_users");
    let option = document.createElement("option");
    option.text = item, ops.add(option);
}
const form = document.querySelector('#messageUserForm');
window.addEventListener('load', loadUsers);
form.addEventListener('submit', messageUser);