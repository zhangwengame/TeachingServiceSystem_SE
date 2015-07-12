var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 
var ClassroomModel = require('../../db/group2db/ClassroomModel');

var tmp = {
    classid2 : "教7-201",
    campus : "玉泉",
    capacity : "100",
    facility : "习近平"    
};

router.get('/classroominsert', function(req, res,next) {
//    if(!req.session.user){return res.redirect('../info/login');}
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
    res.render('arrange/classroominsert',{
        type:status,
        data : tmp,
        insertresult:'请提交表单'
    });
});

router.post('/classroominsert',function(req,res,next){
    console.log("post:classroominsert");
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
        campus : req.body.campus,
        capacity : req.body.capacity,
        facility : req.body.facility,
    };
    
    var classidErr= '';
    var capacityErr = '';
    var facilityErr = '';
    console.log("doc length : "+doc.length);
    console.log("doc : "+doc);
    console.log("doc courseid2: "+doc.classid2);
    
    if(doc.classid2 == '')
    {
        classidErr = 'Classroom Name empty!';
    }
    else if(doc.facility == '')
    {
        facilityErr = 'Facility empty!';
    }
    else if(doc.capacity == '')
    {
        capacityErr = 'Capacity empty!';
    }
    
    for(var i = 0, capacity = doc.capacity; i < capacity.length; i++){
        if(capacity.charAt(i)>'9' || capacity.charAt(i) < '0'){
            capacityErr = 'Capacity is not a number!';
            break;
        }
    }
    
    if(capacityErr == '')
    {
        if(capacity > 500)
        {
            capacityErr = 'Capacity is too large';
        }
    }
    if(classidErr!= '' || facilityErr !='' || capacityErr !='')
    {
       res.render('arrange/classroominsert',{
            type:status,
            data:doc,
            insertresult:'填写的信息错误'
        });
        return;
    }
    else
    {
        ClassroomModel.findbyic(doc.classid2,doc.campus,function (err, data)
        {
            if (err)
            {
                console.log('find error!'+err);
            }
            if (data != '' )
            {
                classidErr = "ID used!";
            }
            if(classidErr !=''){
                    res.render('arrange/classroominsert',{
                        type:status,
                        data:doc,
                        insertresult: '已经存在的教室'
                    });
                return;
            }
            else{
                ClassroomModel.create(doc,function(err,data){
                if(err){
                    console.log("create err : "+err);
                }
                else{
                    console.log('Saved by Model OK!');
                    console.log(data);
                    res.render('arrange/classroominsert',{
                        type:status,
                        data : doc,
                        insertresult:'表单提交成功！'
                        });
                    }
                });
              }
        });
    }
});

module.exports = router;
