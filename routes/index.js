const express = require("express");
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  console.log("OK")
  res.status(200).json('OK');
});

module.exports = router;
