



const express = require('express');
const router = express.Router();

const { applyForMatchingLoan,getmatchingnById, getAllmatchingWithUserDetails,updateMatchingStatus } = require('../controllers/matchingLoanController');

const { authenticateUser } = require('../middlewares/authenticateUser');  // Import JWT middleware
const { authenticateAdmin } = require('../middlewares/authenticateAdmin');
const upload = require('../config/multerconfig');

// Define the POST route for applying for a matching loan
router.post(
  '/',authenticateUser,
  upload.fields([
    { name: 'proofOfInvestment', maxCount: 1 },
    { name: 'accountStatement', maxCount: 1 },
    { name: 'investorUndertaking', maxCount: 1 },
    { name: 'equityDilutionProof', maxCount: 1 },
    { name: 'utilizationPlan', maxCount: 1 },
    { name: 'boardResolution', maxCount: 1 }
  ]), // Handle multiple file fields
  applyForMatchingLoan
);

router.get(
  '/v1/:id',authenticateAdmin,
  getmatchingnById
);

router.get(
  '/v2',authenticateAdmin,
  getAllmatchingWithUserDetails
);

router.patch(
  '/u1/:id',authenticateAdmin,
   updateMatchingStatus
)

module.exports = router;
