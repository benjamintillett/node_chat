var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose'),
  passport = require('passport');
mongoose.connect(config.db);
var db = mongoose.connection;

var current_user;

db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});


var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

require('./config/express')(app, config);

io.on("connection",function(socket){
	console.log("a user connected");
	socket.on('message',function(msg){
		console.log(msg);
		console.log(app.current_user);
	});
});

http.db = db;

module.exports = http;
if (!module.parent) {
  console.log('Server running on port ' + config.port)
  http.listen(config.port)
}