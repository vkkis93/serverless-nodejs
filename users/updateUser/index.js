'use strict';
const db = require('../lib/db');
module.exports.main = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const params = event.pathParameters,
        data = JSON.parse(event.body);
    if (!params) {
        throw db.response.missedId;
    }
    db.connect(process.env.MONGO_URL);
    db.user.findOne({_id: params.id}, {password:0}).then((user) => {
        if (!user) {
            throw db.response.userNotFound;
        }
        user.firstName = data.firstName || user.firstName;
        user.lastName = data.lastName || user.lastName;
        user.phone = data.phone || user.phone;
        user.email = data.email || user.email;
        return user.save();
    }).then(user => {
        db.disconnect();
        const response = {
            statusCode: 200,
            body: JSON.stringify(user)
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

