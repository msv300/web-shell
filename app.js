"use strict";
exports.__esModule = true;
var express = require("express");
var pty = require("node-pty");
var app = express();
var expressWs = require('express-ws')(app);

app.use(express.static(__dirname + "/"));

expressWs.app.ws('/shell', function (ws, req) {
    var shell = pty.spawn('bash', [], {
        name: 'xterm-color',
        cwd: process.env.HOME,
        env: process.env
    });

    // // For all shell data send it to the websocket
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
