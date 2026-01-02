const express = require("express");
const router = express.Router();

const {
  applyForMatchingLoan,
  getmatchingnById,
  getAllmatchingWithUserDetails,
  updateMatchingStatus,

  // ✅ NEW (pattern same as SeedFund)
  getMatchingLoanStatus,
  getMatchingLoanByToken,
  updateMatchingLoanFiles,
} = require("../controllers/matchingLoanController");

const { authenticateUser } = require("../middlewares/authenticateUser");
const { authenticateAdmin } = require("../middlewares/authenticateAdmin");
const upload = require("../config/multerconfig");

// ✅ Submit / Upsert (already working)
router.post(
  "/",
  authenticateUser,
  upload.fields([
    { name: "proofOfInvestment", maxCount: 1 },
    { name: "accountStatement", maxCount: 1 },
    { name: "investorUndertaking", maxCount: 1 },
    { name: "equityDilutionProof", maxCount: 1 },
    { name: "utilizationPlan", maxCount: 1 },
    { name: "boardResolution", maxCount: 1 },
  ]),
  applyForMatchingLoan
);

// ✅ NEW: Update only files (for partial reject / reupload)
router.post(
  "/update-files",
  authenticateUser,
  upload.fields([
    { name: "proofOfInvestment", maxCount: 1 },
    { name: "accountStatement", maxCount: 1 },
    { name: "investorUndertaking", maxCount: 1 },
    { name: "equityDilutionProof", maxCount: 1 },
    { name: "utilizationPlan", maxCount: 1 },
    { name: "boardResolution", maxCount: 1 },
  ]),
  updateMatchingLoanFiles
);

// ✅ NEW: Get by token (user full document)
router.get("/v3", authenticateUser, getMatchingLoanByToken);

// ✅ NEW: Status endpoint (used by checkFormStatus)
router.get("/status", authenticateUser, getMatchingLoanStatus);

// ✅ Admin: get by id
router.get("/v1/:id", authenticateAdmin, getmatchingnById);

// ✅ Admin: list
router.get("/v2", authenticateAdmin, getAllmatchingWithUserDetails);

// ✅ Admin: update status (+ comment + optional fields)
router.patch("/u1/:id", authenticateAdmin, updateMatchingStatus);

module.exports = router;
