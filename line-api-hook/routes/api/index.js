var express = require('express');
var router = express.Router();

router = require('./echo')(router);

module.exports = router;
