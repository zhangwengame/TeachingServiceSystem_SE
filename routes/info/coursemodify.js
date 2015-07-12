var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 
var CourseModel = require('../../db/group1db/CourseModel');
var PersonModel = require('../../db/group1db/PersonModel');
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
    res.render('info/coursemodify',{
        courseidErr:'',
        coursenameErr: '',
        courseid2Err: '',
        teacherErr: '',
        roomErr: '',
        collegeErr: '',
        examtimeErr: '',
        data : tmp,
        modifyresult:'请提交表单'
    });
});

router.post('/',function(req,res,next){
    var doc = {
        courseid: req.body.courseid,
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
    var courseid2Err='';
    var coursenameErr='';
    var teacherErr='';
    var roomErr='';
    var collegeErr='';
    var examtimeErr='';

    //courseidErr
    if(doc.courseid == '')
    courseidErr = 'Course unique id empty';

    //coursenameErr
    if(doc.coursename == '')
    coursenameErr = 'Course name empty';

    //teacherErr
    if(doc.teacher == '')
        teacherErr = 'Teacher name empty';

    //roomErr
    // if(doc.room == '')
    //     roomErr = 'Room empty';

    //collegeErr
    if(doc.college == '')
        collegeErr = 'College empty';

    //courseid2Err
    if(doc.courseid2 == "") {courseid2Err = "Course ID empty";  }
    for(var i = 0, courseid = doc.courseid2; i < courseid.length; i++){
        if(courseid.charAt(i)>'9' || courseid.charAt(i)<'0'){
            courseid2Err = "ID illegal";
            break;
        }
    }

    if(doc.examtime == '') { examtimeErr = 'Exam time empty'; }

    /**信息填写有误 */
    if(courseidErr | courseid2Err || examtimeErr || roomErr || teacherErr || coursenameErr || collegeErr )
    {
        return res.render('info/coursemodify',{
            courseidErr: courseidErr,
            coursenameErr: coursenameErr,
            courseid2Err: courseid2Err,
            teacherErr: teacherErr,
            roomErr: roomErr,
            collegeErr: collegeErr,
            examtimeErr: examtimeErr,
            data : doc,
            modifyresult:'信息填写有误'
        });
    }
    else{
         CourseModel.findOne({courseid : doc.courseid},function(err,data1){
            if(err){
                console.log("find course by courseid err");
                return res.render('info/coursemodify',{
                    courseidErr: courseidErr,
                    coursenameErr: coursenameErr,
                    courseid2Err: courseid2Err,
                    teacherErr: teacherErr,
                    roomErr: roomErr,
                    collegeErr: collegeErr,
                    examtimeErr: examtimeErr,
                    data : doc,
                    modifyresult:'查找对应唯一id课程失败！'
                });
            }
            /**根据courseid找不到对应课程 */
            else if(!data1){
                console.log("cannot find course by courseid");
                return res.render('info/coursemodify',{
                    courseidErr: 'Course not found!',
                    coursenameErr: coursenameErr,
                    courseid2Err: courseid2Err,
                    teacherErr: teacherErr,
                    roomErr: roomErr,
                    collegeErr: collegeErr,
                    examtimeErr: examtimeErr,
                    data : doc,
                    modifyresult:'按照唯一id查找课程不存在！'
                });
            }
            else{
                /**根据教师id查找用户 */
                PersonModel.findOne({userid:doc.teacher},function(err,data2){
                    if(err){
                        console.log("find teacher by doc.teacher err");
                        return res.render('info/coursemodify',{
                            courseidErr: courseidErr,
                            coursenameErr: coursenameErr,
                            courseid2Err: courseid2Err,
                            teacherErr: teacherErr,
                            roomErr: roomErr,
                            collegeErr: collegeErr,
                            examtimeErr: examtimeErr,
                            data : doc,
                            modifyresult:'根据教师ID查找教师失败！'
                        });
                    }
                    /**所给教师ID对应用户不存在 */
                    else if(!data2){
                        console.log("not find teacher by doc.teacher");
                        return res.render('info/coursemodify',{
                            courseidErr: courseidErr,
                            coursenameErr: coursenameErr,
                            courseid2Err: courseid2Err,
                            teacherErr: teacherErr,
                            roomErr: roomErr,
                            collegeErr: collegeErr,
                            examtimeErr: examtimeErr,
                            data : doc,
                            modifyresult:'教师ID对应教师不存在！'
                        });
                    }
                    /**teacher发生变化 */
                    else if(data1.teacher != doc.teacher){
                        /**修改课程信息 */
                        CourseModel.modifybyid(doc,function(err,data){
                            if(err){
                                console.log("modify err : "+err);
                                return res.render('info/coursemodify',{
                                    courseidErr: courseidErr,
                                    coursenameErr: coursenameErr,
                                    courseid2Err: courseid2Err,
                                    teacherErr: teacherErr,
                                    roomErr: roomErr,
                                    collegeErr: collegeErr,
                                    examtimeErr: examtimeErr,
                                    data : doc,
                                    modifyresult:'修改课程信息失败！'
                                });
                            }
                            else{
                                /**跟新所给教师的cstlist */
                                PersonModel.update(
                                    {userid:doc.teacher},
                                    { $push:{ 'cstlist':data1._id.toString() } },
                                    function(err,data3){
                                        if(err)
                                            console.log('doc.teacher update err');
                                    }
                                );
                                /**跟新原教师的cstlist */
                                PersonModel.update(
                                    {userid:data1.teacher},
                                    { $pop:{ 'cstlist':data1._id.toString() } },
                                    function(err,data3){
                                        if(err)
                                            console.log('data1.teacher update err');
                                    }
                                );
                                return res.render('info/coursemodify',{
                                    courseidErr: courseidErr,
                                    coursenameErr: coursenameErr,
                                    courseid2Err: courseid2Err,
                                    teacherErr: teacherErr,
                                    roomErr: roomErr,
                                    collegeErr: collegeErr,
                                    examtimeErr: examtimeErr,
                                    data : doc,
                                    modifyresult:'修改课程信息成功！'
                                });
                            }
                        });
                    }
                    else{
                        /**修改课程信息 */
                        CourseModel.modifybyid(doc,function(err,data){
                            if(err){
                                console.log("modify err : "+err);
                                return res.render('info/coursemodify',{
                                    courseidErr: courseidErr,
                                    coursenameErr: coursenameErr,
                                    courseid2Err: courseid2Err,
                                    teacherErr: teacherErr,
                                    roomErr: roomErr,
                                    collegeErr: collegeErr,
                                    examtimeErr: examtimeErr,
                                    data : doc,
                                    modifyresult:'修改课程信息失败！'
                                });
                            }
                            else{
                                return res.render('info/coursemodify',{
                                    courseidErr: courseidErr,
                                    coursenameErr: coursenameErr,
                                    courseid2Err: courseid2Err,
                                    teacherErr: teacherErr,
                                    roomErr: roomErr,
                                    collegeErr: collegeErr,
                                    examtimeErr: examtimeErr,
                                    data : doc,
                                    modifyresult:'修改课程信息成功！'
                                });
                            }
                        });
                    }
                });
            }
        });      
    }
});

module.exports = router;