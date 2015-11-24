/**
 * Created by alex on 24.11.2015.
 */

var mongoose = require('mongoose'),
    validate = require('mongoose-validator'),
    ValidationError = mongoose.Error.ValidationError,
    ValidatorError = mongoose.Error.ValidatorError;

module.exports = function (obj, options) {
    var error = new ValidationError(obj);
    error.errors[options.path] = new ValidatorError(options);
    return error;
}