

const express = require('express');
const { applyForCoWorkingSpace,getAllCoworkingWithUserDetails,getcoworkingById,updateCoworkinStatus, getCoWorkingByToken, getAllCoworkingWiseApplication } = require('../controllers/coWorkingApplicationController');
const router = express.Router();

const { authenticateUser } = require('../middlewares/authenticateUser'); 
const { authenticateAdmin } = require('../middlewares/authenticateAdmin'); 

router.post('/',authenticateUser, applyForCoWorkingSpace);

router.get('/v2',authenticateAdmin, getAllCoworkingWithUserDetails);

router.get('/v1/:id',authenticateAdmin, getcoworkingById);

router.patch(
    '/u1/:id',authenticateAdmin,
    updateCoworkinStatus
  )

  router.get(
    '/v3',authenticateUser,
    getCoWorkingByToken
  );
  router.get('/center/:center', getAllCoworkingWiseApplication);

module.exports = router
