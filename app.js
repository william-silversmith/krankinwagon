var express = require('express.io');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
app.http().io();

app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 3000);

app.io.on('connection', function (socket) {
    socket.on('lever', function (com) {
        console.log(com);
        socket.emit('complete', com);
    });
});

module.exports = app;
