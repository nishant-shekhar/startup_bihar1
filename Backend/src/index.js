const express = require('express');
const cors = require('cors');
const path = require('path');

// Import your routes
const documentRoutes = require('./routes/documentRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const seedFundRoutes = require('./routes/seedFundRoutes');
const secondTrancheRoutes = require('./routes/secondTrancheRoutes');
const postSeedFundRoutes = require('./routes/postSeedFundRoutes');
const qReportRoutes = require('./routes/qReportRoutes');
const accelerationRoutes = require('./routes/accelerationRoutes');
const matchingLoanRoutes = require('./routes/matchingLoanRoutes');
const incubationRoutes = require('./routes/incubationRoutes');
const coWorkingApplicationRoutes = require('./routes/coWorkingApplicationRoutes');
const iprReimbursementRoutes = require('./routes/iprReimbursementRoutes');
const showcaseRoutes = require('./routes/showcaseRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const activityRoutes = require('./routes/activityRoutes');
const staffRoutes = require('./routes/staffRoutes');
const seatMapRoutes = require('./routes/seatMapRoutes');

// Prisma or other setup
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '100mb' })); // Adjust the limit as needed
app.use(express.urlencoded({ extended: true, limit: '100mb' }));


// (2) Define your API routes
app.use('/api/userlogin', userRoutes);
app.use('/api/adminlogin', adminRoutes);
app.use('/api/StartupProfile', documentRoutes);
app.use('/api/seed-fund', seedFundRoutes);
app.use('/api/second-tranche', secondTrancheRoutes);
app.use('/api/post-seed', postSeedFundRoutes);
app.use('/api/Qreport', qReportRoutes);
app.use('/api/acceleration', accelerationRoutes);
app.use('/api/matchingLoan', matchingLoanRoutes);
app.use('/api/incubation', incubationRoutes);
app.use('/api/coworking', coWorkingApplicationRoutes);
app.use('/api/iprReimbursement', iprReimbursementRoutes);
app.use('/api/showcase', showcaseRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/staff', staffRoutes);
app.use("/api/seatMap", seatMapRoutes);

// (3) Serve your built frontend (dist folder)
app.use(express.static(path.join(__dirname, 'dist')));

// (4) Catch-all route: Send index.html for any other requests
//     so that client-side routing in React/Vue/Angular works
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// (5) Start the server on port 3007
const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
