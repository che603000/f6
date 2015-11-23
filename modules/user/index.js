/**
 * Created by alex on 23.11.2015.
 */

"use strict";

var express = require('express'),
    router = express.Router(),
    Model = require('./model');

module.exports = (app, conf)=> {

// define the home page route
    router.get('/list', function (req, res, next) {
        Model.find({}, (err, doc) => {
            if (err)
                next(err);
            else
                res.json(err || doc);
        });
    });

    router.get('/create', function (req, res, next) {
        var model = new Model({});
        model.save((err, doc) => {
            if (err)
                next(err);
            else
                res.json(doc);
        });
    });

    return router;

};


