var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//course.push({teacher:"xxx",campus:"玉泉",time:"周一12 周三345",room:"曹西502",language:"双语",remain:20,all:40,waiting:30,courseid:1});
//course.push({teacher:"xxx",campus:"玉泉",time:"周一12 周三345",room:"曹西502",language:"双语",remain:20,all:40,waiting:30,courseid:2});
//course.push({teacher:"xxx",campus:"玉泉",time:"周一12 周三345",room:"曹西502",language:"双语",remain:20,all:40,waiting:30,courseid:3});
stu_data=[];
stu_data.push({stu_name:"Henry",major:"计算机科学与技术"});

router.get('/manual_add', function(req, res, next) {
  var course=[];
  var status;
  switch (req.session.user.status.toString()){
    case '学生':status = 0;
                res.redirect("../../login");
                break;
    case '教师':status = 1;
                res.redirect("../../login");
                break;
    case '系统管理员':status = 2;break;
  }
  console.log(course.ejs);
  res.render('select/manual', {
    type:status,//manager
    course:course,
    name: req.session.user.username.toString(), 
    image: 'images/avatars/avatar3.jpg',
   // choose_time:choose_time
  });
});
router.post('/manual_add', function(req, res, next) {
  var courseData=[];
  var courseModel = require('../../db/group1db/CourseModel');
  var userModel = require('../../db/courseDB/userSchema'); 
  var personModel = require('../../db/group1db/PersonModel'); 
  var courseStudentModel = require('../../db/courseDB/courseStudentSchema');
  var studentGradeSchema = require('../../db/group6db/gradesDB');
  console.log(req.body);
  var status;
  switch (req.session.user.status.toString()){
    case '学生':status=0;break;
    case '教师':status=1;break;
    case '系统管理员':status=2;break;
  }
  if (req.body.type=='search'){
      courseModel.find({courseid2:req.body.course_id.toString()},function(err,result){
          if (err)
          {
              console.log(err);
              res.json({status:"err",error:err});
              return;
          }            
          else
            console.log(result);
          if (result.length==0)
          {
              res.json({status:"err",error:"课程不存在！"});
              return;
          }
          for (var i=0;i<result.length;i++){              
              courseData.push({teacher:result[i].teacher,campus:result[i].campus,time:result[i].coursetime,room:result[i].room,remain:result[i].remain,all:result[i].all,waiting:result[i].waiting,courseid:result[i]._id});
          }
          res.json({status:"succ",courseData:courseData});
          return;
      });
  }else if (req.body.type=='add'){
      courseModel.find({_id:req.body.course_id.toString()},function(err,result){
          if (err)
          {
            console.log(err);
            res.json({status:"err",error:err});
            return;
          }
          else
            console.log(result);
          if (result.length==0)
          {
              res.json({status:"err",error:"课程不存在！"});
              return;
          }
          userModel.find({id:req.body.stu_id.toString()},function(err,uresult){
              if (err)
              {
                console.log(err);
                res.json({status:"err",error:err});
                return;
              }
              else
                console.log(uresult);
              if (uresult.length==0)
              {
                  res.json({status:"err",error:"用户不存在！"});
                  return;
              }
              var index=-1;
              for (var i=0;i<uresult[0].confirmedCourse.length;i++){
                  if (uresult[0].confirmedCourse[i].id==req.body.course_id.toString())
                    index=i;
              }
              if (index!=-1)
              {
                  res.json({status:"err",error:"已选该课！"});
                  return;
              }
              studentGradeSchema.insertrecord(req.body.course_id.toString(),req.body.stu_id.toString(), function(err,re){if (err) console.log(err); console.log(re);});
              personModel.addcstlist(req.body.stu_id.toString(),req.body.course_id.toString(),function(err,re){if (err) console.log(err)});
              courseModel.update({_id:req.body.course_id.toString()},{$inc:{remain:-1}},function(err,re){if (err) console.log(err);});
              userModel.update({id:req.body.stu_id.toString()},{$push:{confirmedCourse:{id:req.body.course_id.toString(),points:0}}},function(err,re){if (err) console.log(err);});
              courseStudentModel.update({id: req.body.course_id.toString()},{$push:{confirmedStudent:{id: req.body.stu_id.toString()}}},function(err,re){if (err) console.log(err);});
              res.json({status:"succ"});
              return;
          });        
      });
  } if (req.body.type=='delete'){
      courseModel.find({_id:req.body.course_id.toString()},function(err,result){
          if (err)
          {
            console.log(err);
            res.json({status:"err",error:err});
            return;
          }
          else
            console.log(result);
          if (result.length==0)
          {
              res.json({status:"err",error:"课程不存在！"});
              return;
          }
          userModel.find({id:req.body.stu_id.toString()},function(err,uresult){
              if (err)
              {
                console.log(err);
                res.json({status:"err",error:err});
                return;
              }
              else
                console.log(result);
              if (result.length==0)
              {
                  res.json({status:"err",error:"用户不存在！"});
                  return;
              }
              var index=-1;
              for (var i=0;i<uresult[0].confirmedCourse.length;i++){
                  if (uresult[0].confirmedCourse[i].id==req.body.course_id.toString())
                    index=i;
              }
              if (index==-1)
              {
                  res.json({status:"err",error:"没有选择该课！"});
                  return;
              }
              personModel.deletecstlist(req.body.stu_id.toString(),req.body.course_id.toString(),function(err,re){if (err) console.log(err)});
              courseModel.update({_id:req.body.course_id.toString()},{$inc:{remain:1}},function(err,re){if (err) console.log(err);});
              userModel.update({id:req.body.stu_id.toString()},{$pull:{confirmedCourse:{id:req.body.course_id.toString(),points:0}}},function(err,re){if (err) console.log(err);});
              courseStudentModel.update({id: req.body.course_id.toString()},{$pull:{confirmedStudent:{id: req.body.stu_id.toString()}}},function(err,re){if (err) console.log(err);});
              res.json({status:"succ"});
              return;
          });        
      });
    }
});

module.exports = router;