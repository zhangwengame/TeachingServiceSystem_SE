var express = require('express');
var router = express.Router();
var mongoose = require('mongoose/');

var PersonModel = require('../../db/group1db/PersonModel');

router.get('/', function(req, res, next) {
    PersonModel.findbyid(req.session.user.userid,function (err, user) {
        res.render('info/personinfo',{
//            name: '程序员', 
//            image: 'images/avatars/avatar3.jpg',
//            total_a:'12',
//            a:'2,3,1,2,3,1,0',
//            total_b:'24',
//            b:'4,6,2,4,6,2,0',
//            total_credits:'24',
//            credits:'4,6,2,4,6,2,0',

            person_data: user
        });
    }); 
});

module.exports = router;

