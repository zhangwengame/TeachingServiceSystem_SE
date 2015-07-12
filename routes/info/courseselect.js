var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var CourseModel = require('../../db/group1db/CourseModel');
var tmp=[];
// tmp.push({couresname:'initial_name',teacher:'initial_teacher',exametime:'initial_exametime',room:'initial_room',college:'initial_college'});
var fs = require('fs');
var PersonModel = require('../../db/group1db/PersonModel');

router.get('/', function(req, res, next) {
    res.render('info/courseselect',{
    	name: '程序员', 
		image: 'images/avatars/avatar3.jpg',
		total_a:'12',
		a:'2,3,1,2,3,1,0',
		total_b:'24',
		b:'4,6,2,4,6,2,0',
		total_credits:'24',
		credits:'4,6,2,4,6,2,0',

    	data:tmp,
    	selectresult:''
    });
});

router.post('/',function(req, res, next){
	console.log("post:courseselect");

	CourseModel.findbyid(req.body.courseid2, function(error, data){
		if(error) {
			console.log('find error!'+error);
		} else {
			console.log('find ok!'+data);
		}
		for(i=0;i<data.length;i++)
			console.log('data id : '+data[i].courseid);
		if(!data | data ==''){
			res.render('info/courseselect',{
				data: tmp,
				selectresult:'课程不存在'
			});
		}
		else{
			res.render('info/courseselect',{
				data: data,
				selectresult:''
			});
		}
	});
});

module.exports = router;

