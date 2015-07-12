var express = require('express');
var mongoose = require('mongoose');
var CourseModel = require('../../db/group1db/CourseModel');
var router = express.Router();

var CourseID = ' ';//课程的ID，为Schema中的courseid2，代表一门课程而不是一个教学班

/* GET home page. */
router.get('/', function(req, res, next) {
	//连接数据库
	//var db = mongoose.createConnection('mongodb://127.0.0.1:27017/NodeJS');// 链接错误
	var problemSchema = require('../../db/OnlineTestDB/problemSchema');	
	var problemModel = mongoose.model('ProblemDB', problemSchema);

	//渲染页面，其中problems是数据库中查询得到的内容
	problemModel.find({}, function(err, problems){
		if(err)
			return next(err);
		var classId = req.session.user.cstlist[0];
		CourseModel.findOne({_id: classId}, function(err, theCourse){
			CourseID = theCourse.courseid2;
			var problems_valid = [];
			for(var i = 0; i < problems.length; i++){
				if(problems[i].usedClass == CourseID){
					problems_valid.push(problems[i]);
				}
			}
			res.render('OnlineTest/probManage', {name: '老程序猿', image: 'images/avatars/avatar1.jpg', problems: problems_valid});
		});
	});
  //res.render('teaTestManage', { title: 'Online Test System - Teacher' });
});


router.post('/', function(req, res, next) {
	//连接数据库
	//var db = mongoose.createConnection('mongodb://127.0.0.1:27017/NodeJS');// 链接错误
	var problemSchema = require('../../db/OnlineTestDB/problemSchema');	
	var problemModel = mongoose.model('ProblemDB', problemSchema);

	if(req.body.stem_edit){
		if(req.body.choice1){
			var problemSchema = require('../../db/OnlineTestDB/problemSchema');	
			var problemModel = mongoose.model('ProblemDB', problemSchema);

			var stem = req.body.stem_edit;
			var answer = req.body.answer;
			var choice = [];
			var point = req.body.point;
			choice.push(req.body.choice1);
			choice.push(req.body.choice2);
			choice.push(req.body.choice3);
			choice.push(req.body.choice4);

			var conditions = {_id : req.body.pro_id};
			var update     = {$set : {stem: stem, choice: choice, point: point, answer: answer}};
			var options    = {upsert : true};
			problemModel.update(conditions, update, options, function(error){
		    	if(error) {
		    	    console.log(error);
		    	}
			});
		}
		else{
			var stem = req.body.stem_edit;
			var answer = req.body.answer;
			var point = req.body.point;

			var conditions = {_id : req.body.pro_id};
			var update     = {$set : {stem: stem, point: point, answer: answer}};
			var options    = {upsert : true};
			problemModel.update(conditions, update, options, function(error){
		    	if(error) {
		    	    console.log(error);
		    	}
			});
		}
		res.redirect('/OnlineTest/probManage');
	}

	if(!req.body.stem){
		res.render('OnlineTest/onlineTestErr',{message: '没有题干！'});
		return;
	}

	if(req.body.choice1){
		if(!req.body.choice2 || !req.body.choice3 || !req.body.choice4){
			res.render('OnlineTest/onlineTestErr',{message: '选项不全！'});
			return;
		}

		if(!req.body.answer){
			res.render('OnlineTest/onlineTestErr',{message: '没有答案！'});
			return;	
		}

		//获得表单内容
		var stem = req.body.stem;
		var answer = req.body.answer;
		var choice = [];
		choice.push(req.body.choice1);
		choice.push(req.body.choice2);
		choice.push(req.body.choice3);
		choice.push(req.body.choice4);

		// 增加记录 基于 entity 操作
	 	var problemEntity = new problemModel();
	 	problemEntity.stem = stem;
	 	problemEntity.answer = answer;
	 	problemEntity.choice = choice;
	 	problemEntity.type = 0;
	 	problemEntity.point = req.body.point;
	 	problemEntity.usedClass = CourseID;
		problemEntity.save(function(error) {
		    if(error) {
		        console.log(error);
		    } else {
		        console.log('saved OK!');
		    }
		    //db.close();
		});
	}

	else{
		var stem = req.body.stem;
		var answer = req.body.answer;

		// 增加记录 基于 entity 操作
	 	var problemEntity = new problemModel();
	 	problemEntity.stem = stem;
	 	problemEntity.answer = answer;
	 	problemEntity.type = 1;
	 	problemEntity.point = req.body.point;
	 	problemEntity.usedClass = CourseID;
		problemEntity.save(function(error) {
		    if(error) {
		        console.log(error);
		    } else {
		        console.log('saved OK!');
		    }
		});
	}
	res.redirect('/OnlineTest/probManage');
});

//router.deletePro = function(req, res, next){
router.get('/delete/:id', function(req, res, next){
	//获取题目ID
	var thisId = req.params.id;
	//连接数据库
	//var db = mongoose.createConnection('mongodb://127.0.0.1:27017/NodeJS');// 链接错误
	var problemSchema = require('../../db/OnlineTestDB/problemSchema');	
	var problemModel = mongoose.model('ProblemDB', problemSchema);

	//删除记录
	//删除题目的时候要删除试卷的相应内容【还没有实现
	var conditions = {_id: thisId};
	problemModel.remove(conditions, function(error){
	    if(error) {
	        console.log(error);
	    } else {
	        console.log('delete ok!');
	    }
	    //关闭数据库链接
	    //db.close();
	});

	res.redirect('/OnlineTest/probManage');
});

module.exports = router;