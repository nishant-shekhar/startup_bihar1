const express = require("express");
const { createSeats, assignSeat, getAllSeats, emptySeat } = require("../controllers/seatMapController");
const router = express.Router();

// Route to create seats
router.post("/create-seats", createSeats);

// Route to assign/change seat
router.put("/assign-seat", assignSeat);
router.get("/get-all-seats", getAllSeats);
router.get("/empty-seat", emptySeat);

module.exports = router;
