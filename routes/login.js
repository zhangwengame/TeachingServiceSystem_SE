var express = require('express');
var router = express.Router();
var mongoose = require('mongoose/');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//var cookieParser = require('cookie-parser');

// var db = mongoose.createConnection('mongodb://127.0.0.1:27017/person');
var PersonModel = require('../db/group1db/PersonModel');
// var CollectionName = 'people';
// var PersonModel = db.model('PersonModel',PersonSchema,CollectionName);

router.use(passport.initialize());
router.use(passport.session());



passport.use(new LocalStrategy(
    function(username,passport, done) {
      console.log('passport')
    PersonModel.findbyname(username, function (err, user) {
     if (err) {
       return done(err);
     }
     if (!user) {
       return done(null, false);
     }
     // if (user.password != password) {
     //   return done(null, false);
     // }
     return done(null, user);
    });
}));


// PersonModel.findbyname(req.body.username, function(error, data){
//   if(error) {
//     console.log('find error!'+error);
//   } else {
//     console.log('find ok!'+data);
//   }
//   console.log('data : '+data);
//   res.render('personselect',{
//     name: '程序员', 
//     image: 'images/avatars/avatar3.jpg',
//     total_a:'12',
//     a:'2,3,1,2,3,1,0',
//     total_b:'24',
//     b:'4,6,2,4,6,2,0',
//     total_credits:'24',
//     credits:'4,6,2,4,6,2,0',

//     person_data: data
//   });
// });


router.post('/login',function(req, res, next){
  passport.authenticate('local',function(err,user,info){
    if(err){return(err);}
    if(!user){return res.redirect('login')};

    req.session.user=user;
    return res.redirect('personinsert');
  })(req,res,next);
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

router.get('/login',function(req,res){
  res.render('login');
});


module.exports = router;
