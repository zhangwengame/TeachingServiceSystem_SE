var mongoose = require('mongoose');

var mongooseSchema = new mongoose.Schema({
    courseid: {type: String},
    studentname: {type: String},
    text: {type: String},
    time: {type: Date}
});

var collectionname = 'feedback';

mongooseSchema.statics.insertOne = function (feedbackentity,callbakc) {
    return this.model('feedbackModel').create(feedbackentity,callbakc);
};

mongooseSchema.statics.findbycourseid = function(cid,callback) {
    return this.model('feedbackModel').find({courseid: cid},callback);
};

var mongooseModel = mongoose.model('feedbackModel',mongooseSchema,collectionname);
module.exports=mongooseModel;