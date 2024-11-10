

const express = require('express');
const { userLogin,createUser } = require('../controllers/userController');

const router = express.Router();

// POST route for user login
router.post('/', userLogin);
router.post('/register', createUser);

module.exports = router;
