var express = require('express');
var router = express.Router();

//这里require数据库
var gradesDB = require('../../db/group6db/gradesDB.js');
//var tutorialDB= require('../../db/group6db/tutorialDB.js');
var CourseModel = require('../../db/group1db/CourseModel');
var gradesDB = require('../../db/group6db/gradesDB');
var coursePlan = require('../../db/courseDB/planSchema');


function viewGPA(docs,callback){
	var year=new Array();
	var yearCourseNum={};
	var yearGPA={};
	var yearmainGPA={};
	var yearmainCourseNum={};
	var GPAarray=new Array();
	var allGPA=new Array();
	var mainGPA=new Array();
		//bar chart
	for(var i=0;i<docs.length;i++){
		if(!yearCourseNum[docs[i].year]){//year-bar
			yearCourseNum[docs[i].year]=1;
			year[year.length]=docs[i].year;
			yearGPA[docs[i].year]=docs[i].gradePoint;
			if(docs[i].type==4 || docs[i].type==5){
				yearmainCourseNum[docs[i].year]=1;
				yearmainGPA[docs[i].year]=docs[i].gradePoint;
			}
		}
		else{
			yearCourseNum[docs[i].year]++;
			yearGPA[docs[i].year]+=docs[i].gradePoint;
			if(docs[i].type==4 || docs[i].type==5){
				yearmainCourseNum[docs[i].year]++;
				yearmainGPA[docs[i].year]+=docs[i].gradePoint;
			}
		}
		
	}
	year.sort();
	console.log("year.sort"+year);
	console.log("yearmainGpa",yearmainGPA);
	for(var i=0;i<year.length;i++){		
		GPAarray[i]= Math.round(yearGPA[year[i]]/yearCourseNum[year[i]]*100)/100;
		var tmpGPA=0;
		var tmpNum=0;
		var tmpmainGPA=0;
		var tmpmainNum=0;
		for(var j=0;j<=i;j++){
			tmpGPA=tmpGPA+yearGPA[year[j]];
			tmpNum=tmpNum+yearCourseNum[year[j]];
			if(yearmainCourseNum[year[j]]){
				tmpmainGPA=tmpmainGPA+yearmainGPA[year[j]];
				tmpmainNum=tmpmainNum+yearmainCourseNum[year[j]];
			}
		}
		if(tmpNum)
			allGPA[i]=Math.round(tmpGPA/tmpNum*100)/100;
		else
			allGPA[i]=0;
		if(tmpmainNum)
			mainGPA[i]=	Math.round(tmpmainGPA/tmpmainNum*100)/100;
		else
			mainGPA[i]=0;
	}
	console.log("mainGPA",mainGPA);
	//radar  chart
	var yearsNum=new Array(year.length);
	var yearsGPA=new Array(year.length);
	for(var i=0;i<year.length;i++){
		yearsNum[i]=new Array(0,0,0);
		yearsGPA[i]=new Array(0,0,0);
	}

	for(var i=0; i<docs.length;i++){
		for(var j=0;j<year.length;j++){
			if(docs[i].year==year[j]){
				yearsNum[j][docs[i].type-1]++;
				yearsGPA[j][docs[i].type-1]+=docs[i].gradePoint;
			}
			
		}
			
	}
	for(var i=0;i<year.length;i++){
		for(var j=0;j<3;j++){
			if(yearsNum[i][j])
				yearsGPA[i][j]/=yearsNum[i][j];
			else
				yearsGPA[i][j]=0;
		}
	}
			
	console.log("allGPA",allGPA);
	console.log("gpa",GPAarray);
	callback(year,allGPA,mainGPA,GPAarray,yearsGPA);
}

router.get('/gradesAnalysis',function(req, res, next) {

	if(!req.session.user){return res.redirect('../info/login');}
	if(req.session.user.status!="学生"){return res.redirect('../login');}
	var criteria = {userid : '3120102300'};
	criteria.userid = req.session.user.userid;

	if(req.session.user.status=="学生"){
//这里使用数据库
	 	gradesDB.find(criteria,function(error,docs){
	 	  if(error){
         	console.log(error);
		 	return;
     	  }
		   
		   var courselist=[];
		   
		   for(i=0;i<docs.length;i++){
			   courselist.push(docs[i].courseid);
		   }
     	  
		   
		  CourseModel.find({_id:{$in:courselist}},function(error,docs1){
	 	  if(error){
         	console.log(error);
		 	return;
     	  }
		   
		   var courseidlist=[]
		   
		   for(i=0;i<docs1.length;i++){
			   courseidlist.push(docs1[i].courseid2);
		   }
		   
		   
	 	  coursePlan.find({"id":req.session.user.userid},function(error, tData){
	 	  	if(error){
	 	  		console.log(error);
	 	  		return;
  			}
			 
			 
			for  (var i = 0; i < docs1.length; i++) {
	  			for(var j = 0;j < tData[0].p1.length;++j)
	  				if(tData[0].p1[j]==docs1[i]["courseid2"]){
		  				docs[i]["type"]=1;
	  				}
					  
				for(var j = 0;j < tData[0].p2.length;++j)
	  				if(tData[0].p2[j]==docs1[i]["courseid2"]){
		  				docs[i]["type"]=2;
	  				}
				
				for(var j = 0;j < tData[0].p3.length;++j)
	  				if(tData[0].p3[j]==docs1[i]["courseid2"]){
		  				docs[i]["type"]=3;
	  				}
  			}
			
  		  })
			
			console.log("docs "+  docs);
	 	  CourseModel.find({},function(error,courses){
		 	
	 	    for(var i = 0;i < docs.length;++i)
	 		{   
		 		for(var j = 0;j < courses.length;++j)
		 		if(courses[j]["_id"]==docs[i]["courseid"])//we can use sort to speed up
		 		{
		 			docs[i]["coursename"] = courses[j]["coursename"];
		 			docs[i]["coursecredit"] = courses[j]["coursescore"];
		 			docs[i]["year"]=courses[j]["year"];
          		}
     		}
     		var overallGPA=new Array();
     		var everyGPA=new Array();
     		var yearBar=new Array();
     		var MainGPA=new Array();
     		var YearsGPA=null;
     		viewGPA(docs,function(year,allGPA,mainGPA,GPAarray,yearsGPA){
	     		overallGPA=allGPA;
	     		everyGPA=GPAarray;
	     		yearBar=year;
	     		MainGPA=mainGPA;
	     		YearsGPA=yearsGPA;
     		});
     		console.log("mainGpa",MainGPA);
     		console.log("yearBar", yearBar);
	 		res.render('grades/student_analysis', {
	 			name: '程序员', 
	 			image: 'images/avatars/avatar1.jpg',
	 			total_a:'12',
	 			a:'2,3,1,2,3,1,0',
	 			total_b:'24',
	 			b:'4,6,2,4,6,2,0',
	 			total_credits:'24',
	 			credits:'4,6,2,4,6,2,0',
	 			data:docs,
	 			overallGPA:overallGPA,
	 			everyGPA:everyGPA,
	 			yearBar:yearBar,
	 			mainGPA:MainGPA,
	 			yearsGPA:YearsGPA
     		});

  			});     
   		 }).sort( {"_id":1} );    
 		}).sort( {"courseid":1} );//for stu_grades
	}
}); 
 

module.exports = router;