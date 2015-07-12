var express = require('express');
var mongoose = require('mongoose');
var CourseModel = require('../../db/group1db/CourseModel');
var router = express.Router();

var CourseID = ' ';//课程的ID，为Schema中的courseid2，代表一门课程而不是一个教学班

//A shuffle algorithm
function shuffle(aArr){
    var iLength = aArr.length,
        i = iLength,
        mTemp,
        iRandom;
 
    while(i--){
        if(i !== (iRandom = Math.floor(Math.random() * iLength))){
            mTemp = aArr[i];
            aArr[i] = aArr[iRandom];
            aArr[iRandom] = mTemp;
        }
    }
 
    return aArr;
}

function formatTime(strIn){
	input = parseInt(strIn);
	if(input < 10)
		return "0" + input.toString();
	else
		return strIn;
}

/* GET home page. */
router.get('/', function(req, res, next) {
	//连接数据库
	//var db = mongoose.createConnection('mongodb://127.0.0.1:27017/NodeJS');// 链接错误
	var paperSchema = require('../../db/OnlineTestDB/paperSchema');	
	var paperModel = mongoose.model('PaperDB', paperSchema, 'papers');

	//渲染页面，其中papers是数据库中查询得到的内容
	paperModel.find({}, function(err, papers){
		var classId = req.session.user.cstlist[0];
		CourseModel.findOne({_id: classId}, function(err, theCourse){
			CourseID = theCourse.courseid2;
			papers_valid = [];
			for(var i = 0; i < papers.length; i++){
				if(papers[i].usedClass == CourseID){
					papers_valid.push(papers[i]);
				}
			}

			if(err)
				return next(err);
			res.render('OnlineTest/paperManage', {papers: papers_valid, name: '老程序猿', image: 'images/avatars/avatar1.jpg'});
			//db.close();
		});
	});
  //res.render('teaTestManage', { title: 'Online Test System - Teacher' });
});

router.post('/', function(req, res, next) {
	var paperSchema = require('../../db/OnlineTestDB/paperSchema');	
	var paperModel = mongoose.model('PaperDB', paperSchema, 'papers');

	var classId = req.session.user.cstlist[0];//从Session获取classId
	
	if(req.body.paperTitle_auto){
		if(!req.body.point1 || !req.body.point1 || !req.body.point1){
			res.render('OnlineTest/onlineTestErr',{message: '试卷信息不全！'});
			return;
		}
		var title = req.body.paperTitle_auto;
		var pro_1_num = req.body.point1;
		var pro_2_num = req.body.point2;
		var pro_3_num = req.body.point3;

		var problemSchema = require('../../db/OnlineTestDB/problemSchema');	
		var problemModel = mongoose.model('ProblemDB', problemSchema);

		problemModel.find({}, function(err, problems){
			if(err)
				return next(err);
			problems_valid = [];
			for(var i = 0; i < problems.length; i++){
				if(problems[i].usedClass == CourseID){
					problems_valid.push(problems[i]);
				}
			}
			problems = problems_valid;

			var pro_1 = [];
			var pro_2 = [];
			var pro_3 = [];
			var point = 0;
			for(var i = 0; i < problems.length; i++){
				if(problems[i].point == 1)
					pro_1.push(problems[i]);
				else if(problems[i].point == 2)
					pro_2.push(problems[i]);
				else
					pro_3.push(problems[i]);
			}

			//shuffle the three arrays
			pro_1 = shuffle(pro_1);
			pro_2 = shuffle(pro_2);
			pro_3 = shuffle(pro_3);

			if(pro_1.length < pro_1_num || pro_2.length < pro_2_num || pro_3.length < pro_3_num){
				res.render('OnlineTest/onlineTestErr',{message: '题库数量不够！'});
				return;
			}

			else{
				var createdProblems = [];
				for(var i = 0; i < pro_1_num; i++){
					createdProblems.push(pro_1[i]._id);
					point  = point + pro_1[i].point;
				}
				for(var i = 0; i < pro_2_num; i++){
					createdProblems.push(pro_2[i]._id);
					point  = point + pro_2[i].point;
				}
				for(var i = 0; i < pro_3_num; i++){
					createdProblems.push(pro_3[i]._id);
					point  = point + pro_3[i].point;
				}
				// 增加记录 基于 entity 操作
			 	var paperEntity = new paperModel();
			 	paperEntity.title = title;
			 	paperEntity.usedClass = CourseID;
			 	paperEntity.problems = createdProblems;
			 	paperEntity.totalPoint = point;
			 	paperEntity.timeLimit = "" + formatTime(req.body.hour) + ":" + formatTime(req.body.minute) + ":" + formatTime(req.body.second);
				paperEntity.save(function(error) {
				    if(error) {
				        console.log(error);
				    } else {
				        console.log('saved OK!');
				    }
				    //db.close();
				});
				// res.redirect('/OnlineTest/paperManage');
			}
		});
	}
	else{
		//获得表单内容
		if(!req.body.paperTitle){
			res.render('OnlineTest/onlineTestErr',{message: '试卷信息不全！'});
			return;
		}
		var title = req.body.paperTitle;

		// 增加记录 基于 entity 操作
	 	var paperEntity = new paperModel();
	 	paperEntity.title = title;
	 	paperEntity.usedClass = CourseID;
	 	paperEntity.timeLimit = "" + formatTime(req.body.hour) + ":" + formatTime(req.body.minute) + ":" + formatTime(req.body.second);
		paperEntity.save(function(error) {
		    if(error) {
		        console.log(error);
		    } else {
		        console.log('saved OK!');
		    }
		    //db.close();
		});
	}
	res.redirect('/OnlineTest/paperManage');
});

