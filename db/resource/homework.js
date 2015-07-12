// created by gaotao
var mongoose = require('mongoose');
// Schema 结构
var upfileSchema = new mongoose.Schema({
    stid        : {type : String},
    filename    : {type : String},
    contentType : {type : String},
    id          : {type : String},
    uploadtime  : {type : Date}
});

var homeworkSchema = new mongoose.Schema({
    homework : {type : String},
    ddl      : {type : Date},
    describe : {type : String},
    uploadfile : [upfileSchema]
});

var mongooseSchema = new mongoose.Schema({
    courseid : {type : String},
    homeworklist : [homeworkSchema] //{homework:"hw1",uploadfile:[{stid:"std1",fileinfo:"fid"}]}
});
var collectionname = 'homework';

mongooseSchema.statics.insertBlank = function(cid, callback) {
    var course = {
        courseid : cid,
        homeworklist : []
    };
    return this.model('homeworkModel').create(course,callback);
}

mongooseSchema.statics.insertdemo = function (callback) {
    var ddl = new Date();
    ddl.setDate(21);
    ddl.setHours(23);
    ddl.setMinutes(59);
    var homework1 = {
        homework : 'hw1',
        ddl      : ddl,
        describe : 'this is homework1',
        uploadfile : []
    };
    ddl.setDate(22);
    var homework2 = {
        homework : 'hw2',
        ddl      : ddl,
        describe : 'this is homework2',
        uploadfile : []
    };
    var course = {
        courseid : '5576e0f7bed7f4392d92098a',
        homeworklist : [homework1,homework2]
    };
    return this.model('homeworkModel').create(course,callback);
};

mongooseSchema.statics.findbycourseid = function(courseid, callback) {
    return this.model('homeworkModel').find({courseid: courseid}, callback);
};
mongooseSchema.statics.updatehw = function(cid, homework, callback) {
    console.log('update');
    console.log(homework);
    var conditions = {courseid: cid};
	var update     = {$set : {homeworklist: homework}};
	var options    = {upsert : true};
    return this.model('homeworkModel').update(conditions,update,options,callback);
};
var mongooseModel = mongoose.model('homeworkModel',mongooseSchema,collectionname);
module.exports=mongooseModel;