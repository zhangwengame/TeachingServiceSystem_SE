var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 
var ClassroomModel = require('../../db/group2db/ClassroomModel');

router.get('/classroomdelete', function(req, res,next) {
    var status;
	switch (req.session.user.status.toString()){
	    case '学生':status = 0;
	                res.redirect("../../login");
	                break;
	    case '教师':status = 1;
	                res.redirect("../../login");
	                break;
	    case '系统管理员':status = 2;break;
  	}
    res.render('arrange/classroomdelete',{
        type:status,
        deleteresult:'请提交表单'
    });
});

router.post('/classroomdelete',function(req,res,next){
    
    var status;
	switch (req.session.user.status.toString()){
	    case '学生':status = 0;
	                res.redirect("../../login");
	                break;
	    case '教师':status = 1;
	                res.redirect("../../login");
	                break;
	    case '系统管理员':status = 2;break;
  	}
    var doc = {
        classid2 : req.body.classid2,
        campus : req.body.campus
    };
    var classidErr='';
    ClassroomModel.findbyic(doc.classid2,doc.campus,function (err, data)
    {
        if (err)
        {
            console.log('find error!'+err);
        }
        if (doc.classid2=='')
        {
            classidErr = "Classroom Name Empty!";
        }
        if (data == '' )
        {
            classidErr = "Not exist!";
        }
        if(classidErr !=''){
                res.render('arrange/classroomdelete',{
                    type:status,
                    deleteresult: '不存在的教室'
                });
            return;
        }
        else
        {
            ClassroomModel.deletebyic(req.body.classid2,req.body.campus, function(error, data){
                console.log('data:'+data);
                res.render('arrange/classroomdelete',{
                    type:status,
                    deleteresult:'教室删除成功'
                });
            });
        }
    });
});

module.exports = router;