var express = require('express');
var router = express.Router();
var db_config = require('../config/database.js');
var connection = db_config.init();

db_config.connect(connection);

router.get('/', function (request, response) {
    response.render('login');
});

router.post('/', function (request, response) {
    var id = request.body.id;
    var password = request.body.password;
    if (id && password) {
        connection.query('SELECT * FROM user WHERE id = ? AND password = ?', [id, password], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                var username = results[0].username;
                request.session.loggedin = true;
                request.session.username = username;
                response.render('home', { username: request.session.username });
            } else {
                response.render('form/login', { login: "error" });
            }
        });
    } else {
        response.send('Please enter Id and Password!');
        response.redirect('/home');
    }

});



module.exports = router;