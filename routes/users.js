const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/',async (req, res) => {
    const users = await db.query("SELECT * FROM customer")
    .then(rows => {
        console.log(rows)
        res.json(rows)
    })
    .catch(error =>{
        console.error(error)
    })
});

module.exports = router;