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
        connection.query('SELECT COUNT(*) AS cnt FROM training', function (error, result){
            if(error){
                console.log(error + "training mysql count 실패");
                return;
            }else{
                var totalRow = result[0].cnt;
                var lastPage = totalRow/rowPerPage;
                if(totalRow % rowPerPage != 0 ){
                    lastPage++;
                }
            }
            connection.query('SELECT train_no, train_title, train_url, train_cate FROM training ORDER By train_no DESC LIMIT ?,?', [beginRow, rowPerPage], function (error, result){
                if(error){
                    console.log(error + "training mysql 조회 실패");
                    return;
                }else{
                    model.trainlist = result;
                    console.log(result);
                    model.currentPage = currentPage;
                    model.lastPage = lastPage;
                    console.log("last " +lastPage + " current :" + currentPage);
                    response.render('training/list',{model:model});
                }
            });
            
        });
    } else {
        connection.query('SELECT COUNT(*) AS cnt FROM training WHERE train_cate=?', [category], function (error, result){
            if(error){
                console.log(error + "training mysql count 실패");
                return;
            }else{
                var totalRow = result[0].cnt;
                var lastPage = totalRow/rowPerPage;
                if(totalRow % rowPerPage != 0 ){
                    lastPage++;
                }
            }
            connection.query('SELECT train_no, train_title, train_url, train_cate FROM training WHERE train_cate=? ORDER By train_no DESC LIMIT ?,?', [category, beginRow, rowPerPage], function (error, result){
                if(error){
                    console.log(error + "training mysql 조회 실패");
                    return;
                }else{
                    model.trainlist = result;
                    console.log(result);
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
    var model = {};

    connection.query('SELECT train_title, train_des, train_vid FROM training WHERE train_no=?',[trainNo],function(error, result){
        if(error){
            console.log(error + "training mysql 실패");
            return;
        }else{
            model.traindetail=result;
            console.log(model);
        response.render('training/detail', {model:model});
    }
    });
    
    
});

module.exports = router;