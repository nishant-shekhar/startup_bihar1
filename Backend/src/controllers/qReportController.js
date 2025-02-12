

const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library
const prisma = new PrismaClient();

//const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use environment variable
const JWT_SECRET = 'your_jwt_secret_key';
const JWT_SECRET_ADMIN = 'your';

const submitQuarterlyReport = async (req, res) => {
  try {
    // Extract token from Authorization header (expects "Bearer <token>")
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization token is required" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authorization token is required" });
    }

    // Decode and verify the JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    const tokenUserId = decoded.user_id; // Should match User.user_id

    // Look up the user by the unique business identifier
    const user = await prisma.user.findUnique({ where: { user_id: tokenUserId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Use the user's primary key (UUID) to associate the QReport
    const userId = user.id;
    console.log("User ID:", userId);

    // Extract fields from req.body (and optionally, the QReport id if updating)
    const {
      id, // Optional: provided when updating an existing report
      totalCoFounders,
      stage,
      sector,
      registeredDistrict,
      registeredBlock,
      aboutStartup,
      fundsTaken,
      currentRevenue,
      netProfitOrLoss,
      fundsRaised,
      fundsDetails,
      fundAmount,
      iprReceived,
      fullTimeMale,
      fullTimeFemale,
      partTimeMale,
      partTimeFemale,
      workOrders,
      totalWorkOrderAmount,
      customersAcquired,
      incubationBenefits,
      benefitsDetails,
      otherAchievements,
    } = req.body;

    // Handle file uploads (if available)
    const unitPhoto1 = req.files.unitPhoto1 ? req.files.unitPhoto1[0].location : null;
    const unitPhoto2 = req.files.unitPhoto2 ? req.files.unitPhoto2[0].location : null;
    // Concatenate photos if both exist; filter out any null values.
    const unitPhotos = [unitPhoto1, unitPhoto2].filter(Boolean).join(";");
    const pitchdeck = req.files.pitchdeck ? req.files.pitchdeck[0].location : null;
    const auditedReport = req.files.auditedReport ? req.files.auditedReport[0].location : null;

    // Build the data object that will be used for both create and update operations
    const data = {
      totalCoFounders,
      stage,
      sector,
      registeredDistrict,
      registeredBlock,
      aboutStartup,
      fundsTaken,
      currentRevenue,
      netProfitOrLoss,
      fundsRaised: fundsRaised === "Yes", // Convert "Yes"/"No" to boolean
      fundsDetails,
      fundAmount,
      iprReceived,
      fullTimeMale,
      fullTimeFemale,
      partTimeMale,
      partTimeFemale,
      workOrders,
      totalWorkOrderAmount,
      customersAcquired,
      incubationBenefits,
      benefitsDetails,
      otherAchievements,
      unitPhotos,
      pitchdeck,
      auditedReport,
      // Set the document status based on whether this is an update or a new report
      documentStatus: id ? "Updates" : "created",
      userId, // Associate the QReport with the user's primary key
    };

    let qReport;
    if (id) {
      // Update an existing QReport if an id is provided
      qReport = await prisma.qReport.update({
        where: { id },
        data,
      });
    } else {
      // Create a new QReport record if no id is provided
      qReport = await prisma.qReport.create({
        data,
      });
    }

    //console.log("QReport data:", data);

    // Record the activity after successful update
    await prisma.activity.create({
      data: {
        user_id: tokenUserId,
        action: 'Startup Progress Report Submitted',
        subtitle: `You have submitted your Startup Progress Report`,
      },
    });

    return res.status(200).json({
      message: id
        ? "Quarterly report updated successfully"
        : "Quarterly report created successfully",
      qReport,
    });
  } catch (error) {
    console.error("Error in submitQuarterlyReport:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
};






const getAllqReportWithUserDetails = async (req, res) => {
  try {
    const documents = await prisma.qReport.findMany({
      select: {
        id: true,
        documentStatus:true,

        updatedAt: true,
        // Include select fields from the associated User model
        user: {
          select: {
            user_id: true,          // Business identifier (e.g., "ns_apps")
            registration_no: true,
            company_name: true,
            logo: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Documents with user details retrieved successfully",
      data: documents,
    });
  } catch (error) {
    console.error("Error fetching QReport documents:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching documents" });
  }
};

const getQReportsByUserId = async (req, res) => {
  let { id } = req.params; // Retrieve id from the request parameters

  try {
  
    // Check if id is provided
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    // Fetch the document from the database
    const document = await prisma.qReport.findUnique({
      where: { id: id }, // Use the ID to query the database
      include: {
        user: {
          select: {
            user_id: true,          // Include specific fields from the User model
            logo: true,
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

    if (!document) {
      // Return 404 if document is not found
      return res.status(404).json({ error: 'Document not found' });
    }

    // Return the document if found
    return res.status(200).json(document); // Explicitly set status to 200
  } catch (error) {
    // Handle any server error
    console.error(`Error retrieving document with id ${id}:`, error);
    return res.status(500).json({ error: 'An error occurred while retrieving the document' });
  }
};




const updateQreportStatus = async (req, res) => {
  const { id } = req.params;
  const { documentStatus, comment } = req.body;

  if (!documentStatus) {
    return res.status(400).json({ error: 'Document status is required' });
  }

  try {
    const document = await prisma.qReport.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const updatedDocument = await prisma.qReport.update({
      where: { id },
      data: { documentStatus, comment },
    });

    res.status(200).json({
      message: 'Document status updated successfully',
      document: updatedDocument,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to update document status',
      details: error.message,
    });
  }
};

module.exports = {
  submitQuarterlyReport,
  getQReportsByUserId,
  getAllqReportWithUserDetails,
  updateQreportStatus
};
