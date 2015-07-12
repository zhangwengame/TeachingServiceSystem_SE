var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ClassroomModel = require('../../db/group2db/ClassroomModel');
var tmp=[];
// tmp.push({couresname:'initial_name',teacher:'initial_teacher',exametime:'initial_exametime',room:'initial_room',college:'initial_college'});



router.get('/classroomselect', function(req, res, next) {
//	if(!req.session.user){return res.redirect('../info/login');}
   	var status;
	switch (req.session.user.status.toString()){
	    case '学生':status = 0;
	                break;
	    case '教师':status = 1;
	                break;
	    case '系统管理员':status = 2;break;
  	}
    res.render('arrange/classroomselect',{
		type:status,
    	classroom_data:tmp,
    });
});

router.post('/classroomselect',function(req, res, next){
	console.log("post:classroomselect");
	var status;
	switch (req.session.user.status.toString()){
	    case '学生':status = 0;
	                break;
	    case '教师':status = 1;
	                break;
	    case '系统管理员':status = 2;break;
  	}
	ClassroomModel.findbyic(req.body.classid2,req.body.campus ,function(error, data){
		if(error)
		{
			console.log('find error!'+error);
		}
		else{
			console.log('find ok!'+data);
		}
		console.log('data : '+data.length);
		res.render('arrange/classroomselect',{
			type:status,
			classroom_data: data
		});
	});
});

module.exports = router;

