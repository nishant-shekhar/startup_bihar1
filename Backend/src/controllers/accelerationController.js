

const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use environment variable

const applyForAccelerationProgram = async (req, res) => {
  try {
    // Extract the JWT from the request headers
    const token = req.headers.authorization?.split(' ')[1];

    // Verify and decode the JWT to get the user ID and userName
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    let userId, userName;
    try {
      const decoded = jwt.verify(token, JWT_SECRET); // Use your secret key
      userId = decoded.user_id;
      userName = decoded.user_name;
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Prepare data for the Acceleration Program
    const programData = {
      hostInstitute: req.body.hostInstitute,
      programName: req.body.programName,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      programWebsite: req.body.programWebsite,
      founderName: req.body.founderName,
      coFounderName: req.body.coFounderName,
      participationFee: parseFloat(req.body.participationFee),
      travelAccommodationCost: parseFloat(req.body.travelAccommodationCost),
      totalPersons: parseInt(req.body.totalPersons, 10),
      totalFee: parseFloat(req.body.totalFee),
      userName ,// Add the username extracted from the token
      documentStatus : "created"
    };

    // Upsert: Create or update the acceleration program application
    const accelerationProgram = await prisma.accelerationProgram.upsert({
      where: { userId }, // Check if there's already an application for this user
      update: {
        ...programData
      },
      create: {
        ...programData,
        userId, // Associate the program application with the authenticated user
      },
    });

    // Return the created or updated program application in the response
    return res.status(200).json({
      message: accelerationProgram ? 'Program application updated successfully' : 'Program application created successfully',
      accelerationProgram,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
};


const getAllAccnWithUserDetails = async (req, res) => {
  try {
    const documents = await prisma.accelerationProgram.findMany({
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

const getAccnById = async (req, res) => {
  let { id } = req.params; // Retrieve id from the request parameters

  try {
  
    // Check if id is provided
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    // Fetch the document from the database
    const document = await prisma.accelerationProgram.findUnique({
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

const updateAccnStatus = async (req, res) => {
  const { id } = req.params;
  const { documentStatus,comment } = req.body;

  if (!documentStatus) {
    return res.status(400).json({ error: 'Document status is required' });
  }

  try {
    const document = await prisma.accelerationProgram.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const updatedDocument = await prisma.accelerationProgram.update({
      where: { id },
      data: { documentStatus ,comment},
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
  applyForAccelerationProgram,
  getAllAccnWithUserDetails,
  getAccnById,
  updateAccnStatus
};
