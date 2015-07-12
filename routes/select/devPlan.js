var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
//培养方案页面

var userType=0;//manager

//var currentId = "u001";
var selectedMajor;// = "专业1";//默认专业为当期用户的专业
var userModel = require('../../db/courseDB/userSchema');

//////////////////////////专业培养方案//////////////////////////
////GET////
router.get('/dev_plan', function (req, res, next) {
  //console.log(course.ejs);
  console.log(req.body);
  var userType;
  switch (req.session.user.status.toString()){
    case '学生':userType=0;break;
    case '教师':userType=1;break;
    case '系统管理员':userType=2;break;
  }
  var selectedMajor=req.session.user.major;
  
  //course: id, name, credit, recTime, type, subType, major
  //major: name
  //plan: studentId, p1, isC1, p2, isC2, p3, isC3
  
  //将数据读入内存
  //专业
  //var selectedMajor = "专业1";//默认专业为当期用户的专业

  var major = [];//专业
  var majorModel = require('../../db/courseDB/majorSchema');
  
  var dev_plan_elec_class = [];
  var dev_plan_gen_class=[];
  majorModel.find({}, function(error, result) {
    if (error) console.log(error);
    else console.log(result);
    
    for(var i=0;i<result.length;i++){
      if(result[i].name!="公共课")
        major.push(result[i].name);
      else{
        for(var j=0;j<(result[i].field).length;j++)
          dev_plan_gen_class.push({name:(result[i].field)[j],min_credits:(result[i].mincredit)[j],credits:"0"});
      }

      if(result[i].name == selectedMajor){
        for(var j=0;j<(result[i].field).length;j++)
          dev_plan_elec_class.push({classification: (result[i].field)[j], min_credits: "20", credits: "18"});
      }
    }
  });
 
  var dev_plan_gen = [];
  var dev_plan_req = [];
  var dev_plan_elec = new Array();
  var dev_plan_elec_tmp = [];
  var courseModel = require('../../db/courseDB/courseSchema_hyx');
  courseModel.find({major: {$in: [selectedMajor, "公共课"]} }, function(error, result) {
    if (error) console.log(error);
    else console.log(result);

    for (var i = 0; i < result.length; i++) {
      if (result[i].type == 1) {//公共课, dev_plan页面似乎不用公共课的list
        dev_plan_gen.push({
          ID: result[i].id,
          name: result[i].name,
          time: result[i].time,
          credit: result[i].credit,
          complete: false
        });
      } else if (result[i].type == 2) {//专业必修
        dev_plan_req.push({
          ID: result[i].id,
          name: result[i].name,
          time: result[i].time,
          credit: result[i].credit,
          complete: false
        });
      } else {//3, 专业选修
        //数据存入内存
        dev_plan_elec_tmp.push({
          ID: result[i].id,
          name: result[i].name,
          time: result[i].time,
          credit: result[i].credit,
          complete: false,
          subtype: result[i].subtype
        });
      }
    }
    
    //专业选修分类
    for (var m = 0; m < dev_plan_elec_class.length; m++) {
      var tmp = [];
      for (var i = 0; i < dev_plan_elec_tmp.length; i++) { //每个子类一一匹配，好麻烦
        if (dev_plan_elec_tmp[i].subtype == dev_plan_elec_class[m].classification) {
          tmp.push({
            ID: dev_plan_elec_tmp[i].ID,
            name: dev_plan_elec_tmp[i].name,
            time: dev_plan_elec_tmp[i].time,
            credit: dev_plan_elec_tmp[i].credit,
            complete: dev_plan_elec_tmp[i].complete
          });
        }
      }
      dev_plan_elec.push(tmp);
    }

    res.render('select/dev_plan', {
      type: userType, 
      name: '程序员',
      image: 'images/avatars/avatar3.jpg',
      total_a: '12',
      a: '2,3,1,2,3,1,0',
      total_b: '24',
      b: '4,6,2,4,6,2,0',
      total_credits: '24',
      credits: '4,6,2,4,6,2,0',
      major: major,
      dev_plan_gen: dev_plan_gen_class,
      dev_plan_elec: dev_plan_elec,
      dev_plan_elec_class: dev_plan_elec_class,
      dev_plan_req: dev_plan_req
    });
    
  });//find end
});//get end

