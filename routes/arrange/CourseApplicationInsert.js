var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var PersonModel = require('../../db/group1db/PersonModel');
var CourseModel = require('../../db/group1db/CourseModel');
var ClassroomModel = require('../../db/group2db/ClassroomModel');
var CourseApplicationModel = require('../../db//group2db/CourseApplicationModel');




//mongoose.connect('mongodb://localhost/hello-world');

//var mongo = require('mongodb').MongoClient;
//var uri = "mongodb://segroup2:segroup2@ds041168.mongolab.com:41168/group2"


/*mongo.connect(uri.function(err,db))
{
    if (err) {
        console.log("读数据库失败啦");
        return ;
    }
}
*/
var tmp = {
    courseid2	: "J523001",	//课程ID
    coursename  : "软件工程",	//课程名称
    courseterm  : "2014秋冬",  //课程学期
    coursetime	: "1,2,3",	//上课时间 ?!
    coursescore	: "4.5",	//课程学分
    status      : "pending", //申请状态； 尚在处理中为 on， 处理结束改为off
    teacher     : "MR.J",	//授课老师
    examtime	: "2014-7-10",	//考试时间
    room        : "教7-501",	//上课教室
    campus      : "玉泉校区",  //上课校区
    college     : "计算机学院",	//开课学院
    time     :  Date.now	//创建时间

};
/*
db.CourseApplication.save(
    {courseid2:'J523001',coursename:'软件工程', courseterm:'2014秋' , coursetime:'周一1,2', coursescore:'4.5', status:'pending', teacher:'MR.J',
examtime:'2015-7-10', room:'教7-501',campus:'玉泉校区',college:'计算机学院',time:'2015-2-3'})
*/

router.get('/CourseApplicationInsert', function(req, res,next) {
//    if(!req.session.user){return res.redirect('../info/login');}
    var status;
	switch (req.session.user.status.toString()){
	    case '学生':status = 0;
	                res.redirect("../../login");
	                break;
	    case '教师':status = 1;
	                // res.redirect("../../login");
	                break;
	    case '系统管理员':status = 2;break;
  	}
    res.render('arrange/CourseApplicationInsert',{
        type:status,
        data : tmp,
        insertresult:'请提交申请'
    });
});

router.post('/CourseApplicationInsert',function(req,res,next){
    console.log("post:CourseApplicationInsert");
    console.log("num of courses");
    var status;
	switch (req.session.user.status.toString()){
	    case '学生':status = 0;
	                res.redirect("../../login");
	                break;
	    case '教师':status = 1;
	                // res.redirect("../../login");
	                break;
	    case '系统管理员':status = 2;break;
  	}
           // if ID号不存在COURSE数据库里，返回错误信息！ 这有问题，读不出course里的东西
           // console.log(CourseModel.find().count({courserid:doc.courseid2}));
    console.log(req.body.courseid2);
    CourseModel.find({courseid2:req.body.courseid2},function(err,dataa){
        if(dataa=='')
        {
            console.log('The course not exit!');
            res.render('arrange/CourseApplicationInsert',{
                type:status,
                data : tmp,
                insertresult:'不存在的课程！'
            });
        }
                else {
            console.log('Saved by Model OK!');
            var doc = {
                courseid2: req.body.courseid2,
                coursetime: req.body.time,
                room: req.body.room,
                campus: req.body.campus,
                time: req.body.time
            };
            console.log("doc length : " + doc.length);
            console.log("doc : " + doc);
            console.log("doc courseid2: " + doc.courseid2);
            if (doc.campus == undefined || doc.courseid2 == undefined || doc.coursetime == undefined || doc.room == undefined) //坑爹啊！ undefined<>null！！
                res.render('arrange/CourseApplicationInsert', {
                    type:status,
                    data: doc,
                    insertresult: '请完整填写信息！'
                });
            else {
                var tmpstring;
                console.log(doc.coursetime);
                console.log(doc.coursetime.length);
                console.log(doc.coursetime[0].length);// 多个时间仍需调试！！ 该值不为1，说明选择啦多个时间，需要拆开来存！ 还没写。
                if (doc.coursetime[0] == '1') tmpstring = '周一';
                else if (doc.coursetime[0] == '2') tmpstring = '周二';
                else if (doc.coursetime[0] == '3') tmpstring = '周三';
                else if (doc.coursetime[0] == '4') tmpstring = '周四';
                else if (doc.coursetime[0] == '5') tmpstring = '周五';
                else if (doc.coursetime[0] == '6') tmpstring = '周六';
                else if (doc.coursetime[0] == '7') tmpstring = '周日';

                if (doc.coursetime[1] == '1') tmpstring = tmpstring + '第1,2节课';
                else if (doc.coursetime[1] == '2') tmpstring = tmpstring + '第3,4,5节课';
                else if (doc.coursetime[1] == '3') tmpstring = tmpstring + '第6,7节课';
                else if (doc.coursetime[1] == '4') tmpstring = tmpstring + '第8,9,10节课';
                else if (doc.coursetime[1] == '5') tmpstring = tmpstring + '晚上';
                console.log(tmpstring);
                doc.coursetime = tmpstring;
                if (doc.coursetime == undefined) {
                    res.render('arrange/CourseApplicationInsert', {
                        type:status,
                        data: doc,
                        insertresult: '请选择有且仅有一个申请调课时间段'
                    });
                }
                else {
                    ClassroomModel.findbyid(req.body.room, function (error, data) {
                        if (error) {
                            console.log('find error!' + error);
                        }
                        else {
                            console.log('find classroom ok!' + data);
                            if (data == '')
                                res.render('arrange/CourseApplicationInsert', {
                                    type:status,
                                    data: doc,
                                    insertresult: '不存在的教室！！'
                                });
                            else
                                CourseApplicationModel.create(doc, function (err, data) {
                                    if (err) {
                                        console.log("create err : " + err);
                                        res.render('arrange/CourseApplicationInsert', {
                                            type:status,
                                            data: doc,
                                            insertresult: '错误的申请信息！'
                                        });
                                    }
                                    else
                                        res.render('arrange/CourseApplicationInsert', {
                                            type:status,
                                            data: doc,
                                            insertresult: '调课申请成功！'
                                        });
                                });
                        }
                    })
                }
            }
        }
        });

    });
//    db.close();

module.exports = router;

