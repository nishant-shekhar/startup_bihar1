

const express = require('express');

const {submitSeedFund,getAllSeedWithUserDetails,getseedById,updateSeedStatus, getSeedFundStatus} = require('../controllers/seedFundController');
const {authenticateUser} = require('../middlewares/authenticateUser');
const {authenticateAdmin} = require('../middlewares/authenticateAdmin');

const router = express.Router();


const upload = require('../config/multerconfig');

router.post(
  '/',authenticateUser,
  upload.fields([
    { name: 'companyCertificate', maxCount: 1 },
    { name: 'cancelChequeOrPassbook', maxCount: 1 },
    { name: 'inc33', maxCount: 1 }, // Example conditional field
    { name: 'inc34', maxCount: 1 },
    { name: 'partnershipAgreement', maxCount: 1 },
    { name: 'dpr', maxCount: 1 },
  ]),
  submitSeedFund
);

router.get(
  '/v2',authenticateAdmin,
  getAllSeedWithUserDetails
);

router.get(
  '/v1/:id',authenticateAdmin,
  getseedById
);

router.patch(
  '/u1/:id',authenticateAdmin,
  updateSeedStatus
)

router.get(
  '/status',
  authenticateUser,  // Ensure the user is authenticated
  getSeedFundStatus    // Controller function to get the user's document
);


module.exports = router;
