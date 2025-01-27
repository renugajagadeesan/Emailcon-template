const express = require("express");
const nodemailer = require("nodemailer");
const {
  upload
} = require("../config/cloudinary");
const Student = require("../models/Student");
const Group = require("../models/Group");
const router = express.Router();
const User = require('../models/User'); // Ensure you import the User model



// Upload image to Cloudinary
router.post('/upload', upload.single('image'), (req, res) => {
  if (req.file && req.file.path) {
    res.json({
      imageUrl: req.file.path
    });
  } else {
    res.status(400).send('Image upload failed');
  }
});

// const TemplateSchema = new mongoose.Schema({
//     previewContent: Array,
//     bgColor: String,
//     emailData: Array
// });

// const Template = mongoose.model('Template', TemplateSchema);
// // Save template to DB
// app.post('/save', async (req, res) => {
//     const {
//         previewContent,
//         bgColor,emailData
//     } = req.body;
//     const template = new Template({
//         previewContent,
//         bgColor,emailData
//     });
//     await template.save();
//     res.send('Saved');
// });
// Route to send a test email
router.post('/sendtestmail', async (req, res) => {
  try {
    const {
      emailData,
      previewContent,
      bgColor,
      userId
    } = req.body;

    // Find the current user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // user model has fields for email and smtppassword
    const {
      email,
      smtppassword
    } = user;

    const transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true, // Use SSL/TLS
        auth: {
          user: email,
          pass: smtppassword
        },
        tls: {
          // Do not fail on invalid certificates
          rejectUnauthorized: false
        }
      });

    const emailContent = previewContent.map((item) => {
      if (item.type === 'para') {
        return `<div class="para" style="border-radius:10px;font-size:${item.style.fontSize};padding:10px; color:${item.style.color}; margin-top:20px; background-color:${item.style.backgroundColor}">${item.content}</div>`;
      } else if (item.type === 'head') {
        return `<p style="font-size:${item.style.fontSize};border-radius:10px;padding:10px;font-weight:bold;color:${item.style.color};text-align:${item.style.textAlign};background-color:${item.style.backgroundColor}">${item.content}</p>`;
      } else if (item.type === 'logo') {
        return `<div style="width:${item.style.width};text-align:${item.style.textAlign};border-radius:10px;background-color:${item.style.backgroundColor};">
                  <img src="${item.src}" style="width:30%;height:${item.style.height};pointer-events:none;"/>
                </div>`;
      } else if (item.type === 'image') {
        return `<img src="${item.src}" style="width:${item.style.width};pointer-events:none;height:${item.style.height};border-radius:10px;text-align:${item.style.textAlign};background-color:${item.style.backgroundColor}"/>`;
      } else if (item.type === 'button') {
        return `<div style="text-align:${item.style.textAlign || 'left'};padding-top:20px;">
                  <a href="${item.link || '#'}" target="_blank" style="display:inline-block;padding:12px 25px;width:${item.style.width || 'auto'};color:${item.style.color || '#000'};text-decoration:none;background-color:${item.style.backgroundColor || '#f0f0f0'};text-align:${item.style.textAlign || 'left'};border-radius:${item.style.borderRadius || '0px'};">
                    ${item.content || 'Button'}
                  </a>
                </div>`;
      }
    }).join('');

    const mailOptions = {
      from: email,
      to: emailData.recipient,
      subject: emailData.subject,
      html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
              @media(max-width:768px) {
                .main { width:330px !important; }
                .para{
                  font-size:15px !important;
                }
              }
            </style>
          </head>

          <body>
              <div style="display:none !important; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
                ${emailData.previewtext}  
              </div>
            <div class="main" style ="background-color:${bgColor || "white"};box-shadow:0 4px 8px rgba(0, 0, 0, 0.2);border:1px solid rgb(255, 245, 245);padding:20px;width:650px;height:auto;border-radius:10px;margin:0 auto;" >
              ${emailContent}
            </div>
          </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      console.log(`Email sent to: ${emailData.recipient}`);
      res.send('Email Sent');
    });
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});
//sendexcelmail directly
router.post('/sendexcelEmail', async (req, res) => {
  const {
    recipientEmail,
    subject,
    body,
    bgcolor,
    previewtext,
    userId
  } = req.body;

  if (!recipientEmail) {
    return res.status(400).send("Email is required.");
  }
  // Find the current user by userId
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).send('User not found');
  }

  // user model has fields for email and smtppassword
  const {
    email,
    smtppassword
  } = user;


  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com', // Hostinger SMTP server
    port: 465, // Secure port    //  port: 587, // Use 587 for STARTTLS
    auth: {
      user: email,
      pass: smtppassword, // Use a secure app smtppassword or hostinger password
    },
    tls: {
      // Do not fail on invalid certificates
      rejectUnauthorized: false
    }
  });

  try {
    // Parse the body string as JSON
    const bodyElements = JSON.parse(body);

    // Function to generate HTML from JSON structure
    const generateHtml = (element) => {
      const {
        type,
        content,
        src,
        style,
        link
      } = element;
      const styleString = Object.entries(style || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');

      switch (type) {
        case 'logo':
          return `<div style="border-radius:10px;${styleString};">
                    <img src="${src}" style="width:30%;" alt="image"/>
                  </div>`;

        case 'image':
          return `<img src="${src}" style="${styleString};border-radius:10px;" alt="image" />`;
        case 'head':
          return `<p style="${styleString};border-radius:10px;padding:10px;font-weight:bold;">${content}</p>`;
        case 'para':
          return `<div class="para" style="${styleString};border-radius:10px;padding:10px;">${content}</div>`;
        case 'button':
          return `<div style="margin:20px auto 0 auto;text-align:center;">
                    <a href = "${link}"
                    target = "_blank"
                    style = "${styleString};display:inline-block;padding:12px 25px;text-decoration:none;" >
                      ${content}
                    </a>
                  </div>`;
        default:
          return '';
      }
    };

    const dynamicHtml = bodyElements.map(generateHtml).join('');

    const mailOptions = {
      from: email,
      to: recipientEmail,
      subject: subject,
      html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
              @media(max-width:768px) {
                .main { width: 330px !important; }
                .para{
                  font-size:15px !important;
                }
              }
            </style>
          </head>
          <body>
            <div style="display:none !important; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
              ${previewtext}
            </div>
              <div class="main" style="background-color:${bgcolor || "white"}; box-shadow:0 4px 8px rgba(0, 0, 0, 0.2); border:1px solid rgb(255, 245, 245); padding:20px;width:650px;height:auto;border-radius:10px;margin:0 auto;">
                ${dynamicHtml}
              </div>
          </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to: ${recipientEmail}`);
    res.send('All Email sent successfully!');
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send(error.toString());
  }
});

//Sendbulk mail using group
router.post('/sendbulkEmail', async (req, res) => {
  const {
    recipientEmail,
    subject,
    body,
    bgcolor,
    previewtext,
    userId
  } = req.body;

  if (!recipientEmail) {
    return res.status(400).send("Email is required.");
  }
  // Find the current user by userId
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).send('User not found');
  }

  // user model has fields for email and smtppassword
  const {
    email,
    smtppassword
  } = user;


  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com', // Hostinger SMTP server
    port: 465, // Secure port    //  port: 587, // Use 587 for STARTTLS
    secure:'true',
    auth: {
      user: email,
      pass: smtppassword, // Use a secure app smtppassword or hostinger password
    },
    tls: {
      // Do not fail on invalid certificates
      rejectUnauthorized: false
    }
  });
  try {
    // Parse the body string as JSON
    const bodyElements = JSON.parse(body);

    // Function to generate HTML from JSON structure
    const generateHtml = (element) => {
      const {
        type,
        content,
        src,
        style,
        link
      } = element;
      const styleString = Object.entries(style || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');

      switch (type) {
        case 'logo':
          return `<div style="border-radius:10px;${styleString};">
                    <img src="${src}" style="width:30%;" alt="image"/>
                  </div>`;

        case 'image':
          return `<img src="${src}" style="${styleString};border-radius:10px;" alt="image" />`;
        case 'head':
          return `<p style="${styleString};border-radius:10px;padding:10px;font-weight:bold;">${content}</p>`;
        case 'para':
          return `<div class="para" style="${styleString};border-radius:10px;padding:10px;">${content}</div>`;
        case 'button':
          return `<div style="margin:20px auto 0 auto;text-align:center;">
                    <a href = "${link}"
                    target = "_blank"
                    style = "${styleString};display:inline-block;padding:12px 25px;text-decoration:none;" >
                      ${content}
                    </a>
                  </div>`;
        default:
          return '';
      }
    };

    const dynamicHtml = bodyElements.map(generateHtml).join('');

    const mailOptions = {
      from: email,
      to: recipientEmail,
      subject: subject,
      html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
              @media(max-width:768px) {
                .main { width: 330px !important; }
                .para{
                  font-size:15px !important;
                }
              }
            </style>
          </head>
          <body>
            <div style="display:none !important; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
              ${previewtext}
            </div>
              <div class="main" style="background-color:${bgcolor || "white"}; box-shadow:0 4px 8px rgba(0, 0, 0, 0.2); border:1px solid rgb(255, 245, 245); padding:20px;width:650px;height:auto;border-radius:10px;margin:0 auto;">
                ${dynamicHtml}
              </div>
          </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to: ${recipientEmail}`);
    res.send('All Email sent successfully!');
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send(error.toString());
  }
});


