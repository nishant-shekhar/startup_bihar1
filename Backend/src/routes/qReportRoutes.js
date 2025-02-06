

// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const {submitQuarterlyReport, getAllqReportWithUserDetails,updateQreportStatus, getQReportsByUserId} = require('../controllers/qReportController');

const { authenticateUser } = require('../middlewares/authenticateUser');
const { authenticateAdmin } = require('../middlewares/authenticateAdmin');
const upload = require('../config/multerconfig');

// POST route for submitting the quarterly report
router.post('/',authenticateUser,upload.fields([
  { name: 'pitchdeck', maxCount: 1 },
  { name: 'auditedReport', maxCount: 1 },
  { name: 'unitPhoto1', maxCount: 1 },
  { name: 'unitPhoto2', maxCount: 1 },

]), submitQuarterlyReport);

router.get('/v1/:id',authenticateAdmin, getQReportsByUserId);
router.get('/userFetch/:id',authenticateUser, getQReportsByUserId);

router.get('/v2',authenticateAdmin, getAllqReportWithUserDetails);

router.patch(
    '/u1/:id',authenticateAdmin,
    updateQreportStatus

  )

module.exports = router;
