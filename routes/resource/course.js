/**
* Created by Gnnng on 5/30/15.
*/
var router = require('express').Router();
var modelPath = '../../db/group1db/';
var debug = require('debug')('resource');
var Course = require(modelPath + 'CourseModel');
var Person = require(modelPath + 'PersonModel');
var homeworkModel = require("../../db/resource/homework");
var File = require("./basicfileop");
var Tree = require('./basictreeop');
var fileTree = require("../../db/resource/pan");
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var gfs = Grid(mongoose.connection.db, mongoose.mongo);
/*
  functions
*/
function getCourseList(userid, callback) {
  Person.findbyid(userid, function (err, user) {
    debug('user is ' + user);
    var cstlist = user.cstlist;
    debug('cstlist is ' + cstlist);
    Course.findbylist(cstlist, function (err, _courseList) {
      var courseList = _courseList ? _courseList : [];
      debug(courseList);
      callback(err, courseList);
    });
  });
}


function isValidCourseID(req, res, next) {
  if (!('cid' in req.query)) {
    // has no query of cid, default access at first course
    if (req.session.courseList.length > 0) {
      req.query.cid = encodeURIComponent(req.session.courseList[0]._id);
      debug('Add default cid ' + req.query.cid);
    } else {
      console.log("User's course list is empty");
    }
  } else {
    //has a query of cid, then check validation
    debug(JSON.stringify(req.session.courseList));
    var cList = req.session.courseList;
    var in_flag = false;
    for (var i = 0; i < cList.length; i++) {
      if (req.query.cid === cList[i]._id) {
        in_flag = true;
        break;
      }
    }
    if (!in_flag)
      next(Error("Invalid course id"));
  }

  // finish and next
  next();
}

function cache_courseList(req, res, next) {
  debug('cache_courseList');
  if ('courseList' in req.session) {
    next();
  } else {
    getCourseList(req.session.user.userid, function (err, courseList) {
      if (err)
        next(err);
      else {
        //debug(courseList);
        req.session.courseList = courseList;
        next();
      }
    })
  }
}

function cache_slide_course_data(req, res, next) {
  debug('cache_slide_course_data');
  if (!('slide_course' in req.session)) {
    var arr = [];
    debug('arr length is ' + arr.length);
    for (var i = 0; i < req.session.courseList.length; i++) {
      var c = req.session.courseList[i];
      debug('arr at ' + i + ' is ' + c);
      arr.push({
        courseid: c._id,
        coursename: c.coursename
      });
    }
    debug('arr length is ' + arr.length);
    req.session.slide_course = {
      courses: arr
    };
    debug('slide_course is ' + JSON.stringify(req.session.slide_course));
  }
  next();
}

/*
  routes
*/

router.use(cache_courseList, cache_slide_course_data);

router.get('/', function (req, res, next) {
  res.redirect('/resource/course/data');
});

router.get('/data', isValidCourseID, function (req, res, next) {
  var render_data = {
    current_cid: decodeURIComponent(req.query.cid),
    slide_course: req.session.slide_course,
    path_prefix: 'data'
  };
//  console.log(req.query.cid);
  if (req.session.slide_course.courses.length === 0) {
    res.render('resource/course_data', render_data);
  } else {
    var cid = '';
    console.log(cid);
    if (req.query.cid) {
      cid = req.query.cid;
      req.session.nowcid = cid;
    }
    fileTree.findbyuser(cid, function(err, resu) {
      console.log("in findbyuser");
      if (err) {
        console.log("in err");
        console.log(err);
      } else {
        console.log(resu);
        req.session.ctreeP = resu[0].tree;
        console.log(req.session.ctreeP);
        var nowUserId = req.session.user.userid;
        console.log("ok");
        fileTree.findbyuser(nowUserId, function(err, result) {
          console.log("in findbyuser");
          if (err) {
            console.log("in err");
            console.log(err);
          } else {
            console.log("before render");
            req.session.treeP = result[0].tree;
            render_data.cfileTree = req.session.ctreeP;
            render_data.fileTree = req.session.treeP;
            debug(render_data);
            res.render('resource/course_data', render_data);
          }
        });
      }
    });
  }
});
router.post('/newfile',function(req,res,next){
  console.log('coursenewfile');
  console.log(req.body.fromUrl);
  console.log(req.body.toUrl);
  Tree.move(req.body.fromUrl, req.body.fileName, req.body.toUrl, req.session.ctreeP, req.session.treeP, 0, function() {
    Tree.refreshAndSend(res, req.session.ctreeP, req.session.nowcid);
  });
});

