var mongoose = require('mongoose');
var db       = mongoose.createConnection('mongodb://127.0.0.1:27017/NodeJS');// 链接错误
var mongooseSchema = require('./newSchema');	
var mongooseModel = db.model('mongoose', mongooseSchema);
db.on('error', function(error) {
    console.log(error);
});
db.once('open', function (callback) {
	// mongoose find
	var criteria = {title : 'emtity_demo_title'}; // 查询条件
	var fields   = {title : 1, content : 1, time : 1}; // 待返回的字段
	var options  = {};
	mongooseModel.find(criteria, fields, options, function(error, result){
	    if(error) {
	        console.log(error);
	    } else {
	        console.log(result);
	    }
	    //关闭数据库链接
	    db.close();
	});
});
