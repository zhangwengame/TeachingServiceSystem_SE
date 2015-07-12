var express = require('express');
var router = express.Router();
var CourseModel = require('../../db/group1db/CourseModel');

router.get('/chooseCourse=:courseID', function(req, res, next){
	var thisCourseID = req.params.courseID;

	cstlist = req.session.user.cstlist;
	var index = cstlist.indexOf(thisCourseID);

	if(index > 0){
		var temp = cstlist[index];
		cstlist[index] = cstlist[0];
		cstlist[0] = temp;
	}

	req.session.user.cstlist = cstlist;

	res.redirect('/OnlineTest/teacher');
});

router.get('/', function(req, res, next){
	var student = req.session.user.userid;
	var classId = req.session.user.cstlist;

	//获取课程名
	//var className = [];
	// CourseModel.findbyid(classId, function (err, the_class) {
	// 	console.log('===========================================');
	//     if(err){
	//     	console.log("development router login findbyid error!");
	//     }
	//     else{
	//     	console.log(the_class);
	//     	console.log(classId);
	//     	for(var i = 0; i < the_class.length; i++){
	//     		console.log(the_class);
	//     		className.push(the_class[i].coursename);
	//     	}
	//     }
	//     console.log('===========================================');
 //    }); 
	
	var courses;
	CourseModel.find({_id: {$in:classId}}, function(err, courses){
		if(err){
	    	return next(err);
	    }
	    else{
	    	console.log(courses);
	    }

	    var chosenCourse = '1';

	    // console.log("========================");
	    // console.log(courses);
	    console.log(req.session.user);
	    // console.log("========================");

	    for(var i = 0; i < courses.length; i++){
	    	if(courses[i]._id == req.session.user.cstlist[0]){
	    		chosenCourse = courses[i].coursename;
	    	}
	    }

	    res.render('OnlineTest/teaManage',{
			name: '老程序猿',
			image: 'images/avatars/avatar1.jpg',
			courses: courses,
			chosenCourse: chosenCourse
		});
	});
});

module.exports = router;