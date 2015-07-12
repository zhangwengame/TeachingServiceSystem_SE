var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 
var CourseModel = require('../../db/group1db/CourseModel');
var PersonModel = require('../../db/group1db/PersonModel');

var fs = require('fs');

var tmp = {
    courseid2 : "123456",
    coursename : "软件工程",
    coursetime : "周一第1、2节",
    all : 100,
    remain : 100,
    waiting : 0,
    teacher : "3120",
    examtime : "2015.07.01 8:00-10:00",
    room : "教7-602",
    college : "计算机学院"
};

router.get('/', function(req, res,next) {
    res.render('info/courseinsert',{
        coursenameErr: '',
        courseidErr: '',
        teacherErr: '',
        roomErr: '',
        collegeErr: '',
        examtimeErr: '',
        data : tmp,
        insertresult:'请提交表单'
    });
});

router.post('/',function(req,res,next){
    console.log("post:courseinsert");
    var doc = {
        courseid : "333",
        courseid2: req.body.courseid2,
        coursename  : req.body.coursename,
        courseterm : req.body.courseterm,
        coursetime : req.body.time,
        coursescore : req.body.coursescore,
        year : req.body.year,
        all : req.body.all,
        remain : req.body.remain,
        waiting : req.body.waiting,
        teacher : req.body.teacher,
        examtime : req.body.examtime,
        room : req.body.room,
        campus : req.body.campus,
        college : req.body.college,
    };

    var courseidErr='';
    var coursenameErr='';
    var teacherErr='';
    var roomErr='';
    var collegeErr='';
    var examtimeErr='';
    //coursenameErr
    if(doc.coursename == '')
    coursenameErr = 'Course name empty';

    //teacherErr
    if(doc.teacher == '')
        teacherErr = 'Teacher id empty';
    for(var i = 0, teacher = doc.teacher; i < teacher.length; i++){
        if(teacher.charAt(i)>'9' || teacher.charAt(i)<'0'){
            teacherErr = "Teacher ID illegal";
            break;
        }
    }

    //roomErr
    // if(doc.room == '')
    //     roomErr = 'Room empty';

    //collegeErr
    if(doc.college == '')
        collegeErr = 'College empty';

    //courseidErr
    if(doc.courseid2 == "") {courseidErr = "ID empty";  }
    for(var i = 0, courseid = doc.courseid2; i < courseid.length; i++){
        if(courseid.charAt(i)>'9' || courseid.charAt(i)<'0'){
            courseidErr = "ID illegal";
            break;  
        }
    }

    if(doc.examtime == '') { examtimeErr = 'Exam time empty'; }

    /**信息输入有误 */
    if(courseidErr || examtimeErr || roomErr || teacherErr || coursenameErr || collegeErr )
    {
        return res.render('info/courseinsert',{
            coursenameErr: coursenameErr,courseidErr: courseidErr,teacherErr: teacherErr,roomErr: roomErr,collegeErr: collegeErr,examtimeErr: examtimeErr,
            data : doc,
            insertresult:'表单解析失败！'
        });
    }
    else{
        /**查找教师ID对应用户是否存在 */
        PersonModel.findOne({userid:doc.teacher},function(err,data1){
            if(err) {
                console.log("findOne by teacher err!");
                return res.render('info/courseinsert',{
                    coursenameErr: coursenameErr,courseidErr: courseidErr,teacherErr: teacherErr,roomErr: roomErr,collegeErr: collegeErr,examtimeErr: examtimeErr,
                    data : doc,
                    insertresult:'教师ID查找错误！'
                });
            }
            else if(!data1){
                return res.render('info/courseinsert',{
                    coursenameErr: coursenameErr,courseidErr: courseidErr,teacherErr: teacherErr,roomErr: roomErr,collegeErr: collegeErr,examtimeErr: examtimeErr,
                    data : doc,
                    insertresult:'ID教师不存在！'
                });
            }
            else{
                /**创建对应课程 */
                CourseModel.create(doc,function(err,data2){
                    if(err){
                        console.log("create err : "+err);
                        return res.render('info/courseinsert',{
                            coursenameErr: coursenameErr,courseidErr: courseidErr,teacherErr: teacherErr,roomErr: roomErr,collegeErr: collegeErr,examtimeErr: examtimeErr,
                            data : doc,
                            insertresult:'课程创建失败！'
                        });
                    }
                    else{
                        /**更新data2._id中的courseid为_id */
                        CourseModel.update(
                            {'_id' : data2._id},
                            { $set:{ 'courseid' : data2._id.toString() } },
                            function(err,data3){
                                if(err)
                                    console.log('update courseid err');
                            }
                        );
                        /**更新教师cstlist */
                        PersonModel.update(
                            {userid:doc.teacher},
                            { $push:{ 'cstlist':data2._id.toString() } },
                            function(err,data4){
                                if(err)
                                    console.log('update cstlist err');
                            }
                        );
                        res.render('info/courseinsert',{
                            coursenameErr: coursenameErr,
                            courseidErr: courseidErr,
                            teacherErr: teacherErr,
                            roomErr: roomErr,
                            collegeErr: collegeErr,
                            examtimeErr: examtimeErr,
        
                            data : doc,
                            insertresult:'表单提交成功！'
                        });
                    }
                });
            }
        });
    }
});

module.exports = router;