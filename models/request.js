const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {type: String}, // P/A/D
    Date: {type: Date, default: Date.now}
}, {
    timestamps: true
});

let Request = mongoose.model("Request", RequestSchema);

module.exports = Request;