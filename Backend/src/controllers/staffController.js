const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = 'your_jwt_secret_key'; // Store securely in environment variables

// Utility function to verify JWT and get user_id
const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.user_id;
  } catch (err) {
    throw new Error('Unauthorized: Invalid token');
  }
};

// 1) Add Staff
const postStaff = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

    const user_id = getUserIdFromToken(token);
    const { name, qualification, designation, display, rank } = req.body;

    const dp = req.files.dp ? req.files.dp[0].location : null;

    if (!user_id || !name || !qualification || !designation || !dp) {
      return res.status(400).json({
        error: 'All fields are required: name, qualification, designation, and profile picture',
      });
    }

    const newStaff = await prisma.staff.create({
      data: {
        user_id,
        name,
        qualification,
        designation,
        display: display === 'true' || display === true,
        rank: parseInt(rank, 10) || 0,
        dp,
      },
    });

    res.status(201).json({
      message: 'Staff created successfully',
      staff: newStaff,
    });
  } catch (error) {
    console.error('Error creating staff:', error);
    res.status(500).json({ error: 'An error occurred while creating the staff' });
  }
};

// 2) Fetch Staff for a User
const getStaffByUser = async (req, res) => {
  const { user_id } = req.params; // Retrieve `user_id` from the request parameters

  try {
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required to fetch staff' });
    }

    console.log('Fetching staff for user_id:', user_id);

    const staff = await prisma.staff.findMany({
      where: { user_id },
    });

    if (!staff.length) {
      return res.status(404).json({ error: 'No staff found for the specified user_id' });
    }

    res.status(200).json({
      message: 'Staff retrieved successfully',
      staff,
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'An error occurred while fetching staff' });
  }
};

// 3) Delete Staff
const deleteStaff = async (req, res) => {
  const { id } = req.params; // Retrieve the staff ID from the request parameters

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

    const user_id = getUserIdFromToken(token);

    if (!id) {
      return res.status(400).json({ error: 'Staff ID is required to delete staff' });
    }

    const existingStaff = await prisma.staff.findUnique({
      where: { id },
    });

    if (!existingStaff) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    if (existingStaff.user_id !== user_id) {
      return res.status(403).json({ error: 'Unauthorized: You do not own this staff record' });
    }

    await prisma.staff.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ error: 'An error occurred while deleting the staff', details: error.message });
  }
};

module.exports = {
  postStaff,
  getStaffByUser,
  deleteStaff,
};
