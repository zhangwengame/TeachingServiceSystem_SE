var express = require('express');
var router = express.Router();

var PersonModel = require('../../db/group1db/PersonModel');
var CourseModel = require('../../db/group1db/CourseModel');
var gradesDB = require('../../db/group6db/gradesDB');

function handler(req, res) {
    console.log("motionManager.handler");
    if(req.insertMotion != true) return false;
    // console.log("what is req:"+req.body.courseid);

    console.log("user:"+req.session.user);
    return true;
}


module.exports = handler;
