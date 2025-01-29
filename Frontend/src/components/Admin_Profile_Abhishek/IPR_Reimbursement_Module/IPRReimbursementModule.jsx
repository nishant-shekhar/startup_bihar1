import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

const IPRReimbursementModule = ({ onProfileClick }) => {
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
			<h1 className="pl-5 pt-8 text-2xl pb-4">IPR Reimbursement Module</h1>
			<div className="overflow-x-auto p-4">
  <div className="grid grid-cols-12 gap-4">
    {/* Left Table */}
    <table className="col-span-12 sm:col-span-6 bg-white border border-gray-300 shadow-md rounded-lg text-sm">
      <tbody>
        <tr className="border-b">
          <td className="px-4 py-2 font-medium text-gray-600">Company Name</td>
          <td className="px-4 py-2 text-gray-900">
            <a
              href={`https://startupbihar.in/Startup/${data?.user?.user_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              {data?.user?.company_name || "N/A"}
            </a>
          </td>
        </tr>
        <tr className="border-b">
          <td className="px-4 py-2 font-medium text-gray-600">Registration No.</td>
          <td className="px-4 py-2 text-gray-900">{data?.user?.registration_no || "N/A"}</td>
        </tr>
        <tr className="border-b">
          <td className="px-4 py-2 font-medium text-gray-600">Email</td>
          <td className="px-4 py-2 text-indigo-600">{data?.user?.email || "N/A"}</td>
        </tr>
        <tr>
          <td className="px-4 py-2 font-medium text-gray-600">CIN</td>
          <td className="px-4 py-2 text-gray-900">{data?.user?.cin || "N/A"}</td>
        </tr>
      </tbody>
    </table>

    {/* Right Table */}
    <table className="col-span-12 sm:col-span-6 bg-white border border-gray-300 shadow-md rounded-lg text-sm">
      <tbody>
        <tr className="border-b">
          <td className="px-4 py-2 font-medium text-gray-600">Startup ID</td>
          <td className="px-4 py-2 text-gray-900">{data?.user?.user_id || "N/A"}</td>
        </tr>
        <tr className="border-b">
          <td className="px-4 py-2 font-medium text-gray-600">Founder</td>
          <td className="px-4 py-2 text-gray-900">{data?.user?.founder_name || "N/A"}</td>
        </tr>
        <tr className="border-b">
          <td className="px-4 py-2 font-medium text-gray-600">Mobile</td>
          <td className="px-4 py-2 text-gray-900">{data?.user?.mobile || "N/A"}</td>
        </tr>
        <tr>
          <td className="px-4 py-2 font-medium text-gray-600">District RoC</td>
          <td className="px-4 py-2 text-gray-900">{data?.user?.districtRoc || "N/A"}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
<p className="pl-8 text-sm font-light text-gray-600">
  First Applied on: {sdata?.createdAt ? new Date(sdata.createdAt).toLocaleDateString() : "N/A"} | 
  Last Action on: {sdata?.updatedAt ? new Date(sdata.updatedAt).toLocaleDateString() : "N/A"}
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

export default IPRReimbursementModule;
