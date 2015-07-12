var mongoose = require('mongoose');

// Schema 结构
var CourseSchema = new mongoose.Schema({

    courseid    : {type : String},
	courseid2	: {type : String},	//课程ID 不能直接用courseid或id，mongodb自动对应_id，不能由我们设置

    coursename  : {type : String},	//课程名称
    courseterm  : {type : String},  //课程学期
    coursetime	: {type : String},	//上课时间
    coursescore	: {type : Number},	//课程学分
    year        : {type : String},  //课程年份
    all         : {type : Number},  //课程容量
    remain      : {type : Number},  //课程余量
    waiting     : {type : Number},  //待选人数
    status      : {type : String, default : 'on'}, //课程状态，默认'on'，老师提交成绩后，为‘off’
    teacher     : {type : String},	//授课老师
    examtime	: {type : String},	//考试时间
    room        : {type : String},	//上课教室
    campus      : {type : String},  //上课校区
    college     : {type : String},	//开课学院
    time     : {type : Date, default: Date.now}	//创建时间
    
});
var CollectionName = 'courses';

CourseSchema.statics.findbyid = function(courseid, callback) {
    return this.model('CourseModel').find({courseid: courseid}, callback);
}
CourseSchema.statics.findbyname = function(coursename, callback) {
    return this.model('CourseModel').find({coursename: coursename}, callback);
}


CourseSchema.statics.findbyterm = function (term , callback) {
    return this.model ('CourseModel').find({courseterm : term},callback);
}

CourseSchema.statics.deletebyid = function(courseid2, callback) {
    return this.model('CourseModel').remove({courseid2: courseid2}, callback);

}

CourseSchema.statics.findbyteacher = function(teacher,callback){
    return this.model('CourseModel').find({teacher: teacher}, callback);
}

CourseSchema.statics.findbyclassroom = function(campus,room,callback){
    return this.model('CourseModel').find({campus: campus , room: room}, callback);
}

CourseSchema.statics.modifybyid = function(req, callback) {
    return this.model('CourseModel').update(
        {courseid: req.courseid},
        {
            $set:{
                coursename : req.coursename,
                courseterm : req.courseterm,
                coursetime :req.coursetime,
                coursescore : req.coursescore,
                year : req.year,
                all : req.all,
                remain : req.remain,
                status : req.status,
                waiting : req.waiting,
                teacher : req.teacher,
                examtime : req.examtime,
                room : req.room,
                campus : req.campus,
                college : req.college
            }//,
        },
        callback);
}

//给出cstlist = ['1234','3120'],返回所有id符合cstlist(中一条)的course
CourseSchema.statics.findbylist = function(cstlist, callback) {

    return this.model('CourseModel').find({_id: {$in:cstlist}}, callback);

}

CourseSchema.statics.statusoff = function(courseid, callback) {
    return this.model('CourseModel').update(
        {courseid: courseid},
        {
            $set:{ status : 'off' }
        },
        callback);

}


var CourseModel = mongoose.model('CourseModel',CourseSchema,CollectionName);
var courseStudentModel = require('../../db/courseDB/courseStudentSchema');
var courseSelectModel = require('../../db/courseDB/courseSelectModel');
CourseSchema.post('save', function(doc) {
   console.log("hook course for courseStudent");
   console.log(doc);
   courseStudentModel.create({
       id : doc._id,
       confirmedStudent:[]
   }); 
});
CourseSchema.post('save', function(doc) {
   console.log("hook course for courseSelect");
   console.log(doc);
   courseSelectModel.create({
       id : doc._id,
       remain: 50,
       all: 50,
       waiting: 0
   }); 
});

module.exports=CourseModel;
