const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    Fname: String,
    Lname: String,
    Email: String,
    EMIamount: Number,
    Balance: Number,
    Totalfees: Number,
    Coursename: String,
    Coursetype: String,
    Offer: String,
    Number: String,
    Date: String,
    // Allow additional dynamic fields
    additionalFields: {
        type: Map,
        of: String,
    },
     group: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Group",
     },
     
},{ strict: false });

module.exports = mongoose.model('Student', studentSchema);

