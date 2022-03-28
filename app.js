const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

app.use(express.static('public'));



//default end-point, where the webpage loads to.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/public/index.html'));
});

//tickets routes
app.get('/viewTicket', (req, res) => {
    res.sendFile(path.join(__dirname+'/public/ticket.html'));
});

//messages routes
app.get('/messages', (req, res) => {
    res.sendFile(path.join(__dirname+'/public/Messaging/message.html'));
});

//request routes
app.get('/newRequest', (req, res) => {
    res.sendFile(path.join(__dirname+'/public/Request/makeRequest.html'));
});

//user routes
app.get('/signUp', (req, res) => {
    res.sendFile(path.join(__dirname+'/public/login.html'));
});

//payment routes
app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname+'/public/payment.html'));
});




app.listen(port, () => {
    console.log(`Express app listening on port ${port}`);
})