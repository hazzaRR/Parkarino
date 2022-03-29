const express = require('express');
const path = require('path');
const router = express.Router();


//payment routes
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','payment.html'));
});

module.exports = router;
