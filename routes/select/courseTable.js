var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var fs = require('fs');
//state = 1;  // 1:teacher, 0:student
/*my_course.push({
  course_id:"000000",
  ID:"00001",
  name:'计算机组成',
  teacher:'XX1',
  semaster:'春',
  time:'周一 345',
  campus:'玉泉',
  room:'曹西-204'
});*/
//注意所有课程的time日期格式，多个上课时间之间以空格分隔，共有以下情况：
//晚上的课程格式为 Mon night
//其余为 周一 123 或 周一 12 以此类推
//新增course_id为主键, 
//my_course.push({course_id:"000001",ID:"00002",name:'软件工程',teacher:'XX2', semaster:'春夏',time:'周一 12 周二 345',campus:'玉泉',room:'曹西-101'});
/* GET home page. */
router.get('/my_course', function(req, res, next) {
  var my_course=[];
  var status;
  switch (req.session.user.status.toString()){
    case '学生': status = 0; 
                break;
    case '教师': status = 1; 
                break;
    case '系统管理员': status = 2;
                res.redirect("../../login");
                break;
  }
  console.log(my_course.ejs);
  res.render('select/my_course', {
    type: status,//manager
    name: '程序员', 
    image: 'images/avatars/avatar3.jpg',
    total_a:'12',
    a:'2,3,1,2,3,1,0',
    total_b:'24',
    b:'4,6,2,4,6,2,0',
    total_credits:'24',
    credits:'4,6,2,4,6,2,0',
    course_data: my_course,
    start_year:'2013',/*入学年份*/
    this_year:'2015',/*今年的年份*/
    this_semester:'春',
    error:""
  });
});

router.post('/my_course', function(req, res, next) {
    console.log(req.body);
    // var db     = mongoose.createConnection('mongodb://127.0.0.1:27017/NodeJS');// 链接错误
    // var mongooseSchema = require('../db/courseDB/courseSchema');  
    // var mongooseModel = db.model('course', mongooseSchema);
    // mongooseModel.findbyid(req.body, function(error, result){
    //     if(error) {
    //         console.log(error);
    //     } else {
    //         console.log(result);
    //     }
    //关闭数据库链接

});

//课程人员列表
/*var students=[];
students.push({sId:"3130000027",sname:"桓神",classNo:"启真1301",major:"计算机科学与技术"});
students.push({sId:"3130000017",sname:"闻神",classNo:"启真1301",major:"计算机科学与技术"});*/
router.post('/course_list/:courseID', function(req, res, next){
  var my_course=[];
  //课程号
  var course_id = req.params.courseID;
  var courseStudentModel=require('../../db/courseDB/courseStudentSchema');
  var courseModel = require('../../db/group1db/CourseModel');
  var userModel = require('../../db/group1db/PersonModel'); 
  var student=[];
  var courseid,coursename,coursecredits;
  var error="";
  courseModel.find({_id:course_id},function(err,re){
        if (err)
        {
            console.log(err);
            error='错误课程号';
            res.json({error:error});
        }            
        else
            console.log(re);
        if (re.length==0)
        {
            error='错误课程号';
            res.json({error:error});
        }
        else
        {
            courseStudentModel.find({id:course_id},function(err,cre){
                if (err)
                {
                    error="错误课程号";
                    res.json({error:error});
                }                    
                else
                    console.log(cre);
                if (cre.length==0)
                {
                    error="错误课程号";
                    res.json({error:error});
                }
                else
                for (var i=0;i<cre[0].confirmedStudent.length;i++)
                {
                    (function(i){
                        userModel.find({userid:cre[0].confirmedStudent[i].id.toString()},function(err,ure){
                            console.log(cre[0].confirmedStudent[i].id);
                            if (err)
                            {
                                console.log(err);
                                error="错误用户";
                                render();
                            }                                
                            else
                                console.log(ure);                           
                            student.push({sId:ure[0].userid,sname:ure[0].username,classNo:"启真1301",major:ure[0].major});
                            if (student.length==cre[0].confirmedStudent.length)
                            {
                                courseid=re[0].courseid2;
                                courseid=re[0].coursename;
                                coursecredits=re[0].coursescore;
                                var nfs=fs.createWriteStream("List"+course_id+".csv");
                                nfs.write("学号,姓名,班级,专业\n");
                                for (var j=0;j<student.length;j++)
                                    nfs.write(student[j].sId+','+student[j].sname+','+student[j].classNo+','+student[j].major+'\n');
                                nfs.end('\n');
                                console.log("dao le");
                                var rfs=fs.createReadStream("List"+course_id+".csv");
                                res.setHeader('Content-disposition', 'attachment; filename=' + "List"+course_id+".csv");
                                res.setHeader('Content-type', 'text/plain');
                                rfs.pipe(res);
                                //res.json({succ:"succ"});
                                //console.log(student);
                            }

                        });       
                    })(i);    
          
                }
            });
        }
  });
});

