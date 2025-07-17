const express = require('express');
const {getActivities,recordActivity, getAdminActivities, recordActivityAdmin, getActivityStartup} = require('../controllers/activityController');

const {authenticateUser} = require('../middlewares/authenticateUser');
const {authenticateAdmin} = require('../middlewares/authenticateAdmin');
const router = express.Router();

// Record Activity
router.post('/userPostActivities', authenticateUser,recordActivity);
router.post('/adminPostActivities', authenticateAdmin,recordActivityAdmin);

// Get Activities for Self
router.get('/adminActivities',authenticateAdmin, getAdminActivities);
router.get('/userActivities',authenticateUser, getActivities);
router.get('/userActivitiesAdmin/:userId',authenticateAdmin, getActivityStartup);

module.exports = router;
