"use strict";
exports.__esModule = true;
var express = require("express");
var pty = require("pty.js");
var app = express();
var expressWs = require('express-ws')(app);
// Serve static assets from ./static
app.use(express.static(__dirname + "/static"));
// Instantiate shell and set up data handlers
expressWs.app.ws('/shell', function (ws, req) {
    // Spawn the shell
    // Compliments of http://krasimirtsonev.com/blog/article/meet-evala-your-terminal-in-the-browser-extension
    var shell = pty.spawn('/bin/bash', [], {
        name: 'xterm-color',
        cwd: process.env.PWD,
        env: process.env
    });
    // For all shell data send it to the websocket
    shell.on('data', function (data) {
        ws.send(data);
    });
    // For all websocket data send it to the shell
    ws.on('message', function (msg) {
        shell.write(msg);
    });
});
// Start the application
console.log("Starting application server...");
app.listen(3000);
console.log("Listening to port 3000. Open http://localhost:3000 in browser");
