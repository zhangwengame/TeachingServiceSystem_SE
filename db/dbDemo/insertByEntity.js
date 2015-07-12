var mongoose = require('mongoose');
var db       = mongoose.createConnection('mongodb://127.0.0.1:27017/NodeJS');// 链接错误
var mongooseSchema = require('./newSchema');	
var mongooseModel = db.model('mongoose', mongooseSchema);
db.on('error', function(error) {
    console.log(error);
});
db.once('open', function (callback) {
	// 增加记录 基于 entity 操作
	var doc = {username : 'entity_demo_username', title : 'entity_demo_title', content : 'entity_demo_content'};
 	var mongooseEntity = new mongooseModel(doc);
	mongooseEntity.save(function(error) {
	    if(error) {
	        console.log(error);
	    } else {
	        console.log('saved OK!');
	    }
	    db.close();
	});
});

