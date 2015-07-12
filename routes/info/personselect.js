var express = require('express');
var router = express.Router();
var mongoose = require('mongoose/');

var tmp=[];

var PersonModel = require('../../db/group1db/PersonModel');

router.get('/', function(req, res, next) {
    res.render('info/personselect',{
		person_data: tmp,
		selectresult:''
	});
});

router.post('/',function(req, res, next){
	console.log("post:personselect");
	PersonModel.findbyid(req.body.userid,function (err, user) {
		if (err) {
			console.log('find error!'+ err);
		}
		if (!user | user == '') {
			console.log('user not found!');
			res.render('info/personselect',{
				person_data: tmp,
				selectresult:"用户不存在"
			});
		}
		console.log('user : '+user);
		res.render('info/personselect',{
			person_data: user,
			selectresult:""
		});
	});
});

module.exports = router;