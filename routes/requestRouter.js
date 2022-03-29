const express = require('express');
const path = require('path');
const router = express.Router();


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','Request','makeRequest.html'));
});

router.post('/', (req,res) => {
    console.log(req.body.location);
    console.log(req.body.date);
    console.log(req.body.arrivial);
    console.log(req.body.departure);

    res.status(200).send();
})

module.exports = router;
