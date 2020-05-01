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
    friendRequestSent: [{
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        pending: Boolean, // true: pending, false: done
        accepted: Boolean, // true: yes / false:rejected
        date: {type: Date, default: Date.now()}
    }],
    friendRequestRecieved: [{
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        pending: Boolean, // true: pending, false: done
        accepted: Boolean, // true: yes / false:rejected
        date: {type: Date, default: Date.now()}
    }],
    games: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    }]
});

let User = mongoose.model("User", UserSchema);

module.exports = User;