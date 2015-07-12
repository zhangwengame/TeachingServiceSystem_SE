//培养方案表
var mongoose = require('mongoose');

var tutorialSchema = new mongoose.Schema({
    courseid:String,//课程号
    type:Number,  //模块类型,1,2,3,4,5
    year:String, //修读年份
    major:String //专业
});
//根据专业查询
tutorialSchema.statics.findbyid = function(major,type, callback) {
    return this.model('tutorialDB').find({major: major}, callback).where("type").equals(type);
}

var tutorialModel = mongoose.model('tutorials',tutorialSchema);
module.exports=tutorialModel;