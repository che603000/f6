/**
 * Created by alex on 23.11.2015.
 */
"use strict";

var http = require('http');

module.exports = (app, config, callback)=> {
    let server = http.createServer(app);
    server.listen(config.webServer.port, (err) => {
        if (err)
            callback && callback(err)
        else {
            console.log(`Start web server. Port: ${server.address().port}`);
            callback && callback(null, server);
        }
    });

    return server;
}