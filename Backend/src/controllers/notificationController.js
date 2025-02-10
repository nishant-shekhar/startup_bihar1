const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Post Notification - Admin sends a notification to a user
const postNotification = async (req, res) => {
  try {
    const { user_id, admin_id, admin_role, notification, subtitle, related_to, docLink } = req.body;

    if (!user_id || !admin_id || !admin_role || !notification) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newNotification = await prisma.userNotification.create({
      data: {
        user_id,
        admin_id,
        admin_role,
        notification,
        subtitle,
        related_to,
        docLink,
      },
    });

    res.status(201).json({
      message: 'Notification created successfully',
      notification: newNotification,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'An error occurred while creating the notification.' });
  }
};



// Post Notification - Admin sends a notification to a user
const postPublicNotification = async (req, res) => {
  try {
    const {  admin_id, admin_role, notification, link, docLink ,archieve} = req.body;

    if ( !admin_id || !admin_role || !notification) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newNotification = await prisma.userNotification.create({
      data: {
        admin_id,
        admin_role,
        notification,
        link,
        archieve,
        archieve,
        docLink,
      },
    });

    res.status(201).json({
      message: 'Notification created successfully',
      notification: newNotification,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'An error occurred while creating the notification.' });
  }
};

// Get Notifications for a public
const getPublicNotification = async (req, res) => {
  try {

    const notifications = await prisma.userNotification.findMany({
      where: { archieve: false },

      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      message: 'Public notifications retrieved successfully',
      notifications,
    });
  } catch (error) {
    console.error('Error fetching Public notifications:', error);
    res.status(500).json({ error: 'An error occurred while fetching Public notifications.' });
  }
};

// Get Notifications for a User
const getUserNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notifications = await prisma.userNotification.findMany({
      where: { user_id: id },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      message: 'User notifications retrieved successfully',
      notifications,
    });
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({ error: 'An error occurred while fetching notifications.' });
  }
};

// Get Notifications for an Admin by ID
const getAdminAction = async (req, res) => {
  try {
    const { adminId } = req.params;

    const notifications = await prisma.userNotification.findMany({
      where: { admin_id: adminId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      message: 'Admin notifications retrieved successfully',
      notifications,
    });
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    res.status(500).json({ error: 'An error occurred while fetching notifications.' });
  }
};

// Get Notifications for Admin Role
const getAdminRoleAction = async (req, res) => {
  try {
    const { role } = req.params;

    const notifications = await prisma.userNotification.findMany({
      where: { admin_role: role },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      message: 'Admin role notifications retrieved successfully',
      notifications,
    });
  } catch (error) {
    console.error('Error fetching admin role notifications:', error);
    res.status(500).json({ error: 'An error occurred while fetching notifications.' });
  }
};

module.exports = {
  postNotification,
  getUserNotification,
  getAdminAction,
  getAdminRoleAction,
  postPublicNotification,
  getPublicNotification
};
