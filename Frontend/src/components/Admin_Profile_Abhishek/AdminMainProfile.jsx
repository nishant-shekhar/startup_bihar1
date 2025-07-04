import React, { useState } from "react";
import LeftBar from "./LeftBar";
import IPRReimbursementModule from "./IPR_Reimbursement_Module/IPRReimbursementModule";
import CoworkingModule from "./Coworking_Module/CoworkingModule";
import StartupList from "./Startup_List/StartupList";
import DataMining from "./Data_Mining/DataMining";
import MentorsList from "./Mentors_List/MentorsList.jsx";
import GrievanceRedressalSystem from "./Grievance_Redressal_System/GrievanceRedressalSystem.jsx";
import SeedfundModuleDetails from "./Seed_Fund_module/SeedFundModuleDetails.jsx";
import SecondTrancheModuleDetails from "./Second_Tranche_module/SecondTrancheModule";
import CommonList from "./CommonList.jsx";
import PostSeedFundModuleDetails from "./Post_Seed_Fund_Module/PostSeedFundModuleDetails.jsx";
import QPRModuleDetails from "./QPR_Module/QPRModule";
import AccelerationProgrammeModuleDetails from "./Acceleration_Programme_Module/AccerelationModuleDetails.jsx";
import IncubationModuleDetails from "./Incubation_Module/IncubationModuleDetails.jsx";
import StartupProfileDetails from "./ProfileDetails.jsx";
import RegisterStartup from "./RegisterStartup.jsx";
import AdminNotification from "./AdminNotification.jsx";
import UpdateStartup from "./UpdateStartup.jsx";
import CoWorkingMap from "./CoWorkingMap.jsx";



