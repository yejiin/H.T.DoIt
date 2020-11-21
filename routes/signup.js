var express = require('express');
var router = express.Router();
var db_config = require('../config/database.js');
var connection = db_config.init();

db_config.connect(connection);

router.get('/', function (request, response) {
    response.render('signup');
});

router.post('/', function (request, response) {
    var id = request.body.id;
    var password = request.body.password;
    var password2 = request.body.password2;
    var username = request.body.username;
    console.log(id, password, password2, username);
    if (id && password && username) {
        connection.query('SELECT * FROM user WHERE id = ? AND password = ?', [id, password], function (error, results, fields) {
            if (error) throw error;
            if (results.length <= 0) {
                connection.query('INSERT INTO user (id, password, username) VALUES(?,?,?)', [id, password, username],
                    function (error, data) {
                        if (error)
                            console.log(errer);
                        else
                            console.log(data);
                    });
                 if(password == password2)
                 {
                    response.render('form/login',{ signup: "success" });
                 } else{
                    response.render('form/signup',{signup: "passerror"})
                 }                 
            } else {
                response.render('form/signup', { signup: "existuser" });
            }
        });
    } else {
        response.render('form/signup', { signup: "enteruser" });
    }

});


module.exports = router;