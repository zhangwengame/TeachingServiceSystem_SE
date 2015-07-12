var mongoose = require('mongoose');
var db       = mongoose.createConnection('mongodb://127.0.0.1:27017/NodeJS');// 链接错误
var mongooseSchema = require('./newSchema');	
var mongooseModel = db.model('mongoose', mongooseSchema);
db.on('error', function(error) {
    console.log(error);
});
db.once('open', function (callback) {
	// 删除记录
	var conditions = {username: 'emtity_demo_username'};
	mongooseModel.remove(conditions, function(error){
	    if(error) {
	        console.log(error);
	    } else {
	        console.log('delete ok!');
	    }
	 
	 
	    //关闭数据库链接
	    db.close();
	});
});
