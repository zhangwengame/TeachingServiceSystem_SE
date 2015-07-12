/**
 * Created by Gnnng on 6/5/15.
 */

var router = require('express').Router();
var debug = require('debug')('search');
var elasticsearch = require('elasticsearch');
var search_client = new elasticsearch.Client({
  host: '10.214.128.197:9200',
  log: 'error'
});


router.post('/', function (req, res, next) {
  debug(req.body);
  var query = req.body.query ? req.body.query : '';
  search_client.search({
    index: 'tssapp_fileindex',
    type: 'files',
    body: {
      query: {
        query_string: {
          query: {
            "fields": ["filename", "content"],
            "query": query
          }
        }
      }
    }
  }).then(function (resp) {
    var hits  = resp.hits.hits;
    debug('hits is ' + JSON.stringify(hits));
    var results = [];
    for(var i = 0; i < hits.length; i++) {
      results.push({
        _id: hits[i]._id,
        filename: hits[i]._source.filename
      });
    }
    debug('search result are ' + JSON.stringify(results));
    req.session.last_search = results;
    //req.session.es_search =
    res.redirect('/resource/search');
  }, function(err) {
    res.redirect('/resource/search');
  });
  //res.redirect('/resource/search');
});

router.get('/',
  require('./course').cache_courseList,
  require('./course').cache_slide_course_data,
  function (req, res, next) {
  var render_data = {
    //current_cid   : decodeURIComponent(req.query.cid),
    current_cid: '',
    slide_course: req.session.slide_course,
    path_prefix: '',
    search_results: []
  };

  if (req.session.last_search) {
    //render_data.
    render_data.search_results = req.session.last_search;
  } else {
    delete req.session.last_search;
  }
  res.render('resource/search', render_data);
});

exports.router = router;