//��������ģ��
var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');

//���ݿ�
var gradesDB = require('../../db/group6db/gradesDB.js');
var tutorialDB= require('../../db/group6db/tutorialDB.js');
var PersonModel = require('../../db/group1db/PersonModel');
var CourseModel = require('../../db/group1db/CourseModel');

router.get('/tutorial',function(req, res, next) {

if(!req.session.user){return res.redirect('../basic/login');}

var courseid1=[];//�������޿κ�
var courseyear1=[];//���������޶�ѧ��
var dev_plan1=[];//�����γ�
var getPoint1=0;//��������ѧ��
var total_point1=0;//������ѧ��
var complete1=[];//�����޶�״̬

var courseid2=[];//����ѡ�޿κ�
var courseyear2=[];//����ѡ���޶�ѧ��
var dev_plan2=[];//�����γ�
var getPoint2=0;//��������ѧ��
var total_point2=0;//������ѧ��
var complete2=[];//�����޶�״̬

var courseid3=[];//ͨʶ�κ�
var courseyear3=[];//ͨʶ�޶�ѧ��
var dev_plan3=[];//�����γ�
var getPoint3=0;//��������ѧ��
var total_point3=0;//������ѧ��
var complete3=[];//�����޶�״̬

var courseid4=[];//רҵ���޿κ�
var courseyear4=[];//רҵ�����޶�ѧ��
var dev_plan4=[];//�����γ�
var getPoint4=0;//��������ѧ��
var total_point4=0;//������ѧ��
var complete4=[];//�����޶�״̬

var courseid5=[];//רҵѡ�޿κ�
var courseyear5=[];//רҵѡ���޶�ѧ��
var dev_plan5=[];//�����γ�
var getPoint5=0;//��������ѧ��
var total_point5=0;//������ѧ��
var complete5=[];//�����޶�״̬

var my_major=req.session.user.major;
var my_userid=req.session.user.userid;
tutorialDB.find({"major":my_major},{},function(error, tData){
  if(error){
      console.log(error);
      return;
  }
  for (var i = 0; i < tData.length; i++) {
    var courseid = tData[i].courseid;
    var type=tData[i].type;
    var year=tData[i].year;
    if(type==1){
      courseid1.push(courseid);
      courseyear1.push(year);
    }else if(type==2){
      courseid2.push(courseid);
      courseyear2.push(year);
    }else if(type==3){
      courseid3.push(courseid);
      courseyear3.push(year);
    }else if(type==4){
      courseid4.push(courseid);
      courseyear4.push(year);
    }else if(type==5){
      courseid5.push(courseid);
      courseyear5.push(year);
    }
  }

var id1={courseid: {$in: courseid1}};
var id2={courseid: {$in: courseid2}};
var id3={courseid: {$in: courseid3}};
var id4={courseid: {$in: courseid4}};
var id5={courseid: {$in: courseid5}};
console.log(id1);
//��������
CourseModel.find(id1,function(error,dev_plan1){
  if(error){
    console.log(error);
    return;
  }
  console.log(dev_plan1);
  for (var i = 0; i < dev_plan1.length; i++){
    total_point1+=dev_plan1[i].coursescore;
  }
/* gradesDB.find(id1,function(error,gradeData1){
  if(error){
      console.log(error);
      return;
   }
  // console.log(gradeData1);
   for (var i = 0; i < gradeData1.length; i++) {
       var grade1=gradeData1[i].score;
          console.log(gradeData1[i]);
       if(grade1>=60){
         complete1.push(1);
         getPoint1+=dev_plan1[i].coursescore;
       }else{
         complete1.push(0);
       }
  }*/
  gradesDB.findbycourseid(courseid1,my_userid,function(error,mData){
  if(error){
    console.log(error);
    return;
  }

   for (var i = 0; i < mData.length; i++) {
       if(mData[i]){
	   var grade1=mData[i];
       console.log(grade1);
       if(grade1>=60){
         complete1.push(1);
         getPoint1+=dev_plan1[i].coursescore;
       }else{
         complete1.push(0);
       }
	   }else{
         complete1.push(0);
	   }
  }
 
  console.log(complete1);

//����ѡ��
CourseModel.find(id2,{},function(error,dev_plan2){
  if(error){
    console.log(error);
    return;
  }
  for (var i = 0; i < dev_plan2.length; i++){
    total_point2+=dev_plan2[i].coursescore;
  }
 gradesDB.findbycourseid(courseid2,my_userid,function(error,gradeData2){
  if(error){
    console.log(error);
    return;
  }

   for (var i = 0; i < gradeData2.length; i++) {
       if(gradeData2[i]){
	   var grade2=gradeData2[i];
       console.log(grade2);
       if(grade2>=60){
         complete2.push(1);
         getPoint2+=dev_plan2[i].coursescore;
       }else{
         complete2.push(0);
       }
	   }else{
         complete2.push(0);
	   }
  }
  //ͨʶ�γ�
  CourseModel.find(id3,{},function(error,dev_plan3){
  if(error){
    console.log(error);
    return;
  }
  for (var i = 0; i < dev_plan3.length; i++){
    total_point3+=dev_plan3[i].coursescore;
  }
  gradesDB.findbycourseid(courseid3,my_userid,function(error,gradeData3){
   if(error){
     console.log(error);
     return;
   }
   for (var i = 0; i < gradeData3.length; i++) {
       if(gradeData3[i]){
	   var grade3=gradeData3[i];
       if(grade3>=60){
         complete3.push(1);
         getPoint3+=dev_plan3[i].coursescore;
       }else{
         complete3.push(0);
       }
	   }else{
         complete3.push(0);
	   }
  }
  //רҵѡ��
  CourseModel.find(id4,{},function(error,dev_plan4){
  if(error){
    console.log(error);
    return;
  }
  for (var i = 0; i < dev_plan4.length; i++){
    total_point4+=dev_plan4[i].coursescore;
  }
  gradesDB.findbycourseid(courseid4,my_userid,function(error,gradeData4){
   if(error){
     console.log(error);
     return;
   }
   for (var i = 0; i < gradeData4.length; i++) {
       if(gradeData4[i]){
	   var grade4=gradeData4[i];
       if(grade4>=60){
         complete4.push(1);
         getPoint4+=dev_plan4[i].coursescore;
       }else{
         complete4.push(0);
       }
	   }else{
         complete4.push(0);
	   }
  }
  //רҵ����
  CourseModel.find(id5,{},function(error,dev_plan5){
  if(error){
    console.log(error);
    return;
  }
  for (var i = 0; i < dev_plan5.length; i++){
    total_point5+=dev_plan5[i].coursescore;
  }
  gradesDB.findbycourseid(courseid5,my_userid,function(error,gradeData5){
   if(error){
     console.log(error);
     return;
   }
   for (var i = 0; i < gradeData5.length; i++) {
       if(gradeData5[i]){
	   var grade5=gradeData5[i];
       if(grade5>=60){
         complete5.push(1);
         getPoint5+=dev_plan5[i].coursescore;
       }else{
         complete5.push(0);
       }
	   }else{
         complete5.push(0);
	   }
  }
  res.render('grades/student_guide', {
  name: '����Ա', 
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
  year3:courseyear3,
  dev_plan4:dev_plan4,
  total_point4:total_point4,
  complete4:complete4,
  getpoint4:getPoint4,
  year4:courseyear4,
  dev_plan5:dev_plan5,
  total_point5:total_point5,
  complete5:complete5,
  getpoint5:getPoint5,
  year5:courseyear5
  });
}); 
}).sort( {"courseid":1} );
}); 
}).sort( {"courseid":1} );
});
}).sort( {"courseid":1} );
});
}).sort( {"courseid":1} );
});
}).sort( {"courseid":1} );
}).sort( {_id:1} );
});

module.exports = router;