

const express = require('express');
const {  postShowcase, getShowcaseUser, } = require('../controllers/showcaseController');
const { authenticateUser } = require('../middlewares/authenticateUser');

const router = express.Router();

const upload = require('../config/multerconfig');

// POST route for showcase login
router.post('/post', authenticateUser,
    upload.fields([
        { name: 'picUrl', maxCount: 1 },
      ]),postShowcase);
router.get('/get-showcase', getShowcaseUser);




module.exports = router;
