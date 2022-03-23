const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));


//default end-point, where the webpage loads to.
app.get('/', (req, res) => {
    res.sendFile("index.html");
});




app.listen(3000, () => {
    console.log(`Express app listening on port ${port}`);
})