var express = require('express');
const session = require('express-session');
var router = express.Router();
var db_config = require('../config/database.js');
var connection = db_config.init();
var dateFormat = require('dateformat');

db_config.connect(connection);

router.get('/dd', function(request, response){
    response.render('test');
});

router.post('/s', function(request, response){
    var responseData = {};

    connection.query('SELECT trainingdate, completed from mystate where mytraining_no=43 ORDER BY no DESC limit 7', function(error, results){
        var date = "";
        
        responseData.count = [];
        responseData.trainingdate = [];
      
        if(error) throw error;
        if(results[0]){
         
            responseData.result = "ok";
            results.forEach(function(val){
            date=dateFormat(val.trainingdate,"yy/mm/dd");
            console.log(date);
            responseData.count.push(val.completed);
            responseData.trainingdate.push(date);
        })
      
      }
      else{
        responseData.result = "none";
        responseData.count = "";
      }
      console.log("rd: " + responseData.count[0]);
      response.json(responseData);
    });
});

module.exports = router;