router.get('/delete/:id', function(req, res, next){
	//获取试卷ID
	var thisId = req.params.id;
	//连接数据库
	//var db = mongoose.createConnection('mongodb://127.0.0.1:27017/NodeJS');// 链接错误
	var paperSchema = require('../../db/OnlineTestDB/paperSchema');	
	var paperModel = mongoose.model('PaperDB', paperSchema, 'papers');

	//删除记录
	var conditions = {_id: thisId};
	paperModel.remove(conditions, function(error){
	    if(error) {
	        console.log(error);
	    } else {
	        console.log('delete ok!');
	    }
	    //关闭数据库链接
	    //db.close();
	});

	res.redirect('/OnlineTest/paperManage');
});

router.get('/update/:id', function(req, res, next){
	//获取试卷ID
	var thisId = req.params.id;
	//连接数据库
	//var db = mongoose.createConnection('mongodb://127.0.0.1:27017/NodeJS');// 链接错误
	var paperSchema = require('../../db/OnlineTestDB/paperSchema');	
	var paperModel = mongoose.model('PaperDB', paperSchema, 'papers');

	var problemSchema = require('../../db/OnlineTestDB/problemSchema');	
	var problemModel = mongoose.model('ProblemDB', problemSchema);

	//渲染页面，其中problems是数据库中查询得到的内容
	paperModel.findOne({_id: thisId}, function(err, paper){
		if(err)
			return next(err);
		problemModel.find({_id: {$in: paper.problems}}, function(err, problemsInPaper){
			if(err)
				return next(err);
			problemModel.find({}, function(err, allProblems){
				if(err)
					return next(err);
				problems_valid = [];
				for(var i = 0; i < allProblems.length; i++){
					if(allProblems[i].usedClass == CourseID){
						problems_valid.push(allProblems[i]);
					}
				}
				res.render('OnlineTest/paperEdit', {name: '老程序猿', image: 'images/avatars/avatar1.jpg', paper: paper, problemsInPaper: problemsInPaper, allProblems: problems_valid});
				//db.close();
			});
			
			//console.log(problems);
		});		
	});
});

