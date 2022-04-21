const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded( {extended: true}));



//default end-point, where the webpage loads to.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public','Account','index.html'));
});

const loginRouter = require('./routes/loginRouter');
const regRouter = require('./routes/regRouter');
const requestRouter = require('./routes/requestRouter');
const ticketRouter = require('./routes/ticketRouter');
const managerRouter = require('./routes/managerRouter');
const messageRouter = require('./routes/messagesRouter');
const paymentRouter = require('./routes/paymentRouter');
const adminRouter = require('./routes/adminRouter');
const addCreditRouter = require('./routes/addCreditRouter');
const accountManRouter = require('./routes/accountManRouter');
const viewCarparkRouter = require('./routes/viewCarparkRouter');

app.use('/login', loginRouter);
app.use('/register', regRouter);
app.use('/request', requestRouter);
app.use('/ticket', ticketRouter);
app.use('/accountMan', accountManRouter);
app.use('/ManagerPark', managerRouter);
app.use('/messages', messageRouter);
app.use('/payment', paymentRouter);
app.use('/admin', adminRouter);
app.use('/add-credit', addCreditRouter);
app.use('/view-carpark', viewCarparkRouter);

app.listen(port, () => {
    console.log(`Express app listening on port ${port}`);
})