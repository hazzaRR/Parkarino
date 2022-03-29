const express = require('express');
const path = require('path');
const router = express.Router();


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','Messaging','message.html'));
});


module.exports = router;