////POST////
//搜索专业培养方案
router.post('/dev_plan', function (req, res, next) {
  console.log(req.body);
  var selectedMajor = req.body.major_name;
  var major = [];//专业
  var majorModel = require('../../db/courseDB/majorSchema');
  var dev_plan_elec_class = [];
  var dev_plan_gen_class=[];
  majorModel.find({}, function(error, result) {
    if (error) console.log(error);
    else console.log(result);
    
    for(var i=0;i<result.length;i++){
      if(result[i].name!="公共课")
        major.push(result[i].name);
      else{
        for(var j=0;j<(result[i].field).length;j++)
          dev_plan_gen_class.push({name:(result[i].field)[j],min_credits:(result[i].mincredit)[j],credits:"0"});
      }

      if(result[i].name == selectedMajor){
        for(var j=0;j<(result[i].field).length;j++)
          dev_plan_elec_class.push({classification: (result[i].field)[j], min_credits: "20", credits: "18"});
      }
    }
  });
 
  var dev_plan_gen = [];
  var dev_plan_req = [];
  var dev_plan_elec = new Array();
  var dev_plan_elec_tmp = [];
  var courseModel = require('../../db/courseDB/courseSchema_hyx');
  courseModel.find({major: {$in: [selectedMajor, "公共课"]} }, function(error, result) {
    if (error) console.log(error);
    else console.log(result);

    for (var i = 0; i < result.length; i++) {
      if (result[i].type == 1) {//公共课, dev_plan页面似乎不用公共课的list
        dev_plan_gen.push({
          ID: result[i].id,
          name: result[i].name,
          time: result[i].time,
          credit: result[i].credit,
          complete: false
        });
      } else if (result[i].type == 2) {//专业必修
        dev_plan_req.push({
          ID: result[i].id,
          name: result[i].name,
          time: result[i].time,
          credit: result[i].credit,
          complete: false
        });
      } else {//3, 专业选修
        dev_plan_elec_tmp.push({
          ID: result[i].id,
          name: result[i].name,
          time: result[i].time,
          credit: result[i].credit,
          complete: false,
          subtype: result[i].subtype
        });
      }
    }
    
    //专业选修分类
    for (var m = 0; m < dev_plan_elec_class.length; m++) {
      var tmp = [];
      for (var i = 0; i < dev_plan_elec_tmp.length; i++) { //每个子类一一匹配，好麻烦
        if (dev_plan_elec_tmp[i].subtype == dev_plan_elec_class[m].classification) {
          tmp.push({
            ID: dev_plan_elec_tmp[i].ID,
            name: dev_plan_elec_tmp[i].name,
            time: dev_plan_elec_tmp[i].time,
            credit: dev_plan_elec_tmp[i].credit,
            complete: dev_plan_elec_tmp[i].complete
          });
        }
      }
      dev_plan_elec.push(tmp);
    }

    res.render('select/dev_plan', {
      type: userType,
      name: '程序员',
      image: 'images/avatars/avatar3.jpg',
      total_a: '12',
      a: '2,3,1,2,3,1,0',
      total_b: '24',
      b: '4,6,2,4,6,2,0',
      total_credits: '24',
      credits: '4,6,2,4,6,2,0',
      major: major,
      dev_plan_gen: dev_plan_gen_class,
      dev_plan_elec: dev_plan_elec,
      dev_plan_elec_class: dev_plan_elec_class,
      dev_plan_req: dev_plan_req
    });
    
  });//find end
});//post end

