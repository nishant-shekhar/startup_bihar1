

const express = require('express');

const {submitSeedFund,getAllSeedWithUserDetails,getseedById,updateSeedStatus} = require('../controllers/seedFundController');
const {authenticateUser} = require('../middlewares/authenticateUser');
const {authenticateAdmin} = require('../middlewares/authenticateAdmin');

const router = express.Router();


const upload = require('../config/multerconfig');

router.post(
  '/',authenticateUser,
  upload.fields([
    { name: 'companyCertificate', maxCount: 1 },
    { name: 'cancelChequeOrPassbook', maxCount: 1 }
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

module.exports = router;
