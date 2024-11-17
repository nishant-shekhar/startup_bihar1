import React, { useEffect, useState } from "react";
import axios from "axios";

const SeedfundModuleDetails = ({ id }) => {
	const [data, setData] = useState({});
	const [isCommentVisible, setIsCommentVisible] = useState(false);
	const token = localStorage.getItem("token");

	useEffect(() => {
		const fetchData = async () => {
			if (id) {
				try {
					const response = await axios.get(`http://localhost:3010/api/seed-fund/v1/${id}`, {
						headers: {
							"Content-Type": "application/json",
							Authorization: `${token}`,
						},
					});
					setData(response.data);
				} catch (error) {
					console.error("Error fetching data:", error);
				}
			}
		};
		fetchData();
	}, [id, token]);

	const handleReject = async () => {
		try {
			await axios.patch(
				`http://localhost:3010/api/StartupProfile/u1/${id}`,
				{ documentStatus: "Rejected", comment: "Your Seed Application is Rejected" },
				{ headers: { "Content-Type": "application/json", Authorization: `${token}` } }
			);
		} catch (error) {
			console.error("Error updating data:", error);
		}
	};

	const handleAccept = async () => {
		try {
			await axios.put(
				`http://localhost:3010/api/StartupProfile/u1/${id}`,
				{ documentStatus: "Accepted", comment: "Your Seed Application is Accepted" },
				{ headers: { "Content-Type": "application/json", Authorization: ` ${token}` } }
			);
		} catch (error) {
			console.error("Error updating data:", error);
		}
	};

	return (
		<div className="h-screen overflow-y-auto">
			<h1 className="pt-5 pl-8 text-2xl">Seed Fund Application Details</h1>
			<div className="px-8 py-5">
				<table className="min-w-full bg-white">
					<tbody>
						<tr><td className="py-4 px-4 border">Company Name</td><td className="py-4 px-4 border">{data.companyName}</td></tr>
						<tr><td className="py-4 px-4 border">Registration Number</td><td className="py-4 px-4 border">{data.registrationNumber}</td></tr>
						<tr><td className="py-4 px-4 border">Date of Incorporation</td><td className="py-4 px-4 border">{data.dateOfIncorporation}</td></tr>
						<tr><td className="py-4 px-4 border">Business Entity Type</td><td className="py-4 px-4 border">{data.businessEntityType}</td></tr>
						<tr>
  <td className="py-4 px-4 border">Company Certificate</td>
  <td className="py-4 px-4 border">
    {data.companyCertificate && (
      <div>
        <a
          href={data.companyCertificate}
          target="_blank"
          rel="noopener noreferrer"
        >
          View
        </a>{" "}
        |{" "}
        <a
          href={data.companyCertificate}
          download
        >
          Downloads
        </a>
      </div>
    )}
  </td>
</tr>
						<tr><td className="py-4 px-4 border">ROC District</td><td className="py-4 px-4 border">{data.rocDistrict}</td></tr>
						<tr><td className="py-4 px-4 border">Company Address</td><td className="py-4 px-4 border">{data.companyAddress}</td></tr>
						<tr><td className="py-4 px-4 border">Pincode</td><td className="py-4 px-4 border">{data.pincode}</td></tr>
						<tr><td className="py-4 px-4 border">Bank Name</td><td className="py-4 px-4 border">{data.bankName}</td></tr>
						<tr><td className="py-4 px-4 border">IFSC Code</td><td className="py-4 px-4 border">{data.ifscCode}</td></tr>
						<tr><td className="py-4 px-4 border">Current Account Number</td><td className="py-4 px-4 border">{data.currentAccountNumber}</td></tr>
						<tr><td className="py-4 px-4 border">Current Account Holder Name</td><td className="py-4 px-4 border">{data.currentAccountHolderName}</td></tr>
						<tr><td className="py-4 px-4 border">Branch Name</td><td className="py-4 px-4 border">{data.branchName}</td></tr>
						<tr><td className="py-4 px-4 border">Branch Address</td><td className="py-4 px-4 border">{data.branchAddress}</td></tr>
						<tr>
							<td className="py-4 px-4 border">Cancelled Cheque or Passbook</td>
							<td className="py-4 px-4 border">
								{data.cancelChequeOrPassbook && (
									<div>
										<a href={`/${data.cancelChequeOrPassbook}`} target="_blank" rel="noopener noreferrer">View</a> | <a href={`/${data.cancelChequeOrPassbook}`} download>Download</a>
									</div>
								)}
							</td>
						</tr>
						<tr><td className="py-4 px-4 border">PAN Number</td><td className="py-4 px-4 border">{data.panNumber}</td></tr>
						<tr><td className="py-4 px-4 border">GST Number</td><td className="py-4 px-4 border">{data.gstNumber}</td></tr>
					</tbody>
				</table>

				<div className="flex items-center justify-end gap-x-2 pr-4 py-3">
					<button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white" onClick={handleAccept}>Accept</button>
					<button className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white" onClick={handleReject}>Reject</button>
				</div>

				{isCommentVisible && (
					<div className="absolute top-64 w-3/12 bg-white rounded-md shadow-xl p-4 z-10 left-[37%]">
						<h2 className="text-lg font-semibold">Add Comment</h2>
						<textarea onChange={(e) => console.log(e.target.value)} className="mt-2 border rounded-md w-full h-20 pl-2 pt-2" />
						<div className="flex justify-end gap-x-2 mt-4">
							<button className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white" onClick={() => setIsCommentVisible(false)}>Cancel</button>
							<button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white" onClick={handleReject}>Reject</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default SeedfundModuleDetails;
