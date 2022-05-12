//const path = require('path');
//const messagePath = path.join(__dirname,'..','public','Messaging','message.js')
//import {Messaging, Message, displayMessages, createMessage} from './Messaging/message.js' // used for presenting messages
import { Messaging, Message, displayMessages, addMessage, createMessage } from '/Messaging/message.js';

async function loadUsers(event)
{
    event.preventDefault();
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
    event.preventDefault();
    const selection = document.querySelector('#messageUserForm');
    let selected_email = selection.elements.namedItem('select_user').value
    var formatEmail = selected_email
    if (selected_email.includes("~"))
    {
        var formatEmail = selected_email.substring(0, selected_email.indexOf("~"));
        console.log(formatEmail);
    }
    var info = {
        email: formatEmail
    }
    console.log("trying to reach user : " + formatEmail)
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

    const chat_box_div = document.getElementById('chat_box');
    chat_box_div.textContent='';
    
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
    var info = null;
}

function sendAndUpdateMessages(event)
{   
    console.log("good add message res");
    event.preventDefault();
    //const add_message = await 
    //return addMessage(event).then(messageUser)
    //if (add_message.status == 200)
        //console.log("good add message res");
        //messageUser(event);
    addMessage(event);
    chat.dispatchEvent(refresh);
}

function addOptions(item)
{
    console.log(item)
    let ops = document.getElementById("get_users");
    let option = document.createElement("option");
    option.text = item, ops.add(option);
}

const refresh = new Event('refresh');
const form = document.querySelector('#messageUserForm');
const chat = document.querySelector('#sendMessage');
window.addEventListener('load', loadUsers);
form.addEventListener('submit', messageUser);
chat.addEventListener('submit', addMessage);
//chat.addEventListener('change', messageUser);
//chat.addEventListener('refresh', messageUser);
