

const express = require('express');
const { userLogin, createUser, updateAbout, updateFacebook, updateInstagram, updateMoto, updateTwitter, updateWebsite, getStartupDetails, updateLogo, updateFounderDp, getTopStartupDetails, updateCoverDp, updateMetrics, updateUserField } = require('../controllers/userController');
const { authenticateUser } = require('../middlewares/authenticateUser');

const router = express.Router();

const upload = require('../config/multerconfig');

// POST route for user login
router.post('/', userLogin);
router.post('/register', createUser);

router.put('/update-twitter', updateTwitter);
router.put('/update-facebook', updateFacebook);
router.put('/update-instagram', updateInstagram);
router.put('/update-website', updateWebsite);
router.put('/update-moto', updateMoto);
router.put('/update-about', updateAbout);
router.put('/update-cover-pic', updateCoverDp);
router.put('/update-logo', authenticateUser, upload.fields([
    { name: 'logo', maxCount: 1 }
]), updateLogo);
router.put('/update-founder_dp', authenticateUser, upload.fields([
    { name: 'founder_dp', maxCount: 1 }
]), updateFounderDp);
router.get('/startup-details', getStartupDetails);
router.get('/top-startups', getTopStartupDetails);

router.put('/update-data',authenticateUser, updateMetrics);
router.put('/update-user-field',authenticateUser, updateUserField);

module.exports = router;
