
const express = require('express');
const cors = require('cors');

const documentRoutes = require('./routes/documentRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const seedFundRoutes = require('./routes/seedFundRoutes');
const secondTrancheRoutes = require('./routes/secondTrancheRoutes')
const postSeedFundRoutes = require('./routes/postSeedFundRoutes');
const qReportRoutes = require('./routes/qReportRoutes')
const accelerationRoutes = require('./routes/accelerationRoutes')
const matchingLoanRoutes = require('./routes/matchingLoanRoutes')
const incubationRoutes = require('./routes/incubationRoutes')
const coWorkingApplicationRoutes = require('./routes/coWorkingApplicationRoutes')
const iprReimbursementRoutes = require('./routes/iprReimbursementRoutes')


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/userlogin', userRoutes);
app.use('/api/adminlogin', adminRoutes);

// all the user side forms
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



 //  get routes

// http://localhost:3000/api/StartupProfile/v2   
// http://localhost:3000/api/StartupProfile/v1/:id


//http://localhost:3000/api/acceleration/v1:id
//http://localhost:3000/api/acceleration/v2


//http://localhost:3000/api/coworking/v1:id
//http://localhost:3000/api/coworking/v2


//http://localhost:3000/api/incubation/v1:id
//http://localhost:3000/api/incubation/v2

//http://localhost:3000/api/seed-fund/v1:id
//http://localhost:3000/api/seed-fund/v2


//http://localhost:3000/api/second-tranche/v1:id
//http://localhost:3000/api/second-tranche/v2

//http://localhost:3000/api/post-seed/v1:id
//http://localhost:3000/api/post-seed/v2

//http://localhost:3000/api/Qreport/v1:id
//http://localhost:3000/api/Qreport/v2

//http://localhost:3000/api/iprReimbursement/v1:id
//http://localhost:3000/api/iprReimbursement/v2


//http://localhost:3000/api/matchingLoan/v1:id
//http://localhost:3000/api/matchingLoan/v2




// update -----------------> accept/////// reject
  //http://localhost:3000/api/StartupProfile/u1/:id
  //http://localhost:3000/api/acceleration/u1/:id
  //http://localhost:3000/api/coworking/u1/:id
  //http://localhost:3000/api/incubation/u1/:id
  //http://localhost:3000/api/seed-fund/u1/:id
  //http://localhost:3000/api/second-tranche/u1/:id
  //http://localhost:3000/api/post-seed/u1/:id
  //http://localhost:3000/api/Qreport/u1/:id
   //http://localhost:3000/api/iprReimbursement/u1/:id
  //http://localhost:3000/api/matchingLoan/u1/:id

// Start the server
const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
