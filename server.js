var express = require('express');

var app = module.exports.app = exports.app = express();

app.use('/', express.static(__dirname + '/static'));

app.listen(3000);
