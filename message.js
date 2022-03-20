
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
    message_avatar.src = "default-avatar.png";
    const message_text = document.createElement("p");
    message_text.textContent = message.message
    const messsage_time = document.createElement("span");
    messsage_time.className = "message_time";
    messsage_time.textContent = message.time;
    console.log(message.time);

    message_div.append(message_avatar);
    message_div.append(message_text);
    message_div.append(messsage_time);


    if (message.sender == "driver") {
        message_div.className = "driver_message";
        message_avatar.className = "avatar_left"
        messsage_time.className = "message_time_left";
    }
    else {
        message_div.className = "admin_message";
        messsage_time.className = "message_time_right";
        message_avatar.className = "avatar_right" 
    }

    chat_box.appendChild(message_div);

}

const conversation1 = new Messaging(1);


const message1 = new Message(1, "hi can i book a spot pls?", "19/03/2022", "12:01", true, 1, 12);
const message2 = new Message(2, "yeah sure", "19/03/2022", "12:21", true, 12, 1);
const message3 = new Message(3, "okay thank you", "19/03/2022", "12:23", true, 1, 12);
const message4 = new Message(4, "can i got a spot in sports park", "19/03/2022", "12:30", true, 1, 12);
const message5 = new Message(5, "Yes, i can do that, what time would u like that for?", "19/03/2022", "12:34", true, 12, 1);
const message6 = new Message(6, "could that be for 7pm pls","19/03/2022", "13:01", true, 1, 12);
const message7 = new Message(7, "Thats all booked :)", "19/03/2022", "14:01", true, 12, 1);


conversation1.sendMessage(message1);
conversation1.sendMessage(message2);
conversation1.sendMessage(message3);
conversation1.sendMessage(message4);
conversation1.sendMessage(message5);
conversation1.sendMessage(message6);
conversation1.sendMessage(message7);


displayMessages(conversation1);
console.log("hello")