router.post('/newfolder', function(req, res, next) {
  var ws={};
  ws.filename=req.body.folderName;
  ws.isFolder=1;
  console.log(req.body.path);
  Tree.newnode(req.body.path,ws,req.session.ctreeP,function(){
    Tree.refreshAndSend(res, req.session.ctreeP, req.session.nowcid);
  });
});

/*
  delete a file in tree
*/
router.post('/deletenode', function(req, res, next) {
  Tree.delnode(req.body.url, req.body.name, req.session.ctreeP, 1, function() {
    Tree.refreshAndSend(res, req.session.ctreeP, req.session.nowcid);
  });
});

/*
   move file or folder
*/

router.post('/movenode', function(req, res, next) {
  Tree.move(req.body.oldUrl, req.body.name, req.body.newUrl, req.session.ctreeP, req.session.ctreeP, 1 ,function() {
    Tree.refreshAndSend(res, req.session.ctreeP, req.session.nowcid);
  });
});
/*
  rename file or folder
*/

router.post('/renamenode', function(req, res, next) {
  Tree.renamenode(req.body.url, req.body.oldName, req.body.newName, req.session.ctreeP, function() {
     Tree.refreshAndSend(res, req.session.ctreeP, req.session.nowcid);
  });
});
/*
  sort
  */
router.post('/sort', function(req, res, next) {
  debug(req.body.url);
  var newtree = JSON.parse(req.body.url);
  //url is a tree ,wrong name~~~
  debug(newtree);
  Tree.refreshAndSend(res, newtree, req.session.nowcid);
});

router.get('/info', isValidCourseID, function (req, res, next) {
  var render_data = {
    current_cid: decodeURIComponent(req.query.cid),
    slide_course: req.session.slide_course,
    path_prefix: 'info'
  };

  res.render('resource/course_info', render_data);
});

router.get('/homework/upload', function (req, res, next) {
  var html = '<form action="/resource/course/homework/upload?cid=5576e0f7bed7f4392d92098a&hw=557bda0a19a80d400ae8dac5"enctype="multipart/form-data" method="post"> ' +
    '<h1> Upload your file </h1> ' +
    'Please specify a file, or a set of files:<br> ' +
    '<input type="file" name="file" size="40" multiple="multiple">  ' +
    '<div> <input type="submit" > </div> </form>';
  res.send(html);
  res.end();
});

router.get('/homework/insertdemo', function (req, res, next) {
  homeworkModel.insertdemo(function (error, doc) {
    console.log(doc);
  });
});

router.post('/homework/edithomework', function(req,res,next){
  var cid     = decodeURIComponent(req.query.cid);
  var hwid    = req.body.hwid;
  var hwname  = req.body.name;
  var ddl     = req.body.ddl;
  var desc    = req.body.desc;
  homeworkModel.findbycourseid(cid, function(error,result) {
    if (error) {
      console.log(error);
    } else {
      var homeworList = result[0].homeworklist;
      for(var i= 0; i< homeworList.length; i++) {
        if (homeworList[i]._id == hwid) {
          homeworList[i].homework = hwname;
          homeworList[i].ddl = ddl;
          homeworList[i].describe = desc;
          homeworkModel.updatehw(cid,homeworList, function(error,doc) {
            console.log(doc);
            if (error) {
              console.log(error);
            } else {
              res.json({code:200});
            }
          });
          break;
        }
      }
    }
  });
});

router.post('/homework/newhomework', function(req, res, next) {
  var cid   = decodeURIComponent(req.query.cid);
  var hwname= req.body.name;
  var ddl   = req.body.ddl;
  var desc  = req.body.desc;
  homeworkModel.findbycourseid(cid, function(error,result){
    if(error) {
      console.log(error);
    } else {
      var newhw = {
        homework  : hwname,
        ddl       : ddl,
        describe  : desc,
        uploadfile: []
      }
      var homeworkList = result[0].homeworklist;
      debug(result);
      debug(homeworkList);
      debug(newhw);
      homeworkList.push(newhw);
      homeworkModel.updatehw(cid, homeworkList, function(error,doc){
        console.log('update');
        console.log(doc);
        if (error) {
          console.log(error);
        } else {
          res.json({code:200});
        }
      });
    }
  });
});

