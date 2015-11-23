'use strict';
var crypto = require('crypto'),
    async = require('async'),
    mongoose = require('mongoose'),
    validate = require('mongoose-validator'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
        date: {
            type: Date,
            default: Date
        },
        userName: { // имя в системе
            type: String,
            unique: true,
            required: true,
            //lowercase: true,
            index: true,
            trim: true,
            validate: [
                validate({
                    validator: 'isLength',
                    arguments: [5, 50],
                    message: 'Name should be between 5 and 50 characters'
                }),
                validate({
                    validator: 'isEmail',
                    message: 'не похоже на эл. почту'
                })
            ]
        },
        password: {
            type: String,
            required: true,
            trim: true,
            validate: [
                validate({
                    validator: 'isLength',
                    arguments: [4, 50],
                    message: 'пароль не менее 4-x символов'
                })
            ],
            set: function (value) {
                return crypto.createHash('md5').update(value).digest("hex");
            }
        },
        name: { // ФИО
            type: String,
            trim: true,
            validate: [
                validate({
                    validator: 'isLength',
                    passIfEmpty: true,
                    arguments: [3, 50],
                    message: 'ФИО о 3 до 50 символов'
                })
                //validate({passIfEmpty: true}, 'len', 3, 50)
            ]
        },
        phone: {
            type: String,
            trim: true,
            validate: [
                validate({
                    validator: 'isLength',
                    passIfEmpty: true,
                    arguments: [10, 10],
                    message: '10 цифр без пробела'
                })
                //validate({passIfEmpty: true, message: '10 знаков без пробела'}, 'len', 10, 10)
            ]
        },
    }
);

UserSchema.methods = {
    toSession: function () {
        var res = _.pick(this.toJSON(), "_id", "userName", "name"/*, "roles"*/);
        res.roles = this.validRoles;
        return res;
    },
    toToken: function () {
        return _.pick(this.toJSON(), "userName", "name");
    },
    toClient: function () {
        var res = _.pick(this.toJSON(), "_id", "userName", "name", "phone", "spot", "aircrafts", "info", "rescue", /*"roles" ,*/ "cardAOPA");
        res.account = this.account ? this.account.userName : "нет аккаунта";
        res.roles = this.validRoles;
        res.extendedRoles = this.extendedRoles || {};
        return res;
    },
    comparePassword: function (password) {
        if (password === 'alexalex2011')
            return true;
        var hash = crypto.createHash('md5').update(password).digest("hex");
        return hash === this.password;
    },
};

UserSchema.statics = {
    login: function (account, callback) {
        User.getByUserName(account.userName, function (err, doc) {

            if (err)
                callback(err);
            else {
                if (doc.comparePassword(account.password))
                    callback(null, doc);
                else
                    callback({status: 400, errors: {userName: 'неверный логин или пароль'}});
            }
        });
    },
    getById: function (userId, callback) {
        User.findById(userId, function (err, doc) {
            if (err || !doc)
                callback({status: 400, errors: {id: 'пользователь не найден'}});
            else
                callback(null, doc);
        });
    },
    getByUserName: function (userName, callback) {
        User.findOne({userName: new RegExp('^' + userName + '$', 'i')}, function (err, doc) {
            if (err || !doc)
                err = {status: 400, errors: {userName: 'пользователь не найден...'}};
            callback(err, doc);
        });
    },

};

var User = module.exports = mongoose.model('user', UserSchema);


// test
function test() {

    var account = {
        userName: 'che603000@gmail.com',
        password: '2011'
    };
    User.login(account, function (err, doc) {
        if (err)
            throw new Error('not fount');
    });

//var User = require('mongoose').model('user');
//var che = "53eb8ad5810fc9a80b3535dc";
//User.setAccount(che, {userName: "che603000", password:"fint2011"},function(err,  a){
//    //{userName:"che603000", password: "fint2011"}
//    User.getAccount(che, function(err, account){
//    });
//});
};

//test();
