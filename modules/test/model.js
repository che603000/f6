/**
 * Created by alex on 23.11.2015.
 */
"use strict";

var mongoose = require('mongoose');

var test = mongoose.Schema({
    name: String
});

module.exports = mongoose.model('test', test);