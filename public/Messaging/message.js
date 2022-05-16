// retrieve message history on load of page
async function messageHistory(event)
{   
    event.preventDefault();
    var userInfo = {email : sessionStorage.getItem('email')}
    if (sessionStorage.getItem("userType").toLowerCase() == "admin")
    {
        const selection = document.querySelector('#messageUserForm');
        let selected_email = selection.elements.namedItem('select_user').value
        var formatEmail = selected_email
        if (selected_email.includes("~"))
        {
            var formatEmail = selected_email.substring(0, selected_email.indexOf("~"));
            //console.log(formatEmail);
        }
        var userInfo = {email : formatEmail}
    }
    const serializedMessage = JSON.stringify(userInfo);
    // load message history (user -> driver)
    const messageHistory_res = await fetch('/messages/message-history', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: serializedMessage});
    const messageHistory_json = await messageHistory_res.json();
    
    const conversation = new Messaging(1);
    const options = {year: 'numeric', month: 'numeric', day: 'numeric' };
    //console.log(sessionStorage.getItem('name'))
    let messageHistory = messageHistory_json;
    console.log(messageHistory);

    // clearing chat div in order to reload new messageHistory
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
                console.log(message.type)

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
    console.log("displaying messages");
    //const message1 = new Message(7, "Thats all booked :)", "19/03/2022", "14:01", true, "user", 1);
    //conversation.sendMessage(message1);
    displayMessages(conversation);
    updateScroll();
}
// send a new message/add it to db
async function addMessage(event)
{
    event.preventDefault();
    const msgData = document.querySelector('#send_message_box');
    let currentDate = new Date()  
    var messageInfo = {sender : sessionStorage.getItem("email"), recipient : "admin", id :"", type : sessionStorage.getItem("userType").toLowerCase(), date : String(Math.round(currentDate.getTime() / 1000)), read : false, message : msgData.elements.namedItem('newMessage').value}
    // if message is from admin, flip the sender and recipient
    if (sessionStorage.getItem("userType").toLowerCase() == "admin")
    {
        const selection = document.querySelector('#messageUserForm');
        let selected_email = selection.elements.namedItem('select_user').value
        var formatEmail = selected_email
        if (selected_email.includes("~"))
        {
            var formatEmail = selected_email.substring(0, selected_email.indexOf("~"));
            //console.log(formatEmail);
        }
        var messageInfo = {sender : sessionStorage.getItem("email"), recipient : formatEmail, id :"", type : sessionStorage.getItem("userType").toLowerCase(), date : String(Math.round(currentDate.getTime() / 1000)), read : false, message : msgData.elements.namedItem('newMessage').value}
    }
    console.log(messageInfo);
    const serializedMessage = JSON.stringify(messageInfo);
    // save to db ~ send message
    if(messageInfo.message.length > 0){
        const add_message_res = await fetch('/messages/add-message', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: serializedMessage})
        const add_message_json = await  add_message_res.json();
        if(add_message_res.status == 200)
        {
            console.log("returning success");
            //window.location.href = "/messages";
            messageHistory(event)
            //return add_message_res.status
            updateScroll();
        }
        else
        {
            
            console.log("Add-message was unsuccessful!")
            //window.location.href = "/messages";
            messageHistory(event)
            var element = document.getElementById("prompt_box_text");
            element.innerText = "Please try again...";
            element.setAttribute("class", "prompt-active");
        }
    }
    else
    {
        console.log("message string empty")
         //window.location.href = "/messages";
        messageHistory(event)
        var element = document.getElementById("prompt_box_text");
        element.innerText = "Type something first...";
        element.setAttribute("class", "prompt-active");
    }
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


    for(let index = 0; index < conversation.messages.length; index++) {
        console.log(conversation.messages[index].message)
        createMessage(conversation.messages[index]);
    }

}


/*create a message box */
const createMessage = (message) => {

    const chat_box = document.getElementById("chat_box");
    const message_div = document.createElement("div");
    
    const message_avatar = document.createElement("img");
    if (message.sender == "admin")
    {
        message_avatar.src ='Messaging/admin.png';
    }
    else
    {
        message_avatar.src = 'Messaging/default-avatar.png';
    }
    const message_text = document.createElement("p");
    message_text.textContent = message.message
    const messsage_time = document.createElement("span");
    messsage_time.className = "message_time";
    let readText="delivered"
    if (message.read){let readText = "read";}
    messsage_time.textContent = message.sender + " ~ " + message.time;// +" ~ " + readText;

    message_div.append(message_avatar);
    message_div.append(message_text);
    message_div.append(messsage_time);

    if (sessionStorage.getItem('userType').toLowerCase() == 'admin')
    {
        if (message.sender != "admin") {
            message_div.className = "message-box";
            messsage_time.className = "time-left";
        }
        else {
            message_div.className = "message-box darker";
            messsage_time.className = "time-right";
            message_avatar.className = "right"
        }
    }
    else
    {
        if (message.sender == "admin") {
            message_div.className = "message-box darker";
            messsage_time.className = "time-left";
        }
        else {
            message_div.className = "message-box";
            messsage_time.className = "time-right";
            message_avatar.className = "right"
        }
    }
    chat_box.appendChild(message_div);
}
function updateScroll(){
    var element = document.getElementById("chat_box");
    element.scrollTop = element.scrollHeight;
}

//export for use in inbox module
const _Messaging = Messaging;
export { _Messaging as Messaging };
const _Message = Message;
export { _Message as Message };
const _displayMessages = displayMessages;
export { _displayMessages as displayMessages };
const _createMessage = createMessage;
export { _createMessage as createMessage };
const _messageHistory = messageHistory;
export { _messageHistory as messageHistory };
const _addMessage = addMessage;
export { _addMessage as addMessage };

const form = document.querySelector('#send_message_box');
form.addEventListener('submit', addMessage);
window.addEventListener('load', messageHistory);
