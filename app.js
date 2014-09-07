"use strict";

var express = require('express.io');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var World = require('./world.js');
var Player = require('./player.js');

var app = express();
app.http().io();

app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 3000);

var world = new World();

app.io.on('connection', function (socket) {
    world.addPlayer(socket);
});

module.exports = app;
