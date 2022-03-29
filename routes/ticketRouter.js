const express = require('express');
const path = require('path');
const router = express.Router();


//tickets routes
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','ticket.html'));
});

module.exports = router;