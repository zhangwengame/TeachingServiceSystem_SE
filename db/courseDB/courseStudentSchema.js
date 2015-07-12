var mongoose = require('mongoose');
// Schema 结构

var courseStudentSchema = new mongoose.Schema({
	id:{type:String},
	confirmedStudent:[{id:{type:String}}]
});

var courseStudentModel = mongoose.model('courseStudentModel',courseStudentSchema,'courseStudents');

module.exports=courseStudentModel;