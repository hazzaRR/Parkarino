const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded( {extended: true}));



//default end-point, where the webpage loads to.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public','index.html'));
});

const loginRouter = require('./routes/loginRouter');
const requestRouter = require('./routes/requestRouter');
const ticketRouter = require('./routes/ticketRouter');
const messageRouter = require('./routes/messagesRouter');
const paymentRouter = require('./routes/paymentRouter');

app.use('/login', loginRouter);
app.use('/request', requestRouter);
app.use('/ticket', ticketRouter);
app.use('/messages', messageRouter);
app.use('/payment', paymentRouter);


app.listen(port, () => {
    console.log(`Express app listening on port ${port}`);
})