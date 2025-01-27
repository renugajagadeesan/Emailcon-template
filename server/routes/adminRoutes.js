const express = require("express");
const { getUsers, updateStatus } = require("../controllers/adminController");
const router = express.Router();

router.get("/users", getUsers);
router.post("/update-status", updateStatus);

module.exports = router;