

const express = require('express');
const router = express.Router();

// Import the controller function
  
  const { applyForAccelerationProgram,getAllAccnWithUserDetails,getAccnById,updateAccnStatus } = require('../controllers/accelerationController');

const { authenticateUser } = require('../middlewares/authenticateUser');
const { authenticateAdmin } = require('../middlewares/authenticateAdmin');



// Define the POST route for applying for an acceleration program
router.post('/',authenticateUser, applyForAccelerationProgram);

router.get('/v2',authenticateAdmin, getAllAccnWithUserDetails);

router.get('/v1/:id',authenticateAdmin, getAccnById);

router.patch(
  '/u1/:id',authenticateAdmin,
  updateAccnStatus
)

module.exports = router;
