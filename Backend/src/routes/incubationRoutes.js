

const express = require('express');
const router = express.Router();
const { applyForIncubation,getAllIncubationWithUserDetails,getIncubationnById,updateincubationStatus } = require('../controllers/incubationController');

const { authenticateUser } = require('../middlewares/authenticateUser');
const { authenticateAdmin } = require('../middlewares/authenticateAdmin');

// Route for applying to an incubation center
router.post('/',authenticateUser, applyForIncubation);


router.get('/v1/:id',authenticateAdmin, getIncubationnById);
router.get('/v2',authenticateAdmin, getAllIncubationWithUserDetails);

router.patch(
    '/u1/:id',authenticateAdmin,
    updateincubationStatus
  )

module.exports = router;
