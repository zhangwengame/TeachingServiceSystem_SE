var express = require('express');
var router = express.Router();

var PersonModel = require('../../db/group1db/PersonModel');
var CourseModel = require('../../db/group1db/CourseModel');
var gradesDB = require('../../db/group6db/gradesDB');
var motionManager = require('./motionManager.js');

function gradesfix(req, res) {

    if(!req.session.user){
        return res.redirect('../basic/login');
    }

    var criteria = {courseid : req.body.courseid};

   // console.log("what is req:"+req.body.courseid);

    console.log("userid"+req.body.userid);
    if(req.body.score<60){
        
        gradesDB.update(
        {
            userid:req.body.userid,
            courseid:req.body.courseid
        },
        {
            $set:{
                score:req.body.score,
                gradePoint:0
            }
        },function(error,lol){
  
        }
    );
        
        
        
        
    }
    else{

    gradesDB.update(
        {
            userid:req.body.userid,
            courseid:req.body.courseid
        },
        {
            $set:{
                score:req.body.score,
                gradePoint:(req.body.score-45)/10
            }
        },function(error,lol){
  
        }
    );
    }


}

module.exports = gradesfix;
