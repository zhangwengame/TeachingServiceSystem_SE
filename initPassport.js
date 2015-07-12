var PersonModel = require('./db/group1db/PersonModel');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
  passport.use('local', new LocalStrategy(
    function(userid,password, done) {
      console.log('passport');
//      console.log('status : '+status);
      PersonModel.findbyid(userid, function (err, user) {
       if (err) {
         return done(err);
       }
       else if (!user || user == '') {
        console.log('user empty!');
         return done(null, false);
       }
//       console.log("user.password : "+user.password);
//       console.log("password : "+password);
       else if (parseInt(user.trytime)>4){
         return done(null,user);
       }
       else if (user.password != password) {
         PersonModel.update(
              {userid:user.userid},
              { $set:{ 'trytime':(parseInt(user.trytime)+1).toString() } },
              function(err,data){
                  if(err)
                      console.log('update trytime err');
                  else
                    console.log("trytime add");
              }
          );
          user.trytime=(parseInt(user.trytime)+1).toString();
         return done(null, user);
       }
       else{
         console.log('suc');
         PersonModel.update(
              {userid:user.userid},
              { $set:{ 'trytime':"0" } },
              function(err,data){
                  if(err)
                      console.log('update trytime err');
                  else
                    console.log("trytime 0");
              }
          );
          if(!user.trytime){
            return done(null, user);
          }
          else{
            user.trytime='0';
            return done(null, user);
          }
       }
      });
  }));
  // Passport needs to be able to serialize and deserialize users to support persistent login sessions
  	passport.serializeUser(function(user, done) {
      console.log("in ser");
      done(null, user);
    });

//     passport.deserializeUser(function(userid, done) {
//       console.log("in de",userid);
//       PersonModel.findbyid(userid, function (err, user) {
        

//         // console.log(user[0]);
//         done(null, user[0]);
//       });
    passport.deserializeUser(function(user, done) {
      done(null, user);

    });
};
