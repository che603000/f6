'use strict';
const crypto = require('crypto'),
    async = require('async'),
    mongoose = require('mongoose'),
    validate = require('mongoose-validator'),
    validationError = require('../../../libs/validation-error'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema,
    uuid = require('node-uuid'),
    TIME_VALID_TOKEN = 2 * 60 * 60 * 1000; // два часа


var RegSchema = new Schema({
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
        ]
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
    token: {
        // одноразовый ключ - использутеся для изменения пароля
        type: {},
        default: null
    }
});

RegSchema.pre('save', function (next) {
    this.password = crypto.createHash('md5').update(this.password).digest("hex");
    next();
});

RegSchema.plugin(uniqueValidator, {message: '{VALUE} :такой пользователь уже есть.', kind: '400'});

RegSchema.methods = {
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
    createToken: function (callback) {
        this.token = {
            key: uuid.v4(),
            date: Date.now() + TIME_VALID_TOKEN
        }
        this.save(function (err, doc) {
            callback(err, doc.token.key);
        });
    },
};

RegSchema.statics = {
    register(account, callback) {
        var user = Reg(account);
        user.save(function (err, doc) {
            if (err)
                callback(err);
            else {
                callback(null, doc);
            }
        });
    },

    getByToken(key, callback){
        Reg.findOne({"token.key": key}, (err, doc)=> {
            //console.log("%s > %s = %s", doc.token.date, Date.now(), doc.token.date > Date.now());
            if (err || !doc)
                callback(validationError(this, {
                    path: 'token',
                    message: 'token уже использован или устарел',
                    type: 400
                }))
            else if (doc.token && doc.token.date > Date.now())
                callback(null, doc);
            else
                callback(validationError(this, {
                    path: 'token',
                    message: 'token уже использован или устарел',
                    type: 400
                }))
        });
    },
    resetPassword(tokenAccount, callback){
        async.waterfall([
            (callback) => {
                this.getByToken(tokenAccount.key, callback);
            },
            (doc, callback) => {
                doc.password = tokenAccount.password;
                doc.token = null;
                doc.save(callback);
            }
        ], callback);
    }
};

var Reg = module.exports = mongoose.model('user:register', RegSchema, 'users');


