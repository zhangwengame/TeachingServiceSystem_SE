var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
//课程详细信息
//因为难以把换行符直接处理，需后端将outline每一行处理后存为数组
var courseDetail = require('../../db/courseDB/courseDetail');
router.get('/course/:courseID', function(req, res, next){
	//课程号
	var course_id = req.params.courseID;
    courseDetail.find({course_id: course_id},function(error, result){
        console.log(result);
        if (result.length>0)
            res.render('select/course_data', {
                course_id: course_id,
                course_name: result[0].course_name,
                credits: result[0].credits,
                English_name: result[0].English_name,
                academy: result[0].academy,
                catagory: result[0].catagory,
                course_data: result[0].course_data,
                course_outline: result[0].course_outline,
                name: '程序员', 
                image: '../images/avatars/avatar3.jpg'
            });
        else 
            res.render('select/course_data', {
                course_id: course_id,
                course_name: "信息未录入",
                credits: "信息未录入",
                English_name: "信息未录入",
                academy: "信息未录入",
                catagory: "信息未录入",
                course_data: "信息未录入",
                course_outline: "信息未录入",
                name: '程序员', 
                image: '../images/avatars/avatar3.jpg'
            });
    })
    
});
module.exports = router;