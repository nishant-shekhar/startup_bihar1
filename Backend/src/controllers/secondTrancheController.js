const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

const JWT_SECRET = "your_jwt_secret_key";

// Second Tranche form submission controller
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

		// Handle file uploads
		const utilizationCertificate = req.files.utilizationCertificate
			? req.files.utilizationCertificate[0].location
			: null;
		const statusReport = req.files.statusReport
			? req.files.statusReport[0].location
			: null;
		const expenditurePlan = req.files.expenditurePlan
			? req.files.expenditurePlan[0].location
			: null;
		const bankStatement = req.files.bankStatement
			? req.files.bankStatement[0].location
			: null;
		const expenditureInvoice = req.files.expenditureInvoice
			? req.files.expenditureInvoice[0].location
			: null;
		const geoTaggedPhotos = req.files.geoTaggedPhotos
			? req.files.geoTaggedPhotos[0].location
			: null;

		// Upsert: Create or update the second tranche entry
		const secondTrancheEntry = await prisma.secondTranche.upsert({
			where: { userId }, // Use userId to find existing entry
			update: {
				utilizationCertificate,
				statusReport,
				expenditurePlan,
				bankStatement,
				expenditureInvoice,
				geoTaggedPhotos,
				documentStatus: "created",
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
				// Associate the entry with the user ID
			},
		});

		res.status(200).json({
			message: secondTrancheEntry
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
				user: {
					select: {
						user_id: true, // Fields from the User model
						registration_no: true,
						company_name: true,
						document: {
							select: {
								// Fields from the Document model
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
	const { documentStatus } = req.body;

	if (!documentStatus) {
		return res.status(400).json({ error: "Document status is required" });
	}

	try {
		const document = await prisma.secondTranche.findUnique({
			where: { id },
		});

		if (!document) {
			return res.status(404).json({ error: "Document not found" });
		}

		const updatedDocument = await prisma.secondTranche.update({
			where: { id },
			data: { documentStatus },
		});

		res.status(200).json({
			message: "Document status updated successfully",
			document: updatedDocument,
		});
	} catch (error) {
		console.error(error);

		res.status(500).json({
			error: "Failed to update document status",
			details: error.message,
		});
	}
};

module.exports = {
	submitSecondTranche,
	getSecondById,
	getAllSecnWithUserDetails,
	updateSecondStatus,
};