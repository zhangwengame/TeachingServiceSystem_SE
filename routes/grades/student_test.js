var express = require('express');
var router = express.Router();

//这里require数据库
var gradesDB = require('../../db/group6db/gradesDB.js');
var CourseModel = require('../../db/group1db/CourseModel');
var gradesDB = require('../../db/group6db/gradesDB');

router.get('/testSearch',function(req, res, next) {


if(!req.session.user){return res.redirect('../basic/login');}
if(req.session.user.status!="学生"){return res.redirect('../login');}

gradesDB.find(function(error,docs){
    if(error){
        console.log(error);
        return;
    }
  
  res.render('grades/student_test', {
  	name: '程序员', 
  	image: 'images/avatars/avatar1.jpg',
  	total_a:'12',
  	a:'2,3,1,2,3,1,0',
  	total_b:'24',
  	b:'4,6,2,4,6,2,0',
  	total_credits:'24',
  	credits:'4,6,2,4,6,2,0',
    data:docs
  });
  }); 
}); 

module.exports = router;