//getting particular students in selected group for send bulk
router.get("/groups/:groupId/students", async (req, res) => {
  const {
    groupId
  } = req.params;
  const students = await Student.find({
    group: groupId
  });
  res.json(students);
});

//create group
router.post('/groups', async (req, res) => {
  const {
    name,
    userId
  } = req.body;

  if (!userId) {
    return res.status(400).send({
      message: "User ID is required"
    });
  }

  try {
    const group = new Group({
      name,
      user: userId
    }); // Correct object structure
    await group.save();
    res.status(201).send(group);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error creating group"
    });
  }
});


//add student to selected group through excel

router.post("/students/upload", async (req, res) => {
  try {
    // console.log("Received data:", req.body); // Debugging
    await Student.insertMany(req.body);
    res.status(201).send("Students uploaded successfully");
  } catch (error) {
    console.error("Error inserting students:", error);
    res.status(500).send("Error uploading students");
  }
});

//add manually student to selected group
router.post("/students/manual", async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.status(201).send(student);
});

//getting all students in corresponting group
router.get("/students", async (req, res) => {
  const students = await Student.find().populate("group");
  res.send(students);
});


//getting all groups
router.get('/groups/:userId', async (req, res) => {
  try {
    const groups = await Group.find({
      user: req.params.userId
    });
    res.json(groups);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching groups'
    });
  }
});

