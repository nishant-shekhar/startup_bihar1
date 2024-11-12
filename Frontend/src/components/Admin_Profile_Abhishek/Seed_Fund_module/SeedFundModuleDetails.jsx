import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const ProfileDetails = ({ regKey }) => {
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios({
					method: "get",
					url: "http://localhost:3000/api/startupProfile/startuplist",
					data: { user_id: "Pratush" }, // Pass data in the body (non-standard)
				});
				setData(response.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
		console.log(data);
	}, []);

	return (
		<div
			className="h-screen overflow-y-auto"
			style={{
				msOverflowStyle: "none",
				scrollbarWidth: "none",
			}}
		>
			<h1 className="pt-5 pl-8 text-2xl">Startup Profile Details </h1>
			<div className="px-8 py-5">
				<table className="min-w-full bg-white">
					<tbody>
						{Object.entries(data).map(([key, value], index) => (
							<tr key={index} className="">
								<td className="py-4 px-4 border-b border-l border-t">{key}</td>
								<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
									{value}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ProfileDetails;
