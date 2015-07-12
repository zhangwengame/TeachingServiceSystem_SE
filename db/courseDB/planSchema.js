var mongoose = require('mongoose');
// Schema 结构
var planSchema = new mongoose.Schema({
	id:String,
	p1:[String],
	isC1:[Boolean],
	p2:[String],
	isC2:[Boolean],
	p3:[String],
	isC3:[Boolean]
});

var planModel = mongoose.model('planModel',planSchema,'plan');
module.exports=planModel;