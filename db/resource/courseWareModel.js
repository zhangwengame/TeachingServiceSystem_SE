// created by gaotao
var mongoose = require('mongoose');
// Schema 结构
var mongooseSchema = new mongoose.Schema({
    course     : {type : String},
    courseware : [],
});
mongooseSchema.statics.findbycourse = function (course, callback) {
    return this.model('coursewares').find({course: course}, callback);
}
var mongooseModel = mongoose.model('coursewares', mongooseSchema);
module.exports=mongooseModel;
