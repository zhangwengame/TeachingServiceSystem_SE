var mongoose = require('mongoose');

var courseSelectSchema = new mongoose.Schema({
	id:{type:String},
	remain:{type:Number},
	all:{type:Number},
	waiting:{type:Number}
});

var courseSelectModel = mongoose.model('courseSelectModel',courseSelectSchema,'coursesSelects');


module.exports=courseSelectModel;
