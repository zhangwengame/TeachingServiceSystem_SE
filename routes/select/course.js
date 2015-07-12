var express = require('express');
var router = express.Router();

/* GET home page. */
/*type=0; 学生  type=1;老师  type=2 管理员 */
var courseSearch=require('./courseSearch');
var courseTable=require('./courseTable');
var devPlan=require('./devPlan');
var chooseCourse=require('./chooseCourse');
var courseInfo=require('./courseInfo');
var systemTime=require('./systemTime');
var manualOperation=require('./manualOperation');
router.use('/',courseSearch);
router.use('/',courseTable);
router.use('/',devPlan);
router.use('/',chooseCourse);
router.use('/',courseInfo);
router.use('/',systemTime);
router.use('/',manualOperation);

module.exports = router;