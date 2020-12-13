var express = require('express');
const session = require('express-session');
var router = express.Router();
var db_config = require('../config/database.js');
var connection = db_config.init();
var dateFormat = require('dateformat');

db_config.connect(connection);

router.get('/', function(request, response){
    var userId = request.session.userid;
    console.log(userId);
    var model = {};
    connection.query('SELECT t.title AS title, t.img AS img, t.no AS tno, m.no AS mtno FROM training t, mytraining m WHERE t.no = m.training_no and m.user_id=?',[userId],function(error, results){
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
    var trainingNo = request.query.no;
    var mytrainingNo = request.params.no;
    console.log(trainingNo);

    connection.query('SELECT title, vid FROM training WHERE no=?', [trainingNo], function(error, results){
        if(error){
            console.log(error + "training select 에러");
            return;
        }else{
            var title = results[0].title;
            var vId = results[0].vid;
            response.render('room/detail', {title: title, vid:vId, mytrainingNo:mytrainingNo, trainingNo:trainingNo});
        }

    });
  
});

router.get('/:no/detail/complete', function(request, response){
    var mytrainingNo = request.params.no;
    var trainingNo = request.query.no;
    var userId = request.session.userid;
    connection.query('INSERT INTO mystate (mytraining_no, trainingdate, completed) VALUES (?, sysdate(), 1)', [mytrainingNo], function(error, results){
            if(error) throw error;
            
        response.redirect('/room/' + mytrainingNo + '/detail?no='+trainingNo);
    });
    
});

router.post('/test/:no', function(request, response){
    var no = request.params.no;
    var responseData = {};

    connection.query('SELECT trainingdate, COUNT(*) AS count FROM mystate WHERE mytraining_no=? GROUP BY trainingdate ORDER BY no ASC limit 7', [no],function(error, results){
        var date = "";

        responseData.count = [];
        responseData.trainingdate = [];
        
        if(error) throw error;
        if(results[0]){
            responseData.result = "ok";
            results.forEach(function(val){
         
                date=dateFormat(val.trainingdate,"yy/mm/dd");
              
                
                console.log(date);
                responseData.count.push(val.count);
            
                responseData.trainingdate.push(date);
        })
    }else{
        responseData.result = "none";
        responseData.count = "";
      }

      response.json(responseData);
    });
    
});

module.exports = router;