


const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const JWT_SECRET = 'your_jwt_secret_key'; // Store securely in env vars

// User login controller
const userLogin = async (req, res) => {
  try {
    const { user_id, password } = req.body;

    // Check if user_id and password are provided
    if (!user_id || !password) {
      return res.status(400).json({ error: 'user_id and password are required' });
    }

    // Find user by user_id
    const user = await prisma.user.findUnique({
      where: { user_id },
    });

    // If user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user.user_id },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Return token, user_id, and registration_no
    res.status(200).json({
      message: 'Login successful',
      token,
      user_id: user.user_id,
      registration_no: user.registration_no
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while logging in' });
  }
};


// Fetch basic details of a startup by user_id or registration_no
const getStartupDetails = async (req, res) => {
  try {
    const { user_id } = req.query; // Expecting user_id as a query parameter

    // Ensure that a user_id is provided
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required to fetch startup details' });
    }

    console.log('Fetching details for user_id:', user_id);

    // Find the user by user_id and select only basic fields
    const startup = await prisma.user.findUnique({
      where: { user_id },
      select: {
        user_id: true,
        company_name: true,
        registration_no: true,
        registration_year: true,
        about: true,
        moto: true,
        facebook: true,
        website: true,
        twitter: true,
        instagram: true,
        mobile: true,
        logo: true,
        founder_dp: true,
        founder_name: true,
        coverPic:true,
        category:true,
        revenueLY:true,
        employeeCount:true,
        workOrders:true,
        projects:true

      }
    });

    // If the user is not found, return an error
    if (!startup) {
      console.log(`No startup found for user_id: ${user_id}`);
      return res.status(404).json({ error: 'Startup not found' });
    }

    console.log('Startup details:', startup);

    // Respond with the basic details
    res.status(200).json({ startup });
  } catch (error) {
    console.error('Error fetching startup details:', error);
    res.status(500).json({ error: 'An error occurred while fetching startup details', details: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { user_id, password, registration_no, company_name, startup_since, about ,founder_name,mobile,email,topStartup} = req.body;

    if (!user_id || !password || !registration_no || !company_name) {
      return res.status(400).json({ error: 'All fields are required: user_id, password, registration_no, and company_name' });
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ user_id }, { registration_no }] }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this user_id or registration_no already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        user_id,
        password: hashedPassword,
        registration_no,
        company_name,
        startup_since,
        founder_name,
        about,
        mobile,
        email,
        topStartup: topStartup === undefined ? true : topStartup, // Default to true if not provided
      },
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        user_id: newUser.user_id,
        registration_no: newUser.registration_no,
        company_name: newUser.company_name,
        startup_since: newUser.startup_since,
        about: newUser.about,
        about: newUser.founder_name
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
};
// Utility function to verify JWT and get user_id
const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.user_id;
  } catch (err) {
    throw new Error('Unauthorized: Invalid token');
  }
};

// Update Twitter
const updateTwitter = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

    const user_id = getUserIdFromToken(token);
    const { twitter } = req.body;
    if (!twitter) {
      return res.status(400).json({ error: 'Correct Field required' });
    }

    const updatedUser = await prisma.user.update({
      where: { user_id },
      data: { twitter },
    });

    res.status(200).json({ message: 'Twitter updated successfully', twitter: updatedUser.twitter });
  } catch (error) {
    console.error('Error updating Twitter:', error);
    res.status(500).json({ error: 'An error occurred while updating Twitter' });
  }
};

// Update Facebook
const updateFacebook = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

    const user_id = getUserIdFromToken(token);
    const { facebook } = req.body;
    if (!facebook) {
      return res.status(400).json({ error: 'Correct Field required' });
    }

    const updatedUser = await prisma.user.update({
      where: { user_id },
      data: { facebook },
    });

    res.status(200).json({ message: 'Facebook updated successfully', facebook: updatedUser.facebook });
  } catch (error) {
    console.error('Error updating Facebook:', error);
    res.status(500).json({ error: 'An error occurred while updating Facebook' });
  }
};

