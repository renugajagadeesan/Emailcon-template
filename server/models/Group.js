const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
     user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
     },



}, {
    timestamps: true
});


module.exports = mongoose.model("Group", groupSchema);