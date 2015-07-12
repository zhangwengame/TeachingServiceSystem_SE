var mongoose = require('mongoose');
// Schema 结构
var courseDetail = new mongoose.Schema({
	course_id:      {type: String},
    course_name:    {type: String},
    credits:        {type: Number},
    English_name:   {type: String},
    academy:        {type: String},
    catagory:       {type: String},
    course_data:    {type: String},
    course_outline: {type: String}
});
var courseModel = mongoose.model('courseModel',courseDetail,'coursesInfo');
module.exports=courseModel;