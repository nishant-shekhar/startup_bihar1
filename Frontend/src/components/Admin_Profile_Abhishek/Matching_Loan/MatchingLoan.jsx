import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

const MatchingLoan = ({ onProfileClick }) => {
	const [sdata, setSdata] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					"https://startupbihar.in/api/startupProfile/list",
				);
				setSdata(response.data.documents);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
		console.log(sdata);
	}, []);

	return (
		<div
			className="w-3/12 bg-slate-200 h-screen overflow-y-auto"
			style={{
				msOverflowStyle: "none",
				scrollbarWidth: "none",
			}}
		>
			<h1 className="pl-5 pt-8 text-2xl pb-4">Matching Loan</h1>
			<p className="pt-5 pl-8 text-l text-indigo-600">
				{sdata?.user?.company_name || "Company Name Unavailable"} |
				Startup ID: {sdata?.user?.user_id || "ID Unavailable"}
			</p>
			<p className="pl-8 text-sm font-light text-gray-600">
				First Applied on: {sdata?.createdAt ? new Date(sdata.createdAt).toLocaleDateString() : "N/A"} |
				Last Updated on: {sdata?.updatedAt ? new Date(sdata.updatedAt).toLocaleDateString() : "N/A"}
			</p>
			{sdata.map((item, index) => (
				<div
					key={index}
					className="mx-5 bg-white rounded-lg mt-3 hover:shadow-lg cursor-pointer"
					onClick={() => onProfileClick(item.userId)}
				>
					<div className="flex items-center py-5 px-5 ">
						<div>
							{/* <img
								src={item.LogoURL}
								alt="avatar"
								className="w-12 h-12 rounded-full"
							/> */}
						</div>
						<div className="px-3">
							<h1 className="text-">{item.userId} </h1>
							<h1 className="text-">Reg no: {item.registrationNo}</h1>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default MatchingLoan;
