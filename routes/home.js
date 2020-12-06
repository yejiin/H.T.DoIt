var express = require('express');
const session = require('express-session');
var router = express.Router();
var db_config = require('../config/database.js');
var conn = db_config.init();

db_config.connect(conn);

// Home
router.get('/', function(request, response){
    response.render('home');
});




// Logout
router.get('/logout', function (request, response) {
    request.session.loggedin = false;
    response.redirect('/');
})


module.exports = router;
