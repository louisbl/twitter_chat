const path = require('path');
const express = require('express');
const app = express();

app.get('/', function (req, res) {
    res.sendFile(path.resolve('./views/index.html'));
});

module.exports = app;