router.get('/homework/download', function (req, res, next) {
  var fileid = decodeURIComponent(req.query.fid);
  var filename = decodeURIComponent(req.query.fname);
  console.log(fileid);
  console.log(filename);
  File.dowloadbyid(fileid, filename, req, res, next, function () {
    res.redirect('/resource/course');
  });
});


router.post('/homework/upload', function (req, res, next) {
  var cid = decodeURIComponent(req.query.cid);
  var homeworkid = decodeURIComponent(req.query.hw);
  File.upload(req, function (fileinfo) {
    console.log(fileinfo);
    var file = {
      stid: req.session.user.userid,
      filename: fileinfo.name,
      contentType: fileinfo.options.content_type,
      id: fileinfo.id,
      uploadtime: new Date()
    };
    console.log("file");
    console.log(file);
    homeworkModel.findbycourseid(cid, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        var homeworkList = result[0].homeworklist;
        for (var i = 0; i < homeworkList.length; i++) {
          if (homeworkList[i]._id == homeworkid) {
            homeworkList[i].uploadfile.push(file);
            break;
          }
        };
        homeworkModel.updatehw(cid, homeworkList, function (error, doc) {
          console.log('update');
          console.log(doc);
          if (error) {
            console.log(error);
          } else {
            res.redirect('/resource/course/homework?cid='+cid);
          }
        });
      }
    });
  });
});

router.get('/homework/', isValidCourseID, function (req, res, next) {
  var cid = decodeURIComponent(req.query.cid);
  var hw = decodeURIComponent(req.query.hw);
  Person.findbyid(req.session.user.userid, function (err, user) {
    if (!('hw' in req.query)) {
      homeworkModel.findbycourseid(cid, function (error, result) {
        if (error) {
          console.log(error);
        } else {
          var homeworkList = [];
          if (result.length != 0) {
            homeworkList = result[0].homeworklist;
          } else {
            homeworkModel.insertBlank(cid,function(){});
          }
          var render_data = {
            homeworkLisr: homeworkList,
            current_cid: decodeURIComponent(req.query.cid),
            slide_course: req.session.slide_course,
            path_prefix: 'homework'
          };
          res.render('resource/course_homework', render_data);
        }
      });
    } else {
      homeworkModel.findbycourseid(cid, function (error, result) {
        if (error) {
          console.log(error);
        } else {
          var filelist = [];
          if (result.length != 0) {
            var homeworkList = result[0].homeworklist;
            for (var i = 0; i < homeworkList.length; i++) {
              if (homeworkList[i]._id == hw) {
                var thisuploadfile = homeworkList[i].uploadfile;
                if (user.status == '学生') {
                  for (var j = 0; j < thisuploadfile.length; j++) {
                    if (thisuploadfile[j].stid == user.userid) {
                      filelist.push(thisuploadfile[i]);
                    }
                  }
                } else {
                  filelist = thisuploadfile;
                }
              }
            }
          }

          var render_data = {
            homeworkname: hw,
            filelist: filelist,
            current_cid: decodeURIComponent(req.query.cid),
            slide_course: req.session.slide_course,
            path_prefix: 'homework'
          };
          res.render('resource/course_homework', render_data);
        }
      });
    }
  });
});

router.post('/feedback', function(res,req,next){
    var cid = decodeURIComponent(req.query.cid);
    var text = req.body.feedback;
    var stdid = req.session.user.userid;
});

router.get('/feedback', function (req, res, next) {
  var render_data = {
    current_cid: decodeURIComponent(req.query.cid),
    slide_course: req.session.slide_course,
    path_prefix: 'feedback'
  };

  res.render('resource/course_feedback', render_data);

});


/*
  exports
*/
exports.router = router;

exports.getCourseList = getCourseList;
exports.cache_courseList = cache_courseList;
exports.cache_slide_course_data = cache_slide_course_data;