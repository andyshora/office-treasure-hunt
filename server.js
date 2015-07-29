var express = require('express');
var swig = require('swig');
var config = require('./config');

var app = module.exports.app = exports.app = express();

// swig setup
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

app.use('/', express.static(__dirname + '/static'));

app.get('/q/:slug', function (req, res) {
  console.log('route', req.params.slug);

  var q = config.questions[req.params.slug];
  if (q) {
    res.render(__dirname + '/static/index', {
      title: 'Question ' + q.number,
      description: 'Move a little closer to find the answer!',
      question: q
    });
  } else {
    res.sendStatus(500);
  }

  // res.sendfile(__dirname + '/static/index.html');
});

app.listen(process.env.PORT || 3000);
