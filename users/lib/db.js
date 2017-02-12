const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
module.exports = {
    connect: function(dbConnection) {
        return mongoose.connect(dbConnection);
    },
    disconnect: function() {
        return  mongoose.disconnect()
    },
    objectId: function(id) {
        return mongoose.Types.ObjectId(id)
    },
    user: require('./schema/user'),
    response: require('./response')
}