//////////////////////////我的培养方案//////////////////////////
////GET////
//major表中，除了公共课，其他的mincredit[0]表示专业必修课的mincredit，mincredit[1]表示专业选修课的mincredit
router.get('/my_dev_plan', function (req, res, next) {
  console.log(req.body);

  var userType;
  switch (req.session.user.status.toString()){
    case '学生':userType=0;break;
    case '教师':userType=1;break;
    case '系统管理员':userType=2;break;
  }
  var currentId=req.session.user.userid;

  var ischecked=false;
  var render = function() {
    res.render('select/my_dev_plan', {
      type: userType,
      name: '程序员',
      image: 'images/avatars/avatar3.jpg',
      total_a: '12',
      a: '2,3,1,2,3,1,0',
      total_b: '24',
      b: '4,6,2,4,6,2,0',
      total_credits: '24',
      credits: '4,6,2,4,6,2,0',
      dev_plan_gen: dev_plan_gen_class,
      dev_plan_elec: my_dev_plan_elec,
      dev_plan_elec_class: my_dev_plan_elec_class,
      dev_plan_req: my_dev_plan_req,
      my_dev_plan_gen: my_dev_plan_gen,
      is_checked: ischecked, //这样要改成这样，待审核时可以修改，其他时候不能修改
      error:""
    });
  }

  var planModel = require('../../db/courseDB/planSchema');
  var courseModel = require('../../db/courseDB/courseSchema_hyx');
  var majorModel = require('../../db/courseDB/majorSchema');
  var dev_plan_gen_class=[];//公共课类别++++6.7++++
  majorModel.find({name:"公共课"}, function(error, result) {
    if (error) console.log(error);
    else console.log(result);
    
    if(result.length!=1)
      console.log("ERROR: The length of result is not one!");
      
    for(var i=0;i<(result[0].field).length;i++)
      dev_plan_gen_class.push({name:(result[0].field)[i],min_credits:(result[0].mincredit)[i],credits:"0"});//格式 课程类别，培养方案要求学分，已修学分
  });
 
  var my_dev_plan_gen = [];
  var my_dev_plan_req = [];
  var my_dev_plan_elec = [];
  var my_dev_plan_elec_class = [];
  //查询 & 显示
  planModel.find({id: currentId}, function(error, result) {
    if (error) console.log(error);
    else console.log(result);

    if (result.length != 1) {
      console.log("ERROR: result.length!=1");
      return;
    }

    //公共课
    var ok1=false;
    var ok2=false;
    var ok3=false;
    var credit1_1 = 0;
    var credit1_2 = 0;
    var credit1_3 = 0;
    var credit1_4 = 0;
    var credit3 = 0;
    var credit2 = 0;
    var my_dev_plan_elec_tmp = [];
    
    
    function isRender(){
      if(ok1&&ok2&&ok3){
        dev_plan_gen_class[0].credits=credit1_1.toString();
        dev_plan_gen_class[1].credits=credit1_2.toString();
        dev_plan_gen_class[2].credits=credit1_3.toString();
        dev_plan_gen_class[3].credits=credit1_4.toString();
        var isEmpty = true;
        for (var m = 0; m < my_dev_plan_elec_class.length; m++) {
          var tmp = [];
          for (var j = 0; j < my_dev_plan_elec_tmp.length; j++) { //每个子类一一匹配，好麻烦
            if (my_dev_plan_elec_tmp[j].classi == my_dev_plan_elec_class[m].classification) {
              tmp.push(my_dev_plan_elec_tmp[j]);
            }
          }
          my_dev_plan_elec.push(tmp);
          isEmpty = false;
        }
        if (isEmpty) {
          var tmp = [];
          my_dev_plan_elec.push(tmp);
        }
        console.log("%d %d %d %d", credit1_1, credit1_2, credit1_3, credit1_4);
        console.log(credit2);
        console.log(credit3);
        //render();
        majorModel.find({},function(error,result){
          if (error) console.log(error);
          else console.log(result);

          /*if(result.length!=1)
            console.log("ERROR:result.length!=1");*/

          var ischecked1=false;
          var ischecked2=false;

          for(var i=0;i<result.length;i++){
            if(result[i].name=="公共课"){
              if(credit1_1>=result[0].mincredit[0]
                && credit1_2>=result[0].mincredit[1]
                && credit1_3>=result[0].mincredit[2]
                && credit1_4>=result[0].mincredit[3]){
                ischecked1=true;
              }
            }
            else{
              if(credit2>=result[i].mincredit[0]
                &&credit3>=result[i].mincredit[1]){
                ischecked2=true;
              }
            }

            if(i==result.length-1){
              ischecked=ischecked1&&ischecked2;
              render();
            }
          }  
        });
      }
        
    }
    
    if((result[0].p1).length==0){
      ok1=true;
      console.log(ok1);
      isRender();
    }
    for (var i = 0; i < (result[0].p1).length; i++) {
      //嵌套查询
      (function(i) {
        courseModel.find({id: (result[0].p1)[i]}, function(error, nresult) {
          if (error) console.log(error);
          else console.log(nresult);

          if (nresult.length == 1){
            if(nresult[0].subtype=="通识类课程")
              credit1_1 += nresult[0].credit;
            else if(nresult[0].subtype=="思政类课程")
              credit1_2 += nresult[0].credit;
            else if(nresult[0].subtype=="体育类课程")
              credit1_3 += nresult[0].credit;
            else
              credit1_4 += nresult[0].credit;
            my_dev_plan_gen.push({
              ID: nresult[0].id,
              name: nresult[0].name,
              time: nresult[0].time,
              credit: nresult[0].credit,
              complete: result[0].isC1[i],
              classi: nresult[0].subtype
            });
          }//if end
          if(i==(result[0].p1).length-1){
            ok1=true;
            console.log(ok1);
            isRender();
          }
        });//find end
      })(i);
    }
    console.log(1);

    //专业选修课
    //var ok2=false;
    /*var credit3 = 0;
    var my_dev_plan_elec_tmp = [];*/
    if((result[0].p3).length==0){
      ok2=true;
      console.log(ok2);
      isRender();
    }
    for (var i = 0; i < (result[0].p3).length; i++) {
      //嵌套查询
      (function(i) {
        courseModel.find({id: result[0].p3[i]}, function(error, nresult) {
          if (error) console.log(error);
          else console.log(nresult);

          if (nresult.length == 1) {
            var flag = 0;
            for (var j = 0; j < my_dev_plan_elec_class.length; j++) {
              if (nresult[0].subtype == my_dev_plan_elec_class[j].classification) {
                flag = 1;
                break;
              }
            }
            if (flag == 0) {
              my_dev_plan_elec_class.push({classification:nresult[0].subtype, min_credits: "20", credits: "18"});
            }
            //把所有专业选修课的数据读进内存
            my_dev_plan_elec_tmp.push({
              ID: nresult[0].id,
              name: nresult[0].name,
              time: nresult[0].time,
              credit: nresult[0].credit,
              complete: result[0].isC2[i],
              classi: nresult[0].subtype
            });
            credit3 += nresult[0].credit;
          }

          if(i==(result[0].p3).length-1){
            ok2=true;
            console.log(ok2);
            isRender();
          }
        });//find end
      })(i);
    }

    for (var m = 0; m < my_dev_plan_elec_class.length; m++) {
      var tmp = [];
      for (var i = 0; i < my_dev_plan_elec_tmp.length; i++) { 
        if (my_dev_plan_elec_tmp[i].classi == dev_plan_elec_class[m]) {
          tmp.push(my_dev_plan_elec_tmp[i]);
        }
      }
      my_dev_plan_elec.push(tmp);
    }
    console.log(2);

    //专业必修 
    if((result[0].p2).length==0){
      ok3=true;
      isRender();
    }
    for (var i = 0; i < (result[0].p2).length; i++) {
      //嵌套查询
      (function(i) {
        courseModel.find({id: result[0].p2[i]}, function(error, nresult) {
          if (error) console.log(error);
          else console.log(nresult);

          if (nresult.length == 1)
            my_dev_plan_req.push({
              ID: nresult[0].id,
              name: nresult[0].name,
              time: nresult[0].time,
              credit: nresult[0].credit,
              complete: result[0].isC2[i]
            });
          credit2 += result[0].credit;

          if (my_dev_plan_req.length == (result[0].p2).length){
            ok3=true;
            isRender();
          }
        });
      })(i);
    }
    console.log(2.5);
    
    console.log(3);
  });//plan find end
});//get end

