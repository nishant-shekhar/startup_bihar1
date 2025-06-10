const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';


const applyForCoWorkingSpace = async (req, res) => {
  try {
    // Extract token from headers (expects "Bearer <token>" format)
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    // Verify token and get the user identifier from token payload
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    // Assuming the token payload contains a field "user_id"
    const userIdFromToken = decoded.user_id;
    if (!userIdFromToken) {
      return res.status(400).json({ error: 'Token payload missing user_id' });
    }

    // Extract required fields from the request body
    const { coworkingCenter, seatNo, status, seatAddress } = req.body;
    if (!coworkingCenter || !seatNo || !status) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Upsert the coworking application record (one-to-one relationship)
    const application = await prisma.coWorking.upsert({
      where: { userId: userIdFromToken },
      update: {
        coworkingCenter,
        seatNo,
        status,
        seatAddress,
        documentStatus: "updated",
      },
      create: {
        coworkingCenter,
        seatNo,
        status,
        seatAddress,
        documentStatus: "created",
        // Connect this new record to the user using the unique user_id field on the User model
        user: { connect: { user_id: userIdFromToken } },
      },
    });

    // Record the activity after successful update
    await prisma.activity.create({
      data: {
        user_id: userIdFromToken,
        action: 'Co-Working Space Application Submitted',
        subtitle: `You have submitted co-working space request of ${seatNo} seat in ${coworkingCenter}`,
      },
    });

    return res.status(200).json({
      message: 'CoWorking application submitted successfully',
      application,
    });
  } catch (error) {
    console.error("Error in applyForCoWorkingSpace:", error);
    return res.status(500).json({ error: 'An error occurred while processing the application' });
  }
};


const getAllCoworkingWithUserDetails = async (req, res) => {
  try {
    const documents = await prisma.coWorking.findMany({
      select: {
        id:true,
        documentStatus:true,
        updatedAt:true,
        coworkingCenter:true,
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

const getAllCoworkingWiseApplication = async (req, res) => {
  const { center } = req.params; // or use req.query.center if you're passing via query

  if (!center) {
    return res.status(400).json({ error: "Coworking center name is required" });
  }

  try {
    const documents = await prisma.coWorking.findMany({
      where: { coworkingCenter: center },
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
          },
        },
      },
    });

    return res.status(200).json({
      message: `Applications for coworking center: ${center} retrieved successfully`,
      data: documents,
    });
  } catch (error) {
    console.error('Error fetching applications for coworking center:', error);
    res.status(500).json({ error: 'An error occurred while fetching documents' });
  }
};

const getcoworkingById = async (req, res) => {
  let { id } = req.params; // Retrieve id from the request parameters

  try {
  
    // Check if id is provided
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    // Fetch the document from the database
    const document = await prisma.coWorking.findUnique({
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

const updateCoworkinStatus = async (req, res) => {
  const { id } = req.params;
  const { documentStatus ,comment} = req.body;

  if (!documentStatus) {
    return res.status(400).json({ error: 'Document status is required' });
  }

  try {
    const document = await prisma.coWorking.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const updatedDocument = await prisma.coWorking.update({
      where: { id },
      data: { documentStatus,comment },
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

const getCoWorkingByToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authorization token is required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.user_id;

    const document = await prisma.coWorking.findUnique({
      where: { userId },
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.status(200).json(document);
  } catch (error) {
    console.error("Error retrieving document:", error);
    res.status(500).json({ error: "An error occurred while retrieving the document" });
  }
};

module.exports = {
  applyForCoWorkingSpace,
  getAllCoworkingWithUserDetails,
  getcoworkingById,
  updateCoworkinStatus,
  getCoWorkingByToken,
  getAllCoworkingWiseApplication
};
