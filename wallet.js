const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.use(express.urlencoded({extended: true}))

app.post('/add-credit', (req, res) => 
{
    const dat = req.body.credit
    res.send("You added " + JSON.stringify(dat) + "  credit(s) to your wallet!")
    
})
//default end-point, where the webpage loads to.
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/wallet.html');
});




app.listen(3000, () => {
    console.log(`Express app listening on port ${port}`);
}) 