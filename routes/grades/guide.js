//��������ģ��
var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');

//���ݿ�
var gradesDB = require('../../db/group6db/gradesDB.js');
var planModel = require('../../db/courseDB/planSchema') 
var PersonModel = require('../../db/group1db/PersonModel');
var CourseModel = require('../../db/group1db/CourseModel');
var coursePlan = require('../../db/courseDB/courseSchema_hyx')

router.get('/tutorial',function(req, res, next) {

if(!req.session.user){return res.redirect('../basic/login');}

var criteria = {id : '3120102300'};
criteria.id = req.session.user.userid;

var courseid1=[];//
var courseyear1=[];//
var dev_plan1=[];//
var getPoint1=0;//
var total_point1=0;//
var complete1=[];//

var courseid2=[];//
var courseyear2=[];//
var dev_plan2=[];//
var getPoint2=0;//
var total_point2=0;//
var complete2=[];//

var courseid3=[];//
var courseyear3=[];//
var dev_plan3=[];//
var getPoint3=0;//
var total_point3=0;//
var complete3=[];//



planModel.find(criteria,function(error,docs){
     if(error){
         console.log(error);
         return;
     }
  
  console.log(docs);
  
      
  gradesDB.find({"userid":req.session.user.userid,"score":{"$gte":60}},{"courseid":1},function(error,completelist){
     if(error){
        console.log(error);
         return;
     }
     
     console.log(completelist);
     
    var courseidList = [];
    for( i=0;i<completelist.length;i++){
      courseidList.push(completelist[i].courseid);
    }
     
     
   CourseModel.find({_id: {$in:courseidList}},{"courseid2":1},function(error,clist){
     if(error){
         console.log(error);
         return;
     }
     
      console.log(clist);
      
    var cclist = [];
    for( i=0;i<clist.length;i++){
      cclist.push(clist[i].courseid2);
    }
    
    console.log(cclist);
    
    var complete1=[];
    var complete2=[];
    var complete3=[];
    
    
      //  console.log(docs[0].p1);
    
    for(i=0;i<docs[0].p1.length;i++){
       for(j=0;j<cclist.length;j++){
          if(docs[0].p1[i]==cclist[j]){
              complete1.push(1);
              break;
       }
       }
       if(j == cclist.length)
            complete1.push(0);
    }
    
       for(i=0;i<docs[0].p2.length;i++){
       for(j=0;j<cclist.length;j++){
          if(docs[0].p2[i]==cclist[j]){
              complete2.push(1);
              break;
       }
            }
         if(j == cclist.length)
            complete2.push(0);
    }
    
       for(i=0;i<docs[0].p3.length;i++){
       for(j=0;j<cclist.length;j++){
          if(docs[0].p3[i]==cclist[j]){
              complete3.push(1);
              break;
       }
        }
       if(j == cclist.length)
            complete3.push(0);
      }
    
    console.log(docs[0].p1);
    console.log(complete1);
    console.log(docs[0].p2);
    console.log(complete2);
    console.log(docs[0].p3);
    console.log(complete3);
    
    coursePlan.find({id: {$in:docs[0].p1}},function(error,courselist1){
     if(error){
         console.log(error);
         return;
     }
     
      console.log(courselist1);
    
     coursePlan.find({id: {$in:docs[0].p2}},function(error,courselist2){
     if(error){
         console.log(error);
         return;
     }
     
      console.log(courselist2);
      
      coursePlan.find({id: {$in:docs[0].p3}},function(error,courselist3){
     if(error){
         console.log(error);
         return;
     }
     
      console.log(courselist3);
      
      var dev_plan1 = courselist1;
      var total_point1 = 0;
      var getPoint1 = 0;
      var courseyear1 =[];
      for(i=0;i<courselist1.length;i++){
         total_point1+=courselist1[i].credit;
         courseyear1.push(courselist1[i].time);
         if(complete1[i]==1)
         getPoint1+=courselist1[i].credit;
         
      }
      
      var dev_plan2 = courselist2;
      var total_point2 = 0;
      var getPoint2 = 0;
      var courseyear2 =[];
      for(i=0;i<courselist2.length;i++){
         total_point2+=courselist2[i].credit;
         courseyear2.push(courselist2[i].time);
         if(complete2[i]==1)
         getPoint2+=courselist2[i].credit;
         
      }
      
      var dev_plan3 = courselist3;
      var total_point3 = 0;
      var getPoint3 = 0;
      var courseyear3 =[];
      for(i=0;i<courselist3.length;i++){
         total_point3+=courselist3[i].credit;
         courseyear3.push(courselist3[i].time);
         if(complete3[i]==1)
         getPoint3+=courselist3[i].credit;
         
      }
      
      
     
  
 res.render('grades/student_guide', {
  name: '程序员', 
  image: 'images/avatars/avatar1.jpg',
  total_a:'12',
  a:'2,3,1,2,3,1,0',
  total_b:'24',
  b:'4,6,2,4,6,2,0',
  total_credits:'24',
  credits:'4,6,2,4,6,2,0',
  dev_plan1:dev_plan1,
  total_point1:total_point1,
  complete1:complete1,
  getpoint1:getPoint1,
  year1:courseyear1,
  dev_plan2:dev_plan2,
  total_point2:total_point2,
  complete2:complete2,
  getpoint2:getPoint2,
  year2:courseyear2,
  dev_plan3:dev_plan3,
  total_point3:total_point3,
  complete3:complete3,
  getpoint3:getPoint3,
  year3:courseyear3
  });
}).sort( {"id":1} ); //courselist3
}).sort( {"id":1} ); //courselist2
}).sort( {"id":1} ); //courselist1
}).sort( {"courseid":1} );
});
});
});

module.exports = router;