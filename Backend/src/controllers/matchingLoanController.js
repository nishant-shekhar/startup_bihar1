const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

/**
 * ✅ EXISTING: applyForMatchingLoan (keep as-is)
 * (Your current submit/upsert is working, so not changing it)
 */
const applyForMatchingLoan = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });

    let userId;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.user_id;
    } catch (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // Helpers for multer-s3 + disk compatibility
    const pickName = (f) => f?.filename || f?.originalname || f?.key || null;
    const pickPath = (f) => f?.path || f?.location || f?.key || null;

    const matchingLoanData = {
      fundRaised: parseFloat(req.body.fundRaised),
      investorName: req.body.investorName,
      matchingGrantAmount: parseFloat(req.body.matchingGrantAmount),
      documentStatus: "created",
    };

    // Handle files
    if (req.files) {
      if (req.files.proofOfInvestment?.length) {
        const f = req.files.proofOfInvestment[0];
        matchingLoanData.proofOfInvestmentName = pickName(f);
        matchingLoanData.proofOfInvestmentPath = pickPath(f);
      }

      if (req.files.accountStatement?.length) {
        const f = req.files.accountStatement[0];
        matchingLoanData.accountStatementName = pickName(f);
        matchingLoanData.accountStatementPath = pickPath(f);
      }

      if (req.files.investorUndertaking?.length) {
        const f = req.files.investorUndertaking[0];
        matchingLoanData.investorUndertakingName = pickName(f);
        matchingLoanData.investorUndertakingPath = pickPath(f);
      }

      if (req.files.equityDilutionProof?.length) {
        const f = req.files.equityDilutionProof[0];
        matchingLoanData.equityDilutionProofName = pickName(f);
        matchingLoanData.equityDilutionProofPath = pickPath(f);
      }

      if (req.files.utilizationPlan?.length) {
        const f = req.files.utilizationPlan[0];
        matchingLoanData.utilizationPlanName = pickName(f);
        matchingLoanData.utilizationPlanPath = pickPath(f);
      }

      if (req.files.boardResolution?.length) {
        const f = req.files.boardResolution[0];
        matchingLoanData.boardResolutionName = pickName(f);
        matchingLoanData.boardResolutionPath = pickPath(f);
      }
    }

    const matchingLoan = await prisma.matchingLoan.upsert({
      where: { userId },
      update: { ...matchingLoanData },
      create: { ...matchingLoanData, userId },
    });

    await prisma.activity.create({
      data: {
        user_id: userId,
        action: "Matching Loan Form Submitted",
        subtitle: `You have submitted your matching Loan Form`,
      },
    });

    return res.status(200).json({
      message: "Loan application updated successfully",
      matchingLoan,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while processing the request" });
  }
};

/**
 * ✅ NEW: User-side — get by token (like getSeedByToken / getPostSeedByToken)
 */
const getMatchingLoanByToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Authorization token is required" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.user_id;

    const document = await prisma.matchingLoan.findUnique({
      where: { userId },
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    return res.status(200).json(document);
  } catch (error) {
    console.error("Error retrieving matching loan by token:", error);
    return res.status(500).json({ error: "An error occurred while retrieving the document" });
  }
};

/**
 * ✅ NEW: User-side — status API (like getSeedFundStatus / getPostSeedFundStatus)
 * This is what your frontend calls in checkFormStatus()
 */

/**
 * ✅ NEW: User-side — update only files (like updateSeedFundFiles / updatePostSeedFundFiles)
 * Important for partial reject: startup reuploads only rejected docs.
 *
 * Works for both multer-s3 (location) and disk (path).
 */
const updateMatchingLoanFiles = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Authorization token is required" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.user_id;

    const pickName = (f) => f?.filename || f?.originalname || f?.key || null;
    const pickPath = (f) => f?.path || f?.location || f?.key || null;

    const updatedFields = {};

    const mapFile = (field, nameKey, pathKey) => {
      if (req.files?.[field]?.length) {
        const f = req.files[field][0];
        updatedFields[nameKey] = pickName(f);
        updatedFields[pathKey] = pickPath(f);
      }
    };

    mapFile("proofOfInvestment", "proofOfInvestmentName", "proofOfInvestmentPath");
    mapFile("accountStatement", "accountStatementName", "accountStatementPath");
    mapFile("investorUndertaking", "investorUndertakingName", "investorUndertakingPath");
    mapFile("equityDilutionProof", "equityDilutionProofName", "equityDilutionProofPath");
    mapFile("utilizationPlan", "utilizationPlanName", "utilizationPlanPath");
    mapFile("boardResolution", "boardResolutionName", "boardResolutionPath");

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ error: "No files provided for update" });
    }

    const updated = await prisma.matchingLoan.update({
      where: { userId },
      data: {
        ...updatedFields,
        documentStatus: "Updated",
      },
    });

    return res.status(200).json({
      message: "Matching loan files updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating matching loan files:", error);
    return res.status(500).json({ error: "An error occurred while updating the files." });
  }
};

