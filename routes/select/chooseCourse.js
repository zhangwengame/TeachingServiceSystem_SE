var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.post('/choose', function(req, res, next) {
  console.log(req.body);
  var status;
  switch (req.session.user.status.toString()){
    case '学生':status=0;break;
    case '教师':status=1;break;
    case '系统管理员':status=2;break;
  }
  res.render('select/choose', {
    type:status,//manager
    name: req.session.user.username.toString(), 
    image: 'images/avatars/avatar3.jpg',
    total_a:'12',
    a:'2,3,1,2,3,1,0',
    total_b:'24',
    b:'4,6,2,4,6,2,0',
    total_credits:'24',
    credits:'4,6,2,4,6,2,0',
    dev_plan_gen:dev_plan_gen,
    dev_plan_elec:dev_plan_elec,
    dev_plan_elec_class:dev_plan_elec_class,
    dev_plan_req:dev_plan_req,
    my_dev_plan_gen:my_dev_plan_gen,
    is_checked:true //该培养方案是否通过审核
  });
});



//进入选课系统
//var course1=[];//该课程号对应的所有不同老师、时间段的课程
//course1.push({teacher:"xxx",campus:"玉泉",time:"周一12 周三345",room:"曹西502",language:"双语",remain:20,all:40,waiting:30,_id:1});
//course1.push({teacher:"xxx",campus:"玉泉",time:"周一12 周三345",room:"曹西502",language:"双语",remain:20,all:40,waiting:30,_id:2});
//course1.push({teacher:"xxx",campus:"玉泉",time:"周一12 周三345",room:"曹西502",language:"双语",remain:20,all:40,waiting:30,_id:3});
router.get('/choose_course/:courseID', function(req, res, next){
	var course_id = req.params.courseID;
  var courseModel = require('../../db/group1db/CourseModel');
  var userModel = require('../../db/courseDB/userSchema'); 
  var selectedCourse=[];
  var selectedCourseP=[];
  var remainedP=0;

  userModel.find({id:req.session.user.userid.toString()},function(error,uresult){
      if(error) {
          console.log(error);
      } else {
          console.log(uresult);
      }
      remainedP=uresult[0].points;
      for (var i=0;i<uresult[0].selectedCourse.length;i++)
      {
          selectedCourse.push(uresult[0].selectedCourse[i].id);
          selectedCourseP.push(uresult[0].selectedCourse[i].points);
      }
      courseModel.find({ courseid2: req.params.courseID }, function(error,result){
          if(error) {
              console.log(error);
          } else {
              console.log(result);
          }
          var name=result.length==0?'N/A':result[0].coursename;
          var credits=result.length==0?-1:result[0].coursescore;
          var id=result.length==0?'N/A':result[0].id;
          var course=[];
          var choice=-1;
          var oldPoint=0;
          var error="";
          var render=function(){
            res.render('select/choose', {
            course_id:req.params.courseID,
            course_name:name,
            credits:credits,
            course:course,
            my_choice:choice,//记录登陆人员选择的是哪个选项
            remain_points:remainedP,//该学生剩余的点数
            old_point:oldPoint,//该学生原来分配的点数
            name: req.session.user.username.toString(), 
            image: '../images/avatars/avatar3.jpg',
            error:error
            });
          }
          for (var i=0;i<result.length;i++)
          {
              var index=selectedCourse.indexOf(result[i]._id.toString());
              if (index!=-1)
              {
                  choice=i;
                  oldPoint=selectedCourseP[index];
              }
              console.log(result[i]._id);
              course.push({teacher:result[i].teacher,campus:result[i].campus,time:result[i].coursetime,room:result[i].room,remain:result[i].remain,all:result[i].all,waiting:result[i].waiting,_id:result[i]._id}); 
          }
          //console.log(course);
         // console.log(choice);
          render();
      });
  });
});