// 2. DELETE route to delete a group and its associated students
router.delete('/groups/:id', async (req, res) => {
  try {
    const groupId = req.params.id;
    await Group.findByIdAndDelete(groupId); // Delete group
    await Student.deleteMany({
      group: groupId
    }); // Delete all students in that group
    res.status(200).json({
      message: 'Group and associated students deleted'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting group and students'
    });
  }
});

// 3. GET route to fetch all students, with optional filtering by group
router.get('/students', async (req, res) => {
  try {
    const {
      group
    } = req.query; // Filter by group if provided
    const filter = group ? {
      group
    } : {}; // Apply filter if group is provided
    const students = await Student.find(filter);
    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching students'
    });
  }
});

// 4. DELETE route to delete selected students
router.delete('/students', async (req, res) => {
  try {
    const {
      studentIds
    } = req.body; // Array of student IDs to delete
    await Student.deleteMany({
      _id: {
        $in: studentIds
      }
    }); // Delete students
    res.status(200).json({
      message: 'Selected students deleted'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting students'
    });
  }
});

// 5. PUT route to edit a student's details
router.put("/students/:id", async (req, res) => {
  const {
    Fname,
    Lname,
    Email,
    EMIamount,
    Balance,
    Totalfees,
    Coursetype,
    Coursename,
    Offer,
    Number,
    Date,
    group
  } = req.body;
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    // Update the student details
    student.Fname = Fname;
    student.Lname = Lname;
    student.Email = Email;
    student.EMIamount = EMIamount;
    student.Totalfees = Totalfees;
    student.Balance = Balance;
    student.Coursename = Coursename;
    student.Coursetype = Coursetype;
    student.Offer = Offer;
    student.Number = Number;
    student.Date = Date;
    student.group = group; // Ensure this is the correct reference (group ID)

    await student.save();

    res.json(student);
  } catch (err) {
    res.status(500).json({
      message: "Error updating student",
      error: err
    });
  }
});


//edit group name
router.put('/groups/:id', (req, res) => {
  const groupId = req.params.id;
  const updatedName = req.body.name;

  // Assuming you are using MongoDB with Mongoose
  Group.findByIdAndUpdate(groupId, {
      name: updatedName
    }, {
      new: true
    })
    .then(updatedGroup => res.json(updatedGroup))
    .catch(err => res.status(400).send(err));
});


module.exports = router;