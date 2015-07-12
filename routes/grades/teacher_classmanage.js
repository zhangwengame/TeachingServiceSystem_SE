var express = require('express');
var router = express.Router();
var motionModel = require('../../db/group6db/motion.js');
var PersonModel = require('../../db/group1db/PersonModel');
var CourseModel = require('../../db/group1db/CourseModel');
var gradesDB = require('../../db/group6db/gradesDB.js');
var gradesfix = require('./teacher_gradesfix.js');


function sortNumber(a,b)
{
	return a.score - b.score
}

function viewGrade(grades,callback){
	var bar=new Array(0,0,0,0,0,0,0,0,0,0);
	var average=0;
	var midium=0;
	var avgpos,midpos;
	for(var i=0;i<grades.length;i++){
	//console.log("grades[i]:" + grades[i].score);	
		if(grades[i].score==100){
			bar[9]+=1
		}
		else{
			bar[parseInt(grades[i].score/10)]+=1
		}
			average+=grades[i].score; //console.log("average:" + average);
	
	}
	average=Math.round(average/grades.length*100)/100;
	//grades.sort(sortNumber);
	console.log("grades.length/2:" + parseInt(grades.length/2));
	if(grades.length)
		medium=grades[parseInt(grades.length/2)].score;
	else
		medium=0;
	avgpos=(average==100)?9:parseInt(average/10);
	midpos=(medium==100)?9:parseInt(medium/10);
	console.log("bar"+bar);
	callback(bar,average,medium,avgpos,midpos);
}

function classmanage(req, res, next) {

    if(!req.session.user){return res.redirect('../basic/login');}
    //result of modifing db
    var result = true;
    var criteria = {courseid : req.body.courseid};
    //console.log("coursestatus:" + req.body.coursestatus);
    if(typeof req.body.userid !== 'undefined') {
        if( req.body.coursestatus == "on"){
            gradesfix(req, res);
            
            display(req, res,result);
        } else {
            
            console.log('create a motion:' + req.body.reason)
            console.log('user:' + req.session.user.userid)
            var motion = {
                "teacherid" : req.session.user.userid,
                "teachername" : req.session.user.username,
                "studentid":req.body.userid,
                "courseid": req.body.courseid,
                "oldvalue": req.body.oldvalue,
                "newvalue":req.body.score,
                "reason":req.body.reason
                }
                    console.log('insert_start_here');
            motionModel.insert(motion, function(error, instance) {
                    console.log('_dddd');
                if(error) {
                    console.log(error);
                }
                    console.log('start_dddd');
                display(req, res,result);
                    console.log('stop_dddd');
                return;
                
            });
            
        }

    } else{
  
      display(req, res,result);
      }

}

function display(req, res,result){
        var criteria = {courseid : req.body.courseid};
          var condition = {
            "teacherid" : req.session.user.userid,
            "courseid" : req.body.courseid,
        }
        motion = null;
        motionModel.findbyteachercourse(condition,function(error,motions){
            if(error){
                console.log(error);
                return;
            }
            console.log("Find:" + condition.courseid + " " + condition.teacherid);
            //console.log(motions);
            motion = motions;
        });

		gradesDB.find(criteria,function(error,grades){
    		if(error){
        		console.log(error);
				return;
			}
    		
			console.log(grades[0])
			
			var studentList=[];
   
			for(var i=0;i<grades.length;i++){
				studentList.push(grades[i].userid);
			}
			
			console.log(studentList[0]);
			
			viewGrade(grades,function(bar,average,medium,avgpos,midpos){
		 		PersonModel.find({"userid":{$in:studentList}},function(error,persons){     
		 			// console.log("what is" + persons);
					 console.log(persons[0]);
		 			CourseModel.find({_id:req.body.courseid},function(error,courses){     
     		 			//console.log("what is persons:" + persons);
	 		 			//console.log("what is courses:" + courses);
	 		 			//console.log("what is grades:" + grades);
	 		 			warning = !result;
	 		 			console.log("isWarning:" + warning);
	 		 			res.render('grades/teacher_classmanage', {
		 					name: '程序员', 
		 					image: 'images/avatars/avatar1.jpg',
		 					total_a:'12',
		 					a:'2,3,1,2,3,1,0',
		 					total_b:'24',
		 					b:'4,6,2,4,6,2,0',
		 					total_credits:'24',
		 					credits:'4,6,2,4,6,2,0',
		 					data:grades,
		 					studentslist:persons,
		 					courses:courses,
		 					bar:bar,
		 					average:average,
		 					medium:medium,
		 					avgpos:avgpos,
		 					midpos:midpos,
		 					warning:warning,
		 					motion:motion
		 				});   
		 			});
		 		}).sort({"userid":1});
			});
		}).sort({"userid":1}); 

}

router.post('/classManagement', classmanage);

module.exports = router;
