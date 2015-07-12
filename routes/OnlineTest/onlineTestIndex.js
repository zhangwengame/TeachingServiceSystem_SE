var express = require('express');
var router = express.Router();
var auth = require('../basic/auth');

var teaOnlineTestManage = require('./teaManage');
var problemOnlineTest = require('./probManage');
var paperOnlineTest = require('./paperManage');
var stuOnlineTestManage = require('./stuManage');
var statistics = require('./statistics');

router.get('/', function(req, res, next) {
  	console.log(req.session.user.status);
  	if(req.session.user.status == '学生' || req.session.user.status == '系统管理员'){
  		res.redirect('/OnlineTest/student');	
  	}
  	else if(req.session.user.status == '教师'){
  		res.redirect('/OnlineTest/teacher');
	}
});

// router.use('/teacher', auth.isTeacher, teaOnlineTestManage);
// router.use('/statistics', auth.isTeacher, statistics);
// router.use('/probManage', auth.isTeacher, problemOnlineTest);
// router.use('/paperManage', auth.isTeacher ,paperOnlineTest);
//router.use('/student', auth.isStudent ,stuOnlineTestManage);
router.use('/student', stuOnlineTestManage);
router.use('/teacher', teaOnlineTestManage);
router.use('/statistics', statistics);
router.use('/probManage', problemOnlineTest);
router.use('/paperManage', paperOnlineTest);

module.exports = router;