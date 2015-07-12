var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
//var db       = mongoose.createConnection('mongodb://127.0.0.1:27017/lhdb');// 链接错误
mongoose.connect('mongodb://127.0.0.1:27017/info');
var db = mongoose.connection;
db.once('open', function callback () {
    console.log('About a cat Zildjian');
/*    var CatModel = mongoose.model('Cat', {
        name: String,
        friends: [String],
        age: Number,
    }); 
    var CatEntity = new CatModel({name:'Zildjian'});
    console.log(CatEntity.name);*/
/*    var kitty = new Cat({ name: 'Zildjian', friends: ['tom', 'jerry']});
    kitty.age = 3;   
    kitty.save(function (err) {
    if (err) // ...
        console.log('meow');
    });*/
/*
    console.log("ok open");
    var mongooseSchema = new mongoose.Schema({
        username : {type : String, default : '匿名用户'},
        title    : {type : String},
        content  : {type : String},
        time     : {type : Date, default: Date.now},
        age      : {type : Number}
    });
    var student = mongoose.model('studend', mongooseSchema);
    console.log(student.find({"username": "lihao"}).title);
*/
});
//var mongooseSchema = require('./newSchema');    
//`var mongooseModel = db.model('student', mongooseSchema);
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',function(req, res, next) {
    var CatModel = mongoose.model('Cat', {
        name: String,
        friends: [String],
        age: Number,
    }); 
    var CatEntity = new CatModel({name:'Zildjian'});
  res.send('****************dbtest***********' + CatEntity.name);
});
module.exports = router;
