import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

const MatchingLoan = ({ onProfileClick }) => {
	const [sdata, setSdata] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					"http://localhost:3007/api/startupProfile/list",
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
