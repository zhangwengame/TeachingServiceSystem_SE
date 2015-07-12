var mongoose = require('mongoose');
// Schema 结构
var courseSchema = new mongoose.Schema({
	name:{type:String},
	id:{type:String},
	teacher:{type:String},
	complete:{type:Boolean},
	semaster:{type:String},
	time:{type:String},
	campus:{type:String},
	room:{type:String}
});
courseSchema.statics.findbyid = function(id, callback) {
	name_list = id.course_name.split(',');
	teacher_list = id.course_teacher.split(',');
	cond = [];
	all = [];
	if (id.course_number!="")
		all.push({id:id.course_number});
	nameall = [];
	for (var i=3; i>=0; i--)
	{
		nameall.push({name: new RegExp(name_list[i], 'i')});
	}
	console.log(nameall);
	if (id.course_name!=""){
		if (id.name=="and")
			all.push({"$and":nameall});
		else 
			all.push({"$or":nameall});
	}

	teacherall = [];
	for (var i=3; i>=0; i--)
	{
		teacherall.push({teacher: new RegExp(teacher_list[i], 'i')});
	}
	if (id.course_teacher!=""){
		if (id.teacher=="and")
			all.push({"$and":teacherall});
		else
			all.push({"$or":teacherall});
	}

	cond.push({"$and":all});

    return this.model('course').find(cond[0], callback);
    //else
    	//return this.model('course').find({id:id.course_number, {'$or':[{name: new RegExp(list[0], 'i'), name: new RegExp(list[1], 'i')}]}}, callback);
}

courseSchema.statics.findByName = function (name, cb) {
  return this.model('course').find({ name: new RegExp(name, 'i') }, cb);
}

var courseModel = mongoose.model('courseModel',courseSchema,'courses');
module.exports=courseModel;
