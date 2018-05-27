require('dotenv').config();
const client = require('./twitter/client');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const router = require('./router');
var socket = require('./socket/index');
const path = require('path');
const io = require('socket.io')(server);

app.use(express.static(path.resolve('./static')));
app.use(router);
socket.start(io);

server.listen(process.env.APP_PORT, function () {
    console.log('server start at port :' + process.env.APP_PORT);
});