const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const socket = require('socket.io');
const app     = express();
const databaseConfig = require('./config/db');

const path = require('path');

//Database Connection
/*
mongoose.Promise = require('bluebird');
mongoose.connect(databaseConfig.database.connectionURL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'There is an error while attempting to connect to the database.'));
db.once('open', function() {
  console.log('Successfully connected to the database ' + db.name + '.');
});
*/

//Setup Socket


//Routes Files
const index = require('./routes/index');

app.use(cors());
app.disable('x-powered-by');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/'));

//Routes Paths
app.use('/', index);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.set('port', (process.env.PORT || 4000));
var server = app.listen(app.get('port'), () => console.log('Running on port ' + app.get('port')));

//Socket Setup
var io = socket(server);
io.on('connection', function(socket) {
  console.log('Successfully connected to the server websocket!');
  socket.on('chat', function(data) {
    io.sockets.emit('chat', data);
  });
  socket.on('typing', function(data) {
    socket.broadcast.emit('typing', data);
  });
});

module.exports = app;
