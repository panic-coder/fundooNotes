var mongoose = require('mongoose'); //Nongoose for database communication
var bcrypt = require('bcryptjs');
var saltRounds = 10;

/**
 * @description Schema for user information
 */
var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: { unique: true  }
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
    },
    label: [{
        name: String
    }],
    profilePicture: {
        type: String
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, {collection: 'userInfo'})

var User = module.exports = mongoose.model('userInfo', UserSchema);

/**
 * @description Add user object in database
 * @param {user object} newUser 
 * @param {*} callback 
 */
module.exports.addUser = (newUser, callback) => {
    save(newUser,callback);
    //newUser.save(callback);
}

/**
 * @description Save user data
 */
save = (newUser, callback) => {
    bcrypt.genSalt(saltRounds, function(err, salt) {
        console.log(salt);
        
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            // Store hash in your password DB.
            if(err) {
                return;
            } 
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}
