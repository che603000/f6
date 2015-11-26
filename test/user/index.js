/**
 * Created by alex on 26.11.2015.
 */
"use strict";

var config = require('../../config'),
    should = require('should'),
    mongoose = require('mongoose'),
    data = {
        account: {
            userName: '__test__@api.ru',
            password: '12590'

        },
        accountInvalid: {
            userName: '___test____api.ru',
            password: '12'
        }
    };

require('../../modules/user/models/register');
const Model = require('../../modules/user/models/login');

describe('user', ()=> {
    let dataBase = null;
    // Эти функции будут вызваны один раз внутри этого блока "describe"
    before(done => {
        require('../../core/database')({}, config, function (err, db) {
            dataBase = db;
            done();
        });
    });
    after(done => {
        Model.remove({username: data.account.username}, err => {
            dataBase.close(done);
        });
    });

    describe('register', ()=> {
        require('./register')(data);
    });
    describe('login', ()=> {
        require('./login')(data);
    });

});
