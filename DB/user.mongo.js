/**
 * Created by julian on 28.01.2016.
 */
var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    username: String,
    id: String,
    avatar: String,
    role: Number,
    hash: String

});
var userModel = mongoose.model('User', userSchema);
module.exports = userModel;
