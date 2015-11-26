/**
 * Created by Александр on 19.09.2015.
 */
"use strict";

let mongoose = require('mongoose');


module.exports = (data)=> {


    var Model = mongoose.model('user:register'),
        user,
        keyToken;


    it('не валидные данные', done => {
        Model.register(data.accountInvalid, (err) => {
            err && console.log(err);
            done(!err);
        });
    });
    it('Ok', done => {
        Model.register(data.account, (err, doc) => {
            user = doc;
            console.log(err || doc);
            done(err);
        });
    });

    it('дубликат user', (done) => {
        Model.register(data.account, (err) => {
            console.log(err);
            //done.apply(this, arguments);
            done(!err);
        });
    });

    it('create token', done => {
        user.createToken((err, key) => {
            keyToken = key;
            console.log(err || key);
            done(err);
        });
    });

    it('reset password invalid', done => {
        Model.resetPassword({key: keyToken, password: "760"},(err, doc) => {
            console.log(err || doc);
            done(!err);
        });
    });

    it('reset password', done => {
        data.account.password = "762357257";
        Model.resetPassword({key: keyToken, password: data.account.password},(err, doc) => {
            console.log(err || doc);
            done(err);
        });
    });

    it('reset password повторно', done => {
        Model.resetPassword({key: keyToken, password: "760"},(err, doc) => {
            console.log(err || doc);
            done(!err);
        });
    });


};


/* it('token:создать и использовать', done =>  {
 Model.createToken(account.username, function (err, token) {
 console.log(token);
 Model.usedToken(token, done);
 });
 });

 it('token:поврежденный', done =>  {
 Model.createToken(account.username, function (err, token) {
 console.log(token);
 Model.usedToken(token + "9848798", err  =>  {
 console.log('Err:', err);
 done(!err);
 });
 });
 });

 it('token:просроченный ', done =>  {
 Model.createToken(account.username, Date.now() - 100, function (err, token) {
 console.log(token);
 Model.usedToken(token, function (err, doc) {
 console.log('Err:', err);
 done(!err);
 });
 });
 });

 it('token:сброс', done =>  {
 Model.findOne({username: account.username}, function (err, doc) {
 console.log('keyToken:' + doc.keyToken);
 done(doc.keyToken ? new Error('нет сброса токена') : null)
 });
 });
 */
//
////Мы должны иметь модель UserList
//it('should be have UserList', function () {
//    models.should.be.have.property('UserList');
//    models.UserList.should.be.a('function');
//});
//
////Тестируем модель User
//describe('User', function () {
//
//    //модель User должна иметь метод find
//    it('should be have #find', function () {
//        User.should.be.have.property('find');
//        User.find.should.be.a('function');
//    });
//
//    //модель User должна иметь метод findById
//    it('should be have #findById', function () {
//        User.should.be.have.property('findById');
//        User.findById.should.be.a('function');
//    });
//
//    //модель User должна иметь метод save
//    it('should be have #save', function () {
//        User.prototype.should.be.have.property('save');
//        User.prototype.save.should.be.a('function');
//    });
//
//    //модель User должна иметь метод toJSON
//    it('should be have #toJSON', function () {
//        User.prototype.should.be.have.property('toJSON');
//        User.prototype.toJSON.should.be.a('function');
//    });
//
//    describe('#find', function () {
//
//        //find должен возвращать UserList
//        it('should be instanceof UserList', done =>  {
//            User.find(function (err, list) {
//                if (err) return done(err);
//                list.should.be.an.instanceOf(UserList);
//                done();
//            });
//        });
//
//        //find должен возвращать UserList, даже если ничего нет
//        it('should not be exist', done =>  {
//            //Дропаем БД
//            db.drop();
//
//            User.find(function (err, list) {
//                //Восстанавливаем БД
//                db.generate();
//                if (err) return done(err);
//                list.should.be.an.instanceOf(UserList);
//                done();
//            });
//        });
//    });
//
//    describe('#findById', function () {
//
//        //findById должен возвращать объект типа User
//        it('should be instanceof User', done =>  {
//            User.findById(0, function (err, user) {
//                if (err) return done(err);
//                user.should.be.an.instanceOf(User);
//                done();
//            });
//        });
//
//        //findById должен возвращать ничего, если пользователь не найдено
//        it('should not be exists', done =>  {
//            User.findById(100, function (err, user) {
//                if (err) return done(err);
//                should.not.exist(user);
//                done();
//            });
//        });
//    });
//
//    describe('#save', function () {
//
//        //save должен выбрасывать ошибку, если указать неправильный возраст
//        it('should not be saved', done =>  {
//            var user = new User({name: 'New user', age: 0, sex: 'w'});
//
//            user.save(err  =>  {
//                err.should.eql('Invalid age');
//                done();
//            });
//        });
//
//        //Если все хорошо, то должен быть создан новый пользователь
//        it('should be saved', done =>  {
//            var newuser = new User({name: 'New user', age: 2, sex: 'w'});
//
//            newuser.save(err  =>  {
//                if (err) return done(err);
//
//                User.findById(newuser.id, function (err, user) {
//                    if (err) return done(err);
//                    user.should.eql(newuser);
//                    done();
//                });
//            });
//        });
//    });
//
//    describe('#toJSON', function () {
//
//        //toJSON должен возвращать json представление модели
//        it('should be return json', done =>  {
//            User.findById(0, function (err, user) {
//                if (err) return done(err);
//                user.toJSON().should.be.eql({id: 0, name: 'Jo', age: 20, sex: 'm'});
//                done();
//            });
//        });
//    });
//});
//
//describe('UserList', function () {
//
//    //UserList должен иметь метод toJSON
//    it('should be have #toJSON', function () {
//        UserList.prototype.should.be.have.property('toJSON');
//        UserList.prototype.toJSON.should.be.a('function');
//    });
//});

