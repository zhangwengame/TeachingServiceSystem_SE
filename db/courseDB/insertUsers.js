var mongoose = require('mongoose');
var db       = mongoose.connect('mongodb://tssapp:tssapp@10.214.128.197:27123/tss');// 链接错误
var person=require("../group1db/PersonModel");
var user=require("./userSchema");
/*
db.on('error', function(error) {
    console.log(error);
});
*/
/*
var userSchema = new mongoose.Schema({
	name:{type:String},
	id:{type:String},
	points:{type:Number},
	selectedCourse:[{id:{type:String},points:{type:Number}}],
	confirmedCourse:[{id:{type:String}}],
	major:String
});

*/
person.find({},function(err,re){
	if (err)
		console.log(err);
	else
		console.log(re);
	var user=require("./userSchema");
	for (var i=0;i<re.length;i++)
	{
		user.create({name:re[i].username,id:re[i].userid,points:100,selectedCourse:[],confirmedCourse:[],major:re[i].major},function(err,re){
			
			if (err)
				console.log(err);
		});
	}
});
/*
console.log(db);
db.once('open', function (callback) {
	// mongoose find

	console.log('hir');
	user.save({test:'yo'},function(err,re){
		console.log(re);
	});
	person.find({userid:"3120100001"},function(err,re){
		if (err)
			console.log(err);
		else
			console.log(re);
		db.close();
	});
});
*/