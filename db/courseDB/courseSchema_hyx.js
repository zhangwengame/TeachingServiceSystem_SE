var mongoose = require('mongoose');

var courseSchema_hyx = new mongoose.Schema({
	id:{type:String},
	name:{type:String},
	time:{type:String},//推荐完成时间
	credit:{type:Number},
	type:{type:Number},//1-公共课；2-专业必修；3-专业选修
	subtype:{type:String},
	major:{type:String}//就是开课学院
});
/*
改：time->rectime
增：
classid []
examtime

再加一个class表（classSchema）
classid id_1,id_2,...
teacher
room []
time []
campus
*/

/*courseSchema_hyx.statics.insert = function(req, callback) {
	var doc = {
		id : req.id, 
		name : req.name, 
		time:req.time,
		credit:req.credit,
		type:req.type,
		subtype:req.subtype,
		major:req.major
	};
    return this.model('courseModel_hyx').create(doc, function(error){
	    if(error) {
	        console.log(error);
	    } else {
	        console.log('save ok');
	    }
	});
}*/

var courseModel_hyx = mongoose.model('courseModel_hyx',courseSchema_hyx,'coursesPlan');
module.exports=courseModel_hyx;
