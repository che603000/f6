/**
 * Created by Александр on 19.09.2015.
 */
"use strict";

let mongoose = require('mongoose');

module.exports = (data)=> {
    var Model = mongoose.model('user:login'),
        user = null,
        keyToken = null;

    it('Ok', done => {
        Model.login(data.account, (err, doc) => {
            user = doc;
            console.log(err || doc);
            done(err);
        });
    });



    it('user не найден', done => {
        Model.login({userName: "a@mail.ru", password: "832498"}, err  => {
            console.log(err);
            done(!err);
        });
    });

    it('не верный username password', done => {
        Model.login(data.accountInvalid, err  => {
            console.log(err);
            done(!err);
        });
    });

}