router.get('/course_list/:courseID', function(req, res, next){
  var my_course=[];
  //课程号
  var course_id = req.params.courseID;
  var courseStudentModel=require('../../db/courseDB/courseStudentSchema');
  var courseModel = require('../../db/group1db/CourseModel');
  var userModel = require('../../db/group1db/PersonModel'); 
  var student=[];
  var courseid,coursename,coursecredits;
  var error="";
  var render=function(){
                console.log(course_id);
                res.render('select/course_list', {
                    course_id:courseid,//re[0].courseid2,
                    course_name:courseid,//re[0].coursename,
                    credits:coursecredits,//re[0].coursescore ,
                    course_time:"",
                    students:student,
                    name: '程序员', 
                    image: '../images/avatars/avatar3.jpg',
                    error:error,
                    _id:course_id
                }); 
              }
  courseModel.find({_id:course_id},function(err,re){
        if (err)
        {
            console.log(err);
            error='错误课程号';
            render();
            return;
        }            
        else
            console.log(re);
        if (re.length==0)
        {
            error='错误课程号';
            render();
            return;
        }
        else
        {
            courseStudentModel.find({id:course_id},function(err,cre){
                if (err)
                {
                    error="错误课程号";
                    render();
                    return;
                }                    
                else
                    console.log(cre);
                if (cre.length==0)
                {
                    error="错误课程号";
                    render();
                    return;
                }
                else
                for (var i=0;i<cre[0].confirmedStudent.length;i++)
                {
                    (function(i){
                        userModel.find({userid:cre[0].confirmedStudent[i].id.toString()},function(err,ure){
                            console.log(cre[0].confirmedStudent[i].id);
                            if (err)
                            {
                                console.log(err);
                                error="错误用户";
                                render();
                                return;
                            }                                
                            else
                                console.log(ure);                           
                            student.push({sId:ure[0].userid,sname:ure[0].username,classNo:"启真1301",major:ure[0].major});
                            if (student.length==cre[0].confirmedStudent.length)
                            {
                                courseid=re[0].courseid2;
                                courseid=re[0].coursename;
                                coursecredits=re[0].coursescore;
                                render();
                                return;
                                //console.log(student);
                            }

                        });       
                    })(i);                    
                }
                if (cre[0].confirmedStudent.length==0)
                {
                    render();   
                    return;
                }

            });
        }
  });
});

router.get('/my_course/:timeID',function(req, res, next){
    var my_course=[];
    var time=req.params.timeID;
    console.log(time);

    var status;
    switch (req.session.user.status.toString()){
    case '学生': status = 0; 
                break;
    case '教师': status = 1; 
                break;
    case '系统管理员': status = 2;
                break;
    }

    var userModel = require('../../db/courseDB/userSchema'); 
    var courseModel = require('../../db/group1db/CourseModel'); 
    if (status==1){
        courseModel.find({teacher: req.session.user.userid}, function(error, jresult){
            if (error)
                console.log(error);
            else {
                for (var i=0;i<jresult.length;i++)
                    my_course.push({course_id:jresult[i]._id, ID:jresult[i].courseid2, name:jresult[i].coursename, teacher:jresult[i].teacher, semaster:jresult[i].courseterm, time:jresult[i].coursetime, campus:jresult[i].campus, room:jresult[i].room});
                console.log(my_course);
                res.render('select/my_course', {
                type: status,//manager
                name: '程序员', 
                image: 'images/avatars/avatar3.jpg',
                total_a:'12',
                a:'2,3,1,2,3,1,0',
                total_b:'24',
                b:'4,6,2,4,6,2,0',
                total_credits:'24',
                credits:'4,6,2,4,6,2,0',
                course_data: my_course,
                start_year:'2013',
                this_year:'2015',
                this_semester:'春',
                error:""
                });
            }
        });
    }
    else {
        userModel.find({id: req.session.user.userid}, function(error,raw_result){
        if(error) {
            console.log(error);
        } else {
            my_course_list = [];        
            if (raw_result.length!=0)
                my_course_list = raw_result[0].confirmedCourse;
            console.log(my_course_list);
            console.log('1');
        }
        my_course = [];
        for (var i=0;i<my_course_list.length;i++)
        {
            console.log(my_course_list[i].id);
            (function(i){ 
                courseModel.find({_id:my_course_list[i].id},function(error,nresult){
                if(error) {
                    console.log(error);
                } else {
                    console.log(nresult);
                }              
                if (nresult.length!=0)
                    my_course.push({course_id:nresult[0]._id, ID:nresult[0].courseid2, name:nresult[0].coursename, teacher:nresult[0].teacher, semaster:nresult[0].courseterm, time:nresult[0].coursetime, campus:nresult[0].campus, room:nresult[0].room});           
                
                console.log("!");
                if (my_course.length==my_course_list.length){
                console.log(my_course);
                res.render('select/my_course', {
                    type: status,//manager
                    name: '程序员', 
                    image: 'images/avatars/avatar3.jpg',
                    total_a:'12',
                    a:'2,3,1,2,3,1,0',
                    total_b:'24',
                    b:'4,6,2,4,6,2,0',
                    total_credits:'24',
                    credits:'4,6,2,4,6,2,0',
                    course_data: my_course,
                    start_year:'2013',
                    this_year:'2015',
                    this_semester:'春',
                    error:""
                });
                }
            });
            })(i); 
        }
        console.log('2');
        if (my_course_list.length==0)
            res.render('select/my_course', {
                    type: status,//manager
                    name: '程序员', 
                    image: 'images/avatars/avatar3.jpg',
                    total_a:'12',
                    a:'2,3,1,2,3,1,0',
                    total_b:'24',
                    b:'4,6,2,4,6,2,0',
                    total_credits:'24',
                    credits:'4,6,2,4,6,2,0',
                    course_data: my_course,
                    start_year:'2013',
                    this_year:'2015',
                    this_semester:'春',
                    error:""
                });
          // db.close();
        });
    }

});
module.exports = router;