const AdminMainProfile = () => {
	const userRole = localStorage.getItem("admin_role") || "admin";
	const [activePage, setActivePage] = useState(userRole === "coworking" ? "CoworkingModule" : "StartupProfile");
		
	const [selectedId, setSelectedId] = useState(""); // Controls selected ID for details
	const [detailsView, setDetailsView] = useState(false); // Controls if third section is displayed
	const [hasDetailsPanel, setHasDetailsPanel] = useState(true); // Controls the visibility of the third section
	
	const designation = localStorage.getItem("admin_designation"); // Coworking center name like "Patna Hub"


	// Handles the main content section (second section) based on `activePage`
	function handlePageChange() {
		


		switch (activePage) {
			case "AdminNotification":
				return (
					<>
						<div className="px-10 mt-16">
							<h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4">
								Notifications
							</h1>
							<hr className="mb-3 border-gray-500/30 " />
							<AdminNotification />
						</div>
					</>
				);

			case "StartupProfile":
				return (
					<CommonList
						onSelect={handleSelect}
						url="https://startupbihar.in/api/StartupProfile/v2"
						title="Startup Profile Application List"
						type="StartupProfile"
					/>
				);

			case "SeedFundModule":
				return (
					<CommonList
						onSelect={handleSelect}
						url="https://startupbihar.in/api/seed-fund/v2"
						title="Seed Fund Application List"
						type="seed-fund"
					/>
				);

			case "SecondTrancheModule":
				return (
					<CommonList
						onSelect={handleSelect}
						url="https://startupbihar.in/api/second-tranche/v2"
						title="Second Tranche Application List"
						type="second-tranche"

					/>
				);

			case "PostSeedFundModule":
				return (
					<CommonList
						onSelect={handleSelect}
						url="https://startupbihar.in/api/post-seed/v2"
						title="Post Seed Application List"
						type="post-seed"
					/>
				);

			case "QPRModule":
				return (
					<CommonList
						onSelect={handleSelect}
						url="https://startupbihar.in/api/Qreport/v2"
						title="Startup Progress Report List"
						type="Qreport"
					/>
				);

			case "MatchingLoan":
				return (
					<CommonList
						onSelect={handleSelect}
						url="https://startupbihar.in/api/matchingLoan/v2"
						title="Post Seed Application List"
						type="matchingLoan"
					/>
				);
			case "IncubationModule":
				return (
					<CommonList
						onSelect={handleSelect}
						url="https://startupbihar.in/api/incubation/v2"
						title="Incubation Application"
						type="incubation"
					/>
				);

			case "AccelerationProgrammeModule":
				return (
					<CommonList
						onSelect={handleSelect}
						url="https://startupbihar.in/api/acceleration/v2"
						title="Post Seed Application List"
						type="acceleration"
					/>
				);

			case "IPRReimbursementModule":
				return (
					<CommonList
						onSelect={handleSelect}
						url="https://startupbihar.in/api/iprReimbursement/v2"
						title="IPR Reimbursment Application List"
						type="iprReimbursement"
					/>
				);
			case "CoworkingModule":
				const coworkingUrl =
					userRole === "coworking" && designation
						? `https://startupbihar.in/api/coworking/center/${encodeURIComponent(designation)}`
						: `https://startupbihar.in/api/coworking/v2`;

				return (
					<CommonList
						onSelect={handleSelect}
						url={coworkingUrl}
						title="Co-Working Application List"
						type="coworking"
					/>
				);

			case "StartupList":

				return <StartupList />;
			case "CoWorkingMap":

				return <CoWorkingMap />;
			case "RegisterStartup":
				return <RegisterStartup />;

			case "UpdateStartup":
				return <UpdateStartup />;

			case "DataMining":
				return <DataMining />;

			case "MentorsList":
				return <MentorsList />;

			case "GrievanceRedressalSystem":
				return <GrievanceRedressalSystem />;

			default:
				return null;
		}
	}

	// Handles changes in the first section (left bar menu)
	const changePanel = (newPanel) => {
		setActivePage(newPanel);
		setDetailsView(false); // Reset to second section when changing main module
		if (newPanel === "AdminNotification" || activePage === "RegisterStartup" || activePage === "MentorsList" || activePage === "DataMining" || activePage === "UpdateStartup" || activePage === "StartupList" || activePage === "CoWorkingMap") {
			setHasDetailsPanel(false); // Disable third section for AdminNotification
		} else {
			setHasDetailsPanel(true); // Enable third section for other modules
		}
	};

	// Handles selection within the second section (when clicking on an item to view details)
	const handleSelect = (id) => {
		setSelectedId(id);
		setDetailsView(true); // Show third section when an item is selected
	};
	const renderDetailsSection = () => {
		if (!detailsView)
			return (
				<div className="flex items-center justify-center h-full">
					<h1>Select an item to view details</h1>
				</div>
			);

		switch (activePage) {
			case "SeedFundModule":
				return <SeedfundModuleDetails id={selectedId} />;
			case "StartupProfile":
				return <StartupProfileDetails id={selectedId} />;
			case "SecondTrancheModule":
				return <SecondTrancheModuleDetails id={selectedId} />;
			case "PostSeedFundModule":
				return <PostSeedFundModuleDetails id={selectedId} />;
			case "QPRModule":
				return <QPRModuleDetails id={selectedId} />;
			case "AccelerationProgrammeModule":
				return <AccelerationProgrammeModuleDetails id={selectedId} />;
			case "IncubationModule":
				return <IncubationModuleDetails id={selectedId} />;
			case "IPRReimbursementModule":
				return <IPRReimbursementModule id={selectedId} />;
			case "CoworkingModule":
				return <CoworkingModule id={selectedId} />;
			default:
				return null;
		}
	};

	return (
		<div className="grid grid-cols-12">
			{/* First Section - Left Sidebar */}
			<div className="col-span-2">
				<LeftBar changePanel={changePanel} />
			</div>

			{/* Second Section - Main Content Area */}
			{/* Second Section - Main Content Area */}
			<div
				className={
					activePage === "AdminNotification" || activePage === "RegisterStartup" || activePage === "MentorsList" || activePage === "DataMining" || activePage === "UpdateStartup" || activePage === "StartupList" || activePage === "CoWorkingMap"
						? "col-span-10"
						: hasDetailsPanel
							? "col-span-3"
							: "col-span-10"
				}
			>
				{handlePageChange()}
			</div>



			{/* Third Section - Details Section (conditionally rendered) */}
			{hasDetailsPanel && activePage !== "AdminNotification" && (
				<div className="col-span-7 bg-gray-100">
					{renderDetailsSection()}
				</div>
			)}
		</div>
	);
};

export default AdminMainProfile;
