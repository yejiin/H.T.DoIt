var express = require('express');
const session = require('express-session');
var router = express.Router();
var db_config = require('../config/database.js');
var connection = db_config.init();

db_config.connect(connection);

var query = "SELECT t.title, t.des FROM training t, mytraining m WHERE t.no = m.training_no";

router.get('/', function(request, response){
    var userId = request.session.userid;
    console.log(userId);
    var model = {};
    connection.query('SELECT t.title AS title, t.img AS img, t.no AS no FROM training t, mytraining m WHERE t.no = m.training_no and m.user_id=?',[userId],function(error, results){
        if(error){
            console.log(error + "mytraining select 에러");
            return;
        }else{
            model.trainlist=results;
            console.log(results);
            response.render('room/list', {model:model});
        }

    });
});

router.get('/:no/detail', function(request, response){
    var userId = request.session.userid;
    var trainingNo = request.params.no;
    console.log(trainingNo);
    connection.query('SELECT title, vid FROM training WHERE no=?', [trainingNo], function(error, results){
        if(error){
            console.log(error + "training select 에러");
            return;
        }else{
            var title = results[0].title;
            var vId = results[0].vid;
            response.render('room/detail', {title: title, vid:vId});
        }

    });
  
});

module.exports = router;