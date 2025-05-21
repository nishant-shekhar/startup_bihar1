const express = require('express');
const { adminLogin, createAdmin, resetUserPassword } = require('../controllers/adminController');

const router = express.Router();

// POST route for admin login
router.post('/', adminLogin);

// POST route for creating a new admin
router.post('/register', createAdmin);
router.post('/reset-user-password', resetUserPassword);

module.exports = router;