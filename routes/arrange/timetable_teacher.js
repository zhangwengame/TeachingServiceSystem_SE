var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var PersonModel = require('../../db/group1db/PersonModel');
var CourseModel = require('../../db/group1db/CourseModel');
var ClassroomModel = require('../../db/group2db/ClassroomModel');

router.get('/timetable_teacher',function(req,res,next){
	var status;
	switch (req.session.user.status.toString()){
	    case '学生':status = 0;
	                res.redirect("../../login");
	                break;
	    case '教师':status = 1;
	                break;
	    case '系统管理员':status = 2;
					res.redirect("../../login");
					break;
  	}
	// if(!req.session.user){return res.redirect('../info/login');}
	var localuser=req.session.user;
	console.log("teacher_course: pass user test.");
	CourseModel.findbyteacher(localuser.username,function(error,data){
		if(error){
			console.log('find error:'+error);
		}
		else{
			console.log('find ok:'+data);
		}
		res.render('arrange/timetable_teacher',{
			type:status,
            course_data: data
		});
	});
});

module.exports = router;