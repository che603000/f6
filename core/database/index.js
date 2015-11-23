/**
 * Created by alex on 23.11.2015.
 */
"use strict";

var mongoose = require('mongoose');

module.exports = (app, conf, callback) => {

    let db = mongoose.connection;

    db.on('error', callback);
    db.once('open', () => {
        console.log(`Connected database name: "${db.name}"`);
        callback(null, db);
    });

    mongoose.connect(conf.database.connectionString);
};

