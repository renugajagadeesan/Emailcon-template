const express = require('express');
const cors = require('cors');
const studentRoutes = require('./routes/StudentRoutes');
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const path = require("path");
require('dotenv').config();

// Connect to MongoDB
connectDB();
// Middleware
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));


// Catch-all handler to serve React index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// Routes
app.use('/', studentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);


// // Middleware to verify the token and fetch user details
// const authenticate = async (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).send("Access Denied");

//     try {
//         const verified = jwt.verify(token, "secret");
//         req.user = await User.findById(verified.id).select("-password"); // Exclude password
//         next();
//     } catch (err) {
//         res.status(400).send("Invalid Token");
//     }
// };

// // Route to get user details
// app.get("/api/auth/me", authenticate, (req, res) => {
//     res.send(req.user);
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));