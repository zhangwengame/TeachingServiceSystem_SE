//成绩表

var mongoose = require('mongoose');
var async = require('async');

var studentGradeSchema = new mongoose.Schema({
courseid    : String,  
userid      : String,  
score       : Number,
gradePoint  : Number,
secondScore : Number
});

studentGradeSchema.statics.findbyid = function(courseid, callback) {
    return this.model('gradesDB').find({courseid: courseid}, callback);
}

studentGradeSchema.statics.insertrecord = function(courseid,userid, callback){
    return this.model('gradesDB').create({"courseid":courseid,"userid":userid,"score":"","gradePoint":"" ,"secondScore": ""},callback);
}
   
   
studentGradeSchema.statics.findbycourseid= function(courseid,my_userid,callback) {
   console.log("findbycourseid");
   var model=this.model('gradesDB');
   console.log("111");  
   console.log(courseid);
   async.map(courseid, function (item,callback) {
	  console.log("222");
      model.findOne({courseid:item},function(error,data){
		  console.log(data);
		  if(data){
		  callback(null,data.score);
		  }else{
		  callback(null,null);
		  }
	  }).where("userid").equals(my_userid);
      
	  
   }, function (err, result) {
    //results.filter(function (item) {return item;});//如果有需要过滤空值的话，当然也可以用async.filter
     //results就是你想要的
	 console.log("333");
	 console.log(result);
	 callback(err,result);
	});

/*	async.map([1,3,5], function(item, callback){

    var transformed = item + 1;
    callback(null, transformed);

    }, function(err, results){
     if(err){
        console.error("error: " + err);
        return;
    }
    console.log(results);// [2, 4, 6]

    });*/

}

//studentGradeSchema.statics.findandinsert = function(courseid,my_userid,callback) {
//   console.log("findbycourseid");
//   var model=this.model('gradesDB');
//   console.log("111");  
//   console.log(courseid);
//   async.map(courseid, function (item,callback) {
//	  console.log("222");
//      model.findOne({courseid:item},function(error,data){
//		  console.log(data);
//		  if(data){
//		  callback(null,data.score);
//		  }else{
//       async.map(courseid,function(iterm,callback){
//         model.create({courseid:item,userid:my_userid,score:"",secondScore:"",gradePoint:""},function(error,data){
//		      console.log(data);
//       }),function (err, result) {
//    //results.filter(function (item) {return item;});//如果有需要过滤空值的话，当然也可以用async.filter
//     //results就是你想要的
//	      console.log("333");
//	      console.log(result);
//	      callback(err,result);
//	       });
//        
//		    callback(null,null);
//		  }
//	  }).where("userid").equals(my_userid);
//      
//	  
//   }, function (err, result) {
//    //results.filter(function (item) {return item;});//如果有需要过滤空值的话，当然也可以用async.filter
//     //results就是你想要的
//	 console.log("333");
//	 console.log(result);
//	 callback(err,result);
//	});
/*	async.map([1,3,5], function(item, callback){

    var transformed = item + 1;
    callback(null, transformed);

    }, function(err, results){
     if(err){
        console.error("error: " + err);
        return;
    }
    console.log(results);// [2, 4, 6]

    });*/

//}


var gradesModel = mongoose.model('gradesDB',studentGradeSchema,'grades');

module.exports=gradesModel;