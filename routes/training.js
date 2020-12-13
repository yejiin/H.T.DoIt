var express = require('express');
const session = require('express-session');
var router = express.Router();
var db_config = require('../config/database.js');
var connection = db_config.init();

db_config.connect(connection);


router.get('/', function(request, response){
    response.redirect('/training/all/' + 1);
});


router.get("/:category/:currentPage", function(request, response){
    var rowPerPage = 5;
    var currentPage = 1;
    var category = request.params.category;

    if(request.params.currentPage){
        currentPage = parseInt(request.params.currentPage);
    }
    var beginRow = (currentPage - 1)*rowPerPage;
    var model = {};
    
    if(category == 'all'){
        connection.query('SELECT COUNT(*) AS cnt FROM training', function (error, results){
            if(error){
                console.log(error + "training mysql count 실패");
                return;
            }else{
                var totalRow = results[0].cnt;
                var lastPage = totalRow/rowPerPage;
                if(totalRow % rowPerPage != 0 ){
                    lastPage++;
                }
            }
            connection.query('SELECT no, title, img, cate FROM training ORDER By no DESC LIMIT ?,?', [beginRow, rowPerPage], function (error, results){
                if(error){
                    console.log(error + "training mysql 조회 실패");
                    return;
                }else{
                    model.trainlist = results;
                    model.currentPage = currentPage;
                    model.lastPage = lastPage;
                    console.log("last " +lastPage + " current :" + currentPage);
                    response.render('training/list',{model:model});
                }
            });
            
        });
    } else {
        connection.query('SELECT COUNT(*) AS cnt FROM training WHERE cate=?', [category], function (error, results){
            if(error){
                console.log(error + "training mysql cate count 실패");
                return;
            }else{
                var totalRow = results[0].cnt;
                var lastPage = totalRow/rowPerPage;
                if(totalRow % rowPerPage != 0 ){
                    lastPage++;
                }
            }
            connection.query('SELECT no, title, img, cate FROM training WHERE cate=? ORDER By no DESC LIMIT ?,?', [category, beginRow, rowPerPage], function (error, results){
                if(error){
                    console.log(error + "training mysql 조회 실패");
                    return;
                }else{
                    model.trainlist = results;
                    model.currentPage = currentPage;
                    model.lastPage = lastPage;
                    console.log("last " +lastPage + " current :" + currentPage);
                    response.render('training/list',{model:model});
                }
            });

        });
    }
});


router.get("/:category/:currentPage/:trainNo/detail", function(request, response){
    var trainNo = request.params.trainNo;
    var userId = request.session.userid;
  
    var model = {};

    connection.query('SELECT title, des, vid FROM training WHERE no=?',[trainNo],function(error, results){
        if(error){
            console.log(error + "training mysql 실패");
            return;
        }else{
            model.traindetail=results;
       
        }
        connection.query('SELECT startdate FROM mytraining WHERE user_id=? AND training_no=?', [userId, trainNo],function(error, results){
            if(error){
                console.log(error + "트레이닝 시작 여부 에러");
                return;
            }else{
                if(results[0] === undefined){
                    model.start="no";
                }else{
                    model.start="yes";
                    var time = new Date(results[0].startdate).toISOString().replace(/T/, ' ').split(" ");
                    model.startdate = time[0];
                }
                response.render('training/detail', {model:model});
            }
        });
    }); 
});

router.get("/:category/:currentPage/:trainNo/start", function(request, response){
    var category = request.params.category;
    var currentPage = request.params.currentPage;
    var trainNo = request.params.trainNo;
    var userId = request.session.userid;

    connection.query('SELECT * FROM mytraining WHERE user_id=?, training_no=?',[userId,trainNo],function(error, results){
        if(results == undefined){
            connection.query('INSERT INTO mytraining (user_id, training_no) VALUES (?,?)',[userId,trainNo],function(error, results){
                if(error){
                    console.log(error + "mytraining insert 실패");
                    return;
                }
                console.log("insert!!");
                response.redirect('/training/'+category+'/'+currentPage);
            });
        }else{
            response.redirect('/training/'+category+'/'+currentPage);
            
        }
        
    });
});

module.exports = router;