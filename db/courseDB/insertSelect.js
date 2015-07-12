var mongoose = require('mongoose');
var db       = mongoose.connect('mongodb://tssapp:tssapp@10.214.128.197:27123/tss');// 链接错误
var course=require("../group1db/CourseModel");
var courseSelect=require("./courseSelectModel");
/*
var courseSelectSchema = new mongoose.Schema({
	id:{type:String},
	remain:{type:Number},
	all:{type:Number},
	waiting:{type:Number}
});
*/
course.find({},function(err,re){
	if (err)
		console.log(err);
	else
		console.log(re);
	for (var i=0;i<re.length;i++)
	{
		courseSelect.create({id:re[i]._id,remain:50,all:50,waiting:0},function(err,re){
			
			if (err)
				console.log(err);
		});
	}
});
