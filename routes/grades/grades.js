
var express = require('express');
var router = express.Router();



//这里require各个页面的router
var home = require('./home');
var student_analysis = require('./student_analysis');
var student_test = require('./student_test');
var student_guide= require('./guide');
var teacher_classlist = require('./teacher_classlist');
var teacher_classmanage = require('./teacher_classmanage');
//var teacher_gradesfix = require('./teacher_gradesfix');
var teacher_gradessubmit = require('./teacher_gradessubmit');
var admin_gradesaudit = require('./admin_gradesaudit');



router.use('/',home);
router.use('/',student_analysis);
router.use('/',student_test);
router.use('/',teacher_classlist);
router.use('/',teacher_classmanage);
//router.use('/',teacher_gradesfix);
router.use('/',teacher_gradessubmit);
router.use('/',admin_gradesaudit);
router.use('/',student_guide);






module.exports = router;