////POST////
//修改我的培养方案
router.post('/my_dev_plan_add', function(req, res, next) {
  console.log(req.body);

  var output_error="";
  var ischecked=false;
  var render = function() {
    res.render('select/my_dev_plan', {
      type: userType,
      name: '程序员',
      image: 'images/avatars/avatar3.jpg',
      total_a: '12',
      a: '2,3,1,2,3,1,0',
      total_b: '24',
      b: '4,6,2,4,6,2,0',
      total_credits: '24',
      credits: '4,6,2,4,6,2,0',
      dev_plan_gen: dev_plan_gen_class,
      dev_plan_elec: my_dev_plan_elec,
      dev_plan_elec_class: my_dev_plan_elec_class,
      dev_plan_req: my_dev_plan_req,
      my_dev_plan_gen: my_dev_plan_gen,
      is_checked: ischecked, 
      error:output_error
    });
  }
   
  var userType;
  switch (req.session.user.status.toString()){
    case '学生':userType=0;break;
    case '教师':userType=1;break;
    case '系统管理员':userType=2;break;
  }
  var currentId=req.session.user.userid;
  var selectedMajor=req.session.user.major;

  //var currentId = "313001";
  var planModel = require('../../db/courseDB/planSchema');
  var courseModel = require('../../db/courseDB/courseSchema_hyx');
  var majorModel = require('../../db/courseDB/majorSchema');
  var dev_plan_gen_class = []; //公共课类别++++6.7++++
  majorModel.find({name: "公共课"}, function(error, result) {
    if (error) console.log(error);
    else console.log(result);

    if (result.length != 1)
      console.log("ERROR: The length of result is not one!");

    for (var i = 0; i < (result[0].field).length; i++)
      dev_plan_gen_class.push({
        name: (result[0].field)[i],
        min_credits: (result[0].mincredit)[i],
        credits: "0"
      }); //格式 课程类别，培养方案要求学分，已修学分
  });

  var my_dev_plan_gen = [];
  var my_dev_plan_req = [];
  var my_dev_plan_elec = new Array();
  var my_dev_plan_elec_class = [];

  var ok1 = false;
  var credit1_1 = 0;
  var credit1_2 = 0;
  var credit1_3 = 0;
  var credit1_4 = 0;
  var ok2 = false;
  var credit3 = 0;
  var my_dev_plan_elec_tmp = [];
  var ok3 = false;
  var credit2 = 0;

  
  function isRender() {
    if (ok1 && ok2 && ok3) {
      dev_plan_gen_class[0].credits = credit1_1.toString();
      dev_plan_gen_class[1].credits = credit1_2.toString();
      dev_plan_gen_class[2].credits = credit1_3.toString();
      dev_plan_gen_class[3].credits = credit1_4.toString();
      var isEmpty = true;
      for (var m = 0; m < my_dev_plan_elec_class.length; m++) {
        var tmp = [];
        for (var j = 0; j < my_dev_plan_elec_tmp.length; j++) { //每个子类一一匹配，好麻烦
          if (my_dev_plan_elec_tmp[j].classi == my_dev_plan_elec_class[m].classification) {
            tmp.push(my_dev_plan_elec_tmp[j]);
          }
        }
        my_dev_plan_elec.push(tmp);
        isEmpty = false;
      }
      if (isEmpty) {
        var tmp = [];
        my_dev_plan_elec.push(tmp);
      }
      console.log("%d %d %d %d", credit1_1, credit1_2, credit1_3, credit1_4);
      console.log(credit2);
      console.log(credit3);

      majorModel.find({},function(error,result){
        if (error) console.log(error);
        else console.log(result);

        /*if(result.length!=1)
          console.log("ERROR:result.length!=1");*/

        var ischecked1=false;
        var ischecked2=false;

        for(var i=0;i<result.length;i++){
          if(result[i].name=="公共课"){
            if(credit1_1>=result[0].mincredit[0]
              && credit1_2>=result[0].mincredit[1]
              && credit1_3>=result[0].mincredit[2]
              && credit1_4>=result[0].mincredit[3]){
              ischecked1=true;
            }
          }
          else{
            if(credit2>=result[i].mincredit[0]
              &&credit3>=result[i].mincredit[1]){
              ischecked2=true;
            }
          }

          if(i==result.length-1){
            ischecked=ischecked1&&ischecked2;
            render();
          }
        }  
      });//major find end
    }//if ok1&2&3
  }//isRender function end

  courseModel.find({id: req.body.course_number}, function(error, result) {
    if (error) console.log(error);
    else console.log(result);

    //找到了一个course
    var isCourse=true;
    if (result.length != 1) {
      console.log("ERROR:result.length!=1");
      output_error="不存在此课!";
      isCourse=false;
      isRender();
    }

    //将这门课放进currentId的plan列表 
    //!!加课的时候要判断是否已存在在plan中
    //!!是否为本专业  
    // 修改记录
    var ischangeable=true;
    /*if (result[0].major != selectedMajor && result[0].major != "公共课") {
      console.log("Wrong Major!");
      ischangeable=false;
    }*/

    planModel.find({id: currentId}, function(err, plan) {
      if (plan.length != 1) {
        console.log("ERROR:plan.length!=1");
        return;
      }

      if (isCourse && result[0].major != selectedMajor && result[0].major != "公共课" && req.body.type == "1") { //如果存在才用result[0]
        console.log("Wrong Major!");
        output_error="非本专业课程！";
        ischangeable=false;
      }
      if(isCourse && ischangeable){
        if (result[0].type == 1) { //如果是公共课
          var isExisted = false;
          for (var j = 0; j < plan[0].p1.length; j++) {
            if (result[0].id == plan[0].p1[j]) {
              if (req.body.type == "2") { //删除
                plan[0].p1.splice(j, 1);
                plan[0].isC1.splice(j, 1);
              }
              isExisted = true;
              break;
            }
          }
          if (req.body.type == "1" && !isExisted) { //添加
            plan[0].p1.push(result[0].id);
            plan[0].isC1.push(0);
          }
        } else if (result[0].type == 2) { //如果是专业必修课
          var isExisted = false;
          for (var j = 0; j < plan[0].p2.length; j++) {
            if (result[0].id == plan[0].p2[j]) {
              if (req.body.type == "2") {
                plan[0].p2.splice(j, 1);
                plan[0].isC2.splice(j, 1);
              }
              isExisted = true;
              break;
            }
          }
          if (req.body.type == "1" && !isExisted) {
            plan[0].p2.push(result[0].id);
            plan[0].isC2.push(0);
          }
        } else { //专业选修课
          var isExisted = false;
          for (var j = 0; j < plan[0].p3.length; j++) {
            if (result[0].id == plan[0].p3[j]) {
              if (req.body.type == "2") {
                plan[0].p3.splice(j, 1);
                plan[0].isC3.splice(j, 1);
              }
              isExisted = true;
              break;
            }
          }
          if (req.body.type == "1" && !isExisted) {
            plan[0].p3.push(result[0].id);
            plan[0].isC3.push(0);
          }
        }
        plan[0].save(function(err) {});
      } 

      //公共课
      if ((plan[0].p1).length == 0){
        ok1 = true;
        isRender();
      }
      for (var i = 0; i < (plan[0].p1).length; i++) {
        //嵌套查询
        (function(i) {
          courseModel.find({id: (plan[0].p1)[i]}, function(error, nresult) {
            if (error) console.log(error);
            else console.log(nresult);

            if (nresult.length == 1) {
              if (nresult[0].subtype == "思政类课程")
                credit1_1 += nresult[0].credit;
              else if (nresult[0].subtype == "体育类课程")
                credit1_2 += nresult[0].credit;
              else if (nresult[0].subtype == "语言类课程")
                credit1_3 += nresult[0].credit;
              else
                credit1_4 += nresult[0].credit;
              my_dev_plan_gen.push({
                ID: nresult[0].id,
                name: nresult[0].name,
                time: nresult[0].time,
                credit: nresult[0].credit,
                complete: plan[0].isC1[i],
                classi: nresult[0].subtype
              });
            } //if end
            if (my_dev_plan_gen.length == (plan[0].p1).length) {
              ok1 = true;
              isRender();
            }
          }); //find end - course
        })(i); //function end
      }
      console.log(1);

      //专业选修课
      /*var ok2 = false;
      var credit3 = 0;
      var my_dev_plan_elec_tmp = [];*/
      if ((plan[0].p3).length == 0){
        ok2 = true;
        isRender();
      }
      for (var i = 0; i < (plan[0].p3).length; i++) {
        //嵌套查询
        (function(i) {
          courseModel.find({
            id: plan[0].p3[i]
          }, function(error, nresult) {
            if (error) console.log(error);
            else console.log(nresult);

            if (nresult.length == 1) {
              var flag = 0;
              for (var j = 0; j < my_dev_plan_elec_class.length; j++) {
                if (nresult[0].subtype == my_dev_plan_elec_class[j].classification) {
                  flag = 1;
                  break;
                }
              }
              if (flag == 0) {
                my_dev_plan_elec_class.push({
                  classification: nresult[0].subtype,
                  min_credits: "20",
                  credits: "18"
                }); //min_credit和credits没用的！！
              }
              //把所有专业选修课的数据读进内存
              my_dev_plan_elec_tmp.push({
                ID: nresult[0].id,
                name: nresult[0].name,
                time: nresult[0].time,
                credit: nresult[0].credit,
                complete: plan[0].isC2[i],
                classi: nresult[0].subtype
              });
              credit3 += nresult[0].credit;
            }
            if (my_dev_plan_elec_tmp.length == (plan[0].p3).length) {
              ok2 = true;
              isRender();
            }
          }); //find end
        })(i);
      }

      for (var m = 0; m < my_dev_plan_elec_class.length; m++) {
        var tmp = [];
        for (var i = 0; i < my_dev_plan_elec_tmp.length; i++) {
          if (my_dev_plan_elec_tmp[i].classi == dev_plan_elec_class[m]) {
            tmp.push(my_dev_plan_elec_tmp[i]);
          }
        }
        my_dev_plan_elec.push(tmp);
      }
      console.log(2);

      //专业必修
      if((plan[0].p2).length==0){
        ok3=true;
        isRender();
      }
      for (var i = 0; i < (plan[0].p2).length; i++) {
        //嵌套查询
        (function(i) {
          courseModel.find({id: plan[0].p2[i]}, function(error, nresult) {
            if (error) console.log(error);
            else console.log(nresult);

            if (nresult.length == 1)
              my_dev_plan_req.push({
                ID: nresult[0].id,
                name: nresult[0].name,
                time: nresult[0].time,
                credit: nresult[0].credit,
                complete: plan[0].isC2[i]
              });

            credit2 += nresult[0].credit;
            if (my_dev_plan_req.length == (plan[0].p2).length){
              ok3=true;
              isRender();
            }
          });
        })(i);
      }
      console.log(3);

    });//find end - plan
  }); //find end - course
}); //post end

