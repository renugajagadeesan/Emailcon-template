const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    // port:'587',
    auth: {
        user: "emailcon.01012000@gmail.com",
        pass: "deyq kjki kvii olua",
    },
});

module.exports = transporter;