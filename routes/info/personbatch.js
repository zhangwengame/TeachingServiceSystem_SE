var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var PersonModel = require('../../db/group1db/PersonModel');
var formidable = require('formidable');
var fs = require('fs');

var multiparty=require('connect-multiparty');
router.use(multiparty({uploadDir:'./public', keepExtensions:true}));

router.get('/', function(req, res,next) {
    res.render('info/personbatch',{
        insertresult:'请上传文件'
    });
});

router.post('/',function(req,res){
    if(req.files.filePic!='undefined'){ //如果有需要上传的文件
        console.log("upload1");
        var tempPath=req.files.filePic.path; //获取上传之后的文件路径
        fs.readFile(tempPath,'utf-8',function(err,data){
            if(err){
                console.log(err);
                fs.unlink(tempPath);
                return res.redirect('info/personbatch',{
                    insertresult:'读取上传文件失败'
                });
            }
            else{
                console.log("read1");
                var data2 = data.split('\n');
                var dataerr = '';
                for(i=0;i<data2.length;i++){


                    var data3 = data2[i].split(',');
                    if(data3.length!=11){
                        dataerr='第 '+i+' 行数据长度不符';
                        break;
                    }
                    // if(isNaN(data3[0])){
                    //     dataerr='第 '+i+' 行学工号格式错误';
                    //     break;
                    // }
                    // if(data3[3]!="学生"|data3[3]!="教师"|data3[3]!="系统管理员"|data3[3]!="教务管理员"){
                    //     dataerr='第 '+i+' 身份格式错误';
                    //     break;
                    // }
                    // if(data3[4]!="男"|data3[4]!="女"){
                    //     dataerr='第 '+i+' 行性别错误';
                    //     break;
                    // }
                    // if(isNaN(data3[5])){
                    //     dataerr='第 '+i+' 行年龄非正整数';
                    //     break;
                    // }
                    // if(isNaN(data3[9])){
                    //     dataerr='第 '+i+' 行电话格式错误';
                    //     break;
                    // }
                    // PersonModel.findOne({userid:data3[0]},function(err,data6){
                    //     if(err){
                    //         // fs.unlink(tempPath);
                    //         return res.render('info/personinsert',{
                    //             useridErr: "",
                    //             userNameErr: "",
                    //             passwordErr: "",
                    //             emailerr: "",
                    //             ageerr: "",
                    //             telerr: "",
                    //             data : tmp,
                    //             insertresult:'学工号验证查找错误'
                    //         });
                    //     }
                    //     else if(data6){
                    //         dataerr='第 '+i+' 行学工号已使用';
                    //         // fs.unlink(tempPath);
                    //         return res.render('info/personinsert',{
                    //             useridErr: "",
                    //             userNameErr: "",
                    //             passwordErr: "",
                    //             emailerr: "",
                    //             ageerr: "",
                    //             telerr: "",
                    //             data : tmp,
                    //             insertresult:dataerr
                    //         });
                    //     }
                    //     else{
                    //         console.log("data6 "+data6);
                    //     }
                    // });
                }

                if(dataerr != ''){
                    fs.unlink(tempPath);
                    return res.render('info/personbatch',{
                        insertresult:dataerr
                    });
                }
                else{
                    var insertresult='';
                    for(i=0;i<data2.length;i++){
                        var data3 = data2[i].split(',');
                        var doc={
                            userid  : data3[0],
                            username : data3[1],
                            password : data3[2],
                            status : data3[3],
                            sex : data3[4],
                            age : data3[5],
                            major : data3[6],
                            college : data3[7],
                            title : data3[8],
                            tel : data3[9],
                            email : data3[10]
                        }
                        PersonModel.create(doc,function(err,data4){
                            if(err){
                                console.log(err);
                                insertresult=insertresult+"创建第 "+i+" 行数据对应用户失败;";
                            }
                            else{
                                console.log("create ok"+data4.userid);
                            }
                        });
                    }
                    if(insertresult=='')
                        insertresult="批量插入成功";
                    fs.unlink(tempPath);
                    return res.render('info/personbatch',{
                        insertresult:insertresult
                    });

                }
            }
        });
    }
    else{
        return res.render('info/personbatch',{
            insertresult:'上传文件为空'
        });
    }
});

module.exports = router;