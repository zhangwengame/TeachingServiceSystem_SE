var express = require('express');
var arrange = express.Router();

var classroominsert = require('./classroominsert');
var classroomdelete = require('./classroomdelete');
var classroommodify = require('./classroommodify');
var classroomselect = require('./classroomselect');
var classroomcourse = require('./classroomcourse');
var timetable_classroom = require('./timetable_classroom');
var timetable_teacher = require('./timetable_teacher');
var CourseApplicationInsert = require('./CourseApplicationInsert');
var arrange_by_sa =require ('./arrange_by_sa');
var arrange_course_management = require('./arrange_course_management')
//var teachercourse = require('./teachercourse');

var login =require('../basic/login');
// var group = require('./group');

arrange.use('/', login);
arrange.use('/', classroominsert);
arrange.use('/', classroomdelete);
arrange.use('/', classroommodify);
arrange.use('/', classroomselect);
arrange.use('/', classroomcourse);
arrange.use('/', timetable_classroom);
arrange.use('/', timetable_teacher);
arrange.use('/', CourseApplicationInsert);
arrange.use('/', arrange_course_management);
arrange.use('/', arrange_by_sa);
//arrange.use('/', teachercourse);
// arrange.use('/',group);


module.exports = arrange;