// Update Instagram
const updateInstagram = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

    const user_id = getUserIdFromToken(token);
    const { instagram } = req.body;
    if (!instagram) {
      return res.status(400).json({ error: 'Correct Field required' });
    }

    const updatedUser = await prisma.user.update({
      where: { user_id },
      data: { instagram },
    });

    res.status(200).json({ message: 'Instagram updated successfully', instagram: updatedUser.instagram });
  } catch (error) {
    console.error('Error updating Instagram:', error);
    res.status(500).json({ error: 'An error occurred while updating Instagram' });
  }
};
// Update Linkedin
const updateLinkedin = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

    const user_id = getUserIdFromToken(token);
    const { linkedin } = req.body;
    if (!linkedin) {
      return res.status(400).json({ error: 'Correct Field required' });
    }

    const updatedUser = await prisma.user.update({
      where: { user_id },
      data: { linkedin },
    });

    res.status(200).json({ message: 'Instagram updated successfully', linkedin: updatedUser.linkedin });
  } catch (error) {
    console.error('Error updating Instagram:', error);
    res.status(500).json({ error: 'An error occurred while updating LinkedIn' });
  }
};

// Update Website
const updateWebsite = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

    const user_id = getUserIdFromToken(token);
    const { website } = req.body;
    if (!website) {
      return res.status(400).json({ error: 'Correct Field required' });
    }

    const updatedUser = await prisma.user.update({
      where: { user_id },
      data: { website },
    });

    res.status(200).json({ message: 'Website updated successfully', website: updatedUser.website });
  } catch (error) {
    console.error('Error updating Website:', error);
    res.status(500).json({ error: 'An error occurred while updating Website' });
  }
};

// Update logo
const updateLogo = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

    const user_id = getUserIdFromToken(token);
    const logo = req.files.logo ? req.files.logo[0].location : null;


    const updatedUser = await prisma.user.update({
      where: { user_id },
      data: { logo },
    });

    res.status(200).json({ message: 'Website updated successfully', logo: updatedUser.logo });
  } catch (error) {
    console.error('Error updating Website:', error);
    res.status(500).json({ error: 'An error occurred while updating Website' });
  }
};
// Update applicantDp
const updateFounderDp = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

    const user_id = getUserIdFromToken(token);
    const founder_dp = req.files.founder_dp ? req.files.founder_dp[0].location : null;


    const updatedUser = await prisma.user.update({
      where: { user_id },
      data: { founder_dp },
    });

    res.status(200).json({ message: 'Website updated successfully', founder_dp: updatedUser.founder_dp });
  } catch (error) {
    console.error('Error updating Website:', error);
    res.status(500).json({ error: 'An error occurred while updating Website' });
  }
};
// Update applicantDp
const updateCoverDp = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

    const user_id = getUserIdFromToken(token);
    const coverPic = req.files.coverPic ? req.files.coverPic[0].location : null;


    const updatedUser = await prisma.user.update({
      where: { user_id },
      data: { coverPic },
    });

    res.status(200).json({ message: 'Website updated successfully', founder_dp: updatedUser.coverPic });
  } catch (error) {
    console.error('Error updating Website:', error);
    res.status(500).json({ error: 'An error occurred while updating Website' });
  }
};

// Update Moto
const updateMoto = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

    const user_id = getUserIdFromToken(token);
    const { moto } = req.body;
    if (!moto) {
      return res.status(400).json({ error: 'Correct Field required' });
    }

    const updatedUser = await prisma.user.update({
      where: { user_id },
      data: { moto },
    });

    res.status(200).json({ message: 'Moto updated successfully', moto: updatedUser.moto });
  } catch (error) {
    console.error('Error updating Moto:', error);
    res.status(500).json({ error: 'An error occurred while updating Moto' });
  }
};

// Update About
const updateAbout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

    const user_id = getUserIdFromToken(token);
    const { about } = req.body;
    if (!about) {
      return res.status(400).json({ error: 'Correct Field required' });
    }

    const updatedUser = await prisma.user.update({
      where: { user_id },
      data: { about },
    });

    res.status(200).json({ message: 'About updated successfully', about: updatedUser.about });
  } catch (error) {
    console.error('Error updating About:', error);
    res.status(500).json({ error: 'An error occurred while updating About' });
  }
};

