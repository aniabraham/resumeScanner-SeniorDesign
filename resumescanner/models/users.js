var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const UserData = new Schema({
    username: String,
    password: String
});

mongoose.model('users', UserData);