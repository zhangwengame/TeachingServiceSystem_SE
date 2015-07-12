var mongoose = require('mongoose');
// Schema 结构
var mongooseSchema = new mongoose.Schema({
    title 	: 	String,
    problems: 	[],
    deliver	: 	[String],//用来记录发送给哪些班级

    usedClass : 	String,//用来记录试卷对应的课程ID
    totalPoint : 	{type: Number, default: 0},//试卷总分

    timeLimit : 	String
});

mongooseSchema.methods.findbyId = function(ID, callback) {
    return this.model('mongoose').find({_id: ID}, callback);
}

module.exports=mongooseSchema;