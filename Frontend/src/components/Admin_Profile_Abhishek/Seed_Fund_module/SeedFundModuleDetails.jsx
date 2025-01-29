import React, { useEffect, useState } from "react";
import axios from "axios";
import FileViewPanel from "../FileViewPanel";

const SeedfundModuleDetails = ({ id ,startupName}) => {
	const [data, setData] = useState({});
	const [isCommentVisible, setIsCommentVisible] = useState(false);
	const [comment, setComment] = useState("•");
		console.log("deafault value is" , comment);

	const [showDialog, setShowDialog] = useState(false);
	const [dialogMessage, setDialogMessage] = useState("");
	const token = localStorage.getItem("token");

	const [pdfUrl, setPdfUrl] = useState("");
	const [isPdfModalVisible, setIsPdfModalVisible] = useState(false); // State to manage PDF modal visibility
	const [selectedOptions, setSelectedOptions] = useState([]);

	const adminRole = localStorage.getItem("admin_role") || "admin";
	const adminId = localStorage.getItem("admin_id") || "admin";

	 const handleCommentChange = (e) => {
		setComment(e.target.value);
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			setComment((prevComment) => `${prevComment}\n• `);
		}
	};


	const fetchData = async () => {
		if (id) {
			try {
				const response = await axios.get(
					`https://startupbihar.in/api/seed-fund/v1/${id}`,
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: `${token}`,
						},
					},
				);
				setData(response.data);
				console.log(response.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		}
	};
	useEffect(() => {
		fetchData();
	}, [id]);

	const handleDialog = (message) => {
		setDialogMessage(message);
		setShowDialog(true);
		setTimeout(() => setShowDialog(false), 2000); // Close after 2 seconds
	};
	console.log(selectedOptions);

	const handleReject = async () => {
		handleDialog("Updating status to reject...");
		try {
			await axios.patch(
				`https://startupbihar.in/api/seed-fund/u1/${id}`,
				{
					documentStatus: "Rejected",
					comment: `Document has been rejected for reason: ${comment}`,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `${token}`,
					},
				},
			);
			handleDialog("Application is rejected.");
			setIsCommentVisible(false);
			await fetchData(); // Update the data after status change

			// Post notification
			await postNotification("Your Seed Fund application has been rejected.", `Reason: ${comment}`);
		} catch (error) {
			console.error("Error updating data:", error);
		}
	};

	const handlePartialReject = async () => {
		handleDialog("Updating status to partial reject...");
		try {
			const updateFields = selectedOptions.reduce((acc, field) => {
				acc[field] = null;
				return acc;
			}, {});

			const docLinks = selectedOptions.map(option => {
				const docName = option === "companyCertificate" ? "Company Certificate" :
								option === "cancelChequeOrPassbook" ? "Cancelled Cheque or Passbook" :
								option === "dpr" ? "Detailed Project Report" :
								option === "partnershipAgreement" ? "Partnership Agreement" :
								option === "inc33" ? "INC 33" :
								option === "inc34" ? "INC 34" : option;
				return `${data[option]}^${docName}`;
			}).join(", ");

			await axios.patch(
				`https://startupbihar.in/api/seed-fund/u1/${id}`,
				{
					documentStatus: "Partially Rejected",
					comment: `Document has been partially rejected for reason: ${comment}`,
					...updateFields,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `${token}`,
					},
				},
			);
			handleDialog("Application is partially rejected.");
			setIsCommentVisible(false);
			await fetchData(); // Update the data after status change
			// Post notification
			await postNotification("Your Seed Fund application has been partially rejected.", docLinks, `Reason: ${comment}`);
		} catch (error) {
			console.error("Error updating data:", error);
		}
	};

	const handleAccept = async () => {
		handleDialog("Updating status to accept...");
		try {
			await axios.patch(
				`https://startupbihar.in/api/seed-fund/u1/${id}`,
				{
					documentStatus: "Accepted",
					comment: "Document has been reviewed and approved.",
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `${token}`,
					},
				},
			);
			handleDialog("Application is accepted.");
			await fetchData(); // Update the data after status change
			// Post notification
			await postNotification("Your Seed Fund application has been accepted.");
		} catch (error) {
			console.error("Error updating data:", error);
		}
	};

	const postNotification = async (notificationMessage, docLink = null, subtitle = "Seed Fund Application") => {
		try {
			if (!data?.userId || !adminId || !adminRole || !notificationMessage) {
				console.error("Missing required fields to post a notification.");
				return;
			}
	
			const notificationData = {
				user_id: data.userId, // Ensure `userId` is present
				admin_id: adminId, // Replace with actual admin ID
				admin_role: adminRole, // Replace with actual admin role
				notification: notificationMessage,
				subtitle: subtitle,
				related_to: `Application ID: ${id}`, // Ensure `id` is defined
			};
	
			if (docLink) {
				notificationData.docLink = docLink;
			}
	
			const response = await axios.post(
				"https://startupbihar.in/api/notifications/",
				notificationData,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `${token}`, // Validate `token` existence
					}
				},
			);
	
			if (response.status === 201) {
				console.log("Notification posted successfully.");
			} else {
				console.error("Unexpected response:", response);
			}
		} catch (error) {
			console.error("Error posting notification:", error.response?.data || error.message);
		}
	};
	
	const getStatusColor = () => {
		if (data.documentStatus === "Accepted") return "text-green-500";
		if (data.documentStatus === "Rejected") return "text-red-500";
		if (data.documentStatus === "Partially Rejected") return "text-yellow-500";
		return "";
	};
	const getComment = () => {
		if (comment != null) {
			return data.comment;
		}
		if (data.documentStatus === "Accepted")
			return "Document has been reviewed and approved.";
		if (data.documentStatus === "Rejected")
			return "Document has been partially rejected";
		if (data.documentStatus === "Partially Rejected")
			return "Document has been rejected";
		return "";
	};
	const handleViewPdf = (url) => {
		// Use Google PDF viewer as fallback
		const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
		setPdfUrl(viewerUrl);
		setIsPdfModalVisible(true);
	};

	const closePdfModal = () => {
		setIsPdfModalVisible(false);
		setPdfUrl("");
	};

	const handleCheckboxChange = (event) => {
		const { value } = event.target;
		setSelectedOptions((prevSelectedOptions) =>
			prevSelectedOptions.includes(value)
				? prevSelectedOptions.filter((option) => option !== value)
				: [...prevSelectedOptions, value],
		);
	};

	return (
		<div className="h-screen overflow-y-auto">
			<h1 className="pt-5 pl-8 text-2xl">Seed Fund Application Details</h1>
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
  First Applied on: {data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : "N/A"} | 
  Last Action on: {data?.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : "N/A"}
</p>
			<div className="px-8 py-5">
				<table className="min-w-full bg-white">
					<tbody>
						
						{/* Conditionally render Application Status row */}
						{data.documentStatus && (
							<tr>
								<td className="py-4 px-4 border">Application Status</td>
								<td className={`py-4 px-4 border ${getStatusColor()}`}>
									{`${data.documentStatus} | ${getComment()}`}
								</td>
							</tr>
						)}
						<tr>
							<td className="py-4 px-4 border">Company Name</td>
							<td className="py-4 px-4 border">{data.companyName}</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">Registration Number</td>
							<td className="py-4 px-4 border">{data.registrationNumber}</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">Date of Incorporation</td>
							<td className="py-4 px-4 border">{data.dateOfIncorporation}</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">Business Entity Type</td>
							<td className="py-4 px-4 border">{data.businessEntityType}</td>
						</tr>

						<tr>
							<td className="py-4 px-4 border">ROC District</td>
							<td className="py-4 px-4 border">{data.rocDistrict}</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">Company Address</td>
							<td className="py-4 px-4 border">{data.companyAddress}</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">Pincode</td>
							<td className="py-4 px-4 border">{data.pincode}</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">Bank Name</td>
							<td className="py-4 px-4 border">{data.bankName}</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">IFSC Code</td>
							<td className="py-4 px-4 border">{data.ifscCode}</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">Current Account Number</td>
							<td className="py-4 px-4 border">{data.currentAccountNumber}</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">Current Account Holder Name</td>
							<td className="py-4 px-4 border">
								{data.currentAccountHolderName}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">Branch Name</td>
							<td className="py-4 px-4 border">{data.branchName}</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">Branch Address</td>
							<td className="py-4 px-4 border">{data.branchAddress}</td>
						</tr>

						<tr>
							<td className="py-4 px-4 border">PAN Number</td>
							<td className="py-4 px-4 border">{data.panNumber}</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">GST Number</td>
							<td className="py-4 px-4 border">{data.gstNumber}</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">Cancelled Cheque or Passbook</td>
							<td className="border-b border-l border-t border-r w-[35vw]">
								<FileViewPanel
									field={data.cancelChequeOrPassbook}
									handleViewPdf={handleViewPdf}
								/>
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">Detailed Project Report</td>
							<td className="border-b border-l border-t border-r w-[35vw]">
								<FileViewPanel field={data.dpr} handleViewPdf={handleViewPdf} />
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">Company Certificate</td>
							<td className="border-b border-l border-t border-r w-[35vw]">
								<FileViewPanel
									field={data.companyCertificate}
									handleViewPdf={handleViewPdf}
								/>
							</td>
						</tr>
						{/* Conditional Upload Field for Partnership Firm or Limited Liability Partnership (LLP) */}
						{(data.businessEntityType === "Partnership Firm" ||
							data.businessEntityType ===
								"Limited Liability Partnership (LLP)") && (
							<tr>
								<td className="py-4 px-4 border">Partnership Agreement</td>
								<td className="border-b border-l border-t border-r w-[35vw]">
									<FileViewPanel
										field={data.partnershipAgreement}
										handleViewPdf={handleViewPdf}
									/>
								</td>
							</tr>
						)}

						{data.businessEntityType ===
							"Private Limited Company/One Person Company (OPC)" && (
							<>
								<tr>
									<td className="py-4 px-4 border">INC 33</td>
									<td className="border-b border-l border-t border-r w-[35vw]">
										<FileViewPanel
											field={data.inc33}
											handleViewPdf={handleViewPdf}
										/>
									</td>
								</tr>
								<tr>
									<td className="py-4 px-4 border">INC34</td>
									<td className="border-b border-l border-t border-r w-[35vw]">
										<FileViewPanel
											field={data.inc34}
											handleViewPdf={handleViewPdf}
										/>
									</td>
								</tr>
							</>
						)}
					</tbody>
				</table>

				<div className="flex items-center justify-end gap-x-2 pr-4 py-3">
					<button
						className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
						onClick={handleAccept}
					>
						Accept
					</button>
					<button
						className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white"
						onClick={() => {
							setIsCommentVisible(true);
							setComment("•");
						}}
					>
						Reject
					</button>
					<button
						className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white"
						onClick={() => {
							setIsCommentVisible(true);
							setComment("•");
						}}
					>
						Partial Reject
					</button>
				</div>

				{isCommentVisible && (
					<div className="fixed top-1/4 w-5/12 bg-white/40 rounded-md shadow-xl p-4 z-10 left-1/3 bg-opacity-30 backdrop-filter backdrop-blur-lg border border-white border-opacity-30 ">
						<h2 className="text-lg font-semibold">Add Comment</h2>
						<textarea
							value={comment}
							onChange={handleCommentChange}
							onKeyDown={handleKeyDown}
							className="mt-2  border rounded-md w-full h-20 pl-2 pt-2"
						/>
						<button
							type="button"
							className="absolute top-24 right-6 bg-blue-500 px-2 my-1 rounded-md"
							onClick={() => setComment((prevComment) => `${prevComment}\n• `)}
						>
							•
						</button>
						<p className="my-2 text-slate-950">
							Select documents for partial reject{" "}
						</p>
						<hr />
						{/* Checkbox Group */}
						<div className="my-4 space-y-2 ">
							<label className="flex items-center space-x-2 cursor-pointer">
								<input
									type="checkbox"
									name="rejectReason"
									value="companyCertificate"
									checked={selectedOptions.includes("companyCertificate")}
									onChange={handleCheckboxChange}
									className="form-checkbox h-4 w-4 text-indigo-600 rounded-none"
								/>
								<span className="text-sm text-slate-950">
									Company Certificate
								</span>
							</label>
							<label className="flex items-center space-x-2 cursor-pointer">
								<input
									type="checkbox"
									name="rejectReason"
									value="cancelChequeOrPassbook"
									checked={selectedOptions.includes("cancelChequeOrPassbook")}
									onChange={handleCheckboxChange}
									className="form-checkbox h-4 w-4 text-indigo-600 rounded-none"
								/>
								<span className="text-sm text-slate-950">
									Cancelled Cheque or Passbook
								</span>
							</label>
							<label className="flex items-center space-x-2 cursor-pointer">
								<input
									type="checkbox"
									name="rejectReason"
									value="dpr"
									checked={selectedOptions.includes("dpr")}
									onChange={handleCheckboxChange}
									className="form-checkbox h-4 w-4 text-indigo-600 rounded-none"
								/>
								<span className="text-sm text-slate-950">
									Detailed Project Report
								</span>
							</label>
							{(data.businessEntityType === "Partnership Firm" ||
								data.businessEntityType ===
									"Limited Liability Partnership (LLP)") && (
								<label className="flex items-center space-x-2 cursor-pointer">
									<input
										type="checkbox"
										name="rejectReason"
										value="partnershipAgreement"
										checked={selectedOptions.includes("partnershipAgreement")}
										onChange={handleCheckboxChange}
										className="form-checkbox h-4 w-4 text-indigo-600 rounded-none"
									/>
									<span className="text-sm text-slate-950">
										Partnership Agreement
									</span>
								</label>
							)}
							{data.businessEntityType ===
								"Private Limited Company/One Person Company (OPC)" && (
								<>
									<label className="flex items-center space-x-2 cursor-pointer">
										<input
											type="checkbox"
											name="rejectReason"
											value="inc33"
											checked={selectedOptions.includes("inc33")}
											onChange={handleCheckboxChange}
											className="form-checkbox h-4 w-4 text-indigo-600 rounded-none"
										/>
										<span className="text-sm text-slate-950">INC 33</span>
									</label>
									<label className="flex items-center space-x-2 cursor-pointer">
										<input
											type="checkbox"
											name="rejectReason"
											value="inc34"
											checked={selectedOptions.includes("inc34")}
											onChange={handleCheckboxChange}
											className="form-checkbox h-4 w-4 text-indigo-600 rounded-none"
										/>
										<span className="text-sm text-slate-950">INC 34</span>
									</label>
								</>
							)}
						</div>
						<div className="flex justify-end gap-x-2 mt-4">
							<button
								type="button"
								className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
								onClick={() => setIsCommentVisible(false)}
							>
								Cancel
							</button>
							<button
								type="button"
								className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white"
								onClick={handlePartialReject}
							>
								Partial Reject
							</button>
							<button
								type="button"
								className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white"
								onClick={handleReject}
							>
								Reject
							</button>
						</div>
					</div>
				)}
				{/* PDF View Modal */}
				{isPdfModalVisible && (
					<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
						<div className="bg-white rounded-lg shadow-lg p-4 w-3/4 h-[600px]">
							<div className="flex justify-end">
								<button
									className="text-gray-600 hover:text-gray-900"
									onClick={closePdfModal}
								>
									Close
								</button>
							</div>
							<iframe
								src={pdfUrl}
								className="w-full h-full"
								frameBorder="0"
							></iframe>
						</div>
					</div>
				)}
				{showDialog && (
					<div className="fixed inset-0 flex items-center justify-center z-50">
						<div className="bg-black bg-opacity-50 absolute inset-0"></div>
						<div className="bg-white p-6 rounded-md shadow-lg z-10">
							<p className="text-lg font-semibold">{dialogMessage}</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default SeedfundModuleDetails;
