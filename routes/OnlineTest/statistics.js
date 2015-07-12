var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var thisTitle = '请选择需要可视化的试卷';
var thisLegends = [];
var thisPersonNum = [];

var papers_valid = [];

var print_record = -1;

//假定只有一个班级。在合体之后需要通过别的方法获取这些信息
var classId = "001";

router.get('/', function(req, res, next){
	var paperSchema = require('../../db/OnlineTestDB/paperSchema');	
	var paperModel = mongoose.model('PaperDB', paperSchema, 'papers');

	classId = req.session.user.cstlist[0];

	var recordSchema = require('../../db/OnlineTestDB/recordSchema');
	var recordModel = mongoose.model('RecordDB', recordSchema, 'records');
	paperModel.find({}, function(err, papers){
		if(err)
			return next(err);

		papers_valid = [];
		var papers_valid_id = [];
		for(var i = 0; i < papers.length; i++){
			if(papers[i].deliver.indexOf(classId) != -1){
				papers_valid.push(papers[i]);
				papers_valid_id.push(papers[i]._id);
			}
		}
		recordModel.find({paperId: { "$in" : papers_valid_id }}, function(err, records){
			var titles = [];
			var totalpoints = [];

			for(var i = 0; i < papers_valid.length; i++){
				titles.push(papers_valid[i].title);
				totalpoints.push(papers_valid[i].totalPoint);
			}
			res.render('OnlineTest/statistics', {
				name: '老程序猿',
				image: 'images/avatars/avatar1.jpg',
				titles: titles,
				totalpoints: totalpoints,
				title: thisTitle,
				legends: thisLegends,
				personNum: thisPersonNum,
				records: records,
				print_record: print_record
			});
		});
	});
});

router.post('/', function(req, res, next){
	if(!req.body.choosePaper){
		res.send("<script type='text/javascript'>alert('请先选择一场考试！');window.location.href='/OnlineTest/statistics'</script>");
	}
	splitNum = req.body.counter;
	splits = [];
	before = 0;

	thisLegends = [];
	thisPersonNum = [];
	thisTitle = papers_valid[req.body.choosePaper].title;
	for(var i = 0; i < splitNum; i++){
		var name = 'parag' + i;
		thisSplit = req.body[name];
		thisParag = "" + before + "~" + (thisSplit - 1);
		before = thisSplit;
		splits.push(thisSplit)
		thisLegends.push(thisParag);
	}
	var totalP = papers_valid[req.body.choosePaper].totalPoint;
	var str = "" + before + "~" + totalP;
	thisLegends.push(str);

	thisPaper = papers_valid[req.body.choosePaper]._id;

	var recordSchema = require('../../db/OnlineTestDB/recordSchema');
	var recordModel = mongoose.model('RecordDB', recordSchema, 'records');

	recordModel.find({paperId: thisPaper}, function(err, records){
		console.log(thisPersonNum);
		for(var i = 0; i < splits.length; i++){
			thisPersonNum.push(0);
		}
		thisPersonNum.push(0);

		for(var i = 0; i < records.length; i++){
			var flag = 0;
			for(var j = 0; j < splits.length; j++){
				if(records[i].point < splits[j]){
					thisPersonNum[j]++;
					flag = 1;
					break;
				}
			}
			if(!flag){
				thisPersonNum[thisPersonNum.length-1]++;
			}
		}

		res.redirect('/OnlineTest/statistics');
	});
});

router.get('/print/paper=:paperTitle', function(req, res, next){
	print_record = req.params.paperTitle;
	res.redirect('/OnlineTest/statistics');
});

module.exports = router;