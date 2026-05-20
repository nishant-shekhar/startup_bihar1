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
import MainAdmin from './components/AdminRedesign/MainAdmin';
import DashboardPagePublic from './components/Profile/PublicProfile/DashboardPage';
import StartupRegistrationMain from './components/New_Applications/StartupRegistration/StartupRegistrationMain';
import StartupDetailsForm from './components/New_Applications/StartupRegistration/StartupDetailsForm';
import StartupMainForm from './components/New_Applications/StartupRegistration/StartupMainRegistration';
import UserSignup from './components/New_Applications/StartupRegistration/UserSignup';
import Response from './components/New_Applications/Response';
import IdeaFestHome from './components/IdeaFest/IdeaFestHome';
import Certificate from './components/IdeaFest/Certificate';
import Migration from './components/AdminRedesign/NewApplicationAdmin/Migration/Migration';
import StartupMainFormWrapper from './components/New_Registration/registration/RegistrationLayout';
import Block from './components/New_Registration/admin/Block';
import NewApplicationDashboard from './components/New_Registration/admin/MainAdmin';
import RegistrationLayout from './components/SSU_Recruitment/registration/RegistrationLayout';
import ReviewerBoard from './components/New_Registration/admin/ReviewerBoard';
import PIAIReviewedData from './components/AdminRedesign/NewApplicationAdmin/PIAIEvaluationData';

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
				<Route path="/AllStartups" element={<AllStartup />} />
				<Route path="/DeveloperTeam" element={<Team />} />
				<Route path="/PublicDashboard" element={<DashboardPagePublic />} />
				<Route path="/StartupCell" element={<StartupIncubationCell />} />
				<Route path="/IncubationCell" element={<IncubationNodalList />} />
				<Route path="/Mentors" element={<Mentors />} />
				<Route path="/newapplicationdashboard" element={<MainAdmin />} />
				<Route path="/reviewer-board" element={<ReviewerBoard />} />
				<Route path="/Events" element={<Events />} />
				<Route path="/pdf-viewer" element={<PdfViewer />} />
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
					path="/AdminMain"
					element={
						<PrivateRoute role="admin">
							<MainAdmin />
						</PrivateRoute>
					}
				/>
				<Route
					path="/NewApplicationData"
					element={
						<PrivateRoute role="admin">
							<NewApplicationDashboard />
						</PrivateRoute>
					}
				/>
					<Route
					path="/PitchingPanel"
					element={
						<PrivateRoute role="admin">
							<PIAIReviewedData />
						</PrivateRoute>
					}
				/>
				<Route
					path="/block"
					element={
						<PrivateRoute role="admin">
							<Block />
						</PrivateRoute>
					}
				/>
				<Route
					path="/Startup/:id"
					element={<StartupPublicProfile />}
				/>
				<Route path="/notif" element={<UserNotification />} />
				<Route path="/NewStartupForm" element={<StartupDetailsForm />} />
				<Route path="/ssu-recruitment-test" element={<RegistrationLayout />} />
				<Route path="/SR" element={<UserSignup />} />
				<Route path="/rv" element={<Response />} />
				<Route path="/startupregistration" element={<StartupMainFormWrapper />} />
				<Route path="/ideafest" element={<IdeaFestHome />} />
						<Route path="/certificate/:id" element={<Certificate />} />
				
			</Routes>
		</Router>
	);
};

export default App;
