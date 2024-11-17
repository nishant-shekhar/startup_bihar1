import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

const StartupProfile = ({ onSelect }) => {
	const [sdata, setSdata] = useState([]);

	const handleClick = (id) => {
		onSelect(id);
	};

	const token = localStorage.getItem("token");

	useEffect(() => {
		const fetchData = async () => {
			try {
				console.log(token);
				const response = await axios.get(
					"http://localhost:3010/api/StartupProfile/v2",
					{
						headers: {
							"Content-Type" : "application/json",
							Authorization : `${token}`,
						},
					},
				);
				setSdata(response.data.documents);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
		
	}, []);
console.log(sdata);
	return (
		<div
			className="w-3/12 bg-slate-200 h-screen overflow-y-auto"
			style={{
				msOverflowStyle: "none",
				scrollbarWidth: "none",
			}}
		>
			<h1 className="pl-5 pt-8 text-2xl pb-4">Startup Profile</h1>
			{sdata.map((item, index) => (
				<div
					key={item.id}
					className="mx-5 bg-white rounded-lg mt-3 hover:shadow-lg cursor-pointer"
					onClick={() => handleClick(item.id)}
				>
					<div className="flex items-center py-5 px-5 ">
						<div>
							<img
								src={item.logoPath}
								alt="avatar"
								className="w-12 h-12 rounded-full"
							/>
						</div>
						<div className="px-3">
							<h1 className="text-">{item.user.user_id} </h1>
							<h1 className="text-">Reg no: {item.user.registration_no}</h1>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default StartupProfile;
