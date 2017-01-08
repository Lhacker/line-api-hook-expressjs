var express = require('express');
var router = express.Router();

router = require('./echo')(router);
router = require('./barnaviy')(router);

module.exports = router;