//////////////////////////修改培养方案//////////////////////////
////GET////
router.get('/edit_dev_plan', function(req, res, next){
  console.log(req.body);
  var userType;
  switch (req.session.user.status.toString()){
    case '学生':userType=0;break;
    case '教师':userType=1;break;
    case '系统管理员':userType=2;break;
  }
  var currentId=req.session.user.userid;

  var major = [];//专业
  var majorModel = require('../../db/courseDB/majorSchema');
  var major_name = "";

  var dev_plan_elec_class = [];
  var dev_plan_gen_class=[];

  var dev_plan_gen = [];
  var dev_plan_req = [];
  var dev_plan_elec = new Array();
  var dev_plan_elec_tmp = [];
  var courseModel = require('../../db/courseDB/courseSchema_hyx');

  majorModel.find({}, function(error, result) {
    if (error) console.log(error);
    else console.log(result);
    
    for(var i=0;i<result.length;i++){
      if(result[i].name!="公共课"){
        major.push(result[i].name);
        major_name=major[0];
        if(result[i].name == major_name){
          for(var j=0;j<(result[i].field).length;j++){
            dev_plan_elec_class.push({classification: (result[i].field)[j], min_credits: "20", credits: "18"});
          }
          courseModel.find({major: {$in: [major_name, "公共课"]} }, function(error, result) {
            if (error) console.log(error);
            else console.log(result);

            for (var i = 0; i < result.length; i++) {
              if (result[i].type == 1) {//公共课, dev_plan页面似乎不用公共课的list
                dev_plan_gen.push({
                  ID: result[i].id,
                  name: result[i].name,
                  time: result[i].time,
                  credit: result[i].credit,
                  complete: false
                });
              } else if (result[i].type == 2) {//专业必修
                dev_plan_req.push({
                  ID: result[i].id,
                  name: result[i].name,
                  time: result[i].time,
                  credit: result[i].credit,
                  complete: false
                });
              } else {//3, 专业选修
                //数据存入内存
                dev_plan_elec_tmp.push({
                  ID: result[i].id,
                  name: result[i].name,
                  time: result[i].time,
                  credit: result[i].credit,
                  complete: false,
                  subtype: result[i].subtype
                });
              }
            }
            
            //专业选修分类
            for (var m = 0; m < dev_plan_elec_class.length; m++) {
              var tmp = [];
              for (var i = 0; i < dev_plan_elec_tmp.length; i++) { 
                if (dev_plan_elec_tmp[i].subtype == dev_plan_elec_class[m].classification) {
                  tmp.push({
                    ID: dev_plan_elec_tmp[i].ID,
                    name: dev_plan_elec_tmp[i].name,
                    time: dev_plan_elec_tmp[i].time,
                    credit: dev_plan_elec_tmp[i].credit,
                    complete: dev_plan_elec_tmp[i].complete
                  });
                }
              }
              dev_plan_elec.push(tmp);
            }
            res.render('select/edit_dev_plan', {
              type:userType,//manager
              name: '程序员', 
              image: 'images/avatars/avatar3.jpg',
              total_a:'12',
              a:'2,3,1,2,3,1,0',
              total_b:'24',
              b:'4,6,2,4,6,2,0',
              total_credits:'24',
              credits:'4,6,2,4,6,2,0',
              major:major,
              major_name:major_name,
              dev_plan_gen:dev_plan_gen_class,
              dev_plan_elec:dev_plan_elec,
              dev_plan_elec_class:dev_plan_elec_class,
              dev_plan_req:dev_plan_req
            });
            
          });//course - find end
        }
      }
      else{
        for(var j=0;j<(result[i].field).length;j++)
          dev_plan_gen_class.push({name:(result[i].field)[j],min_credits:(result[i].mincredit)[j],credits:"0"});
      }
    }
  });//major find end
});//get end

