import React from "react";

const LeftBar = ({changePanel}) => {
	return (
		<div className="w-1/4 bg-gray-900 h-screen overflow-y-auto">
			<div className="flex items-center pt-12 pl-8 gap-4">
				<div>
					<img
						src="https://www.w3schools.com/howto/img_avatar.png"
						alt="avatar"
						className="w-12 h-12 rounded-full"
					/>
				</div>
				<div className="text-white">
					<h1 className="text-xl">Abhishek</h1>
					<h1 className="text-xl">Admin, Finance</h1>
					<h1 className="text-sm text-white/60">Department of Industries</h1>
				</div>
			</div>
			<div>
				<input
					type="text"
					placeholder="Search..."
					className="block w-[18vw] mt-5 ml-3 pl-4  p-2 bg-gray-800 text-gray-300 rounded-md focus:outline-none"
				/>
			</div>
			<div className="space-y-4 mx-3 text-white">
				<div>
					<div
						className="block mt-5 py-2 px-4 rounded-md hover:bg-gray-700 cursor-pointer"
						onClick={() => changePanel("StartupProfile")}
					>
						Startup Profile
					</div>
				</div>
				<div>
					<div
						className="block py-2 px-4 rounded-md hover:bg-gray-700 cursor-pointer"
						onClick={() => changePanel("SeedFundModule")}
					>
						Seed Fund Module
					</div>
				</div>
				<div>
					<div
						className="block py-2 px-4 rounded-md hover:bg-gray-700 cursor-pointer"
						onClick={() => changePanel("SecondTrancheModule")}
					>
						Second Tranche Module
					</div>
				</div>
				<div>
					<div
						className="block py-2 px-4 rounded-md hover:bg-gray-700 cursor-pointer"
						onClick={() => changePanel("PostSeedFundModule")}
					>
						Post Seed Fund Module
					</div>
				</div>
				<div>
					<div
						className="block py-2 px-4 rounded-md hover:bg-gray-700 cursor-pointer"
						onClick={() => changePanel("QPRModule")}
					>
						QPR Module
					</div>
				</div>
				<div>
					<div
						className="block py-2 px-4 rounded-md hover:bg-gray-700 cursor-pointer"
						onClick={() => changePanel("MatchingLoan")}
					>
						Matching Loan
					</div>
				</div>
				<div>
					<div
						className="block py-2 px-4 rounded-md hover:bg-gray-700 cursor-pointer"
						onClick={() => changePanel("IncubationModule")}
					>
						Incubation Module
					</div>
				</div>
				<div>
					<div
						className="block py-2 px-4 rounded-md hover:bg-gray-700 cursor-pointer"
						onClick={() => changePanel("AccelerationProgrammeModule")}
					>
						Acceleration Programme Module
					</div>
				</div>
				<div>
					<div
						className="block py-2 px-4 rounded-md hover:bg-gray-700 cursor-pointer"
						onClick={() => changePanel("IPRReimbursementModule")}
					>
						IPR Reimbursement Module
					</div>
				</div>
				<div>
					<div
						className="block py-2 px-4 rounded-md hover:bg-gray-700 cursor-pointer"
						onClick={() => changePanel("CoworkingModule")}
					>
						Coworking Module (BHUB)
					</div>
				</div>
				<div>
					<div
						className="block py-2 px-4 rounded-md hover:bg-gray-700 cursor-pointer"
						onClick={() => changePanel("StartupList")}
					>
						Startup List
					</div>
				</div>
				<div>
					<div
						className="block py-2 px-4 rounded-md hover:bg-gray-700 cursor-pointer"
						onClick={() => changePanel("DataMining")}
					>
						Data Mining
					</div>
				</div>
				<div>
					<div
						className="block py-2 px-4 rounded-md hover:bg-gray-700 cursor-pointer"
						onClick={() => changePanel("MentorsList")}
					>
						Mentors List
					</div>
				</div>
				<div>
					<div
						className="block py-2 px-4 mb-3 rounded-md hover:bg-gray-700 cursor-pointer"
						onClick={() => changePanel("GrievanceRedressalSystem")}
					>
						Grievance Redressal System
					</div>
				</div>
			</div>
		</div>
	);
};

export default LeftBar;
