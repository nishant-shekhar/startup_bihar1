import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginCopy from './components/Login/LoginCopy';
import HomePage from './components/HomePage/Home';
import StartupProfileMain from './components/Profile/StartupProfile/StartupProfileMain';
import AdminMainProfile from './components/Admin_Profile_Abhishek/AdminMainProfile';
import StartupListCategory from './components/Profile/PublicProfile/StartupListCategory';
import StartupPublicProfile from './components/Profile/PublicProfile/StartupPublicProfile';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginCopy onLogin={handleLogin} />} />
        <Route path="/StartupProfile" element={<StartupProfileMain />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/AdminProfile" element={<AdminMainProfile />} />
        <Route path="/StartupList" element={<StartupListCategory />} />
        <Route path="/StartupPublicProfile" element={<StartupPublicProfile />} />
      </Routes>
    </Router>
  );
};

export default App;
