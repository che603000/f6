/**
 * Created by alex on 23.11.2015.
 */
"use strict";


const express = require('express'),
    config = require('./config'),
    async = require('async'),
    app = express();

async.parallel([
    callback=> {
        require('./core/database')(app, config, callback);
    },
    callback=> {
        require('./core/redis')(app, config, (err, client) => {
            app.redis = client;
            callback(err)
        });
    },
    callback=> {
        require('./core/web-server')(app, config, callback);
    },
], (err)=> {
    if (err)
        console.error(err);
    else {
        require('./modules/router')(app, config);
        console.log("App ready...");
        //require('./core/web-server')(app, config);
    }

});

