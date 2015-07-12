//lhtest

var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');

//这里require数据库
var gradesDB = require('../db/group6db/gradesDB.js');
var tutorialDB= require('../db/group6db/tutorialDB.js');
var PersonModel = require('../db/group1db/PersonModel');
var CourseModel = require('../db/group1db/CourseModel');
var motionModel = require('../db/group6db/motion.js')
// var session = require('express-session');
function f1(req, res, next) {
    req.data = "This is a test";
    next()
}

router.get('/', f1, function(req, res) {

// console.log(req.session.user[0].userid);
    console.log(req.session);
    console.log("Hello");
    req.teacherid = '10000';
    req.status = 'pending'
    req.studentid = '3120102300'
    req.courseid = '(2012-2013-1)-061B0170-0002349-5'
    req.oldvalue = '50'
    req.newvalue = '74'
    req.reason = 'This is a test, for fun'
    req.admin = '123456'
    req.comment = 'This is also a test'
    motionModel.findbyid(req, function(error, motion) {
        console.log(motion);
        if(error) {
            console.log(error);
        } else {
            console.log('Save');
        }
    });

    res.send(req.data);
});  



module.exports = router;
