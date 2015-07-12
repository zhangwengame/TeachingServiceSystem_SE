var express = require('express');
var router = express.Router();
var mongoose = require('mongoose/');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var PersonModel = require('../../db/group1db/PersonModel');

router.get('/login',function(req,res,next){
  res.render('info/login',{
    loginerror:""
  });
});

router.use(passport.initialize());
router.use(passport.session());


passport.use(new LocalStrategy(
    function(userid,password, done) {
      console.log('passport')
    PersonModel.findbyid(userid, function (err, user) {
     if (err) {
       return done(err);
     }
     if (!user) {
       return done(null, false);
     }
     console.log("user.password : "+user);
     console.log("password : "+password);
     if (user[0].password != password) {
       return done(null, false);
     }
     return done(null, user);
    });
}));

router.post('/login',function(req, res, next){
  passport.authenticate('local',function(err,user,info){
    if(err){return(err);}
    if(user=="" | !user){
      console.log("user : NULL");
      res.render('login',{
        loginerror:"学号/密码错误"
      });
    }
    else{
      console.log(user);
      req.session.user=user;
      if(user[0].status == "系统管理员"){
        res.redirect('personinsert');
      }
      else{
        res.redirect('personinfo');
      }
    }
  })(req,res,next);
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = router;