router.get('/add/:paperId/:problemId/:problemPoint', function(req, res, next){
	//获取试卷和题目ID
	var paperId = req.params.paperId;
	var problemId = req.params.problemId;
	var problemPoint = req.params.problemPoint;

	//连接数据库
	//var db = mongoose.createConnection('mongodb://127.0.0.1:27017/NodeJS');// 链接错误
	var paperSchema = require('../../db/OnlineTestDB/paperSchema');	
	var paperModel = mongoose.model('PaperDB', paperSchema, 'papers');

	paperModel.findOne({_id: paperId}, function(err,paper){
		if(err)
			return next(err);
		
		if(paper.problems.indexOf(problemId) == -1){
			paper.problems.push(problemId);
			paper.totalPoint = paper.totalPoint + parseInt(problemPoint);
		}

		var conditions = {_id : paperId};
		var update     = {$set : {problems : paper.problems, totalPoint : paper.totalPoint}};
		var options    = {upsert : true};
		paperModel.update(conditions, update, options, function(error){
	    	if(error) {
	    	    console.log(error);
	    	} else {
	    	    console.log('update ok!');
	    	}
	    	//关闭数据库链接
	    	//db.close();
		});
	});

	res.redirect('/OnlineTest/paperManage/update/'+paperId);
});

router.get('/deleteProblem/:paperId/:problemId/:problemPoint', function(req, res, next){
	//获取试卷和题目ID
	var paperId = req.params.paperId;
	var problemId = req.params.problemId;
	var problemPoint = req.params.problemPoint;

	//连接数据库
	//var db = mongoose.createConnection('mongodb://127.0.0.1:27017/NodeJS');// 链接错误
	var paperSchema = require('../../db/OnlineTestDB/paperSchema');	
	var paperModel = mongoose.model('PaperDB', paperSchema, 'papers');

	paperModel.findOne({_id: paperId}, function(err,paper){
		if(err)
			return next(err);

		//paper.problems.push(problemId);
		for(var i = 0; i < paper.problems.length; i++){
			console.log(paper.problems[i]);
			console.log(problemId);
			if(paper.problems[i] == problemId){
				paper.problems.splice(i, 1);
				paper.totalPoint = paper.totalPoint - parseInt(problemPoint);
			}
		}

		var conditions = {_id : paperId};
		var update     = {$set : {problems : paper.problems, totalPoint : paper.totalPoint}};
		var options    = {upsert : true};
		paperModel.update(conditions, update, options, function(error){
	    	if(error) {
	    	    console.log(error);
	    	} else {
	    	    console.log('update ok!');
	    	}
	    	//关闭数据库链接
	    	//db.close();
		});
	});

	res.redirect('/OnlineTest/paperManage/update/'+paperId);
});

router.get('/deliver/:paperId', function(req, res, next){
	var paperId = req.params.paperId;
	var paperSchema = require('../../db/OnlineTestDB/paperSchema');	
	var paperModel = mongoose.model('PaperDB', paperSchema, 'papers');

	var classId = req.session.user.cstlist[0];

	paperModel.findOne({_id: paperId}, function(err,paper){
		if(err)
			return next(err);

		if(paper.deliver.indexOf(classId) == -1){
			paper.deliver.push(classId);
		}

		var conditions = {_id : paperId};
		var update     = {$set : {deliver : paper.deliver}};
		var options    = {upsert : true};
		paperModel.update(conditions, update, options, function(error){
	    	if(error) {
	    	    console.log(error);
	    	} else {
	    	    console.log('update ok!');
	    	}
	    	//关闭数据库链接
	    	//db.close();
		});
	});

	res.redirect('/OnlineTest/paperManage');
});

router.get('/undeliver/:paperId', function(req, res, next){
	var paperId = req.params.paperId;
	var paperSchema = require('../../db/OnlineTestDB/paperSchema');	
	var paperModel = mongoose.model('PaperDB', paperSchema, 'papers');

	var classId = req.session.user.cstlist[0];

	paperModel.findOne({_id: paperId}, function(err,paper){
		if(err)
			return next(err);

		paper.deliver = [];

		var conditions = {_id : paperId};
		var update     = {$set : {deliver : paper.deliver}};
		var options    = {upsert : true};
		paperModel.update(conditions, update, options, function(error){
	    	if(error) {
	    	    console.log(error);
	    	} else {
	    	    console.log('update ok!');
	    	}
	    	//关闭数据库链接
	    	//db.close();
		});
	});

	res.redirect('/OnlineTest/paperManage');
});

module.exports = router;