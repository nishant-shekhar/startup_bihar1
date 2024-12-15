const express = require('express');

const { uploadDocuments,getDocumentById,getAllDocumentsWithUserDetails,updateDocumentStatus,getUserDocument, getDocumentByToken, uploadCertificate} = require('../controllers/documentController');
const { authenticateUser } = require('../middlewares/authenticateUser'); // Import JWT middleware
const { authenticateAdmin } = require('../middlewares/authenticateAdmin');
const upload = require('../config/multerconfig');

const router = express.Router();

// Define the route for document uploads with JWT authentication
router.post(
  '/', 
  authenticateUser, // Protect the route with JWT authentication
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'certificate', maxCount: 1 },
  ]),
  uploadDocuments // Controller to handle form and file data
);

router.post(
  '/upload-certificate',
  authenticateUser, // Middleware for authentication
  upload.fields([{ name: 'certPath', maxCount: 1 }]), // Handle only the certificate file
  uploadCertificate
);

router.get(
  '/v1/:id',authenticateAdmin,
  getDocumentById
)

router.get(
  '/v2',authenticateAdmin,
  getAllDocumentsWithUserDetails
)

router.patch(
  '/u1/:id',authenticateAdmin,
   updateDocumentStatus
)
router.get(
  '/v3',authenticateUser,
  getDocumentByToken
);

router.get(
  '/user-document',
  authenticateUser,  // Ensure the user is authenticated
  getUserDocument    // Controller function to get the user's document
);

module.exports = router;
