/**
 * Created by Gnnng on 4/10/15.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var debug = require('debug')('resource');
var fileTree = require("../../db/resource/pan");
var homeworkModel = require("../../db/resource/homework");
var coursewareModel = require("../../db/resource/courseWareModel");
var File = require("./basicfileop");
var Tree = require("./basictreeop");
var cloud = require('./cloud');
var gfs = Grid(mongoose.connection.db, mongoose.mongo);
var fs = require('fs');

router.get('/', function(req, res, next) {
  res.redirect('/resource/cloud');
});

/*
  show cloud file
  created by zyh
*/
router.use('/cloud', cloud);

/*
  route: "/resource/course"
  authored by Gong Deli <Gnnnnng@gmail.com>
 */
router.use('/course', require('./course').router);


/*
  route: "/resource/search"
  authored by Gong Deli <Gnnnnng@gmail.com>
 */
router.use('/search', require('./search').router);

router.get('/config', function(req, res, next) {
  res.render('resource/index', {
    title: 'Config'
  });
});

//TODO: lines below need to be removed
// file tree post data
router.post('/tree_data', function(req, res, next) {

  res.send(req.session.treeP);
});
/*

  These routes below are under test

*/
router.get('/myresource', function(req, res, next) {
  res.render('resource/myresource', {});
});

router.get('/info', function(req, res, next) {
  res.render('resource/courseInfo', {});
});

router.get('/feedback', function(req, res, next) {
  res.render('resource/feedback', {});
});

router.get('/homework', function(req, res, next) {
  var homework = [];
  homework.push({
    homework: 'work5',
    ddl: Date.now(),
    describe: '1'
  });
  // homework.push({homework: 'work2',ddl: Date.now(),describe:'2'});
  // homework.push({homework: 'work3',ddl: Date.now(),describe:'3'});
  var homeworkEntity = new homeworkModel(homework);
  //console.log(homeworkEntity.id);                          
  /* homeworkEntity.save(function(error) {
      if(error) {
          console.log(error);
      } else {
          console.log('saved OK!');
      }
  });*/
  /*
    homeworkModel.create(homework,function (error) {
        if(error) {
            console.log(error);
        } else {
            console.log(homework.id);                        
            console.log('save ok');
        }
    });
    */
  // 增加记录 基于model操作
  var id = '555837a11c3eb0cb470e8d5d';
  homeworkModel.find({
    _id: id
  }, function(error, result) {
    if (error) {
      console.log(error);
    } else {
      homework = result;
      console.log(result);
    }
    res.render('resource/homework', {
      homeWorkList: homework
    });
  });
});

router.get('/homeworkupload/:homework', function(req, res, next) {
  res.render('resource/homeworkupload', {});
});

router.get('/coursewares', function(req, res, next) {
  var course = 'course1';
  var coursewares = [];
  //TODO req.course                                          
  courseWareModel.findbycourse(course, function(error, result) {
    if (error) {
      console.log(error);
    } else {
      var cws = result[0].courseware;
      var num = 0;
      cws.forEach(function(cw) {
        gfs.findOne({
          _id: cw.id
        }, function(error, file) {
          if (error) {
            console.log(error);
          } else {
            coursewares.push(file);
            num++;
            if (num >= cws.length) {
              console.log(coursewares);
              console.log('read file ok!');
              res.render('resource/coursewares', {
                coursewares: coursewares
              });
            }
          }
        });
      });
    }
  });
});

//router.get('/resource', function(req, res, next) {
//  res.render('resource/resource', {});
//});
//
//router.get('/search', function(req, res, next) {
//  res.render('resource/search', {});
//});
//
//router.get('/hwtest', function(req, res, next) {
//    res.render('resource/homework', {});
//});
//
//router.get('/admin_changeinfo', function(req, res, next) {
//  res.render('resource/admin_changeInfo', {});
//});
//
//router.get('/admin_feedback', function(req, res, next) {
//  res.render('resource/admin_feedback', {});
//});
//
router.get('/admin_homework', function(req, res, next) {
  res.render('resource/admin_homework', {});
});
//
//router.get('/admin_resource', function(req, res, next) {
//  res.render('resource/admin_resource', {});
//});



module.exports = router;