const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

const JWT_SECRET = "your_jwt_secret_key";

const submitSecondTranche = async (req, res) => {
	try {
		// Ensure a token is provided in the request headers
		const token = req.headers.authorization?.split(" ")[1]; // Assuming Bearer <token> format
		if (!token) {
			return res.status(401).json({ error: "Authorization token is required" });
		}

		// Decode the JWT to get the user ID
		const decoded = jwt.verify(token, JWT_SECRET); // Use your JWT secret
		const userId = decoded.user_id; // Adjust according to your token payload structure

		// Fetch existing second tranche entry for the user
		const existingEntry = await prisma.secondTranche.findUnique({
			where: { userId },
		});

		// Handle file uploads
		const utilizationCertificate = req.files.utilizationCertificate
			? req.files.utilizationCertificate[0].location
			: existingEntry?.utilizationCertificate;
		const statusReport = req.files.statusReport
			? req.files.statusReport[0].location
			: existingEntry?.statusReport;
		const expenditurePlan = req.files.expenditurePlan
			? req.files.expenditurePlan[0].location
			: existingEntry?.expenditurePlan;
		const bankStatement = req.files.bankStatement
			? req.files.bankStatement[0].location
			: existingEntry?.bankStatement;
		const expenditureInvoice = req.files.expenditureInvoice
			? req.files.expenditureInvoice[0].location
			: existingEntry?.expenditureInvoice;
		const geoTaggedPhotos = req.files.geoTaggedPhotos
			? req.files.geoTaggedPhotos[0].location
			: existingEntry?.geoTaggedPhotos;

		// Upsert: Create or update the second tranche entry
		const secondTrancheEntry = await prisma.secondTranche.upsert({
			where: { userId },
			update: {
				utilizationCertificate,
				statusReport,
				expenditurePlan,
				bankStatement,
				expenditureInvoice,
				geoTaggedPhotos,
				documentStatus: "created", // Update document status
			},
			create: {
				utilizationCertificate,
				statusReport,
				expenditurePlan,
				bankStatement,
				expenditureInvoice,
				geoTaggedPhotos,
				userId,
				documentStatus: "created",
			},
		});

		res.status(200).json({
			message: existingEntry
				? "Second tranche entry updated successfully"
				: "Second tranche entry created successfully",
			data: secondTrancheEntry,
		});
	} catch (error) {
		console.error("Error creating/updating second tranche entry:", error);
		res
			.status(500)
			.json({ error: "An error occurred while submitting the form." });
	}
};


const getAllSecnWithUserDetails = async (req, res) => {
	try {
		const documents = await prisma.secondTranche.findMany({
			select: {
				id: true,
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
			message: "Documents with user and program details retrieved successfully",
			data: documents,
		});
	} catch (error) {
		console.error("Error fetching documents with user details:", error);
		res
			.status(500)
			.json({ error: "An error occurred while fetching documents" });
	}
};

const getSecondById = async (req, res) => {
	let { id } = req.params; // Retrieve id from the request parameters

	try {
		// Check if id is provided
		if (!id) {
			return res.status(400).json({ error: "ID is required" });
		}

		// Fetch the document from the database
		const document = await prisma.secondTranche.findUnique({
			where: { id: id }, // Use the ID to query the database
			include: {
				user: {
				  select: {
					user_id: true,          // Include specific fields from the User model
					registration_no: true,
					logo:true,
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
const getSecondByToken = async (req, res) => {
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
		const document = await prisma.secondTranche.findUnique({
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

const updateSecondStatus = async (req, res) => {
	const { id } = req.params;
	const {
		documentStatus,
		comment,
		utilizationCertificate,
		statusReport,
		expenditurePlan,
		bankStatement,
		expenditureInvoice,
		geoTaggedPhotos,
	} = req.body;

	// Check if documentStatus is provided
	if (!documentStatus) {
		return res.status(400).json({ error: "Document status is required" });
	}

	try {
		// Find the document
		const document = await prisma.secondTranche.findUnique({
			where: { id },
		});

		if (!document) {
			return res.status(404).json({ error: "Document not found" });
		}

		// Build the data object dynamically
		const updateData = {
			documentStatus,
			comment,
			...(utilizationCertificate !== undefined && { utilizationCertificate }),
			...(statusReport !== undefined && { statusReport }),
			...(expenditurePlan !== undefined && { expenditurePlan }),
			...(bankStatement !== undefined && { bankStatement }),
			...(expenditureInvoice !== undefined && { expenditureInvoice }),
			...(geoTaggedPhotos !== undefined && { geoTaggedPhotos }),
		};

		// Update the document
		const updatedDocument = await prisma.secondTranche.update({
			where: { id },
			data: updateData,
		});

		// Send a successful response
		res.status(200).json({
			message: "Document status updated successfully",
			document: updatedDocument,
		});
	} catch (error) {
		console.error(error);

		// Send an error response
		res.status(500).json({
			error: "Failed to update document status",
			details: error.message,
		});
	}
};

const getSecondTrancheStatus = async (req, res) => {
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
	  const document = await prisma.secondTranche.findUnique({
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
		  message: 'No Second Tranche status found for this user',
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
	submitSecondTranche,
	getSecondById,
	getAllSecnWithUserDetails,
	updateSecondStatus,
	getSecondTrancheStatus,
	getSecondByToken
};