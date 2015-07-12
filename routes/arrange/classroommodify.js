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

router.get('/classroommodify', function(req, res,next) {
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
    res.render('arrange/classroommodify',{
        type:status,
        data : tmp,
        modifyresult:'请提交表单'
    });
});

router.post('/classroommodify',function(req,res,next){
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
       res.render('arrange/classroommodify',{
            type:status,
            data:doc,
            modifyresult:'填写数据不符合标准'
        });
        return;
    }
    else
    {
        ClassroomModel.findbyid(doc.classid2,function (err, data)
        {
            if (err)
            {
                console.log('find error!'+err);
            }
            if (data == '' )
            {
                classidErr = "Classroom doesn't exist.";
            }
            if(classidErr !=''){
                    res.render('arrange/classroommodify',{
                    type:status,
                    data:doc,
                    modifyresult: '教室不存在'
                    });
                return;
            }
            else{
                ClassroomModel.modifybyid(doc,function(err,data){
                    if(err){
                        console.log("modify err : "+err);
                    }
                    else{
                        console.log(data);
                        res.render('arrange/classroommodify',{
                            type:status,
                            data : doc,
                            modifyresult:'表单提交成功！'
                        });
                    }
                });
              }
        });
    }

//    db.close();
});

module.exports = router;