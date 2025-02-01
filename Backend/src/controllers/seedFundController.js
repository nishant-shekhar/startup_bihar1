const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const JWT_SECRET = 'your_jwt_secret_key';

// Seed fund form submission controller
const submitSeedFund = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authorization token is required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.user_id;

    const {
      companyName,
      registrationNumber,
      dateOfIncorporation,
      businessEntityType,
      rocDistrict,
      companyAddress,
      pincode,
      bankName,
      ifscCode,
      currentAccountNumber,
      currentAccountHolderName,
      branchName,
      branchAddress,
      panNumber,
      gstNumber,
      cinNumber
    } = req.body;

    // Extract the S3 URLs from the file upload response
    const companyCertificate = req.files.companyCertificate ? req.files.companyCertificate[0].location : null;
    const cancelChequeOrPassbook = req.files.cancelChequeOrPassbook ? req.files.cancelChequeOrPassbook[0].location : null;
    const inc33 = req.files.inc33 ? req.files.inc33[0].location : null;
    const inc34 = req.files.inc34 ? req.files.inc34[0].location : null;
    const partnershipAgreement = req.files.partnershipAgreement ? req.files.partnershipAgreement[0].location : null;
    const dpr = req.files.dpr ? req.files.dpr[0].location : null;

    const seedFundEntry = await prisma.seedFund.upsert({
      where: { userId },
      update: {
        companyName,
        registrationNumber,
        dateOfIncorporation: new Date(dateOfIncorporation),
        businessEntityType,
        companyCertificate,
        rocDistrict,
        companyAddress,
        pincode,
        bankName,
        ifscCode,
        currentAccountNumber,
        currentAccountHolderName,
        branchName,
        branchAddress,
        cancelChequeOrPassbook,
        panNumber,
        gstNumber,
        cinNumber,
        inc33,
        inc34,
        partnershipAgreement,
        dpr,
        documentStatus: "Updated"
      },
      create: {
        companyName,
        registrationNumber,
        dateOfIncorporation: new Date(dateOfIncorporation),
        businessEntityType,
        companyCertificate,
        rocDistrict,
        companyAddress,
        pincode,
        bankName,
        ifscCode,
        currentAccountNumber,
        currentAccountHolderName,
        branchName,
        branchAddress,
        cancelChequeOrPassbook,
        inc33,
        inc34,
        partnershipAgreement,
        dpr,
        panNumber,
        gstNumber,
        cinNumber,
        documentStatus: "created",
        userId
      }
    });

    res.status(200).json({
      message: seedFundEntry ? 'Seed fund entry updated successfully' : 'Seed fund entry created successfully',
      data: seedFundEntry
    });
  } catch (error) {
    console.error('Error creating/updating seed fund entry:', error);
    res.status(500).json({ error: 'An error occurred while submitting the form.' });
  }
};
const updateSeedFundFiles = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authorization token is required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.user_id;

    // Extract the S3 URLs from the uploaded files
    const updatedFields = {};
    if (req.files.companyCertificate) {
      updatedFields.companyCertificate = req.files.companyCertificate[0].location;
    }
    if (req.files.cancelChequeOrPassbook) {
      updatedFields.cancelChequeOrPassbook = req.files.cancelChequeOrPassbook[0].location;
    }
    if (req.files.inc33) {
      updatedFields.inc33 = req.files.inc33[0].location;
    }
    if (req.files.inc34) {
      updatedFields.inc34 = req.files.inc34[0].location;
    }
    if (req.files.partnershipAgreement) {
      updatedFields.partnershipAgreement = req.files.partnershipAgreement[0].location;
    }
    if (req.files.dpr) {
      updatedFields.dpr = req.files.dpr[0].location;
    }

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ error: 'No files provided for update' });
    }

    // Update the seed fund entry in the database
    const seedFundEntry = await prisma.seedFund.update({
      where: { userId },
      data: {
        ...updatedFields,
        documentStatus: "Updated",
      },
    });

    res.status(200).json({
      message: 'Seed fund files updated successfully',
      data: seedFundEntry,
    });
  } catch (error) {
    console.error('Error updating seed fund files:', error);
    res.status(500).json({ error: 'An error occurred while updating the files.' });
  }
};


