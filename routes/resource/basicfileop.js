/*
  file upload api return the ws
  creat by gaotao
*/
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var gfs = Grid(mongoose.connection.db, mongoose.mongo);
var debug = require('debug')('resource');

function fileupload(req, callback) {
  console.log("want to upload");
  req.busboy.on('file', function(fieldname, readStream, filename, encoding, mimetype) {
    debug('a file is posted: ' + filename);
    var ws = gfs.createWriteStream({
      mode: 'w',
      content_type: mimetype,
      filename: filename,
      metadata: {}
    });
    console.log("upload ok");
    readStream.pipe(ws);
    ws.on('close', function() {
      callback(ws);
    });
  });
  req.pipe(req.busboy);
};

function filedowloadbyname(fileName,res,next,callback) {
  var opts = {
    filename: fileName
  };
  gfs.exist(opts, function(err, found) {
    if (err)
      return next(err);
    if (found) {
      var rs = gfs.createReadStream(opts);
      console.log(rs);      
      res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
      res.setHeader('Content-type', 'text/plain');
      rs.pipe(res);
    } else {
      next(new Error('File ' + fileName + ' not found'));
    }
  });
};

function filedowloadbyid(fileid,filename,req,res,next,callback) {
  var opts = {
    _id: fileid
  };
  gfs.exist(opts, function(err, found) {
    if (err)
      return next(err);
    if (found) {
      var rs = gfs.createReadStream(opts);
      console.log(rs);     
      var userAgent = (req.headers['user-agent']||'').toLowerCase(); 
      if(userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
        res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(filename));
      } else if(userAgent.indexOf('firefox') >= 0) {
        res.setHeader('Content-Disposition', 'attachment; filename*="utf8\'\'' + encodeURIComponent(filename)+'"');
      } else {
         /* safari等其他非主流浏览器只能自求多福了 */
        res.setHeader('Content-Disposition', 'attachment; filename=' + new Buffer(filename).toString('binary'));
      }
      res.setHeader('Content-type', 'text/plain');
      rs.pipe(res);
    } else {
      next(new Error('File id:' + fileid + ' not found'));
    }
  });
}; 

function fileinfobyid(fileid,callback) {
  gfs.findOne({_id: fileid}, function (error,file) {
    if (error) {
      console.log(error);
      callback(error,null);
    } else {
      console.log(file);
      callback(null,file);
    }
  })
};

function fileremovebyid(fileid,callback) {
  gfs.remove({_id: fileid}, function (err) {
    callback(err);
  });
}

function fileremovebyname(filename,callback) {
  gfs.remove({filename: filename}, function (err) {
    callback(err);
  });
}

var FILE = {};
FILE.upload = fileupload;
FILE.dowloadbyname = filedowloadbyname;
FILE.dowloadbyid = filedowloadbyid;
FILE.infobyid = fileinfobyid;
FILE.removebyid = fileremovebyid;
FILE.removebyname = fileremovebyname;
module.exports = FILE;