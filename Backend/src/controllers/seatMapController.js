const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create 160 seats
const createSeats = async (req, res) => {
  try {
    const seats = [];

    for (let i = 1; i <= 160; i++) {
      seats.push({
        center: "bhub_maurya",
        seatNo: i.toString(),
        seatName: i.toString(),
        seatType: "active",
        status: "Available",
      });
    }

    await prisma.coWorkingSeatMap.createMany({
      data: seats,
      skipDuplicates: true, // avoid duplicates if rerun
    });

    res.json({ message: "160 seats created successfully." });
  } catch (error) {
    console.error("Error creating seats:", error);
    res.status(500).json({ error: "Failed to create seats" });
  }
};

// Get all seats
const getAllSeats = async (req, res) => {
  try {
    const seats = await prisma.coWorkingSeatMap.findMany({
      orderBy: {
        seatNo: 'asc'
      }
    });

    res.json(seats);
  } catch (error) {
    console.error("Error fetching seats:", error);
    res.status(500).json({ error: "Failed to fetch seats" });
  }
};

// Assign or change a seat to a user
const assignSeat = async (req, res) => {
  const { center, seatNo, userId } = req.body;

  try {
    const seat = await prisma.coWorkingSeatMap.updateMany({
      where: {
        center,
        seatNo: seatNo.toString(),
      },
      data: {
        userId,
        status: "Booked",
      },
    });

    if (seat.count === 0) {
      return res.status(404).json({ message: "Seat not found" });
    }

    res.json({ message: "Seat assigned successfully" });
  } catch (error) {
    console.error("Error assigning seat:", error);
    res.status(500).json({ error: "Failed to assign seat" });
  }
};
// Empty a seat (make it available)
const emptySeat = async (req, res) => {
  const { center, seatNo } = req.body;

  try {
    const seat = await prisma.coWorkingSeatMap.updateMany({
      where: { center, seatNo: seatNo.toString() },
      data: { userId: null, status: "Available" },
    });

    if (seat.count === 0) {
      return res.status(404).json({ message: "Seat not found" });
    }

    res.json({ message: "Seat emptied successfully" });
  } catch (error) {
    console.error("Error emptying seat:", error);
    res.status(500).json({ error: "Failed to empty seat" });
  }
};

module.exports = {
  createSeats,
  assignSeat,
  getAllSeats,
  emptySeat
};
