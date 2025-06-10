import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginCopy from './components/Login/LoginCopy';
import HomePage from './components/HomePage/Home';
import StartupProfileMain from './components/Profile/StartupProfile/StartupProfileMain';
import AdminMainProfile from './components/Admin_Profile_Abhishek/AdminMainProfile';
import StartupListCategory from './components/Profile/PublicProfile/StartupListCategory';
import StartupPublicProfile from './components/Profile/PublicProfile/StartupPublicProfile';
import UserNotification from './components/UserForm/UserNotification';

import AboutUs from './components/About/AboutUs';
import ContactUs from './components/About/ContactUs';
import Ecosystem from './components/About/Ecosystem';
import AllStartup from './components/HomePage/StartupList/AllStartupPage';
import Team from './components/About/Team';
import StartupIncubationCell from './components/About/StartupCellList';
import IncubationNodalList from './components/About/IncubationList';
import Events from './components/About/Events';
import Mentors from './components/About/Mentors';
import PdfViewer from './components/Admin_Profile_Abhishek/PDFViewer';
import PrivateRoute from './components/Login/PrivateRoute';
import StartupList from './components/Admin_Profile_Abhishek/Startup_List/StartupList';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
			<Router>
				<Routes>
					<Route path="/login" element={<LoginCopy onLogin={handleLogin} />} />
					<Route path="/about-us" element={<AboutUs />} />
					<Route path="/contact-us" element={<ContactUs />} />
					<Route path="/ecosystem" element={<Ecosystem />} />
					
					<Route path="/" element={<HomePage />} />
					<Route path="/StartupList" element={<StartupListCategory />} />
					<Route path="/AllStartups" element={<AllStartup />} />
					<Route path="/DeveloperTeam" element={<Team />} />
					<Route path="/StartupCell" element={<StartupIncubationCell />} />
					<Route path="/IncubationCell" element={<IncubationNodalList />} />
					<Route path="/Mentors" element={<Mentors />} />
					<Route path="/Events" element={<Events />} />
					<Route path="/pdf-viewer" element={<PdfViewer/>} />
					<Route
  path="/StartupProfile"
  element={
    <PrivateRoute role="user">
      <StartupProfileMain />
    </PrivateRoute>
  }
/>
<Route
  path="/AdminProfile"
  element={
    <PrivateRoute role="admin">
      <AdminMainProfile />
    </PrivateRoute>
  }
/>
<Route
  path="/StartupListAdmin"
  element={
    <PrivateRoute role="admin">
      <StartupList />
    </PrivateRoute>
  }
/>
					<Route
						path="/Startup/:id"
						element={<StartupPublicProfile />}
					/>
					<Route path="/notif" element={<UserNotification />} />
				</Routes>
			</Router>
		);
};

export default App;
