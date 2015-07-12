var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var PersonModel = require('../../db/group1db/PersonModel');
var CourseModel = require('../../db/group1db/CourseModel');
var ClassroomModel = require('../../db/group2db/ClassroomModel');
var CourseApplicationModel = require('../../db//group2db/CourseApplicationModel');

var tmp;
router.get('/arrange_course_management', function(req, res,next) {
//    if(!req.session.user){return res.redirect('../info/login');}
    var status;
    switch (req.session.user.status.toString()){
        case '学生':status = 0;
                    res.redirect("../../login");
                    break;
        case '教师':status = 1;
                    break;
        case '系统管理员':status = 2;break;
    }
    CourseApplicationModel.findbystatus('pending',function(error,data1){
        CourseApplicationModel.findbystatus('accept',function(error,data2){
            CourseApplicationModel.findbystatus('deny',function(error,data3){
                //console.log('pending:' + data1);
               // console.log('accept:' + data2);
               // console.log('deny:' + data3);
                console.log('start!');
                
                res.render('arrange/arrange_course_management',{
                    type:status,
                    pending: data1,
                    accepted: data2,
                    deny: data3
                   // insertresult:'���ύ��'
                });
            })
        })
    })
});

router.post('/arrange_course_management',function(req,res,next){
    var status;
    switch (req.session.user.status.toString()){
        case '学生':status = 0;
                    res.redirect("../../login");
                    break;
        case '教师':status = 1;
                    break;
        case '系统管理员':status = 2;break;
    }
    console.log("post:arrange_course_management");
    console.log(req.body.type.substring(1,100));
    console.log('1');
    if (req.body.type[0]=='y')
    {
        console.log('2');
        console.log('accept')
        CourseApplicationModel.find({_id: req.body.type.substring(1,100)},function(err,dataa) {
            CourseApplicationModel.update({_id: req.body.type.substring(1, 100)}, {$set: {status: 'accept'}}, function (err, data) {
                if (err) console.log(err);
                else {
                    //   console.log(data);
                    //����ͬ���Ŀγ�����ֱ����Ϊdeny��
                    //����course
                    console.log('3');
                    console.log('same or not');
                    console.log(data._id);
                    CourseModel.update({courseid2:dataa[0].courseid2},{$set:{coursetime: dataa[0].coursetime,campus:dataa[0].campus,room:dataa[0].room}},function(xxx,zzz){
                        if (xxx) console.log(xxx);
                            else
                        {
                            console.log(zzz);
                            console.log("trying to update others!!!!!")
                            console.log(dataa);
                            console.log(dataa[0].courseid2);
                            CourseApplicationModel.update({
                                    courseid2: dataa[0].courseid2,
                                    status: 'pending'
                                }, {$set: {status: 'deny'}},{multi:true}, function (a, b) {
                                    if (a) console.log(a);
                                    else
                                    {
                                        console.log(b);
                                        CourseApplicationModel.findbystatus('pending',function(error,data11){
                                            CourseApplicationModel.findbystatus('accept',function(error,data22){
                                                CourseApplicationModel.findbystatus('deny',function(error,data33){
                                                    console.log('pending:' + data11.length);
                                                    console.log('accept:' + data22.length);
                                                    console.log('deny:' + data33.length);
                                                    console.log('5');
                                                    res.render('arrange/arrange_course_management',{
                                                        type:status,
                                                        pending: data11,
                                                        accepted: data22,
                                                        deny: data33
                                                        // insertresult:'���ύ��'
                                                    });
                                                })
                                            })
                                        });
                                    }
                                }
                            );
                        }
                    })

                }
            });
        });
    }
        else
             if (req.body.type[0]=='n')
                {
                    console.log('deny');
                    CourseApplicationModel.update({_id: req.body.type.substring(1, 100)}, {$set: {status: 'deny'}}, function (err, data) {
                        CourseApplicationModel.findbystatus('pending',function(error,data11){
                            CourseApplicationModel.findbystatus('accept',function(error,data22){
                                CourseApplicationModel.findbystatus('deny',function(error,data33){
                                    console.log('pending:' + data11.length);
                                    console.log('accept:' + data22.length);
                                    console.log('deny:' + data33.length);
                                    console.log('5');
                                    res.render('arrange/arrange_course_management',{
                                        type:status,
                                        pending: data11,
                                        accepted: data22,
                                        deny: data33
                                        // insertresult:'���ύ��'
                                    });
                                })
                            })
                        });
                    });
                }
            else
             {
                 console.log('delete');
                 console.log(req.body.type);
                 //var obj_id = BSON.ObjectID.createFromHexString(req.body.type);
                 //console.log(obj_id);
                 CourseApplicationModel.remove({_id:req.body.type},function(txt1,txtb) {
                     if (txt1) {
                         console.log(txt1);
                         console.log('fail?');
                     } else {
                         console.log(txtb);
                         console.log('ɾ����');
                         CourseApplicationModel.update({_id: req.body.type.substring(1, 100)}, {$set: {status: 'deny'}}, function (err, data) {
                             CourseApplicationModel.findbystatus('pending',function(error,data11){
                                 CourseApplicationModel.findbystatus('accept',function(error,data22){
                                     CourseApplicationModel.findbystatus('deny',function(error,data33){
                                         console.log('pending:' + data11.length);
                                         console.log('accept:' + data22.length);
                                         console.log('deny:' + data33.length);
                                         console.log('5');
                                         res.render('arrange/arrange_course_management',{
                                             type:status,
                                             pending: data11,
                                             accepted: data22,
                                             deny: data33
                                             // insertresult:'���ύ��'
                                         });
                                     })
                                 })
                             });
                         });
                     }
                 });
             }
/*
    console.log( req.body.type.substring(1,100));
    CourseApplicationModel.find({_id: req.body.type.substring(1,100)},function(errr,tmpdata) {
        console.log('just give a try');
        console.log('4');
        if (errr) console.log('fail');
            else console.log(tmpdata);
    });*/

});

module.exports = router;

