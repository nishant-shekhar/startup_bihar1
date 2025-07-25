import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogOutDialogBox from '../Profile/StartupProfile/Navbar/LogoutDialog';
import { Link } from 'react-router-dom'


const LeftBar = ({ changePanel }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

 

  const handleLogoutClick = () => {
		setIsDialogVisible(true);
	};


	const handleCancel = () => {
		setIsDialogVisible(false); 
	};

	
	const handleClose = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user_id");
		setIsDialogVisible(false); 
		navigate("/login"); 
	};

  const userRole = localStorage.getItem("admin_role") || "admin";

  // Full menu items array
  const menuItems = [
    { label: "Notifications", panel: "AdminNotification" },
    { label: "Startup Profile", panel: "StartupProfile" },

    { label: "Seed Fund Module", panel: "SeedFundModule" },
    { label: "Second Tranche Module", panel: "SecondTrancheModule" },
    { label: "Post Seed Fund Module", panel: "PostSeedFundModule" },
    { label: "Startup Progress Report", panel: "QPRModule" },
    { label: "Matching Loan", panel: "MatchingLoan" },
    { label: "Incubation Module", panel: "IncubationModule" },
    { label: "Acceleration Programme Module", panel: "AccelerationProgrammeModule" },
    { label: "IPR Reimbursement Module", panel: "IPRReimbursementModule" },
    { label: "Coworking Module", panel: "CoworkingModule" },
    { label: "CoWorking Map", panel: "CoWorkingMap" },    

    { label: "Data Mining", panel: "DataMining" },
    { label: "Mentors List", panel: "MentorsList" },
    { label: "Register New Startups", panel: "RegisterStartup" },
    { label: "Update Startup", panel: "UpdateStartup" },
    { label: "Grievance Redressal System", panel: "GrievanceRedressalSystem" },
        { label: "Startup List", panel: "StartupList" },

  ];

 // Role-based menu access configuration
 const roleBasedMenuAccess = {
  
   "STARTUPDIR": [
	 
    "Startup List",
	],
  "DI": [
	 
    "Startup List",
	],
	"IT": [
	  "Seed Fund Module",
	  "Second Tranche Module",
	  "Post Seed Fund Module",
	  "Startup Progress Report",
	  "Matching Loan",
	  "Incubation Module",
	  "Acceleration Programme Module",
    "Coworking Module",
	  "IPR Reimbursement Module",
	  "Register New Startups",
    "Startup List",
	],
	"finance-wing": [
   
	  "Second Tranche Module",
	  "Post Seed Fund Module",
	  "Startup Progress Report",
	  "Matching Loan",
    "Startup List",
	  "Acceleration Programme Module",
    "IPR Reimbursement Module",

	],
  "incubation-wing":[ 

	  "Startup Progress Report",
    "Startup List",

	  "Incubation Module",

  ],
  "startup_nodal":[ 
    "Startup Profile",
	 
    "Startup List",

	 
  ],
  "coworking": [
    "Coworking Module",
  ], 
  
	guest: ["Notifications" , "Startup Profile", "Startup List"],
  };

  

  // Get allowed menu items for the user's role
  const allowedMenuItems = menuItems.filter((item) =>
    roleBasedMenuAccess[userRole]?.includes(item.label)
  );

  // Filter menu items based on the search term
  const filteredMenu = allowedMenuItems.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-gray-900 h-screen overflow-y-auto overflow-x-hidden">
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700  ">
					<a href="/" className="font-semibold text-white text-lg">
						Startup Bihar
					</a>
				</div>
				<div className="flex items-center pt-12 pl-8 gap-4">
           
        <div>
          <img
            src="https://www.w3schools.com/howto/img_avatar.png"
            alt="avatar"
            className="w-12 h-12 rounded-full"  
          />
        </div>
        <div className="text-white">
          <h1 className="text-l">{localStorage.getItem("admin_name")}</h1>
          <h1 className="text-sm text-white/60">
            {localStorage.getItem("admin_designation")}
          </h1>
          <h1 className="text-sm text-white/60">Department of Industries</h1>
          <h1 className="text-sm text-white/60">Govt. of Bihar</h1>
        </div>
      </div>

      {/* Search Box */}
      <div>
        <input
          type="text"
          placeholder="Search..."
          className="block w-[18vw] mt-5 ml-3 pl-4 p-2 bg-gray-800 text-gray-300 rounded-md focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Menu List */}
      <div className="space-y-4 mx-3 pt-4 text-white">
        
        {filteredMenu.map((item, index) => (
          
          <div
            
            key={index}
            onClick={() => {
              setSelectedItem(item.panel);
              changePanel(item.panel);
            }}
            className={`flex items-center justify-between px-3 py-2 rounded-md ${selectedItem === item.panel ? 'bg-gray-500' : 'hover:bg-gray-500'}`}
          >
            {item.label}
          </div>
        ))}

        <button
          onClick={handleLogoutClick}
          className="flex items-center justify-between px-3 py-4 hover:bg-gray-500 rounded-md"
        >
          <i className="fas fa-sign-out-alt"></i>
          <span className="ml-2">Logout</span>
        </button>
        <LogOutDialogBox   
          isVisible={isDialogVisible}
          title="Confirm Logout"
          subtitle="Are you sure you want to log out?"
          buttonVisible={true}
          status="warning"
          actionButton="Logout"
          cancelButton="Cancel"
          onClose={handleClose}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default LeftBar;
