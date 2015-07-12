var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
//选课时间确定
//choose_time=[];
//choose_time.push({start_time:"2015/01/01",end_time:"2015/02/02",isChoose:true,isCancell:true,ID:"1"});
//choose_time.push({start_time:"2015/03/01",end_time:"2015/04/02",isChoose:true,isCancell:false,ID:"2"});
//ID为主键
Date.prototype.format = function(format)
{
 var o = {
 "M+" : this.getMonth()+1, //month
 "d+" : this.getDate(),    //day
 "h+" : this.getHours(),   //hour
 "m+" : this.getMinutes(), //minute
 "s+" : this.getSeconds(), //second
 "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
 "S" : this.getMilliseconds() //millisecond
 }
 if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
 (this.getFullYear()+"").substr(4 - RegExp.$1.length));
 for(var k in o)if(new RegExp("("+ k +")").test(format))
 format = format.replace(RegExp.$1,
 RegExp.$1.length==1 ? o[k] :
 ("00"+ o[k]).substr((""+ o[k]).length));
 return format;
}

router.get('/time', function(req, res, next) {
  var choose_time=[];
  var courseTimeModel = require('../../db/courseDB/selectTimeModel');
  var userModel = require('../../db/courseDB/userSchema');
  var courseModel = require('../../db/group1db/CourseModel');
  var error="";
  var status;
  switch (req.session.user.status.toString()){
    case '学生':status = 0;
                res.redirect("../../login");
                break;
    case '教师':status = 1;
                res.redirect("../../login");
                break;
    case '系统管理员':status = 2; break;
  }
  courseTimeModel.find({},function(err,cre){
      if (err)
          console.log(err);
      else
          console.log(cre);
      //console.log("jinlaile2");
      for (var i=0;i<cre.length;i++)
      {
          choose_time.push({start_time:cre[i].stTime.format('yyyy-MM-dd'),
                            end_time:cre[i].edTime.format('yyyy-MM-dd'),
                            isChoose:cre[i].select,
                            isCancell:cre[i].unselect,
                            ID:cre[i]._id});
          }
          console.log(choose_time);
          res.render('select/time', {
              type:status,//manager
              name: req.session.user.username.toString(), 
              image: 'images/avatars/avatar3.jpg',
              choose_time:choose_time,
              error:error
          });
  });
});
router.post('/time', function(req, res, next) {
  console.log(req.body);
  var choose_time=[];
  var courseTimeModel = require('../../db/courseDB/selectTimeModel');
  var userModel = require('../../db/courseDB/userSchema');
  var courseModel = require('../../db/group1db/CourseModel');
  var stDate=new Date();
  var edDate=new Date();
  var isChoose=false;
  var isCancell=false;
  var error="";
  var render=function(){
      res.render('select/time', {
          type:2,//manager
          name: '程序员', 
          image: 'images/avatars/avatar3.jpg',
          choose_time:choose_time,
          error:error
      });
  }
  if (req.body.type=='add')
  {   
      stDate=new Date(req.body.start_year,req.body.start_month.substring(0,req.body.start_month.length-1),req.body.start_day);
      edDate=new Date(req.body.end_year,req.body.end_month.substring(0,req.body.end_month.length-1),req.body.end_day);
      stDate.setMonth(stDate.getMonth()-1);
      edDate.setMonth(edDate.getMonth()-1);
      isChoose='true'==req.body.isChoose?true:false;
      isCancell='true'==req.body.isCancell?true:false;
      if (stDate>edDate)
      {
          error='时序错误';
          res.json({status:"err",error:error});
          return;
      }
      courseTimeModel.find({},function(err,cre){
          if (err)
          {
              console.log(err);
              error='搜索错误';
              res.json({status:"err",error:error});
              return;
          }                  
          else
              console.log(cre);
          var flag=1;
          for (var i=0;i<cre.length;i++)
          {
              if ((stDate>=cre[i].stTime && stDate<=cre[i].edTime )||(edDate>=cre[i].stTime && edDate<=cre[i].edTime) )
                  flag=0;
          }
          if (flag==0)
          {
              error="时段交叉";
              res.json({status:"err",error:error});
              return;
          }
          courseTimeModel.create({stTime:stDate,edTime:edDate,select:isChoose,unselect:isCancell},function(err,re){
              if (err)
              {
                  console.log(err);
                  error="搜索错误";
                  res.json({status:"err",error:error});
                  return;
              }              
              else
                  console.log(re);
              res.json({status:"succ"});
          });         

      });     
  }
  else if (req.body.type=='delete')
  {
      console.log("jindelete");
      courseTimeModel.remove({_id:req.body.id},function(err,re){
          if (err)
          {
              error="搜索错误";
              console.log(err);
              res.json({status:"err",error:error});
              return;
          }
          else
            console.log(re);
          courseTimeModel.find({},function(err,cre){
              if (err)
              {
                  console.log(err);
                  error='搜索错误';
                  res.json({status:"err",error:error});
                  return;
              }                  
              else
                  console.log(cre);             
              res.json({status:"succ"});
          });

      });
  }
  else
  res.json({status:"err",error:"操作错误"});

});



