const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const JWT_SECRET = 'your_jwt_secret_key'; // Use your actual JWT secret

// Post Seed Fund form submission controller
const submitPostSeedFund = async (req, res) => {
  try {
    // Ensure a token is provided in the request headers
    const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer <token> format
    if (!token) {
      return res.status(401).json({ error: 'Authorization token is required' });
    }

    // Decode the JWT to get the user ID
    const decoded = jwt.verify(token, JWT_SECRET); // Use your JWT secret
    const userId = decoded.user_id; // Adjust according to your token payload structure

    // Extract form data from the request body
    const {
      currentStage,
      technicalKnowledge,
      raisedFunds,
      employment
    } = req.body;

    // Handle file uploads
				const auditedBalanceSheet = req.files.auditedBalanceSheet
					? req.files.auditedBalanceSheet[0].location
					: null;
    const gstReturn = req.files.gstReturn ? req.files.gstReturn[0].location : null;
    const projectReport = req.files.projectReport
					? req.files.projectReport[0].location
					: null;

    // Upsert: Create or update the PostSeedFund entry
				const postSeedFundEntry = await prisma.postSeedFund.upsert({
					where: { userId }, // Use userId to find existing entry
					update: {
						currentStage,
						technicalKnowledge: technicalKnowledge === "Yes", // Convert string to boolean
						auditedBalanceSheet,
						gstReturn,
						raisedFunds: raisedFunds === "Yes", // Convert string to boolean
						employment: employment === "Yes", // Convert string to boolean
						projectReport,
						documentStatus: "created",
					},
					create: {
						currentStage,
						technicalKnowledge: technicalKnowledge === "Yes", // Convert string to boolean
						auditedBalanceSheet,
						gstReturn,
						raisedFunds: raisedFunds === "Yes", // Convert string to boolean
						employment: employment === "Yes", // Convert string to boolean
						projectReport,
						userId, // Associate the entry with the user ID
						documentStatus: "created",
					},
				});

    res.status(200).json({
      message: postSeedFundEntry ? 'Post Seed Fund entry updated successfully' : 'Post Seed Fund entry created successfully',
      data: postSeedFundEntry
    });
  } catch (error) {
    console.error('Error creating/updating Post Seed Fund entry:', error);
    res.status(500).json({ error: 'An error occurred while submitting the form.' });
  }
};

const updatePostSeedFundFiles = async (req, res) => {
  try {
    // Ensure a token is provided in the request headers
    const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer <token> format
    if (!token) {
      return res.status(401).json({ error: 'Authorization token is required' });
    }

    // Decode the JWT to get the user ID
    const decoded = jwt.verify(token, JWT_SECRET); // Use your JWT secret
    const userId = decoded.user_id; // Adjust according to your token payload structure

    // Extract file uploads from the request
    const updatedFields = {};

    if (req.files.auditedBalanceSheet) {
      updatedFields.auditedBalanceSheet = req.files.auditedBalanceSheet[0].location;
    }
    if (req.files.gstReturn) {
      updatedFields.gstReturn = req.files.gstReturn[0].location;
    }
    if (req.files.projectReport) {
      updatedFields.projectReport = req.files.projectReport[0].location;
    }

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ error: 'No files provided for update' });
    }

    // Update the Post Seed Fund entry in the database
    const postSeedFundEntry = await prisma.postSeedFund.update({
      where: { userId }, // Find entry by user ID
      data: {
        ...updatedFields,
        documentStatus: "Updated", // Update the document status
      },
    });

    res.status(200).json({
      message: 'Post Seed Fund files updated successfully',
      data: postSeedFundEntry,
    });
  } catch (error) {
    console.error('Error updating Post Seed Fund files:', error);
    res.status(500).json({ error: 'An error occurred while updating the files.' });
  }
};

