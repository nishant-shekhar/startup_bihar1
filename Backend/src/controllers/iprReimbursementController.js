


const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use environment variable

const applyForIPRReimbursement = async (req, res) => {
  try {
    // Ensure a token is provided in the request headers
    const token = req.headers.authorization?.split(' ')[1]; // Assuming "Bearer <token>" format
    if (!token) {
      return res.status(401).json({ error: 'Authorization token is required' });
    }
 
    // Decode the JWT to get the user ID
    const decoded = jwt.verify(token, JWT_SECRET); // Use your JWT secret
    const userId = decoded.user_id; // Adjust according to your token payload structure
 
    const { iprType, feePaidForApplicationForm, consultancyFee } = req.body;
 
    if (!iprType || !feePaidForApplicationForm) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }
 
    // Handle file uploads
    const iprCertificateFilePath = req.files.iprCertificate
      ? req.files.iprCertificate[0].location
      : "";
    const feePaidInvoiceFilePath = req.files.feePaidInvoice
      ? req.files.feePaidInvoice[0].location
      : "";
    const consultancyInvoiceFilePath = req.files.consultancyInvoice
      ? req.files.consultancyInvoice[0].location
      : "";
 
    
 
    const application = await prisma.iPRReimbursement.upsert({
      where: { userId },
      update: {
        iprType,
        feePaidForApplicationForm,
        consultancyFee,
        iprCertificateFilePath,
        feePaidInvoiceFilePath,
        consultancyInvoiceFilePath,
        iprCertificateFileName: "a",
        feePaidInvoiceFileName: "b",
        consultancyInvoiceFileName: "c",
        documentStatus: "created"
      },
      create: {
       

        iprType,
        feePaidForApplicationForm,
        consultancyFee,
        iprCertificateFilePath,
        feePaidInvoiceFilePath,
        consultancyInvoiceFilePath,
        iprCertificateFileName: "a",
        feePaidInvoiceFileName: "b",
        consultancyInvoiceFileName: "c",
        documentStatus: "created",
        // Connect the related User via the unique user_id field
        user: { connect: { user_id: userId } }
      },
    });
 
    // Record the activity after successful update
    await prisma.activity.create({
      data: {
        user_id: userId,
        action: 'IPR Reimbursement Form Submitted',
        subtitle: `You have submitted your IPR Reimbursement Form`,
      },
    });
 
    return res.status(200).json({
      message: 'IPR Reimbursement application submitted successfully',
      application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the application' });
  }
};

const getAllIprnWithUserDetails = async (req, res) => {
  try {
    const documents = await prisma.iPRReimbursement.findMany({
      select: {
        id:true,
        documentStatus:true,
        updatedAt:true,
				user: {
					select: {
						user_id: true, // Fields from the User model
						registration_no: true,
						company_name: true,
						logo:true,
						
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

const getIprnById = async (req, res) => {
  let { id } = req.params; // Retrieve id from the request parameters

  try {
  
    // Check if id is provided
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    // Fetch the document from the database
    const document = await prisma.iPRReimbursement.findUnique({
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

const updateiprStatus = async (req, res) => {
  const { id } = req.params;
  const { documentStatus } = req.body;

  if (!documentStatus) {
    return res.status(400).json({ error: 'Document status is required' });
  }

  try {
    const document = await prisma.iPRReimbursement.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const updatedDocument = await prisma.iPRReimbursement.update({
      where: { id },
      data: { documentStatus },
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
  applyForIPRReimbursement,
  getIprnById,
  getAllIprnWithUserDetails,
  updateiprStatus
};
