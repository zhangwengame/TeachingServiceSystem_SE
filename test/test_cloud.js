/**
 * Created by Gnnng on 4/17/15.
 */
var should = require('should');
var request = require('request');
var async = require('async');
var fs = require('fs');
var debug = require('debug')('test_cloud');

var serverHost = 'http://localhost:3000';

describe('POST /resource/cloud/upload', function () {
  it('upload a file', function (done) {
    var formData = {
      file: fs.createReadStream(__dirname + '/../Makefile')
    };
    request.post({
      url: serverHost + '/resource/cloud/upload',
      formData: formData
    }, function (err, res, body) {
      should.not.exists(err);
      done();
    })
  })
  it('upload a form', function (done) {
    var formData = {
      name: 'john',
      gender: 'male'
    };
    request.post({
      url: serverHost + '/resource/cloud/upload',
      formData: formData
    }, function (err, res, body) {
      should.not.exists(err);
      done();
    })
  })
});

describe('GET /resource/cloud/download', function () {
  it('file exists', function (done) {
    var fileName = 'Makefile';
    request(serverHost + '/resource/cloud/download/' + fileName, function (err, res, body) {
      should.not.exists(err);
      res.statusCode.should.equal(200);
      done();
    })
  })
  it('file not exists', function (done) {
    var fileName = 'jsdfjsle';
    request(serverHost + '/resource/cloud/download/' + fileName, function (err, res, body) {
      should.not.exists(err);
      res.statusCode.should.equal(500);
      done();
    })
  })
})