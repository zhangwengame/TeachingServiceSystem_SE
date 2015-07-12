var mongoose = require('mongoose');
// Schema 结构
var ClassroomSchema = new mongoose.Schema({
    classid2     : {type : String},
    campus      : {type : String},	//校区
    capacity    : {type : Number},  //教室容量
    facility    : {type : String},  //负责人
});

var CollectionName = 'classrooms';

//ClassroomSchema.statics.findall = function (callback){
//    return this.model('ClassroomSchema').find(callback);
//}

ClassroomSchema.statics.findbyid = function (classid2,callback) {
    return this.model('ClassroomModel').find({classid2 : classid2},callback);
}

ClassroomSchema.statics.findbyic = function (classid2,campus,callback) {
    return this.model('ClassroomModel').find({classid2 : classid2,campus : campus},callback);
}


ClassroomSchema.statics.findbycampus = function (campus, callback) {
    return this.model('ClassroomModel').find({campus : campus},callback);
}

ClassroomSchema.statics.deletebyic = function(classid2,campus, callback) {
    return this.model('ClassroomModel').remove({classid2: classid2,campus:campus}, callback);
}

ClassroomSchema.statics.modifybyid = function(req, callback) {
    return this.model('ClassroomModel').update(
        {classid2: req.classid2},
        {
            $set:{
                classid2 : req.classid2,
                campus : req.campus,
                capacity : req.capacity,
                facility : req.facility
            }//,
 //           $currentDate : { lastModified: true }
        },
        callback);
}

var ClassroomModel = mongoose.model('ClassroomModel',ClassroomSchema,CollectionName);
module.exports=ClassroomModel;