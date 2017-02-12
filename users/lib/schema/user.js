'use strict';
const mongoose = require('mongoose'),
    bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstName: {type: String, maxlength: 40},
    lastName: {type: String, maxlength: 40},
    state: {
        type: String,
        enum: ['active', 'not_verified', 'blocked'],
        default: 'active',
        required: true
    },
    avatar: {type: String},
    email: {type: String, required: true, maxlength: 80},
    password: {type: String, minlength: 6, maxlength: 20},
    phone: {type: String}
}, {
    versionKey: false,
    timestamps: true
});

userSchema.pre('save', function (next) {
    if (!this.isNew) {
        return next();
    }
    this.email = this.email.toLowerCase();
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) {
                next(err);
            } else {
                this.password = hash;
                return next();
            }
        });
    });
});

module.exports = mongoose.model('User', userSchema, 'User');
