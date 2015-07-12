var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var PersonModel = require('../../db/group1db/PersonModel');
var CourseModel = require('../../db/group1db/CourseModel');
var formidable = require('formidable');
var fs = require('fs');

var multiparty=require('connect-multiparty');
router.use(multiparty({uploadDir:'./public', keepExtensions:true}));

router.get('/', function(req, res,next) {
    res.render('info/coursebatch',{
        insertresult:'请上传文件'
    });
});

router.post('/',function(req,res){
    if(req.files.filePic!='undefined'){ //如果有需要上传的文件
        var tempPath=req.files.filePic.path; //获取上传之后的文件路径
        fs.readFile(tempPath,'utf-8',function(err,data){
            if(err){
                console.log(err);
                fs.unlink(tempPath);
                return res.render('info/coursebatch',{
                    insertresult:'读取上传文件失败'
                });
            }
            else{
                var data2 = data.split('\n');
                var dataerr = '';
                for(i=0;i<data2.length;i++){
                    var data3 = data2[i].split(',');
                    if(data3.length!=12){
                        dataerr='第 '+i+' 行数据长度不符';
                        break;
                    }
                    // if(isNaN(data3[0])){
                    //     dataerr='第 '+i+' 行课程ID格式错误';
                    //     break;
                    // }
                    // if(isNaN(data3[3])){
                    //     dataerr='第 '+i+' 行课程学分非正整数';
                    //     break;
                    // }
                    // if(isNaN(data3[5])|isNaN(data3[6])|isNaN(data3[7])){
                    //     dataerr='第 '+i+' 行课程容量, 余量, 待选人数非正整数';
                    //     break;
                    // }
                    // if(isNaN(data3[10])){
                    //     dataerr='第 '+i+' 行教师学工号格式错误';
                    //     break;
                    // }
                    // PersonModel.find({userid:data3[10]},function(err,data6){
                    //     if(err){
                    //         // fs.unlink(tempPath);
                    //         return res.redirect('info/courseinsert',{
                    //             coursenameErr: '',
                    //             courseidErr: '',
                    //             teacherErr: '',
                    //             roomErr: '',
                    //             collegeErr: '',
                    //             examtimeErr: '',
                    //             data : tmp,
                    //             insertresult:'教师ID查找错误'
                    //         });
                    //     }
                    //     else if(!data6){
                    //         dataerr='第 '+i+' 行教师学工号不存在';
                    //         // fs.unlink(tempPath);
                    //         return res.redirect('info/courseinsert',{
                    //             coursenameErr: '',
                    //             courseidErr: '',
                    //             teacherErr: '',
                    //             roomErr: '',
                    //             collegeErr: '',
                    //             examtimeErr: '',
                    //             data : tmp,
                    //             insertresult:dataerr
                    //         });
                    //     }
                    // });
                }

                if(dataerr != ''){
                    fs.unlink(tempPath);
                    return res.render('info/coursebatch',{
                        insertresult:dataerr
                    });
                }
                else{
                    var insertresult='';
                    for(i=0;i<data2.length;i++){
                        var data3 = data2[i].split(',');
                        var doc={
                            courseid2  : data3[0],
                            coursename : data3[1],
                            courseterm : data3[2],
                            coursescore : data3[3],
                            year : data3[4],
                            all : data3[5],
                            remain : data3[6],
                            waiting : data3[7],
                            campus : data3[8],
                            college : data3[9],
                            teacher : data3[10],
                            examtime : data3[11],
                            courseid : "123"
                        }
                        CourseModel.create(doc,function(err,data4){
                            if(err){
                                console.log(err);
                                insertresult=insertresult+"创建第 "+i+" 行数据对应课程失败;";
                            }
                            else{
                                console.log("create ok"+data4.courseid2);
                                CourseModel.update(
                                    {'_id' : data4._id},
                                    { $set:{ 'courseid' : data4._id.toString() } },
                                    function(err,data5){
                                        if(err){
                                            console.log('update courseid err');
                                            insertresult=insertresult+"创建第 "+i+" 行数据对应课程_id更新失败;";
                                        }
                                    }
                                );

                                PersonModel.update(
                                  {userid:data4.teacher},
                                    { $push:{ 'cstlist':data4._id.toString() } },
                                    function(err,data5){
                                        if(err){
                                            console.log('update cstlist err');
                                            insertresult=insertresult+"创建第 "+i+" 行数据教师课程列表更新失败;";
                                        }
                                    }
                                );
                            }
                        });
                    }
                    if(insertresult=='')
                        insertresult="批量插入成功";
                    fs.unlink(tempPath);
                    return res.render('info/coursebatch',{
                        insertresult:insertresult
                    });

                }
            }
        });
    }
    else{
        return res.render('info/coursebatch',{
                    insertresult:'上传文件为空'
        });
    }
});

module.exports = router;