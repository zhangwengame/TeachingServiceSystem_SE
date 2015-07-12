var express = require('express');
var router = express.Router();

//这里require数据库
var CourseModel = require('../../db/group1db/CourseModel');
var gradesDB = require('../../db/group6db/gradesDB');
//var tutorialModel= require('../../db/group6db/tutorialDB.js');
var motionModel = require('../../db/group6db/motion');
var coursePlan = require('../../db/courseDB/courseSchema_hyx')

router.get('/grades', function(req, res, next) {
if(!req.session.user){return res.redirect('../basic/login');}
var criteria = {userid : '3120102300'};
criteria.userid = req.session.user.userid;

// console.log(req.session.user[0].userid);

if(req.session.user.status=="学生"){
//这里使用数据库

 req.session.user.cstlist.forEach(function(courseid){

    
   gradesDB.findOne( {"courseid":courseid,"userid":req.session.user.userid},function(error,docs){
     if(error){
       console.log(error);
       return ;
     }

     if(docs=="" | !docs){
     gradesDB.insertrecord(courseid,req.session.user.userid,function(error,docs){
       if(error){
       console.log(error);
       return ;
       }
       
     });
     }
   }); 
   
   
 });
  


 gradesDB.find(criteria,function(error,docs){
     if(error){
         console.log(error);
         return;
     }
     
   var docs_result = [];
   var idx_docs_reuslt = 0;
   var courseplanID = [];
   CourseModel.find({},function(error,courses){
         for(var i = 0;i < docs.length;++i)
         {   
           for(var j = 0;j < courses.length;++j)
           {            
              if(courses[j]["_id"]==docs[i]["courseid"])//we can use sort to speed up
              {
                if(courses[j]["status"]=="off")
                {
                  docs_result.push(docs[i]);
                  docs_result[idx_docs_reuslt]["coursename"] = courses[j]["coursename"];
                  docs_result[idx_docs_reuslt]["coursecredit"] = courses[j]["coursescore"];
                  docs_result[idx_docs_reuslt]["courseterm"] = courses[j]["courseterm"];
                  docs_result[idx_docs_reuslt]["courseyear"] = courses[j]["year"];
                  docs_result[idx_docs_reuslt]["courseplan_id"] = courses[j]["courseid2"];
                  courseplanID.push(courses[j]["courseid2"]);
                  idx_docs_reuslt++;
                }
                break;
              }
           }
         }            
         //console.log(courseplanID);
         coursePlan.find({id:{$in:courseplanID}},function(error,courseplan){
             for(var i = 0;i < docs_result.length;++i)
             {
                //console.log(docs_result[i]["courseplan_id"]);
                for(var j = 0;j < courseplan.length;++j)
                {
                  //console.log("curr_courseplanID");
                  //console.log(courseplan[j]["id"]);
                  if(courseplan[j]["id"]==docs_result[i]["courseplan_id"])
                  {
                    switch(courseplan[j]["type"])
                    {
                      case 1: docs_result[i]["coursetype"] = "公共课"; break;
                      case 2: docs_result[i]["coursetype"] = "专业必修"; break;
                      case 3: docs_result[i]["coursetype"] = "专业选修"; break;
                    }
                    break;
                  }
                }
             }
           res.render('grades/student_grades', {
               	name: '程序员', 
               	image: 'images/avatars/avatar1.jpg',
               	total_a:'12',
               	a:'2,3,1,2,3,1,0',
               	total_b:'24',
               	b:'4,6,2,4,6,2,0',
               	total_credits:'24',
               	credits:'4,6,2,4,6,2,0',
                data:docs_result});
         });                
         
         
         
     
   });
  });
}
else if (req.session.user.status=="教师"){
  
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
 

 
}

else if(req.session.user.status=="教务管理员"||req.session.user.status=="系统管理员"){
    var rejected = {
        "status" : "rejected"
    }

    var accepted = {
        "status" : "accepted"
    }
    resultOfrejected = {"length":0};
    resultOfaccepted = {"length":0};
    motionModel.findbystatus(rejected,function(error,motions){
        if(error){
            console.log(error);
            return;
        }
        resultOfrejected = motions;
    });
    motionModel.findbystatus(accepted,function(error,motions){
        if(error){
            console.log(error);
            return;
        }
        resultOfaccepted = motions;
    });
    var query = {
        "status":"pending"
    }
    motionModel.findbystatus(query, function(error,motions){
        if(error){
            console.log(error);
            return;
        }

        console.log('Form admin_grades')
        res.render('grades/admin_gradesaudit', {
            name: '程序员', 
            image: 'images/avatars/avatar1.jpg',
            total_a:'12',
            a:'2,3,1,2,3,1,0',
            total_b:'24',
            b:'4,6,2,4,6,2,0',
          total_credits:'24',
            credits:'4,6,2,4,6,2,0',
            pending:motions,
            accepted:resultOfaccepted,
            rejected:resultOfrejected
        });
    }); 
}


});  


module.exports =router;
