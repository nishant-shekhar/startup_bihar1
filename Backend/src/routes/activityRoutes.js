const express = require('express');
const {getActivities,recordActivity} = require('../controllers/activityController');

const {authenticateUser} = require('../middlewares/authenticateUser');
const {authenticateAdmin} = require('../middlewares/authenticateAdmin');
const router = express.Router();

// Record Activity
router.post('/userPostActivities', authenticateUser,recordActivity);
router.post('/adminPostActivities', authenticateAdmin,recordActivity);

// Get Activities for Self
router.get('/adminActivities',authenticateAdmin, getActivities);
router.get('/userActivities',authenticateUser, getActivities);

module.exports = router;
