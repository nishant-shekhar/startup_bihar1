

const express = require('express');
const { userLogin, createUser, updateMoto, getStartupDetails, updateLogo, updateFounderDp, getTopStartupDetails, updateCoverDp, updateMetrics, updateUserField, addStaff, getStaffByStartup,deleteStaff ,getStartupsByCategory, getPublicStartupDetails, changePassword} = require('../controllers/userController');
const { authenticateUser } = require('../middlewares/authenticateUser');

const router = express.Router();

const upload = require('../config/multerconfig');

// POST route for user login
router.post('/', userLogin);
router.post('/register', createUser);


router.put('/update-moto', updateMoto);
router.put('/update-cover-pic', updateCoverDp);
router.put('/update-logo', authenticateUser, upload.fields([
    { name: 'logo', maxCount: 1 }
]), updateLogo);
router.put('/update-founder_dp', authenticateUser, upload.fields([
    { name: 'founder_dp', maxCount: 1 }
]), updateFounderDp);
router.get('/startup-details',authenticateUser, getStartupDetails);
router.get('/public-startup-details', getPublicStartupDetails);
router.get('/top-startups', getTopStartupDetails);

router.put('/update-data',authenticateUser, updateMetrics);
router.put('/update-user-field',authenticateUser, updateUserField);

router.post('/addEmployees', authenticateUser,upload.fields([
    { name: 'dp', maxCount: 1 }
]),addStaff); // Add an employee
router.get('/getEmployees/:user_id', getStaffByStartup); // Get employees by startup
router.delete("/deleteEmployee/:id", authenticateUser,deleteStaff);
router.get("/startups/by-category/:category", getStartupsByCategory);

router.put('/change-password', authenticateUser, changePassword);


module.exports = router;
