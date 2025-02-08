const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken'); // Assuming JWT is used for tokens

// Middleware to Extract ID from Token

const JWT_SECRET = 'your_jwt_secret_key'; // Store securely in env vars


const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    return { userId: decoded.user_id, adminId: decoded.admin_id }; // Adjust based on your token payload structure
  } catch (err) {
    throw new Error('Unauthorized: Invalid token');
  }
};
const recordActivity = async (req, res) => {
    try {
      const { action, subtitle } = req.body;
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });
      const { userId, adminId } = getUserIdFromToken(token);
  
      if (!action) {
        return res.status(400).json({ error: 'Action description is required' });
      }
  
      const newActivity = await prisma.activity.create({
        data: {
          user_id: userId || null,
          admin_id: adminId || null,
          action,
          subtitle: subtitle || null,
        },
      });
  
      res.status(201).json({
        message: 'Activity recorded successfully',
        activity: newActivity,
      });
    } catch (error) {
      console.error('Error recording activity:', error.message, error.stack);
      res.status(500).json({ error: 'An error occurred while recording activity', details: error.message });
    }
  };
  

// Get Activities for Self
const getActivities = async (req, res) => {
  try {
    const { userId, adminId } = req.body;

    if (!userId && !adminId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const activities = await prisma.activity.findMany({
      where: {
        OR: [
          { user_id: userId || undefined },
          { admin_id: adminId || undefined },
        ],
      },
      orderBy: { timestamp: 'desc' },
    });

    res.status(200).json({
      message: 'Activities retrieved successfully',
      activities,
    });
  } catch (error) {
    console.error('Error fetching activities:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching activities' });
  }
};

module.exports = {
  recordActivity,
  getActivities,
};