// Fetch all top startups
const getTopStartupDetails = async (req, res) => {
  try {
    // Find the startups where topStartup is true and select only basic fields
    const startups = await prisma.user.findMany({
      where: { topStartup: true },
      select: {
        user_id: true,
        company_name: true,
        moto: true,
        logo: true,
        founder_dp: true,
        founder_name: true,
        startup_since:true,
        category:true
      },
    });

    // If no startups are found, return an error
    if (startups.length === 0) {
      console.log('No startup found with topStartup tag');
      return res.status(404).json({ error: 'No top startups found' });
    }

    console.log('Top startup details:', startups);

    // Respond with the basic details
    res.status(200).json({ startups });
  } catch (error) {
    console.error('Error fetching startup details:', error);
    res.status(500).json({ error: 'An error occurred while fetching startup details', details: error.message });
  }
};
const updateMetrics = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

    const user_id = getUserIdFromToken(token);
    const { employeeCount, workOrders, projects, revenueLY } = req.body;

    // Validate at least one field is provided
    if (
      employeeCount === undefined &&
      workOrders === undefined &&
      projects === undefined &&
      revenueLY === undefined
    ) {
      return res.status(400).json({ error: 'At least one field (employeeCount, workOrders, projects, revenueLY) is required' });
    }

    // Prepare data object dynamically
    const dataToUpdate = {};
    if (employeeCount !== undefined) dataToUpdate.employeeCount = employeeCount;
    if (workOrders !== undefined) dataToUpdate.workOrders = workOrders;
    if (projects !== undefined) dataToUpdate.projects = projects;
    if (revenueLY !== undefined) dataToUpdate.revenueLY = revenueLY;

    // Update user in the database
    const updatedUser = await prisma.user.update({
      where: { user_id },
      data: dataToUpdate,
    });

    res.status(200).json({
      message: 'Metrics updated successfully',
      updatedMetrics: {
        employeeCount: updatedUser.employeeCount,
        workOrders: updatedUser.workOrders,
        projects: updatedUser.projects,
        revenueLY: updatedUser.revenueLY,
      },
    });
  } catch (error) {
    console.error('Error updating metrics:', error);
    res.status(500).json({ error: 'An error occurred while updating metrics' });
  }
};
const updateUserField = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

    const user_id = getUserIdFromToken(token);

    // Extract fields from the request body
    const { facebook, twitter, instagram, linkedin, website, moto, about } = req.body;

    // Build a dynamic object with only the provided fields
    const fieldsToUpdate = {};
    if (facebook !== undefined) fieldsToUpdate.facebook = facebook;
    if (twitter !== undefined) fieldsToUpdate.twitter = twitter;
    if (instagram !== undefined) fieldsToUpdate.instagram = instagram;
    if (linkedin !== undefined) fieldsToUpdate.linkedin = linkedin;
    if (website !== undefined) fieldsToUpdate.website = website;
    if (moto !== undefined) fieldsToUpdate.moto = moto;
    if (about !== undefined) fieldsToUpdate.about = about;

    // Ensure there is at least one field to update
    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { user_id },
      data: fieldsToUpdate,
    });

    res.status(200).json({
      message: 'User fields updated successfully',
      updatedFields: fieldsToUpdate,
    });
  } catch (error) {
    console.error('Error updating user fields:', error);
    res.status(500).json({ error: 'An error occurred while updating user fields' });
  }
};
const addEmployee = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

    const user_id = getUserIdFromToken(token);

    const { name, dp, qualification, designation, display, rank } = req.body;

    if (!name || !qualification || !designation) {
      return res.status(400).json({ error: 'Name, qualification, and designation are required' });
    }

    const newEmployee = await prisma.employee.create({
      data: {
        startupId: user_id,
        name,
        dp,
        qualification,
        designation,
        display: display ?? true,
        rank: rank ?? 0,
      },
    });

    res.status(201).json({
      message: 'Employee added successfully',
      employee: newEmployee,
    });
  } catch (error) {
    console.error('Detailed Error:', error.message, error.stack);
    res.status(500).json({ error: 'An error occurred while adding the employee', details: error.message });
  }
};

const getEmployeesByStartup = async (req, res) => {
  try {
    const { startupId } = req.query; // Expecting startupId as a query parameter

    // Validate that startupId is provided
    if (!startupId) {
      return res.status(400).json({ error: 'startupId is required to fetch employees' });
    }

    // Fetch employees for the given startupId
    const employees = await prisma.employee.findMany({
      where: { startupId },
      orderBy: [
        { rank: 'asc' }, // Order employees by rank
        { createdAt: 'asc' }, // Secondary order by creation date
      ],
    });

    // If no employees found, return an empty array
    if (!employees || employees.length === 0) {
      return res.status(404).json({ error: 'No employees found for the specified startupId' });
    }

    res.status(200).json({
      message: 'Employees retrieved successfully',
      employees,
    });
  } catch (error) {
    console.error('Error retrieving employees:', error.message);
    res.status(500).json({ error: 'An error occurred while retrieving employees' });
  }
};


module.exports = {
  userLogin,
  createUser,
  
  getStartupDetails,

  updateAbout,
  updateFacebook,
  updateInstagram,
  updateWebsite,
  updateTwitter,
  updateMoto,
  updateLogo,
  updateCoverDp,
  updateFounderDp,
  getTopStartupDetails,
  updateMetrics,
  updateUserField,
  addEmployee,
  getEmployeesByStartup
};
