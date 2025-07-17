

const express = require('express');

const {postNotification,getUserNotification,getAdminAction,getAdminRoleAction, postPublicNotification, getPublicNotification} = require('../controllers/notificationController');
const {authenticateUser} = require('../middlewares/authenticateUser');
const {authenticateAdmin} = require('../middlewares/authenticateAdmin');

const router = express.Router();



router.post(
  '/',authenticateAdmin,
  
  postNotification
);
router.post(
  '/postPublic',authenticateAdmin,
  
  postPublicNotification
);

router.get(
  '/publicNotification',
  getPublicNotification    // Controller function to get the user's document
);

router.get(
  '/userNotification/:id',
  authenticateUser,  // Ensure the user is authenticated
  getUserNotification    // Controller function to get the user's document
);
router.get(
  '/userNotificationAdmin/:id',
  authenticateAdmin,  // Ensure the user is authenticated
  getUserNotification    // Controller function to get the user's document
);
router.get(
  '/adminNotification/:adminId',
  authenticateAdmin,  // Ensure the admin is authenticated
  getAdminAction    // Controller function to get the user's document
);
router.get(
  '/adminRoleNotification/:role',
  authenticateAdmin,  // Ensure the admin is authenticated
  getAdminRoleAction    // Controller function to get the user's document
);

module.exports = router;
