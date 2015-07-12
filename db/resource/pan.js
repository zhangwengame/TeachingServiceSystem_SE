var mongoose = require('mongoose');
var person = require('../group1db/PersonModel');
var course = require('../group1db/CourseModel');
// Schema 结构
var mongooseSchema = new mongoose.Schema({
    uid : {type : String},
    tree : {type : mongoose.Schema.Types.Mixed}
/*    tree:
        {
            text : string means file name
            isFolder: 1/0
            fid: file ID
        }
*/
});
mongooseSchema.statics.findbyuser = function(uid, callback) {
    console.log("find:"+uid);
    return this.model('tree').find({uid: uid}, callback);
};
mongooseSchema.statics.updatetree = function(uid, newtree, callback) {
    console.log("update tree, uid:"+uid);
    var conditions = {uid: uid};
	var update     = {$set : {tree: newtree.tree}};
	var options    = {upsert : true};
    return this.model('tree').update(conditions,update,options,callback);
};
var mongooseModel = mongoose.model('tree', mongooseSchema);
person.schema.post('save', function(doc) {
   console.log("hook");
   console.log(doc);
   mongooseModel.findbyuser(doc.userid,function(err, res) {
       if (res.length == 0) {
           mongooseModel.create({
               uid : doc.userid,
               tree : []
           }); 
       }
   });
   
});
course.schema.post('save', function(doc) {
   console.log("hook course");
   console.log(doc);
   mongooseModel.findbyuser(doc._id,function(err, res) {
       if (res.length == 0) {
           mongooseModel.create({
               uid : doc._id,
               tree : []
           }); 
       }
   });
});
module.exports=mongooseModel;