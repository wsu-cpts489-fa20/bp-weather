"use strict";

// server.js -- A simple Express.js web server for serving a React.js app
//import path from 'path';
//import express from 'express';
path = require('path');
express = require('express');
var PORT = process.env.HTTP_PORT || 8081;
var app = express();
app.use(express["static"](path.join(__dirname, 'client', 'build')));
app.listen(PORT, function () {
  console.log("Server listening at port ".concat(PORT, "."));
});
