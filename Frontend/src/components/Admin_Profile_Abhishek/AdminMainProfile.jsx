import React from "react";
import Navbar from "../Navbar/Navbar";
import LeftBar from "./LeftBar";
import StartupProfile from "./StartupProfile";
import ProfileDetails from "./ProfileDetails";
import SeedFundModule from "./Seed_Fund_module/SeedFundModule";
import SecondTrancheModule from "./Second_Tranche_module/SecondTrancheModule";
import PostSeedFundModule from "./Post_Seed_Fund_module/PostSeedFundModule";
import QPRModule from "./QPR_Module/QPRModule";
import MatchingLoan from "./Matching_Loan/MatchingLoan";
import IncubationModule from "./Incubation_module/IncubationModule";
import AccelerationProgrammeModule from "./Acceleration_Programme_Module/AccelerationProgrammeModule";
import IPRReimbursementModule from "./IPR_Reimbursement_Module/IPRReimbursementModule";
import CoworkingModule from "./Coworking_Module/CoworkingModule";
import StartupList from "./Startup_List/StartupList";
import DataMining from "./Data_Mining/DataMining";
import MentorsList from "./Mentors_List/MentorsList.jsx";
import GrievanceRedressalSystem from "./Grievance_Redressal_System/GrievanceRedressalSystem.jsx";

import { useState } from "react";

const AdminMainProfile = () => {

	const [activePage , setActivePage] = useState("StartupProfile");
	const [selectedId, setSelectedId] = useState("");

	function handlePageChange(){
		switch(activePage){
			case "StartupProfile":
				return <StartupProfile onSelect={setSelectedId} />;
			
			case "SeedFundModule":
				return <SeedFundModule />

			case "SecondTrancheModule":
				return <SecondTrancheModule />

			case "PostSeedFundModule":
				return <PostSeedFundModule />

			case "QPRModule":
				return <QPRModule />

			case "MatchingLoan":
				return <MatchingLoan />

			case "IncubationModule":
				return <IncubationModule />

			case "AccelerationProgrammeModule":
				return <AccelerationProgrammeModule />

			case "IPRReimbursementModule":
				return <IPRReimbursementModule />

			case "CoworkingModule":
				return <CoworkingModule />

			case "StartupList":
				return <StartupList />

			case "DataMining":
				return <DataMining />

			case "MentorsList":
				return <MentorsList />

			case "GrievanceRedressalSystem":
				return <GrievanceRedressalSystem />
				
			default:
				return <StartupProfile />
		}
	}

	const changePanel = (newPanel) => {
		setActivePage(newPanel);
	}


	return (
		<div className="flex items-center ">
			<LeftBar changePanel={changePanel} />
			{handlePageChange(activePage)}

			<ProfileDetails id={selectedId} />
		</div>
	);
};

export default AdminMainProfile;
