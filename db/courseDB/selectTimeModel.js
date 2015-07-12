var mongoose = require('mongoose');
// Schema 结构
var courseTimeSchema = new mongoose.Schema({
	stTime:{type:Date},
	edTime:{type:Date},
	select:{type:Boolean},
	unselect:{type:Boolean}
});

var courseTimeModel = mongoose.model('courseTimeSchema',courseTimeSchema,'courseTimes');
module.exports=courseTimeModel;