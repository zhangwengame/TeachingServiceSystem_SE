var express = require('express');
var router = express.Router();

var PersonModel = require('../../db/group1db/PersonModel');
var CourseModel = require('../../db/group1db/CourseModel');
var gradesDB = require('../../db/group6db/gradesDB');


router.post('/gradesSubmit',function(req, res, next) {

if(!req.session.user){return res.redirect('../basic/login');}

console.log(req.body.courseid);

CourseModel.update({"_id":req.body.courseid},{$set:{status:"off"}},function(error,back){
    if(error){
        console.log(error);
        return;
    }
  
        
CourseModel.findbylist(req.session.user.cstlist,function(error,clist){
    if(error){
         console.log(error);
         return;
     }
    var cliston=[];
    var clistoff=[]; 
    
    for(var i=0;i<clist.length;i++){
      if(clist[i].status=="on"){
        cliston.push(clist[i]);
      }
      else if(clist[i].status=="off"){
        clistoff.push(clist[i]);
      }
    }
   
    res.render('grades/teacher_classlist', {
    name: '程序员', 
    image: 'images/avatars/avatar1.jpg',
    total_a:'12',
    a:'2,3,1,2,3,1,0',
    total_b:'24',
    b:'4,6,2,4,6,2,0',
    total_credits:'24',
    credits:'4,6,2,4,6,2,0',
    cliston: cliston,
    clistoff:clistoff
   });  
   
 });
 });
 }); 
 
 module.exports = router;