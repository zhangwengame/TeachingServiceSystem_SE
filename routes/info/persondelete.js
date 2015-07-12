var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 
var PersonModel = require('../../db/group1db/PersonModel');
var CourseModel = require('../../db/group1db/CourseModel');

router.get('/', function(req, res,next) {
    res.render('info/persondelete',{
        deleteresult:'请提交表单'
    });
});

router.post('/',function(req,res,next){
    console.log("post:persondelete");
    PersonModel.findbyid(req.body.userid, function(error, user){
        if(error){
            console.log('find by userid error!'+error);
        }
        else if (!user){
            console.log('not found by userid!'+error);
            return res.render('info/persondelete',{
                deleteresult:'学工号不存在'
            });
        }
        else{
            PersonModel.deletebyid(req.body.userid, function(error, data){
                console.log('data : '+data);
                if(error) {
                    console.log('delete error!'+error);
                    res.render('info/persondelete',{
                        deleteresult:'用户删除失败'
                    });
                }
                else{
                   for(i=0;i<user.cstlist.length;i++){
                       CourseModel.remove(
                           {courseid:user.cstlist[i]},
                           function(err,data2){
                               if(err) console.log("remove user.cstlist[i] failed!");
                           }
                       );
                   }
                   res.render('info/persondelete',{
                       deleteresult:'用户删除成功'
                   });
                }
            });
        }
    });
});

module.exports = router;