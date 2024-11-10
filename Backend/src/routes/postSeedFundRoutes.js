

const express = require('express');
const router = express.Router();

const {submitPostSeedFund,getpostById,getAllpostWithUserDetails,updatepostStatus} = require('../controllers/postSeedFundController');

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
    { name: 'projectReport', maxCount: 1 }
  ]),
  submitPostSeedFund
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

module.exports = router;
