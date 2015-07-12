var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var PersonModel = require('../../db/group1db/PersonModel');

router.get('/', function(req, res,next) {
    res.render('info/personpassword',{
	    passwordErr: '',
	    password1Err: '',
	    password2Err: '',
	    passwordresult: "请输入原密码和新密码"
	});
});

router.post('/', function(req, res,next) {
	var passwordErr='';
	var password1Err='';
	var password2Err='';

	if(req.body.password == ""){passwordErr = '原密码不能为空!';}
	if(req.body.password1 == ""){password1Err = '新密码不能为空!';}
    if(req.body.password1 != req.body.password2){password1Err = '两次密码输入不同!';}

    if(passwordErr != '' || password1Err != '' || password1Err != ''){
    	console.log("输入信息有误");
    	res.render('info/personpassword',{
		    passwordErr: passwordErr,
		    password1Err: password1Err,
		    password2Err: password2Err,
		    passwordresult: "填写信息有误，修改失败"
		});
    }
    else{
    	var localuser=req.session.user;
    	PersonModel.findbyid(localuser.userid,function (err, user) {
	        if(err){
	        	console.log("根据id查找错误");
	        	res.render('info/personpassword',{
		            name: '程序员', 
		            image: 'images/avatars/avatar3.jpg',
		            total_a:'12',
		            a:'2,3,1,2,3,1,0',
		            total_b:'24',
		            b:'4,6,2,4,6,2,0',
		            total_credits:'24',
		            credits:'4,6,2,4,6,2,0',

		            passwordErr: passwordErr,
				    password1Err: password1Err,
				    password2Err: password2Err,
		            passwordresult: "查找用户出错"
	        	});
	        }
	        else if(!user){
	        	console.log("找不到对应id用户");
	        	res.render('info/personpassword',{
		            passwordErr: passwordErr,
				    password1Err: password1Err,
				    password2Err: password2Err,
		            passwordresult: "用户不存在"
	        	});
	        }
	        else{
	        	localuser=user;
	        	console.log("localuser : "+localuser);
	        	console.log("localuser.password : "+localuser.password);
	        	console.log("req.body.password : "+req.body.password);
	        	if(req.body.password != localuser.password){
	        		console.log("原密码错误");
	        		passwordErr="原密码错误";
	        		res.render('info/personpassword',{
			            passwordErr: passwordErr,
					    password1Err: password1Err,
					    password2Err: password2Err,
			            passwordresult: "密码修改失败"
	        		});
	        	}
	        	else{
	        		localuser.password=req.body.password1;
	        		console.log("localuser : "+localuser);
	        		PersonModel.modifybyid(localuser,function(err,data){
		                if(err){
		                	console.log("密码修改错误");
		                    res.render('info/personpassword',{
		                        passwordErr: passwordErr,
							    password1Err: password1Err,
							    password2Err: password2Err,
					            passwordresult: "密码修改失败(modify err)"
		                    })
		                }
		                else{
		                	console.log("密码修改成功");
		                    res.render('info/personpassword',{
		                        passwordErr: passwordErr,
							    password1Err: password1Err,
							    password2Err: password2Err,
		                        passwordresult:'密码修改成功！'
		                    });
		                }
		            });
	        	}
	        }
        });
    }
});


module.exports = router;
