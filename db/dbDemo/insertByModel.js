var mongoose = require('mongoose');
var db       = mongoose.createConnection('mongodb://127.0.0.1:27017/NodeJS');// 链接错误
var mongooseSchema = require('./newSchema');	
var mongooseModel = db.model('mongoose', mongooseSchema);
db.on('error', function(error) {
    console.log(error);
});
db.once('open', function (callback) {
	// 增加记录 基于model操作
	var doc = {username : 'model_demo_username', title : 'model_demo_title', content : 'model_demo_content'};
	mongooseModel.create(doc, function(error){
	    if(error) {
	        console.log(error);
	    } else {
	        console.log('save ok');
	    }
	    // 关闭数据库链接
	    db.close();
	});
});
