var express = require('express');
var router = express.Router();
var db_config = require('../config/database.js');
var connection = db_config.init();

db_config.connect(connection);

router.get('/', function(reqest, response){
    response.render('/');
});

router.post('/', function(request, response){
    var id = request.body.id;
    var password = request.body.password;
    if(id && password){
        connection.query('SELECT * FROM user WHERE id = ? AND password = ?', [id, password], function(error, results, fields){
            if (error) throw error;
            if (results.length > 0){
                var username = results[0].username;
                console.log(username);
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('./');
                response.end();
            } else {
                response.render('/');
            }
        });
    } else {
        response.send('Please enter Id and Password!');
        response.end();
    }

});


module.exports = router;