/**
 * Created by alex on 23.11.2015.
 */

"use strict";

var redis = require("redis");

module.exports =(app, config, callback) =>{
    let client = redis.createClient();
    client.on("error", callback);
    client.on("ready", ()=>{
        console.log("Connected Redis => Ready");
        callback(null, client);
    })
};
