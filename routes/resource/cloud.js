var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var debug = require('debug')('resource');
var fileTree = require("../../db/resource/pan");
var File = require("./basicfileop");
var Tree = require("./basictreeop");
var cloud = require('./cloud')
var gfs = Grid(mongoose.connection.db, mongoose.mongo);
var fs = require('fs');

router.get('/', function(req, res, next) {
  var nowUserId = req.session.user.userid;
  console.log("ok!get cloud");
  fileTree.findbyuser(nowUserId, function(err, result) {
    console.log("in findbyuser");
    if (err) {
      console.log("in err");
      console.log(err);
    } else {
      console.log("before render");
      req.session.treeP = result[0].tree;
      console.log(req.session.treeP);
      res.render('resource/myresource', {
        title: 'Cloud',
        fileTree: req.session.treeP
      });
    }
  });
});
/*
  new folder api
*/
// foldername path
router.post('/newfolder', function(req, res, next) {
  var ws={};
  ws.filename=req.body.folderName;
  ws.isFolder=1;
  console.log(req.body.path);
  Tree.newnode(req.body.path,ws,req.session.treeP,function(){
    Tree.refreshAndSend(res, req.session.treeP, req.session.user.userid);
  });

});

/*
  new file api
*/

//par: datafile, path(xx.xx.xx)
router.post('/newfile', function(req, res, next) {
  req.busboy.on('field',function(a,b){
    req.body[a]=b;
    File.upload(req, function(ws) {
      console.log("upload suc");
      ws.isFolder = 0;
      Tree.newnode(req.body.path, ws, req.session.treeP, function(){
        Tree.refreshAndSend(res, req.session.treeP, req.session.user.userid);
      });
    });
  });
  req.pipe(req.busboy);
});
/*

  A temporary upload page for test purpose

*/
router.get('/upload', function(req, res, next) {
  var html = '<form action="/resource/cloud/upload"enctype="multipart/form-data" method="post"> ' +
    '<h1> Upload your file </h1> ' +
    'Please specify a file, or a set of files:<br> ' +
    '<input type="file" name="file" size="40" multiple="multiple">  ' +
    '<div> <input type="submit" > </div> </form>';
  res.send(html);
  res.end();
});
/*

  file upload api

 */
router.post('/upload', function(req, res, next) {
  File.upload(req,function (id) {
    console.log(id);
  });
  console.log(req);
//  req.busboy.on('file', function(fieldname, readStream, filename, encoding, mimetype) {
//    debug('a file is posted: ' + filename);
//    var ws = gfs.createWriteStream({
//      mode: 'w',
//      content_type: mimetype,
//      filename: filename,
//      metadata: {}
//    });
//    console.log(ws.id);
//    readStream.pipe(ws);
//  });

  //TODO: should not allow any other field to be post to the upload route
  req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {
    debug('Field is ' + key + value);
  });

  req.busboy.on('finish', function() {
    res.redirect('/resource/cloud');
  });
//
//  req.pipe(req.busboy);
});

/*

  file download api

 */

router.get('/download/:filename', function(req, res, next) {
  var dlfileName = req.params['filename'];
  debug('a file will be download: ' + req.params['filename']);

  //FIXME: the search option may have more fields than the 'filename', because GridFS allow files with the same name.
  var opts = {
    filename: dlfileName
  };
  gfs.exist(opts, function(err, found) {
    if (err)
      return next(err);
    if (found) {
      var rs = gfs.createReadStream(opts);

      res.setHeader('Content-disposition', 'attachment; filename=' + dlfileName);
      res.setHeader('Content-type', 'text/plain');
      rs.pipe(res);
    } else {
      next(new Error('File ' + dlfileName + ' not found'));
    }
  });
});

router.post('/iddownload', function(req, res, next) {
  req.session.nowfilename = req.body.name;
  res.json({});
});

router.get('/iddownload/:fid', function(req, res, next) {
  File.dowloadbyid(req.params.fid, req.session.nowfilename, req, res, next);
});

/*
  delete a file in tree
*/
router.post('/deletenode', function(req, res, next) {
  Tree.delnode(req.body.url, req.body.name, req.session.treeP, 1, function() {
    Tree.refreshAndSend(res, req.session.treeP, req.session.user.userid);
  });
});

/*
   move file or folder
*/

router.post('/movenode', function(req, res, next) {
  Tree.move(req.body.oldUrl, req.body.name, req.body.newUrl, req.session.treeP, req.session.treeP, 1 ,function() {
    Tree.refreshAndSend(res, req.session.treeP, req.session.user.userid);
  });
});
/*
  rename file or folder
*/

router.post('/renamenode', function(req, res, next) {
  Tree.renamenode(req.body.url, req.body.oldName, req.body.newName, req.session.treeP, function() {
     Tree.refreshAndSend(res, req.session.treeP, req.session.user.userid);
  });
})

router.post('/share', function(req, res, next) {

});
router.get('/course', function(req, res, next) {
  res.render('resource/index', {
    title: 'Course'
  });
});

module.exports = router;