import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomeNav from './components/HomePage/HomeNav';
import UserProfile from './components/Profile/UserProfile/UserProfile';
import LoginCopy from './components/Login/LoginCopy';
import Startupform from './components/UserForm/Startupform';
import Upload from './components/UserForm/Upload';
import SecondTrance from './components/UserForm/SecondTrance';
import Profile from './components/Profile/PublicProfile/Profile';
import AdminApp from './components/Profile/AdminProfile/AdminApp';
import SeedAdminForm from './components/Profile/AdminProfile/seedAdminForm';
import AdminForm from './components/Profile/AdminProfile/AdminForm';
import TopNavbar from './components/Profile/AdminProfile/Navbar/TopNavBar';
import Acceleration from './components/UserForm/Acceleration';
import Coworking from './components/UserForm/Coworking';
import Matchingloan from './components/UserForm/Matchingloan';
import Reimbursement from './components/UserForm/Reimbursement';
import PostSeed from './components/UserForm/PostSeed';
import SeedFunded from './components/UserForm/SeedFunded';
import Qpr from './components/UserForm/Qpr';
import HomePage from './components/HomePage/Home';
import LeftBar from './components/Profile/UserProfile/Navbar/LeftBar';
import LeftBarfix from './components/Profile/UserProfile/LeftBarfix';
import Navbarfix from './components/Profile/AdminProfile/Navbar/Navbarfix';
import SecondTrancheAdmin from './components/Profile/AdminProfile/SecondTrancheAdmin';
import GrievanceContainer from './components/Profile/UserProfile/grievance-container';
import Grievance from './components/UserForm/Grievance';
import Incubation from './components/UserForm/Incubation';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginCopy onLogin={handleLogin} />} />

        {/* Wrap all the routes that need LeftBar inside LayoutWithLeftBar */}
        <Route element={<LeftBarfix isLoggedIn={isLoggedIn} />}>
          <Route path="/UserProfile" element={<UserProfile />} />
          <Route path="/startupform" element={<Startupform />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/secondtrance" element={<SecondTrance />} />
          <Route path="/seedfunded" element={<SeedFunded />} />
          <Route path="/postseed" element={<PostSeed />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/Matchingloan" element={<Matchingloan />} />
          <Route path="/Reimbursement" element={<Reimbursement />} />
          <Route path="/coworking" element={<Coworking />} />
          <Route path="/acceleration" element={<Acceleration />} />
          <Route path="/qpr" element={<Qpr />} />
          <Route path="/grievance" element={<Grievance />} />
          <Route path="/incubation" element={<Incubation />} />

        </Route>
        {/*Admin Route with fixNavbar hello*/}
        <Route element={<Navbarfix isLoggedIn={isLoggedIn} />}>

          <Route path="/startupProfile" element={<AdminForm />} />

          <Route path="/seedFund" element={<SeedAdminForm />} />

          <Route path="/secondTranche" element={<SecondTrancheAdmin />} />
          <Route
            path="/accelerationAdmin"
            element={<accelerationAdmin />}
          />

        </Route>

        {/* Routes without LeftBar */}
        <Route path="/" element={<HomePage />} />
        <Route path="/adminprofile" element={<AdminApp />} />
        <Route path="/TopNavbar" element={<TopNavbar />} />
      </Routes>
    </Router>
  );
};

export default App;
