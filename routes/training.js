var express = require('express');
const session = require('express-session');
var router = express.Router();
var db_config = require('../config/database.js');
var connection = db_config.init();

db_config.connect(connection);

router.get('/', function(request, response){
    response.render('training');
});

module.exports = router;