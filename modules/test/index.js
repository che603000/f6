/**
 * Created by alex on 23.11.2015.
 */

"use strict";

var express = require('express'),
    router = express.Router(),
    Model = require('./model');

module.exports = (app, conf)=> {

// middleware specific to this router
    router.use(function timeLog(req, res, next) {
        console.log('Time: ', Date.now());
        next();
    });
// define the home page route
    router.get('/', function (req, res, next) {
        var model = new Model({name: 'test'});
        model.save((err, doc) => {
            if (err)
                next(err);
            else
                res.json(err || doc);
        });
    });
// define the about route
    router.get('/about', function (req, res) {
        res.send('About birds');
    });

    return router;

};


