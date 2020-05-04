const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    personal: {
        name: String,
        age: Number,
        bio: String,
        gender: String
    },
    cred: {
        username: {type: String, unique: true, required: true},
        password: {type: String, required: true}
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    requests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request'
    }],
    games: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    }]
});

let User = mongoose.model("User", UserSchema);

module.exports = User;