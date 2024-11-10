

// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const {submitQuarterlyReport, getQReportnById, getAllqReportWithUserDetails,updateQreportStatus} = require('../controllers/qReportController');

const { authenticateUser } = require('../middlewares/authenticateUser');
const { authenticateAdmin } = require('../middlewares/authenticateAdmin');

// POST route for submitting the quarterly report
router.post('/',authenticateUser, submitQuarterlyReport);

router.get('/v1/:id',authenticateAdmin, getQReportnById);

router.get('/v2',authenticateAdmin, getAllqReportWithUserDetails);

router.patch(
    '/u1/:id',authenticateAdmin,
    updateQreportStatus

  )

module.exports = router;
