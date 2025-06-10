const express = require('express');
const {
  adminLogin,
  createAdmin,
  resetUserPassword,
  getStartupsByCategoryAdmin,
  startupDetailAdmin,
  updateStartupByAdmin
} = require('../controllers/adminController');
const { authenticateAdmin } = require('../middlewares/authenticateAdmin');

const router = express.Router();

// POST route for admin login
router.post('/', adminLogin);

// POST route for creating a new admin
router.post('/register', createAdmin);

// POST route for resetting user password
router.post('/reset-user-password', authenticateAdmin, resetUserPassword);

// GET route for startups by category
router.get('/startups/category/:category', authenticateAdmin, getStartupsByCategoryAdmin);

// ✅ FIXED: GET route for a single startup's details
router.get('/startup/details/:user_id', authenticateAdmin, startupDetailAdmin);

router.put("/update-startup-details", authenticateAdmin, updateStartupByAdmin);


module.exports = router;
