const express = require('express');
const { adminLogin, createAdmin } = require('../controllers/adminController');

const router = express.Router();

// POST route for admin login
router.post('/', adminLogin);

// POST route for creating a new admin
router.post('/register', createAdmin);

module.exports = router;