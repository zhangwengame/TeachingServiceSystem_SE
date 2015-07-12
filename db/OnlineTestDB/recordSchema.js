var mongoose = require('mongoose');
// Schema 结构
var mongooseSchema = new mongoose.Schema({
    student	: {type : String},
    paperId	: {type : String},
    choices : {type : [String]},
    point 	: {type : Number},
    time 	: {type : String},

    title 	: {type : String},//显示历史成绩的时候，已删除的试卷也可以
});

module.exports=mongooseSchema;