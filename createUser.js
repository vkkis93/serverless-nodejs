'use strict';

const mongo = require('./mongo')
module.exports.main = (event, context, callback) =>  {
     console.log(process.env);
    console.log(context)
};
