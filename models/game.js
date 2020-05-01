const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    tableNumber: {type: Number, required: true, unique: true},
    players: {
        p1: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        p2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    joined: {
        p1: Boolean,
        p2: Boolean
    },
    scores: {
        p1: {type: Number, defaule: 0},
        p2: {type: Number, defaule: 0}
    },
    cards: [{
        question: {type: String, required: true},
        answers: [{
            option: {type: String, required: true},
            correct: Boolean
        }],
        find: {type: String}, // truth / false
        givenBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        actions: {
            answerGivenBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            answredCorrect: Boolean
            //optionSelected: Number
        }
    }],
    gameIsAlive: Boolean
});

let Game = mongoose.model("Game", GameSchema);

module.exports = Game;