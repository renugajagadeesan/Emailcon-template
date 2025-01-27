const User = require("../models/User");
const transporter = require("../config/nodemailer");

exports.getUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

exports.updateStatus = async (req, res) => {
    const {
        id,
        status
    } = req.body;
    const user = await User.findByIdAndUpdate(
        id, {
            isActive: status
        }, {
            new: true
        }
    ); {
        /* <h4>Your account has been ${status ? "activated" : "deactivated"}.</h4> */
    }
    const mailOptions = {
        from: "megarajan55@gmail.com",
        to: user.email,
        subject: `Account ${status ? "Activated" : "Deactivated"}`,
        html: `
    <html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Notification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f7f7f7;
      color: #333;
    }

    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .username{
        font-weight:600;
    }

    .header {
      background: #1a5eb8;
      color: white;
      padding: 20px;
      text-align: center;
    }

    .header .mail-icon {
      font-size: 50px;
      margin-bottom: 10px;
    }

    .header h1 {
      font-size: 24px;
      margin: 0;
    }

    .content {
      padding: 20px;
      text-align: center;
      line-height: 1.6;
    }

    .content p {
      margin: 10px 0;
    }

    .content .activation-btn,
    .content .deactivation-btn {
      display: inline-block;
      margin: 10px 0;
      padding: 10px 20px;
      text-decoration: none;
      font-size: 16px;
      font-weight: bold;
      border-radius: 5px;
      transition: background-color 0.3s ease;
    }
    .content .deactivation-btn {
      background: #f44336;
      color: white;
    }

    .content .deactivation-btn:hover {
      background: #e53935;
    }

    .footer {
      background: #f7f7f7;
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: #666;
    }

    .footer a {
      color: #4CAF50;
      text-decoration: none;
    }

    /* Media Query for Small Screens */
    @media (max-width: 768px) {
      .email-container {
        margin: 10px;
        font-size: 14px;
      }

      .header .mail-icon {
        font-size: 40px;
      }

      .header h1 {
        font-size: 20px;
      }

      .content .activation-btn,
      .content .deactivation-btn {
        padding: 8px 16px;
        font-size: 14px;
      }

      .content p {
        font-size: 14px;
      }
    }

    /* Media Query for Very Small Screens */
    @media (max-width: 400px) {
      .content .activation-btn,
      .content .deactivation-btn {
        width: 100%;
        box-sizing: border-box;
        padding: 10px;
        font-size: 14px;
      }

      .content p {
        margin: 5px 0;
        font-size: 12px;
      }

      .footer {
        padding: 5px;
        font-size: 10px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="mail-icon">✉️</div>
      <h1>Account Notification</h1>
    </div>
    <div class="content">
      <p>Hello <span class="username">${user.username}<span/>,</p>
      <p>Your account status has changed. Please take the necessary actions below:</p>
       <h3>Your account has been ${status ? "activated" : "deactivated"}.</h3>
       <p>We wanted to let you know that there has been an update to your account. Whether you're looking to access your features or temporarily deactivate your account, we've made it simple and secure for you.</p>
      <p>If you choose to activate your account, you will regain access to all your services, data, and personalized settings. However, if you decide to deactivate, your account will be paused, and you can reactivate it anytime.</p>

    </div>
    <div class="footer">
      <p>If you have any questions, contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>
    </div>
  </div>
</body>
</html>`,
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) return res.status(500).send("Email failed to send.");
        res.send(`Account ${status ? "activated" : "deactivated"} successfully.`);
    });
};