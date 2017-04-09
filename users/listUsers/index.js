'use strict';
const db = require('../lib/db');
module.exports.main = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    db.connect(process.env.MONGO_URL);
    db.user.find().then((users) => {
        db.disconnect();
        const response = {
            statusCode: 200,
            body: JSON.stringify(users)
        };
        callback(null, response);
    }).catch((err) => {
        const errObj = {
            statusCode: err.statusCode || 500,
            body: JSON.stringify(err)
        };
        db.disconnect();
        callback(null, errObj);
    });
};

