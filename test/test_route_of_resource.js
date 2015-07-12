/**
 * Created by Gnnng on 4/13/15.
 */
var should = require('should');
var request = require('request');
var async = require('async');

var serverHost = 'http://localhost:3000';

describe('Route', function () {
  context('when access correct route', function () {
    [
      '/resource',
      '/resource/cloud',
      '/resource/course',
      '/resource/config'
    ].forEach(function (route) {
      describe(route, function () {
        // body...
        it('should return 200', function (done) {
          request(serverHost + route, function (err, res, body) {
            should.not.exists(err);
            res.statusCode.should.equal(200);
            done();
          })
        })
      })
    })
  })
  context('when access incorrect route', function () {
    var wrongRoute = '/resource/wrongRoute';
    describe(wrongRoute, function () {
      it('should return 404', function (done) {
        request(serverHost + wrongRoute, function (err, res, body) {
          should.not.exists(err);
          res.statusCode.should.equal(404);
          done();
        })
      })
    })
  })
});

