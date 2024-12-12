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
import PostSeedFundModuleDetails from "./Post_Seed_Fund_module/PostSeedFundModuleDetails.jsx";
import QPRModuleDetails from "./QPR_Module/QPRModule";
import AccelerationProgrammeModuleDetails from "./Acceleration_Programme_Module/AccerelationModuleDetails.jsx";
import IncubationModuleDetails from "./Incubation_Module/IncubationModuleDetails.jsx";
import StartupProfileDetails from "./ProfileDetails.jsx";
import RegisterStartup from "./RegisterStartup.jsx";

const AdminMainProfile = () => {
	const [activePage, setActivePage] = useState("StartupProfile"); // Controls second section
	const [selectedId, setSelectedId] = useState(""); // Controls selected ID for details
	const [detailsView, setDetailsView] = useState(false); // Controls if third section is displayed
	const [hasDetailsPanel, setHasDetailsPanel] = useState(true); // Controls the visibility of the third section


	// Handles the main content section (second section) based on `activePage`
	function handlePageChange() {
		switch (activePage) {
			case "StartupProfile":
				return (
					<CommonList
					onSelect={handleSelect}
						url="http://localhost:3007/api/StartupProfile/v2"
						title="Startup Profile Application List"
						type="StartupProfile"
					/>
				);

			case "SeedFundModule":
				return (
					<CommonList
						onSelect={handleSelect}
						url="http://localhost:3007/api/seed-fund/v2"
						title="Seed Fund Application List"
						type="seed-fund"
					/>
				);

			case "SecondTrancheModule":
				return (
					<CommonList
						onSelect={handleSelect}
						url="http://localhost:3007/api/second-tranche/v2"
						title="Second Tranche Application List"
						type="second-tranche"

					/>
				);

			case "PostSeedFundModule":
				return (
					<CommonList
						onSelect={handleSelect}
						url="http://localhost:3007/api/post-seed/v2"
						title="Post Seed Application List"
						type="post-seed"
					/>
				);

			case "QPRModule":
				return (
					<CommonList
						onSelect={handleSelect}
						url="http://localhost:3007/api/Qreport/v2"
						title="QPR List"
						type="Qreport"
					/>
				);

			case "MatchingLoan":
				return (
					<CommonList
						onSelect={handleSelect}
						url="http://localhost:3007/api/matchingLoan/v2"
						title="Post Seed Application List"
						type="matchingLoan"
					/>
				);
			case "IncubationModule":
				return (
					<CommonList
						onSelect={handleSelect}
						url="http://localhost:3007/api/incubation/v2"
						title="Incubation Application"
						type="incubation"
					/>
				);

			case "AccelerationProgrammeModule":
				return (
					<CommonList
						onSelect={handleSelect}
						url="http://localhost:3007/api/acceleration/v2"
						title="Post Seed Application List"
						type="acceleration"
					/>
				);

			case "IPRReimbursementModule":
				return <IPRReimbursementModule />;

			case "CoworkingModule":
				return <CoworkingModule />;

			case "StartupList":
				setHasDetailsPanel(false); // Disable third section for this case
				return <StartupList />;
			case "RegisterStartup":
				return <RegisterStartup />;

			case "DataMining":
				return <DataMining />;

			case "MentorsList":
				return <MentorsList />;

			case "GrievanceRedressalSystem":
				return <GrievanceRedressalSystem />;

			default:
				return null ;
		}
	}

	// Handles changes in the first section (left bar menu)
	const changePanel = (newPanel) => {
		setActivePage(newPanel);
		setDetailsView(false); // Reset to second section when changing main module
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
			<div
				className={
					hasDetailsPanel
						? "col-span-3"
						: "col-span-10"
				}
			>
				{handlePageChange()}
			</div>

			{/* Third Section - Details Section (conditionally rendered) */}
			{hasDetailsPanel && (
				<div className="col-span-7 bg-gray-100">
					{renderDetailsSection()}
				</div>
			)}
		</div>
	);
};

export default AdminMainProfile;