router.post('/choose_course/:courseID', function(req, res, next){
	console.log(req.body);
  //课程号
  var course_id = req.params.courseID;
  var courseModel = require('../../db/group1db/CourseModel');
  var courseTimeModel = require('../../db/courseDB/selectTimeModel');
  var userModel = require('../../db/courseDB/userSchema'); 
  var selectedCourse=[];
  var selectedCourseP=[];
  var remainedP=0;
  userModel.find({id:req.session.user.userid.toString()},function(error,uresult){
      if(error) {
          console.log(error);
      } else {
          console.log(uresult);
      }
      remainedP=uresult[0].points;
      for (var i=0;i<uresult[0].selectedCourse.length;i++)
      {
          selectedCourse.push(uresult[0].selectedCourse[i].id);
          selectedCourseP.push(uresult[0].selectedCourse[i].points);
      }
      console.log(req.params);
      courseModel.find({ courseid2:req.params.courseID}, function(error,result){
          if(error) {
              console.log(error);
          } else {
              console.log(result);
          }
          var name=result.length==0?'N/A':result[0].coursename;
          var credits=result.length==0?-1:result[0].coursescore;
          var id=result.length==0?'N/A':result[0].id;
          var course=[];
          var choice=-1;
          var oldPoint=0;
          var error="";
          var render=function(){
            res.render('select/choose', {
            course_id:req.params.courseID,
            course_name:name,
            credits:credits,
            course:course,
            my_choice:choice,//记录登陆人员选择的是哪个选项
            remain_points:remainedP,//该学生剩余的点数
            old_point:oldPoint,//该学生原来分配的点数
            name: req.session.user.username.toString(), 
            image: '../images/avatars/avatar3.jpg',
            error:error
            });
          }
          for (var i=0;i<result.length;i++)
          {
              var index=selectedCourse.indexOf(result[i]._id.toString());
              if (index!=-1)
              {
                  choice=i;
                  oldPoint=selectedCourseP[index];
              }
             //console.log(result[i]._id);
              course.push({teacher:result[i].teacher,campus:result[i].campus,time:result[i].coursetime,room:result[i].room,remain:result[i].remain,all:result[i].all,waiting:result[i].waiting,_id:result[i]._id}); 
          }
          courseTimeModel.find({},function(err,cre){
              if (err)
              {
                error=err;
                console.log(err);
              }                  
              else
                  console.log(cre);
              var now=new Date();
              var choose=0;
              var cancel=0;
              for (var i=0;i<cre.length;i++)
              {
                  if (now>=cre[i].stTime&&now<=cre[i].edTime)
                  {
                      choose=choose|(cre[i].select==true);
                      cancel=cancel|(cre[i].unselect==true);
                  }
              }
              if ('choose' in req.body)
              {
                  console.log('choose-sect');
                  var point=parseInt(req.body.points);
                  if (choose==0)
                  {
                      error="不是选课时间";
                  }
                  else
                  if (point>remainedP){
                      error="点数不够";
                  }
                  else
                  {
                      if (choice!=-1)
                      {
                            error="已经选课";
                      }
                      else
                      {
                            var user=uresult[0];
                            courseModel.update({_id:req.body.choose},{$inc:{waiting:1}},function(err,re){if (err) console.log(err);});
                            userModel.update({id:req.session.user.userid.toString()},{$set:{points:user.points-point}},function(err,re){if (err) console.log(err);});
                            userModel.update({id:req.session.user.userid.toString()},{$push:{selectedCourse:{id:req.body.choose,points:point}}},function(err,re){if (err) console.log(err);});
                            for (var i=0;i<course.length;i++)
                                if (course[i]._id==req.body.choose)
                                {
                                    choice=i;
                                    course[i].waiting+=1;
                                }
                                    
                            console.log(choice);
                            oldPoint=point;
                            remainedP=remainedP-point;
                      }
                  }
              }
              if ('cancel_course' in req.body)
              {
                  console.log('cancel-sect');
                  if (cancel==0)
                  {
                      error="不是退课时间";
                  }
                  else
                  if (choice==-1)
                  {
                        error="没有选课";
                  }
                  else
                  {
                        console.log('cancel-update-sect');
                        var cid=result[choice]._id;
                        var cpo=oldPoint;
                        var user=uresult[0];
                        console.log(cid,cpo);
                        courseModel.update({_id:req.body.cancel_course},{$inc:{waiting:-1}},function(err,re){if (err) console.log(err);});
                        userModel.update({id:req.session.user.userid.toString()},{$set:{points:user.points+cpo}},function(err,re){if (err) console.log(err);});
                        userModel.update({id:req.session.user.userid.toString()},{$pull:{selectedCourse:{id:cid,points:cpo}}},function(err,re){if (err) console.log(err);});
                        remainedP=remainedP+oldPoint;
                        course[choice].waiting-=1;
                        choice=-1;
                  }
              }
              render();
          });     
      });
  });
  
}); 
module.exports = router;
/*
{ type: 'choose',
  choice: '55575464feaeea682b000004',
  points: '10' }
*/
/*
 db.users.update({id:"u001"},{$set:{points:56}) 
 db.users.update({id:"u001"},{$push:{selectedCourse:{id:'hehe',points:15}}}) add
 db.users.update({id:"u001"},{$pull:{selectedCourse:{id:'hehe',points:15}}}) delete
 function(err,re){if (err) console.log(err); else console.log(re);}
 */