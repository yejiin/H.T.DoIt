const e = require('express');
var express = require('express');
const session = require('express-session');
var router = express.Router();
var db_config = require('../config/database.js');
var connection = db_config.init();

db_config.connect(connection);


router.get('', function(request, response){
    var rowPerPage = 10;
    var currentPage = 1;

    if(request.query.page){
        currentPage = parseInt(request.query.page);
    }
    var beginRow = (currentPage - 1)*rowPerPage;
    var model = {};
    connection.query('SELECT COUNT(*) AS cnt FROM review', function(error, results){
        if(error){
            console.log(error + "mysql count 실패");
            return;
        }else{
            var totalRow = results[0].cnt;
            var lastPage = totalRow/rowPerPage;
            if(totalRow % rowPerPage != 0 ){
                lastPage++;
            }
        }
        connection.query("SELECT r.no no, r.user_id user_id, r.title title, r.content content, date_format(r.regdate,'%Y-%m-%d') as regdate, t.title ttitle from review r, training t WHERE r.training_no=t.no ORDER By r.no DESC LIMIT ?,?", [beginRow, rowPerPage], function(error, results){
        if(error) throw error;
        model.currentPage = currentPage;
        model.lastPage = lastPage;
        response.render('review/list', {results: results, model:model});
    });
});
});

router.get('/write', function(request, response){
    var userId = request.session.userid;

    connection.query("SELECT t.no no, t.title title FROM training t, mytraining m WHERE t.no = m.training_no AND m.user_id=?",[userId], function(error, results){
        if(error) throw error;
        response.render('review/write', {results: results});
    })
    
    
});

router.post('/write', function(request, response){
    var userId = request.session.userid;
    var title = request.body.title;
    var content = request.body.content;
    var trainingNo = request.body.training_no;
    var password = request.body.password;

    connection.query('INSERT INTO review(user_id, title, content, regdate, training_no, password) VALUES (?,?,?,sysdate(),?,?)', [userId, title, content,trainingNo,password], function(error, results){
        if(error) throw error;
        response.redirect('/review');
    });
});

router.get('/detail/:no', function(request, response){
    var no = request.params.no;

    connection.query("SELECT r.no no, r.user_id user_id, r.title title, r.content content, date_format(r.regdate,'%Y-%m-%d') as regdate, t.title ttitle from review r, training t WHERE r.training_no=t.no AND r.no=?", [no], function(error, results){
        if(error) throw error;
        console.log(results);
        response.render('review/detail', {results, results});
    });
});

router.get('/update/:no', function(request, response){
    var no = request.params.no;

    connection.query("SELECT r.no no, r.user_id user_id, r.title title, r.content content, date_format(r.regdate,'%Y-%m-%d') as regdate, r.password password, t.title ttitle from review r, training t WHERE r.training_no=t.no AND r.no=?", [no], function(error, results){
        if(error) throw error;
        console.log(results);
        response.render('review/update', {results, results});
    });
});

router.post('/update/:no', function(request, response){
    var no = request.params.no;
    var title = request.body.title;
    var content = request.body.content;

    connection.query("UPDATE review SET title=?, content=? WHERE no=?", [title, content, no], function(error, results){
        if(error) throw error;
        response.redirect('/review');
    });
});

router.post('/delete/:no', function(request, response){
    var no = request.params.no;

    connection.query('DELETE FROM review WHERE no=?', [no], function(error, results){
        if(error) throw error;
        response.redirect('/review');
    })
})

router.post('/password', function(request, response){
    var responseData = {};
    var pw = request.body.password;
    var result = "";
    connection.query("SELECT password from review WHERE password=?", [pw], function(error, results){
        if(error) throw error;
        if(results[0] == undefined){
            result = "no";
            responseData.result = "no";
        }else{
            result = "yes";
            responseData.result = "yes";
        }
        response.json(responseData);
    });
});


module.exports = router;
