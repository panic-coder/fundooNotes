var mongoose = require('mongoose'); //Nongoose for database communication

/**
 * Schema for user information
 */
var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
       type: String,
       required: true
    },
    phone: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    }
}, {collection: 'userInfo'})

var User = module.exports = mongoose.model('userInfo', UserSchema);

module.exports.addUser = (newUser, callback) => {
    newUser.save(callback);
}