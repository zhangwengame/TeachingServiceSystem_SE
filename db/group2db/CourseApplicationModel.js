var mongoose = require('mongoose');
// Schema �ṹ
var CourseApplicationSchema = new mongoose.Schema({
    courseid2	: {type : String},
    coursetime	: {type : String},
    status      : {type : String, default : 'pending'}, //初始为 pending  管理员审批后为accepted/dened
    room        : {type : String},
    campus      : {type : String},
    time     : {type : Date, default: Date.now}

});
var CollectionName = 'CourseApplications';
CourseApplicationSchema.statics.findbystatus= function(statuss, callback) {
    return  this.model('CourseApplicationModel').find({status: statuss}, callback);
    //this.model('CourseModel').find({status: "accept"}, callback2);
   // this.model('CourseModel').find({status: "deny"}, callback3);

}
CourseApplicationSchema.statics.findby_id = function(id, callback) {
    //if (_id=='') return this.model('CourseApplicationModel').find({}, callback);
    console.log('start to find!!!');
    console.log(id);
    return this.model('CourseApplicationModel').find({_id: id}, callback);
}

CourseApplicationSchema.statics.findbyid = function(courseid2, callback) {
    console.log('?');
    if (courseid2=='') return this.model('CourseApplicationModel').find({}, callback);
    return this.model('CourseApplicationModel').find({courseid2: courseid2}, callback);
}
CourseApplicationSchema.statics.findbyname = function(coursename, callback) {
    return this.model('CourseApplicationModel').find({coursename: coursename}, callback);
}

CourseApplicationSchema.statics.findbyterm = function (term , callback) {
    return this.model ('CourseApplicationModel').find({courseterm : term},callback);
}

CourseApplicationSchema.statics.deletebyid = function(courseid2, callback) {
    return this.model('CourseApplicationModel').remove({courseid2: courseid2}, callback);
}
CourseApplicationSchema.statics.findby_id = function(_id, callback) {
    return this.model('CourseApplicationModel').remove({_id: _id}, callback);
}


CourseApplicationSchema.statics.findbyteacher = function(teacher,callback){
    return this.model('CourseApplicationModel').find({teacher: teacher}, callback);
}

CourseApplicationSchema.statics.findbyclassroom = function(campus,room,callback){
    return this.model('CourseApplicationModel').find({campus: campus , room: room}, callback);
}

CourseApplicationSchema.statics.modifybyid = function(req, callback) {
    return this.model('CourseApplicationModel').update(
        {courseid2: req.courseid2},
        {
            $set:{
                coursename : req.coursename,
                courseterm : req.courseterm,
                coursetime :req.coursetime,
                coursescore : req.coursescore,
                status : req.status,
                teacher : req.teacher,
                examtime : req.examtime,
                room : req.room,
                campus : req.campus,
                college : req.college
            }//,
        },
        callback);
}


CourseApplicationSchema.statics.findbylist = function(cstlist, callback) {
    return this.model('CourseModel').find({courseid2: {$in:cstlist}}, callback);
}

CourseApplicationSchema.statics.statusoff = function(courseid2, callback) {
    return this.model('CourseModel').update(
        {courseid2: courseid2},
        {
            $set:{ status : 'off' }
        },
        callback);
}

var CourseApplicationModel = mongoose.model('CourseApplicationModel',CourseApplicationSchema,CollectionName);
module.exports=CourseApplicationModel;