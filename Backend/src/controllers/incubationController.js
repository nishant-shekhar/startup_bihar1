

const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const applyForIncubation = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

    let userId;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.user_id;
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    const { preference1, preference2, preference3 } = req.body;
    if (!preference1 || !preference2 || !preference3) {
      return res.status(400).json({ error: 'Please provide all preferences' });
    }

    const data = {
      preference1,
      preference2,
      preference3,
      documentStatus: "created",
      userId,
    };

    const application = await prisma.incubationApplication.upsert({
      where: { userId },
      update: { ...data },
      create: { ...data },
    });

    return res.status(200).json({
      message: 'Incubation application submitted successfully',
      application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
};

const getIncubationStatus = async (req, res) => {
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
    const document = await prisma.incubationApplication.findUnique({
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
        message: 'No incubation application status found for this user',
        document: { documentStatus: null, comment: null },
      });
    }

    // Send the document and its status in response
    return res.status(200).json({
      message: 'incubation application Status retrieved successfully',
      document,
    });
  } catch (error) {
    console.error('Error retrieving user incubation application status:', error);
    res.status(500).json({ error: 'An error occurred while fetching the incubation applicationstatus' });
  }
};
const getAllIncubationWithUserDetails = async (req, res) => {
  try {
    const documents = await prisma.incubationApplication.findMany({
      select: {
        id:true,
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

const getIncubationnById = async (req, res) => {
  let { id } = req.params; // Retrieve id from the request parameters

  try {
  
    // Check if id is provided
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    // Fetch the document from the database
    const document = await prisma.incubationApplication.findUnique({
      where: { id: id }, // Use the ID to query the database
      include: {
        user: {
          select: {
            user_id: true,          // Include specific fields from the User model
            registration_no: true,
            company_name: true,
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

const updateincubationStatus = async (req, res) => {
  const { id } = req.params;
  const { documentStatus,comment ,assignCenter} = req.body;

  if (!documentStatus && !assignCenter) {
    return res.status(400).json({ error: 'Document status and assigned center are required' });
  }

  try {
    const document = await prisma.incubationApplication.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const updatedDocument = await prisma.incubationApplication.update({
      where: { id },
      data: { documentStatus,comment ,assignCenter},
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
  applyForIncubation,
  getAllIncubationWithUserDetails,
  getIncubationnById,
  updateincubationStatus,
  getIncubationStatus
  
};