const getAllpostWithUserDetails = async (req, res) => {
  try {
    const documents = await prisma.postSeedFund.findMany({
      select: {
        id:true,
        documentStatus:true,
        user: {
          select: {
            user_id: true,             // Fields from the User model
            registration_no: true,
            company_name: true,
           
          },
        },
      },
    });

    return res.status(200).json({
      message: 'Documents with user and program details retrieved successfully',
      data: documents,
    });
  } catch (error) {
    console.error('Error fetching documents with user details:', error);
    res.status(500).json({ error: 'An error occurred while fetching documents' });
  }
};

const getpostById = async (req, res) => {
  let { id } = req.params; // Retrieve id from the request parameters

  try {
  
    // Check if id is provided
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    // Fetch the document from the database
    const document = await prisma.postSeedFund.findUnique({
      where: { id: id }, // Use the ID to query the database
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

const getPostSeedByToken = async (req, res) => {
  // Ensure a token is provided in the request headers
  
    try {
      const token = req.headers.authorization?.split(" ")[1]; // Assuming Bearer <token> format
      if (!token) {
        return res.status(401).json({ error: "Authorization token is required" });
      }
      
      // Decode the JWT to get the user ID
      const decoded = jwt.verify(token, JWT_SECRET); // Use your JWT secret
      const userId = decoded.user_id; // Adjust according to your token payload structure
  
      
  
      // Fetch the document from the database
      const document = await prisma.postSeedFund.findUnique({
        where: { userId: userId }, // Use the ID to query the database
      });
  
      if (!document) {
        // Return 404 if document is not found
        return res.status(404).json({ error: "Document not found" });
      }
  
      // Return the document if found
      return res.status(200).json(document); // Explicitly set status to 200
    } catch (error) {
      // Handle any server error
      console.error(`Error retrieving document with id ${id}:`, error);
      return res
        .status(500)
        .json({ error: "An error occurred while retrieving the document" });
    }
  };
const updatepostStatus = async (req, res) => {
  const { id } = req.params;
  const {
    documentStatus,
    comment,
    auditedBalanceSheet,
    gstReturn,
    projectReport,
  } = req.body;

  if (!documentStatus) {
    return res.status(400).json({ error: 'Document status is required' });
  }

  try {
    const document = await prisma.postSeedFund.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Prepare update data dynamically based on what is provided in the request
    const updateData = { documentStatus, comment };

    if (auditedBalanceSheet !== undefined) {
      updateData.auditedBalanceSheet = auditedBalanceSheet;
    }
    if (gstReturn !== undefined) {
      updateData.gstReturn = gstReturn;
    }
    if (projectReport !== undefined) {
      updateData.projectReport = projectReport;
    }

    const updatedDocument = await prisma.postSeedFund.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      message: 'Document status updated successfully',
      document: updatedDocument,
    });
  } catch (error) {
    console.error('Error updating document status:', error);

    res.status(500).json({
      error: 'Failed to update document status',
      details: error.message,
    });
  }
};

const getPostSeedFundStatus = async (req, res) => {
  try {
    // Extract the token from headers
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    // Decode the token to get the user ID
    let userId;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.user_id;
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Query for documents linked to this user ID
    const document = await prisma.postSeedFund.findUnique({
      where: { userId },
      select: {
        id: true,
        documentStatus: true,
        comment: true,
        // add other fields as necessary
      },
    });

   if (!document) {
      // If document not found, return a response with documentStatus: null
      return res.status(200).json({
        message: 'No post seed fund status found for this user',
        document: { documentStatus: null, comment: null },
      });
    }

    // Send the document and its status in response
    return res.status(200).json({
      message: 'Post Seed Fund Status retrieved successfully',
      document,
    });
  } catch (error) {
    console.error('Error retrieving user post seed fund status:', error);
    res.status(500).json({ error: 'An error occurred while fetching the post seed fund status' });
  }
};

module.exports = {
  submitPostSeedFund,
  getpostById,
  getAllpostWithUserDetails,
  updatepostStatus,
  getPostSeedFundStatus,
  updatePostSeedFundFiles,
  getPostSeedByToken
}