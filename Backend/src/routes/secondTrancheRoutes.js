

const express = require('express');

const {submitSecondTranche,getAllSecnWithUserDetails,getSecondById,updateSecondStatus, getSecondTrancheStatus, getSecondByToken, getPaginatedSecondTrancheApplications} = require('../controllers/secondTrancheController');

const router = express.Router();

const { authenticateUser } = require('../middlewares/authenticateUser'); // Import JWT middleware
const { authenticateAdmin } = require('../middlewares/authenticateAdmin');

const upload = require('../config/multerconfig');

router.post(
  '/',authenticateUser,
  upload.fields([
    { name: 'utilizationCertificate', maxCount: 1 },
    { name: 'statusReport', maxCount: 1 },
    { name: 'expenditurePlan', maxCount: 1 },
    { name: 'bankStatement', maxCount: 1 },
    { name: 'expenditureInvoice', maxCount: 1 },
    { name: 'geoTaggedPhotos', maxCount: 1 }
  ]),
  submitSecondTranche
);

router.get(
  '/v2',authenticateAdmin,
  getAllSecnWithUserDetails
);


router.get(
  '/v1/:id',authenticateAdmin,
  getSecondById
);
router.get(
  '/v3',authenticateUser,
  getSecondByToken
);


router.patch(
  '/u1/:id',authenticateAdmin,
  updateSecondStatus
)
router.get(
  '/status',
  authenticateUser,  // Ensure the user is authenticated
  getSecondTrancheStatus    // Controller function to get the user's document
);

router.get(
  '/v5',authenticateAdmin,
  getPaginatedSecondTrancheApplications
);
module.exports = router;
