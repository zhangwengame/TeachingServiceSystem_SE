var mongoose = require('mongoose');
var db       = mongoose.createConnection('mongodb://127.0.0.1:27017/NodeJS');// 链接错误
db.on('error', function(error) {
    console.log(error);
});
