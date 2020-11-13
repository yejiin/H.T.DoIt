var express = require('express');
var router = express.Router();
var db_config = require('../config/database.js');
var conn = db_config.init();

db_config.connect(conn);

// Home
router.get('/', function(req, res){
    res.render('home');
});

// Login
router.get('/login', function(req, res){
    res.render('form/login');
});

// Signup
router.get('/signup', function(req, res){
    res.render('form/signup');
});

module.exports = router;
