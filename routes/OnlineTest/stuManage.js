var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var done = false;
var point = 0;
var time = "00:00:00";

router.get('/', function(req, res, next) {
	//连接数据库
	//var db = mongoose.createConnection('mongodb://127.0.0.1:27017/NodeJS');// 链接错误
	var paperSchema = require('../../db/OnlineTestDB/paperSchema');	
	var paperModel = mongoose.model('PaperDB', paperSchema, 'papers');

	var recordSchema = require('../../db/OnlineTestDB/recordSchema');
	var recordModel = mongoose.model('RecordDB', recordSchema, 'records');

	//从session获取studentID和classID
	var student = req.session.user.userid;
	var classIds = req.session.user.cstlist;

	//渲染页面，其中papers是数据库中查询得到的内容
	paperModel.find({}, function(err, papers){
		if(err)
			return next(err);
		var papers_valid = [];
		for(var i = 0; i < papers.length; i++){
			for(var j = 0; j < classIds.length; j++){
				if(papers[i].deliver.indexOf(classIds[j]) != -1){
					papers_valid.push(papers[i]);
				}
			}
		}
		recordModel.find({student: student}, function(err, records){
			var titles = [];
			for(var i = 0; i < records.length; i++){
				titles.push(records[i].title);
			}
			res.render('OnlineTest/stuManage', {papers: papers_valid, records: records, titles: titles, name: '老程序猿',
		image: 'images/avatars/avatar1.jpg'});
		});
		
	});
  //res.render('teaTestManage', { title: 'Online Test System - Teacher' });
});


router.post('/answer=:paperId', function(req, res, next) {
	//获取试卷ID
	
	var thisId = req.params.paperId;

	var choices = [];

	//连接数据库
	//var db = mongoose.createConnection('mongodb://127.0.0.1:27017/NodeJS');// 链接错误
	var paperSchema = require('../../db/OnlineTestDB/paperSchema');	
	var paperModel = mongoose.model('PaperDB', paperSchema, 'papers');

	var problemSchema = require('../../db/OnlineTestDB/problemSchema');	
	var problemModel = mongoose.model('ProblemDB', problemSchema);

	var recordSchema = require('../../db/OnlineTestDB/recordSchema');
	var recordModel = mongoose.model('RecordDB', recordSchema, 'records');

	//渲染页面，其中problems是数据库中查询得到的内容
	paperModel.findOne({_id: thisId}, function(err, paper){
		if(err)
			return next(err);
		problemModel.find({_id: {$in: paper.problems}}, function(err, problemsInPaper){
			if(err)
				return next(err);
			var getPoint = 0;
			for(var i = 0; i < problemsInPaper.length; i++){
				var thisAnswer = req.body[problemsInPaper[i]._id];
				if(!thisAnswer){
					// res.render('OnlineTest/onlineTestErr',{message: '答题未完成！'});
					// return;
					thisAnswer = -1;
				}
				//console.log(thisAnswer);
				choices.push(thisAnswer);
				if(thisAnswer == problemsInPaper[i].answer){
					getPoint = getPoint + problemsInPaper[i].point;
				}
			}
			//db.close();

			var recordEntity = new recordModel();
			recordEntity.student = req.session.user.userid;
			recordEntity.paperId = thisId;
			recordEntity.choices = choices;
			recordEntity.point = getPoint;
			recordEntity.time = req.body.clock;
			recordEntity.title = paper.title;

			done = true;
			point = getPoint;
			time = req.body.clock;
			console.log(recordEntity);
			recordEntity.save(function(error){
				if(error) {
			        console.log(error);
			    } else {
			        console.log('saved OK!');
			    }
			    res.redirect('/OnlineTest/student/answer='+thisId);
			});
		});		
	});
});

router.get('/answer=:paperId', function(req, res, next) {
	//获取试卷ID
	var thisId = req.params.paperId;
	//连接数据库
	//var db = mongoose.createConnection('mongodb://127.0.0.1:27017/NodeJS');// 链接错误
	var paperSchema = require('../../db/OnlineTestDB/paperSchema');	
	var paperModel = mongoose.model('PaperDB', paperSchema, 'papers');

	var problemSchema = require('../../db/OnlineTestDB/problemSchema');	
	var problemModel = mongoose.model('ProblemDB', problemSchema);

	var recordSchema = require('../../db/OnlineTestDB/recordSchema');
	var recordModel = mongoose.model('RecordDB', recordSchema, 'records');

	var student = req.session.user.userid;

	//渲染页面，其中problems是数据库中查询得到的内容
	recordModel.findOne({student: student, paperId: thisId}, function(err, result){
		paperModel.findOne({_id: thisId}, function(err, paper){
			if(err)
				return next(err);
			problemModel.find({_id: {$in: paper.problems}}, function(err, problemsInPaper){
				if(err)
					return next(err);
				//没有查询到答题记录，渲染答题页面
				if(!result){
					res.render('OnlineTest/paperAnswer', {name: '老程序猿', image: 'images/avatars/avatar1.jpg', done: false, point: point, paper: paper, problemsInPaper: problemsInPaper});
				}
				else{
					res.render('OnlineTest/paperAnswer', {name: '老程序猿', image: 'images/avatars/avatar1.jpg', done: true, point: result.point, paper: result.paperId, problemsInPaper: problemsInPaper, time: result.time});						
				}
			});	
		});
	});
});

module.exports = router;