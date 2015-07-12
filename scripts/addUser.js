/**
 * Created by Gnnng on 5/26/15.
 */
var async = require('../node_modules/async');

var Person = require('../db/group1db/PersonModel');
var Course = require('../db/group1db/CourseModel');

module.exports = function(req,res,next){
  var courseList = [
    'g1',
    'g2',
    'g3'
  ];
  
  var courseNames = [
    'course1',
    'course2',
    'course3'
  ];
  
  var courses = courseList.map(function(courseID, i) {
    return {
      courseid2 : courseID,
      coursename : courseNames[i]
    }
  });
  
  var user = {
    photo     : '',
    userid    : '3120000000',
    username  : 'wtf',
    password  : '3120000000',
    status    : '系统管理员',
    sex       : '',
    age       : '',
    cstlist   : courseList,
    major     : '',
    college   : '',
    title     : '',
    tel       : '',
    email     : ''
  };
  
  async.series([
    function (next) {
      Course.create(courses, function(err, data) {
        if (err)
          next(err, null);
        else
          next(null,data);
          data.map(function(data, i){
            user.cstlist[i] = data._id;
          });
      });
    },
    function (next) {
      Person.findbyid(user.userid, function(err, data){
        console.log(data);
        if (data == null){
            Person.create(user, function(err, data) {
            if (err)
              next(err, null);
            else
              next(null,data);
            });
         }
      });
    }
  ], function (err, results) {
      console.log('Insert into db ' + results);
      res.send("ok!");
    }
  );
};