/**
 * ✅ Existing: Admin list — small improvement to match Seed/Post list style
 * (Add documentStatus + updatedAt)
 */
const getAllmatchingWithUserDetails = async (req, res) => {
  try {
    const documents = await prisma.matchingLoan.findMany({
      select: {
        id: true,
        documentStatus: true,
        updatedAt: true,
        user: {
          select: {
            user_id: true,
            registration_no: true,
            company_name: true,
            logo: true,
            document: {
              select: {
                coFounderNames: true,
                logoPath: true,
                category: true,
                founderName: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      message: "Documents with user and program details retrieved successfully",
      data: documents,
    });
  } catch (error) {
    console.error("Error fetching documents with user details:", error);
    res.status(500).json({ error: "An error occurred while fetching documents" });
  }
};

/**
 * ✅ Existing: Admin detail by ID (keep)
 */
const getmatchingnById = async (req, res) => {
  let { id } = req.params;

  try {
    if (!id) return res.status(400).json({ error: "ID is required" });

    const document = await prisma.matchingLoan.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            user_id: true,
            registration_no: true,
            company_name: true,
            founder_name: true,
            dateOfIncorporation: true,
            districtRoc: true,
            cin: true,
            mobile: true,
            email: true,
          },
        },
      },
    });

    if (!document) return res.status(404).json({ error: "Document not found" });
    return res.status(200).json(document);
  } catch (error) {
    console.error(`Error retrieving document with id ${id}:`, error);
    return res.status(500).json({ error: "An error occurred while retrieving the document" });
  }
};

/**
 * ✅ UPDATED: Admin status update — match Seed/Post pattern
 * Supports:
 * - documentStatus (required)
 * - comment
 * - optional override of any file path/name fields (useful for admin corrections)
 */
const updateMatchingStatus = async (req, res) => {
  const { id } = req.params;

  const {
    documentStatus,
    comment,

    proofOfInvestmentName,
    proofOfInvestmentPath,
    accountStatementName,
    accountStatementPath,
    investorUndertakingName,
    investorUndertakingPath,
    equityDilutionProofName,
    equityDilutionProofPath,
    utilizationPlanName,
    utilizationPlanPath,
    boardResolutionName,
    boardResolutionPath,
  } = req.body;

  if (!documentStatus) {
    return res.status(400).json({ error: "Document status is required" });
  }

  try {
    const document = await prisma.matchingLoan.findUnique({ where: { id } });
    if (!document) return res.status(404).json({ error: "Document not found" });

    const updateData = {
      documentStatus,
      comment,
      ...(proofOfInvestmentName !== undefined && { proofOfInvestmentName }),
      ...(proofOfInvestmentPath !== undefined && { proofOfInvestmentPath }),
      ...(accountStatementName !== undefined && { accountStatementName }),
      ...(accountStatementPath !== undefined && { accountStatementPath }),
      ...(investorUndertakingName !== undefined && { investorUndertakingName }),
      ...(investorUndertakingPath !== undefined && { investorUndertakingPath }),
      ...(equityDilutionProofName !== undefined && { equityDilutionProofName }),
      ...(equityDilutionProofPath !== undefined && { equityDilutionProofPath }),
      ...(utilizationPlanName !== undefined && { utilizationPlanName }),
      ...(utilizationPlanPath !== undefined && { utilizationPlanPath }),
      ...(boardResolutionName !== undefined && { boardResolutionName }),
      ...(boardResolutionPath !== undefined && { boardResolutionPath }),
    };

    const updatedDocument = await prisma.matchingLoan.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      message: "Document status updated successfully",
      document: updatedDocument,
    });
  } catch (error) {
    console.error("Error updating matching loan status:", error);
    return res.status(500).json({
      error: "Failed to update document status",
      details: error.message,
    });
  }
};
const getMatchingLoanStatus = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    let userId;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.user_id;
    } catch (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const document = await prisma.matchingLoan.findUnique({
      where: { userId },
      select: {
        id: true,
        documentStatus: true,
        comment: true,
      },
    });

    if (!document) {
      return res.status(200).json({
        message: "No matching loan status found for this user",
        document: { documentStatus: null, comment: null },
      });
    }

    return res.status(200).json({
      message: "Matching Loan Status retrieved successfully",
      document,
    });
  } catch (error) {
    console.error("Error retrieving matching loan status:", error);

    // ✅ Important: don't throw raw prisma errors to client
    return res.status(500).json({
      error: "An error occurred while fetching matching loan status",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
module.exports = {
  applyForMatchingLoan,

  // admin
  getmatchingnById,
  getAllmatchingWithUserDetails,
  updateMatchingStatus,

  // user helpers (NEW)
  getMatchingLoanStatus,
  getMatchingLoanByToken,
  updateMatchingLoanFiles,
};
