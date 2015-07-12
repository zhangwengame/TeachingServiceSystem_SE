var express = require('express');
var router = express.Router();
var mongoose = require('mongoose/');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var app = express();

var PersonModel = require('../../db/group1db/PersonModel');

router.get('/login',function(req,res,next){
  console.log("login get");
  console.log("app.get('env')"+app.get('env'));
  req.session.destroy(); // not need callback function
  if (app.get('env') == 'development'){
    console.log("development module");

    passport.authenticate('local',function(err,user2,info){
      //use your own admin account here
      var user={
        userid:'3120100002',
        password:'123456'
      };
     

      if(err){return(err);}
      
      else if(!user){
        console.log("user : NULL");
        res.render('info/login',{
          loginerror:"学号/密码错误"
        });
      }
      else{
        PersonModel.findbyid(user.userid,function (err, user) {
         if(err){console.log("development router login findbyid error!")}
         else if(!user | user == ''){console.log("development router login findbyid find NULL!")}
         else {
           console.log("user : "+user);
           req.logIn(user, function(err){
          console.log(user);
          req.session.user=user;
          console.log(req.isAuthenticated());
          if(user.status == "系统管理员"){
            res.redirect('/info/personinsert');
          }
          else{
            res.redirect('/info/personinfo');
          }
        });
          }
        }); 
        
      }
    })(req,res,next);
  } else {
    res.render('info/login',{
      loginerror:""
    });
  }

});

router.post('/login',function(req, res, next){
  passport.authenticate('local',function(err,user,info){
    if(err){return(err);}
    if(user=="" | !user){
      console.log("userid"+user.userid);
      console.log("user : NULL");
      return res.render('info/login',{
        loginerror:"学工号不存在！"
      });
    }
    else{
      if(req.body.status!=user.status){
        return res.render('info/login',{
        loginerror:"登录身份错误！"
      });
      }
      else if(!user.trytime){
        req.logIn(user, function(err){
          // console.log(user);
          req.session.user=user;
          // console.log(req.isAuthenticated());
          if(user.status == "系统管理员"){
            return res.redirect('/info/personinsert');
          }
          else{
            return res.redirect('/info/personinfo');
          }
        })
      }
     else{
       if(user.trytime=='5'){
         return res.render('info/login',{
            loginerror:"帐号被锁！"
          });
       }
       else if(user.trytime!='0'){
         return res.render('info/login',{
            loginerror:"密码错误，"+user.trytime+"次！"
          });
       }
       else{
         req.logIn(user, function(err){
            // console.log(user);
            req.session.user=user;
            // console.log(req.isAuthenticated());
            if(user.status == "系统管理员"){
              return res.redirect('/info/personinsert');
            }
            else{
              return res.redirect('/info/personinfo');
            }
          })
       }
     }
      
    }
  })(req,res,next);
});

router.get('/logout', function(req, res, next) {
 req.session.destroy(function (err) {
    res.redirect('/'); //Inside a callback… bulletproof!
  });
});
module.exports = router;

