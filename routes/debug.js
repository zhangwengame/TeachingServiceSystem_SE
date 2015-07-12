var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var mongoose = require('mongoose');
	// Schema 结构
	var mongooseSchema = new mongoose.Schema({
	    username : {type : String, default : '匿名用户'},
	    title    : {type : String},
	    content  : {type : String},
	    time     : {type : Date, default: Date.now},
	    age      : {type : Number}
	});
	var mongoose = require('mongoose');
	// Schema 结构
	var mongooseSchema = new mongoose.Schema({
	    username : {type : String, default : '匿名用户'},
	    title    : {type : String},
	    content  : {type : String},
	    time     : {type : Date, default: Date.now},
	    age      : {type : Number}
	});
	var mongooseModel = global.db.model('mongoose', mongooseSchema);
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
	});
});



module.exports = router;


