var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var sess_config = require('./sess-config.json');
var db_config = require('./db-config.json');

var session_info = {
    secret: sess_config.secret,
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host: db_config.host,
        port: db_config.port,
        user: db_config.user,
        password: db_config.password,
        database: db_config.database
    })
}

module.exports = {
    init: function(){
        return session(session_info);
    }
    
}
