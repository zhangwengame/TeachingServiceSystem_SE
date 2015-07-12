var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 
var CourseModel = require('../../db/group1db/CourseModel');
var PersonModel = require('../../db/group1db/PersonModel');

router.get('/', function(req, res,next) {
    res.render('info/coursedelete',{
        deleteresult:'请提交表单'
    });
});

router.post('/',function(req,res,next){
    if(!req.body.courseid2){
        return res.render('info/coursedelete',{
            deleteresult:'课程ID不能为空'
        });
    }
    
    /* 查找courseid2对应课程是否存在 */
    CourseModel.findbyid(req.body.courseid2, function(error, data){
        if(error) {
            console.log('find courseid2 error!'+error);
        } else {
            console.log('find courseid2 ok!'+data);
        }
        console.log('data : '+data.length);
        if(!data | data ==''){
            /* 查找courseid2结果为空 */
            return res.render('info/coursedelete',{
                deleteresult:'课程ID不存在'
            });
        }
        /* 如果有courseid输入 */
        else if(req.body.courseid){
            /* 查找courseid对应课程是否存在 */
            CourseModel.findOne({courseid:req.body.courseid},function(err,data2){
                if(err){
                    console.log("find courseid error!"+err);
                    return res.render('info/coursedelete',{
                        deleteresult:'查找唯一ID对应课程错误'
                    });
                }
                /* 查找courseid结果为空 */
                if(!data2){
                    return res.render('info/coursedelete',{
                        deleteresult:'唯一ID不存在'
                    });
                }
                else{
                    /* 删除对应courseid的课程 */
                    CourseModel.remove({courseid:req.body.courseid},function(err,data3){
                        if(err){
                            console.log("remove by courseid error!"+err);
                            return res.render('info/coursedelete',{
                                deleteresult:'通过唯一ID删除课程失败'
                            });
                        }
                        /**同时删除对应教师的课程列表中对应信息 */
                        else{
                            PersonModel.update(
                                {userid:data2.teacher},
                                {
                                    $pop:{
                                        'cstlist':data2._id.toString()
                                    }
                                },
                                function(err,data4){
                                    if(err){ console.log('update err'); }
                                }
                            );
                            return res.render('info/coursedelete',{
                                deleteresult:'课程删除成功！'
                            });
                        }
                    });
                }
            });
        }
        else{
            CourseModel.deletebyid(req.body.courseid2, function(error, data5){
                if(error) {
                    console.log('find error!'+error);
                    return res.render('info/coursedelete',{
                        deleteresult:'根据courseid2删除课程失败'
                    });
                } 
                else {
                    for(j=0;j<data.length;j++){
                        PersonModel.update(
                            {userid:data[j].teacher},
                            {
                                $pop:{
                                    'cstlist':data[j]._id.toString()
                                }
                            },
                            function(err,data6){
                                if(err){
                                    console.log('update err');
    
                                }
                            }
                        );
                    }
                    return res.render('info/coursedelete',{
                        deleteresult:'课程删除成功'
                    });
                }
            });
        }
    }); 
});

module.exports = router;