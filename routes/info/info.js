var express = require('express');
var info = express.Router();
var auth = require('../basic/auth');

var personinsert = require('./personinsert');
var personselect = require('./personselect');
var persondelete = require('./persondelete');
var personmodify = require('./personmodify');
var personinfo = require('./personinfo');
var personpassword = require('./personpassword');
var courseinsert = require('./courseinsert');
var courseselect = require('./courseselect');
var coursedelete = require('./coursedelete');
var coursemodify = require('./coursemodify');
var personbatch = require('./personbatch');
var coursebatch = require('./coursebatch');

// var group = require('./group');

info.use('/personinfo', personinfo);
info.use('/personpassword', personpassword);
info.use('/personinsert', auth.isAdmin2,personinsert);
info.use('/personselect', auth.isAdmin2,personselect);
info.use('/persondelete', auth.isAdmin2,persondelete);
info.use('/personmodify', auth.isAdmin2,personmodify);
info.use('/courseinsert', auth.isAdmin2,courseinsert);
info.use('/courseselect', auth.isAdmin2,courseselect);
info.use('/coursedelete', auth.isAdmin2,coursedelete);
info.use('/coursemodify', auth.isAdmin2,coursemodify);
info.use('/personbatch', auth.isAdmin2,personbatch);
info.use('/coursebatch', auth.isAdmin2,coursebatch);

module.exports = info;
