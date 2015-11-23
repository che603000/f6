/**
 * Created by alex on 23.11.2015.
 */
"use strict";

module.exports= (app, config)=>{
    app.use('/',require('./test')(app, config));
    app.use('/user',require('./user')(app, config));


    app.use(require('./errors').err400);
    app.use(require('./errors').err500);
    app.use(require('./errors').err404);

};


