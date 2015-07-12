var mongoose = require('mongoose');
// Schema 结构
var mongooseSchema = new mongoose.Schema({
    username : {type : String, default : '匿名用户'},
    title    : {type : String},
    content  : {type : String},
    time     : {type : Date, default: Date.now},
    age      : {type : Number}
});
mongooseSchema.methods.findbyusername = function(username, callback) {
    return this.model('mongoose').find({username: username}, callback);
}
mongooseSchema.statics.findbytitle = function(title, callback) {
    return this.model('mongoose').find({title: title}, callback);
}

module.exports=mongooseSchema;