////POST////
//搜索专业培养方案 & 保存修改
router.post('/edit_dev_plan', function(req, res, next){
  console.log(req.body);
  var major_name = req.body.major_name;
  var major = [];//专业
  var dev_plan_gen_class=[];
  var dev_plan_elec_class = [];
  var majorModel = require('../../db/courseDB/majorSchema');
  //修改 - 公共课最低学分 - ok!
  //增/删/改 - 专业选修类别 - ok!
  majorModel.find({}, function(error, result) {
    if (error) console.log(error);
    else console.log(result);
    
    for(var i=0;i<result.length;i++){
      if(result[i].name!="公共课")
        major.push(result[i].name);
      else{//公共课类别
        for(var j=0;j<result[i].field.length;j++){
          //有修改数据 - 公共课 - ok!
          if(req.body.gen0){
            switch(j){
              case 0:result[i].mincredit.splice(j,1,parseFloat(req.body.gen0)); break;
              case 1:result[i].mincredit.splice(j,1,parseFloat(req.body.gen1)); break;
              case 2:result[i].mincredit.splice(j,1,parseFloat(req.body.gen2)); break;
              case 3:result[i].mincredit.splice(j,1,parseFloat(req.body.gen3)); break;
            }
          }
          dev_plan_gen_class.push({name:(result[i].field)[j],min_credits:(result[i].mincredit)[j],credits:"0"});
        }
        result[i].save(function(err) {});
      }

      if (result[i].name == major_name) { //专业选修课类别  
        //增加/删除 - 专业选修类别 - ok!
        if(req.body.new_class){
          console.log("class changes!");
          if(req.body.choice=="add")
            result[i].field.push(req.body.new_class);
          else{//"del"
            for(var j=0;j<(result[i].field).length; j++){
              if(result[i].field[j]==req.body.new_class)
                result[i].field.splice(j,1);
            }
          }
          result[i].save(function(err) {});
        }
        //修改 - 专业选修类别 - ok!
        if(req.body.classNameinput){
          result[i].field.splice(parseInt(req.body.elec_class),1,req.body.classNameinput);
          result[i].save();
        }

        for (var j = 0; j < (result[i].field).length; j++) {
          dev_plan_elec_class.push({classification: (result[i].field)[j], min_credits: "20", credits: "18"});
        }
      }
    }
  });
 
  var dev_plan_gen = [];
  var dev_plan_req = [];
  var dev_plan_elec = new Array();
  var dev_plan_elec_tmp = [];
  var courseModel = require('../../db/courseDB/courseSchema_hyx');
  

  //删除 - 专业必修课 - ok!
  if (req.body.req_del instanceof Array) {
    //upsert选项：如果不存在就插入
    for (var i = 0; i < req.body.req_del.length; i++) {
      courseModel.update({id: req.body.req_del[i]}, {$set:{major:""}}, {upsert: false}, function(err, docs) {
        if (err) console.log(err);
        else console.log("deleted!");
      });
    }
  }
  else if(req.body.req_del){
    courseModel.update({id: req.body.req_del}, {$set:{major:""}}, {upsert: false}, function(err, docs) {
      if (err) console.log(err);
      else console.log("deleted!");
    });
  }

  //修改/添加 - 专业必修课 - ok!
  if(req.body.reqIDinput instanceof Array){
    for(var i=0;i<req.body.reqIDinput.length;i++){
      courseModel.update({id: req.body.reqIDinput[i]}, 
        {$set:{
          //name: req.body.reqNameinput[i], 
          time: req.body.reqTimeinput[i], 
          //credit: req.body.reqCreditinput[i], 
          type: 2,
          major:major_name}
        }, 
        {upsert: false}, function(err, docs) {
        if (err) console.log(err);
        else console.log("update!");
      });
    }
  }
  else if(req.body.reqIDinput){
    courseModel.update({id: req.body.reqIDinput}, 
      {$set:{
        //name: req.body.reqNameinput, 
        time: req.body.reqTimeinput, 
        //credit: req.body.reqCreditinput, 
        type: 2,
        major:major_name}
      }, 
      {upsert: false}, function(err, docs) {
      if (err) console.log(err);
      else console.log("update!");
    });
  }

  //删除 - 专业选修课
  if(req.body.elec_del instanceof Array){
    for (var i = 0; i < req.body.elec_del.length; i++) {
      courseModel.update({id: req.body.elec_del[i]}, {$set:{major:""}}, {upsert: false}, function(err, docs) {
        if (err) console.log(err);
        else console.log("deleted!");
      });
    }
  }
  else if(req.body.elec_del){
    courseModel.update({id: req.body.elec_del}, {$set:{major:""}}, {upsert: false}, function(err, docs) {
      if (err) console.log(err);
      else console.log("deleted!");
    });
  }

  //修改/添加 - 专业选修课 - ok!
  if(req.body.elecIDinput instanceof Array){
    for(var i=0;i<req.body.elecIDinput.length;i++){
      courseModel.update({id: req.body.elecIDinput[i]}, 
        {$set:{
          //name: req.body.elecNameinput[i], 
          time: req.body.elecTimeinput[i], 
          //credit: req.body.elecCreditinput[i], 
          type: 3,
          subtype: req.body.classNameinput,
          major:major_name}
        }, 
        {upsert: false}, function(err, docs) {
        if (err) console.log(err);
        else console.log("updated!");
      });
    }
  }
  else if(req.body.elecIDinput){
      courseModel.update({id: req.body.elecIDinput}, 
        {$set:{
          //name: req.body.elecNameinput, 
          time: req.body.elecTimeinput, 
          //credit: req.body.elecCreditinput, 
          type: 3,
          subtype: req.body.classNameinput,
          major:major_name}
        }, 
        {upsert: false}, function(err, docs) {
        if (err) console.log(err);
        else console.log("updated!");
      });
  }

  courseModel.find({major: {$in: [major_name, "公共课"]} }, function(error, result) {
    if (error) console.log(error);
    //else console.log(result);

    for (var i = 0; i < result.length; i++) {
      if (result[i].type == 1) {//公共课, dev_plan页面似乎不用公共课的list
        dev_plan_gen.push({
          ID: result[i].id,
          name: result[i].name,
          time: result[i].time,
          credit: result[i].credit,
          complete: false
        });
      } else if (result[i].type == 2) {//专业必修
        dev_plan_req.push({
            ID: result[i].id,
            name: result[i].name,
            time: result[i].time,
            credit: result[i].credit,
            complete: false
          });
      } else {//3, 专业选修
        dev_plan_elec_tmp.push({
          ID: result[i].id,
          name: result[i].name,
          time: result[i].time,
          credit: result[i].credit,
          complete: false,
          subtype: result[i].subtype
        });
      }
    }
    
    //专业选修分类
    for (var m = 0; m < dev_plan_elec_class.length; m++) {
      var tmp = [];
      for (var i = 0; i < dev_plan_elec_tmp.length; i++) { //每个子类一一匹配，好麻烦
        if (dev_plan_elec_tmp[i].subtype == dev_plan_elec_class[m].classification) {
          tmp.push({
            ID: dev_plan_elec_tmp[i].ID,
            name: dev_plan_elec_tmp[i].name,
            time: dev_plan_elec_tmp[i].time,
            credit: dev_plan_elec_tmp[i].credit,
            complete: dev_plan_elec_tmp[i].complete
          });
        }
      }
      dev_plan_elec.push(tmp);
    }

    res.render('select/edit_dev_plan', {
      type:userType,//manager
      name: '程序员', 
      image: 'images/avatars/avatar3.jpg',
      total_a:'12',
      a:'2,3,1,2,3,1,0',
      total_b:'24',
      b:'4,6,2,4,6,2,0',
      total_credits:'24',
      credits:'4,6,2,4,6,2,0',
      major:major,
      major_name:major_name,
      dev_plan_gen:dev_plan_gen_class,
      dev_plan_elec:dev_plan_elec,
      dev_plan_elec_class:dev_plan_elec_class,
      dev_plan_req:dev_plan_req
    });
  });//find end
});//post end

module.exports = router;
