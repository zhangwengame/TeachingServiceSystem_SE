var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var PersonModel = require('../../db/group1db/PersonModel');
var CourseModel = require('../../db/group1db/CourseModel');
var ClassroomModel = require('../../db/group2db/ClassroomModel');

var tmp=[];

router.get('/timetable_classroom',function(req,res,next){
	// if(!req.session.user){return res.redirect('../info/login');}
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
    res.render('arrange/timetable_classroom',{
        type:status,
        course_data : tmp
    });
});

router.post('/timetable_classroom', function(req, res, next) {
    console.log("post:timetable_classroom");
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
    CourseModel.findbyclassroom(req.body.campus,req.body.classid2, function(error,data){
        if(error)
    	{
    		console.log('find error!'+error);
    	}
    	else{
    		console.log('find ok!'+data);
    	}
    	console.log('data : '+data.length);
        res.render('arrange/timetable_classroom', {
            type:status,
            course_data: data
        });
    });
});

router.post('/search_sem',function(req,res,next){
    console.log("search_sem");
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
    CourseModel.findbyterm(req.body.term,function (error,data) {
        if(error)
    	{
    		console.log('find error!'+error);
    	}
    	else{
    		console.log('find ok!'+data);
    	}
    	console.log('data : '+data.length);
        res.render('arrange/search_sem', {
            type:status,
            course_data: data
        });
    });
});

    
module.exports = router;