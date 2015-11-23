/**
 * Created by alex on 23.11.2015.
 */
"use strict";

var mongoose = require('mongoose');

module.exports = {
    err404: (req, res, next)=> {
        res.status(404);
        if (req.xhr)
            res.json({message: 'Uri not found'})
        else
            res.send('Error 404. Page not found ');
    },
    err400: (err, req, res, next)=> {
        if (err instanceof mongoose.Error.ValidationError) {
            res.status(400);
            if (req.xhr)
                res.json(err)
            else
                res.send(`Error 400. ${err.message} `);
        } else
            next(err);
    },
    err500: (err, req, res, next)=> {
        res.status(500);
        if (req.xhr)
            res.json({message: err.message})
        else
            res.send(`Error 500. ${err.message}`);
    }
};
