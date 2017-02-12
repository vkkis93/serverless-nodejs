'use strict';
const Joi = require('joi'),
    db = require('./lib/db');
module.exports.main = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const data = JSON.parse(event.body);
    validate(data).then(result => {
        db.connect(process.env.MONGO_URL);
        const userObj = new db.user(data);
        return userObj.save();
    }).then(() => {
        db.disconnect();
        const response = {
            statusCode: 200,
            body: JSON.stringify({"message": "OK"})
        };
        callback(null, response);
    }).catch((err) => {
        if (err.body) {
            err.body = JSON.stringify(err.body);
        }
        db.disconnect();
        callback(null, err);
    });
};


function validate(params) {
    return new Promise((resolve, reject) => {
        const schema = Joi.object().keys({
            firstName: Joi.string().max(40).required(),
            lastName: Joi.string().max(40).required(),
            avatar: Joi.string(),
            email: Joi.string().max(80).required(),
            password: Joi.string().max(20).required(),
            phone: Joi.string()
        });
        Joi.validate(params, schema, (err, result) => {
            if (err) {
                return reject({statusCode: 400, body: {message: err.details[0].message}});
            }
            return resolve(result);
        });
    });
}
