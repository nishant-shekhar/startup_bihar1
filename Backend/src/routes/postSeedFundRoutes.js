

const express = require('express');
const router = express.Router();

const {submitPostSeedFund,getpostById,getAllpostWithUserDetails,updatepostStatus, getPostSeedFundStatus,updatePostSeedFundFiles, getPostSeedByToken} = require('../controllers/postSeedFundController');

// Setup Multer for file uploads


const { authenticateUser } = require('../middlewares/authenticateUser'); // Import JWT middleware
const { authenticateAdmin } = require('../middlewares/authenticateAdmin'); 
const upload = require('../config/multerconfig');

// Define route for Post Seed Fund submission
router.post(
  '/',authenticateUser,
  upload.fields([
    { name: 'auditedBalanceSheet', maxCount: 1 },
    { name: 'gstReturn', maxCount: 1 },
    { name: 'projectReport', maxCount: 1 },
    { name: 'file1', maxCount: 1 },
    { name: 'file2', maxCount: 1 },
    { name: 'file3', maxCount: 1 },
    { name: 'file4', maxCount: 1 }
  ]),
  submitPostSeedFund
);
router.post(
  '/update-files',
  authenticateUser, // Middleware for authentication
  upload.fields([
    { name: 'auditedBalanceSheet', maxCount: 1 },
    { name: 'gstReturn', maxCount: 1 },
    { name: 'projectReport', maxCount: 1 },
    { name: 'file1', maxCount: 1 },
    { name: 'file2', maxCount: 1 },
    { name: 'file3', maxCount: 1 },
    { name: 'file4', maxCount: 1 }
  ]),
  updatePostSeedFundFiles
);

router.get(
  '/v1/:id',authenticateAdmin,
  getpostById
);

router.get(
  '/v2',authenticateAdmin,
  getAllpostWithUserDetails
);

router.patch(
  '/u1/:id',authenticateAdmin,
  updatepostStatus
)
router.get(
  '/status',
  authenticateUser,  // Ensure the user is authenticated
  getPostSeedFundStatus    // Controller function to get the user's document
);
router.get(
  '/v3',authenticateUser,
  getPostSeedByToken
);

module.exports = router;
