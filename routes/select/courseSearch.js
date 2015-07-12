var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var course = [];
/*course.push({name:'程序员的自我修养',complete:true, teacher:'XX1', semaster:'春',time:'周一 123',campus:'玉泉',room:'曹西-204',id:'000001'});
course.push({name:'论程序员的把妹精神',complete:false, teacher:'XX2', semaster:'春夏',time:'周一 123 周二 345',campus:'玉泉',room:'曹西-101',id:'000002'});
course.push({name:'程序员的自我修养',complete:true, teacher:'XX1', semaster:'春',time:'周一 123',campus:'玉泉',room:'曹西-204',id:'000001'});
course.push({name:'论程序员的把妹精神',complete:false, teacher:'XX2', semaster:'春夏',time:'周一 123 周二 345',campus:'玉泉',room:'曹西-101',id:'000002'});
course.push({name:'程序员的自我修养',complete:true, teacher:'XX1', semaster:'春',time:'周一 123',campus:'玉泉',room:'曹西-204',id:'000001'});
course.push({name:'论程序员的把妹精神',complete:false, teacher:'XX2', semaster:'春夏',time:'周一 123 周二 345',campus:'玉泉',room:'曹西-101',id:'000002'});
course.push({name:'程序员的自我修养',complete:true, teacher:'XX1', semaster:'春',time:'周一 123',campus:'玉泉',room:'曹西-204',id:'000001'});
course.push({name:'论程序员的把妹精神',complete:false, teacher:'XX2', semaster:'春夏',time:'周一 123 周二 345',campus:'玉泉',room:'曹西-101',id:'000002'});
course.push({name:'程序员的自我修养',complete:true, teacher:'XX1', semaster:'春',time:'周一 123',campus:'玉泉',room:'曹西-204',id:'000001'});
course.push({name:'论程序员的把妹精神',complete:false, teacher:'XX2', semaster:'春夏',time:'周一 123 周二 345',campus:'玉泉',room:'曹西-101',id:'000002'});*/

var Time_Dictionary = {"11":"周一 12","12":"周一 34","13":"周一 67","14":"周一 910","15":"周一 1112",
                       "21":"周二 12","22":"周二 34","23":"周二 67","24":"周二 910","25":"周二 1112",
                       "31":"周三 12","32":"周三 34","33":"周三 67","34":"周三 910","35":"周三 1112",
                       "41":"周四 12","42":"周四 34","43":"周四 67","44":"周四 910","45":"周四 1112",
                       "51":"周五 12","52":"周五 34","53":"周五 67","54":"周五 910","55":"周五 1112",
                       "61":"周六 12","62":"周六 34","63":"周六 67","64":"周六 910","65":"周六 1112",
                       "71":"周日 12","72":"周日 34","73":"周日 67","74":"周日 910","75":"周日 1112"};

router.get('/course', function(req, res, next) {
  var status;
  switch (req.session.user.status.toString()){
    case '学生': status = 0; 
                break;
    case '教师': status = 1; 
                break;
    case '系统管理员': status = 2;
                break;
  }
  res.render('select/course', {
    type: status,//manager
  	name: '程序员', 
  	image: 'images/avatars/avatar3.jpg',
  	total_a:'12',
  	a:'2,3,1,2,3,1,0',
  	total_b:'24',
  	b:'4,6,2,4,6,2,0',
  	total_credits:'24',
  	credits:'4,6,2,4,6,2,0',
  	course_data: course
  });
});
router.post('/course_search', function(req, res, next) {
  console.log(req.body); 
  id = req.body;
  name_list = id.course_name.split(',');
  teacher_list = id.course_teacher.split(',');
  cond = [];
  all = [];

  // Add time condition
  if (id["time"]==undefined){
    console.log("No time require!");
  }
  else {
    timeall = [];
    if (id.time[0].length==1){
        timeall.push({coursetime: new RegExp(Time_Dictionary[id.time], 'i')});
    }
    else
        for (i=id.time.length-1; i>=0; i--){
        timeall.push({coursetime: new RegExp(Time_Dictionary[id.time[i]], 'i')});
    }
    if (id.time_check=="and")
        all.push({"$and":timeall});
    else
        all.push({"$or":timeall});
  }

  // Add id condition
  if (id.course_number!="")
    all.push({courseid2:id.course_number});

  // Add name condition
  nameall = [];
  for (var i=3; i>=0; i--)
  {
    nameall.push({coursename: new RegExp(name_list[i], 'i')});
  }
  if (id.course_name!=""){
    if (id.name=="and")
      all.push({"$and":nameall});
    else 
      all.push({"$or":nameall});
  }

  // Add teacher condition
  teacherall = [];
  for (var i=3; i>=0; i--)
  {
    teacherall.push({teacher: new RegExp(teacher_list[i], 'i')});
  }
  if (id.course_teacher!=""){
    if (id.teacher=="and")
      all.push({"$and":teacherall});
    else
      all.push({"$or":teacherall});
  }
  cond.push({"$and":all});

  var Model = require('../../db/group1db/CourseModel');  
  Model.find(cond[0], function(error,raw_result){
      if(error) {
          console.log(error);
      } else {
          console.log(raw_result);
      }
      result = [];

      for (var i=0; i<raw_result.length; i++)
        result.push({id:raw_result[i].courseid2, name:raw_result[i].coursename, 
                     semester:raw_result[i].courseterm, time:raw_result[i].coursetime, 
                     teacher:raw_result[i].teacher, room:raw_result[i].room, 
                     campus:raw_result[i].campus});
      console.log(result);
      //关闭数据库链接
      var status;
      switch (req.session.user.status.toString()){
        case '学生': status = 0; 
                break;
        case '教师': status = 1; 
                break;
        case '系统管理员': status = 2;
                break;
      }
      res.render('select/course', {
        type:status,//manager
        name: '程序员', 
        image: 'images/avatars/avatar3.jpg',
        total_a:'12',
        a:'2,3,1,2,3,1,0',
        total_b:'24',
        b:'4,6,2,4,6,2,0',
        total_credits:'24',
        credits:'4,6,2,4,6,2,0',
        course_data: result
      });
  });  
});
module.exports = router;