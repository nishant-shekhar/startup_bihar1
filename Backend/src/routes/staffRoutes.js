const express = require("express");
const {
	postStaff,
	getStaffByUser,
	deleteStaff,
} = require("../controllers/staffController");
const { authenticateUser } = require("../middlewares/authenticateUser");

const router = express.Router();

const upload = require("../config/multerconfig");

router.post(
	"/post",
	authenticateUser,
	upload.fields([{ name: "dp", maxCount: 1 }]),
	postStaff,
);
router.get("/getEmployees/:user_id", getStaffByUser);
router.delete("/staff/:id", authenticateUser, deleteStaff);

module.exports = router;