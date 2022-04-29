async function messageHistory(event)
{
    userInfo = {email : sessionStorage.getItem('email')}
    const serializedMessage = JSON.stringify(userInfo);
    // load message history (user -> driver)
    const messageHistory_res = await fetch('/messages/message-history', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: serializedMessage})

    const messageHistory_json = await messageHistory_res.json();
    //messageHistory_str = messageHistory_json.replace(/[^a-zA-Z, ]/g, ""); // strip all specials except comma,spaces
    //const options = carparks_str.split(",");
    //console.log(carparks_str);

    const conversation = new Messaging(1);
    const options = {year: 'numeric', month: 'numeric', day: 'numeric' };
    let messageHistory = JSON.parse(messageHistory_json)

    if(messageHistory_res.status == 200)
    {
        if (messageHistory.alert != "no history")
        {
            console.log(messageHistory)
            for(i = 0; i < messageHistory.length; i++) 
            {
                message = messageHistory[i]
                //console.log(messageHistory_json[i])
                var date = new Date(message.date * 1000);
                if(message.type == "driver"){sender = sessionStorage.getItem("name"); recipient = "Admin"}
                else{sender = "Admin"; recipient = sessionStorage.getItem("name")}
                raw_str = message.id + " " + message.message + " " + String(date.toLocaleDateString(undefined, options)) + " " + String(date.toLocaleTimeString('en-UK')) + " " + true + " " + sender + " " + recipient
                console.log(raw_str)
                msg = new Message(message.id, message.message, date.toLocaleDateString("en-UK", options), date.toLocaleTimeString('en-UK'), true, sender, recipient)
                conversation.sendMessage(message);
            }
        }
        else
        {
            document.getElementById('alert_box').innerHTML = "You must be logged in to view the message page!";
        }
    }
    else{
        para = document.createElement("p");
        para.innerText = "Start a conversation...";
        var element = document.getElementById("alert_box");
        element.appendChild(para);
    }
    displayMessages(conversation);
}

/* messaging class that stores all the messages between one driver and the admin */
class Messaging {
    driverid;
    messages;
    total;
    constructor(driverid) {
        this.driverid = driverid;
        this.messages = [];
        this.total = 0;
    }

    get driverid() {
        return this.driverid
    }

    get messages() {
        return this.messages
    }

    get total() {
        return this.total
    }

    sendMessage(message) {
        this.messages.push(message);
        this.total++;

    }

    openMessages() {
    }
}



/*message class to store a new message */

class Message {
    messageId;
    message;
    date;
    time;
    read;
    sender;
    recipent;


    constructor(messageId, message, date, time, read, sender, recipent) {
        this.messageId = messageId;
        this.message = message;
        this.date = date;
        this.time = time;
        this.read = read;
        this.sender = sender;
        this.recipent = recipent;
    }

    get messageId() {
        return this.messageId;
    }

    set messageId(value) {
        this.messageId = value;
    }
    get message() {
        return this.message;
    }

    set message(value) {
        this.message = value;
    }
    get date() {
        return this.date;
    }

    set date(value) {
        this.date = value;
    }
    get time() {
        return this.time;
    }

    set time(value) {
        this.time = value;
    }
    get read() {
        return this.read;
    }

    set read(value) {
        this.read = value;
    }
    get sender() {
        return this.sender;
    }

    set sender(value) {
        this.sender = value;
    }
    get recipent() {
        return this.recipent;
    }

    set recipent(value) {
        this.recipent = value;
    }
}



//displays all the messages between the admin 
const displayMessages = (conversation) => {

    // conversation.forEach(element => {
    //     console.log(element);
    //     createMessage(element);
    // });


    for(index = 0; index < conversation.messages.length; index++) {
        console.log(conversation.messages[index].message)
        createMessage(conversation.messages[index]);
    }

}


/*create a message box */



const createMessage = (message) => {

    const chat_box = document.getElementById("chat_box");
    const message_div = document.createElement("div")
    
    const message_avatar = document.createElement("img");
    message_avatar.src = "Messaging/default-avatar.png";
    const message_text = document.createElement("p");
    message_text.textContent = message.message
    const messsage_time = document.createElement("span");
    messsage_time.className = "message_time";
    messsage_time.textContent = message.time;

    message_div.append(message_avatar);
    message_div.append(message_text);
    message_div.append(messsage_time);


    if (message.sender != "admin") {
        message_div.className = "message-box darker";
        message_avatar.className = "right"
        messsage_time.className = "time-left";
    }
    else {
        message_div.className = "message-box";
        messsage_time.className = "time-right";
    }

    chat_box.appendChild(message_div);
}

window.addEventListener('load', messageHistory);