const getAllSeedWithUserDetails = async (req, res) => {
  try {
    const seedFund = await prisma.seedFund.findMany({
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
      data: seedFund,
    });
  } catch (error) {
    console.error('Error fetching documents with user details:', error);
    res.status(500).json({ error: 'An error occurred while fetching documents' });
  }
};

const getseedById = async (req, res) => {
  let { id } = req.params; // Retrieve id from the request parameters

  try {
  
    // Check if id is provided
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    // Fetch the document from the database
    const document = await prisma.seedFund.findUnique({
      where: { id: id }, // Use the ID to query the database
      include: {
        user: {
          select: {
            user_id: true,          // Include specific fields from the User model
            registration_no: true,
            company_name: true,
            founder_name: true,
            dateOfIncorporation: true,
            districtRoc:true,
            cin:true,
            mobile:true,
            email:true,
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
const getSeedByToken = async (req, res) => {
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
      const document = await prisma.seedFund.findUnique({
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

  const updateSeedStatus = async (req, res) => {
    const { id } = req.params;
    const { 
      documentStatus, 
      comment, 
      cancelChequeOrPassbook,
      companyCertificate,
      inc33,
      inc34,
      partnershipAgreement,
      dpr
    } = req.body;
  
    if (!documentStatus) {
      return res.status(400).json({ error: "Document status is required" });
    }
  
    try {
      // Find the document in the SeedFund model
      const document = await prisma.seedFund.findUnique({
        where: { id },
      });
  
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
  
      // Prepare update data dynamically
      const updateData = {
        documentStatus,
        comment,
        ...(cancelChequeOrPassbook !== undefined && { cancelChequeOrPassbook }),
        ...(companyCertificate !== undefined && { companyCertificate }),
        ...(inc33 !== undefined && { inc33 }),
        ...(inc34 !== undefined && { inc34 }),
        ...(partnershipAgreement !== undefined && { partnershipAgreement }),
        ...(dpr !== undefined && { dpr }),
      };
  
      // Update the document status
      const updatedDocument = await prisma.seedFund.update({
        where: { id },
        data: updateData,
      });
  
      // If document is accepted, update the User model
      if (documentStatus === "Accepted") {
        const { userId, companyName, companyAddress, cinNumber, dateOfIncorporation , rocDistrict} = document;
  
        if (!userId) {
          return res.status(400).json({ error: "User ID not found in SeedFund entry" });
        }
  
        // Format the date to "DD-MM-YYYY"
        const formattedDate = new Date(dateOfIncorporation).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        console.log(rocDistrict)
        // Update the User model
        await prisma.user.update({
          where: { user_id: userId },
          data: {
            cin: cinNumber,
            address: companyAddress,
            company_name: companyName,
            dateOfIncorporation: formattedDate,
            districtRoc: rocDistrict,
          },
        });
      }
  
      // Send response
      res.status(200).json({
        message: "Document status updated successfully",
        document: updatedDocument,
      });
  
    } catch (error) {
      console.error("Error updating document status:", error);
      res.status(500).json({
        error: "Failed to update document status",
        details: error.message,
      });
    }
  };
  

const getSeedFundStatus = async (req, res) => {
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
    const document = await prisma.seedFund.findUnique({
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
        message: 'No seed fund status found for this user',
        document: { documentStatus: null, comment: null },
      });
    }

    // Send the document and its status in response
    return res.status(200).json({
      message: 'Seed Fund Status retrieved successfully',
      document,
    });
  } catch (error) {
    console.error('Error retrieving user seed fund status:', error);
    res.status(500).json({ error: 'An error occurred while fetching the seed fund status' });
  }
};
module.exports = {
  submitSeedFund,
  getseedById,
  getAllSeedWithUserDetails,
  updateSeedStatus,
  getSeedFundStatus,
  getSeedByToken,
  updateSeedFundFiles
}