router.post('/course_filtrate', function(req, res, next) {
  console.log(req.body);
  var courseTimeModel = require('../../db/courseDB/selectTimeModel');
  var userModel = require('../../db/courseDB/userSchema');
  var courseModel = require('../../db/group1db/CourseModel');
  var courseStudentModel = require('../../db/courseDB/courseStudentSchema');
  var personModel = require('../../db/group1db/PersonModel'); 
  var studentGradeSchema = require('../../db/group6db/gradesDB');
  var current = [];
    // 课程筛选
  courseModel.find({},function(error,result){
    if (error)
        console.log(error);
    // for each course
    else for (course_i=0;course_i<result.length;course_i++){
        (function(course_i){
        var remaining = result[course_i].remain;
        userModel.find({},function(err,res){
            current = [];
            total_points = 0;
            console.log(remaining);
            if (err)
                console.log(err);

            // look for every student whether he chooses it. 
            else for (var i=0;i<res.length;i++){
                wait_course = res[i].selectedCourse;
                for (var j=0;j<wait_course.length;j++)
                if (wait_course[j].id==result[course_i]._id){
                    current.push({"user":res[i].id, "points":wait_course[j].points,"chip":0});
                    total_points += wait_course[j].points;
                }
                //userModel.update({id: res[i].id},{$push:{confirmedCourse:{id: wait_course[j].id}}},function(err,re){if (err) console.log(err);});
            }
            
            // handle overflow
            if (current.length>remaining){
                for (var i=0;i<current.length;i++)
                    current[i].chip = current[i].points*Math.random();
                current.sort(function(a,b){return a.chip<b.chip?1:-1});
                console.log(current);
                for (var i=0;i<remaining;i++){
                    userModel.update({id: current[i].user},{$push:{confirmedCourse:{id: result[course_i].id}}},
                        function(err,re){if (err) console.log(err);});
                    userModel.update({id: current[i].user},{$pull:{selectedCourse:{id: result[course_i].id}}},
                        function(err,re){if (err) console.log(err);});
                    courseStudentModel.update({id: result[course_i].id},{$push:{confirmedStudent:{id: current[i].user}}},
                        function(err,re){if (err) console.log(err);});
                    personModel.addcstlist(current[i].user,result[course_i].id,function(err,re){if (err) console.log(err)});
                    studentGradeSchema.insertrecord(result[course_i].id,current[i].user, function(err,re){if (err) console.log(err)});
                }
            }
            // vacancy is enough
            else {
                console.log(current);
                for (var i=0;i<current.length;i++){
                    userModel.update({id: current[i].user},{$push:{confirmedCourse:{id: result[course_i].id}}},
                        function(err,re){if (err) console.log(err);});
                    userModel.update({id: current[i].user},{$pull:{selectedCourse:{id: result[course_i].id}}},
                        function(err,re){if (err) console.log(err);});
                    courseStudentModel.update({id: result[course_i].id},{$push:{confirmedStudent:{id: current[i].user}}},
                        function(err,re){if (err) console.log(err);});
                    personModel.addcstlist(current[i].user,result[course_i].id,function(err,re){if (err) console.log(err)});
                    studentGradeSchema.insertrecord(result[course_i].id,current[i].user, function(err,re){if (err) console.log(err)});
                }
            }
                
        });
        })(course_i);
        // end one course
        }
  });
  
  var course = [];
  var choose_time = [];
  var error = "";
  res.render('select/time', {
    type:2,//manager
    course:course,
    name: '程序员', 
    image: 'images/avatars/avatar3.jpg',
    choose_time:choose_time,
    error: error
  });
});

module.exports = router;