import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import FileViewPanel from "./FileViewPanel";

const StartupProfileDetails = ({ id }) => {
	const [data, setData] = useState([]);
	const [isCommentVisible, setIsCommentVisible] = useState(false);
	const token = localStorage.getItem("token");
	const [isImageModalVisible, setIsImageModalVisible] = useState(false);
	const [imageUrl, setImageUrl] = useState("");
	const [showDialog, setShowDialog] = useState(false);
	const [comment, setComment] = useState("");
	const [dialogMessage, setDialogMessage] = useState("");
	const [selectedOptions, setSelectedOptions] = useState([]);

	const [pdfUrl, setPdfUrl] = useState("");
	const [isPdfModalVisible, setIsPdfModalVisible] = useState(false); // State to manage PDF modal visibility

	const adminRole = localStorage.getItem("admin_role") || "admin";
	const adminId = localStorage.getItem("admin_id") || "admin";

	console.log(data);
	const fetchData = async () => {
		if (id) {
			try {
				const response = await axios.get(
					`http://51.20.52.245:3007/api/StartupProfile/v1/${id}`,
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: `${token}`,
						},
					},
				);
				setData(response.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
			console.log(`http://51.20.52.245:3007/api/StartupProfile/v1/${id}`);
			console.log(data);
		}
	};
	useEffect(() => {
		fetchData();
	}, [id]);

	const handleCheckboxChange = (event) => {
		const { value } = event.target;
		setSelectedOptions((prevSelectedOptions) =>
			prevSelectedOptions.includes(value)
				? prevSelectedOptions.filter((option) => option !== value)
				: [...prevSelectedOptions, value],
		);
	};

	const handleReject = async () => {
		handleDialog("Updating status to reject...");
		try {
			await axios.patch(
				`http://51.20.52.245:3007/api/StartupProfile/u1/${id}`,
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
			await postNotification("Your Start-up application has been rejected.", `Reason: ${comment}`);
		} catch (error) {
			console.error("Error updating data:", error);
		}
	};
	const handleDialog = (message) => {
		setDialogMessage(message);
		setShowDialog(true);

		// Automatically hide the dialog after 2 seconds
		setTimeout(() => {
			setShowDialog(false);
			setDialogMessage(""); // Clear the message
		}, 2000);
	};

	const handlePartialReject = async () => {
		handleDialog("Updating status to partial reject...");
		try {
			const updateFields = selectedOptions.reduce((acc, field) => {
				acc[field] = null;
				return acc;
			}, {});

			const docLinks = selectedOptions.map(option => {
				const docName = option === "certPath" ? "DPIIT Certificate" : option;
				return `${data[option]}:${docName}`;
			}).join(", ");

			await axios.patch(
				`http://51.20.52.245:3007/api/StartupProfile/u1/${id}`,
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
			await postNotification("Your Start-up application has been partially rejected.", docLinks, `Reason: ${comment}`);
		} catch (error) {
			console.error("Error updating data:", error);
		}
	};

	const handleAccept = async () => {
		handleDialog("Updating status to accept...");
		try {
			await axios.patch(
				`http://51.20.52.245:3007/api/StartupProfile/u1/${id}`,
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
		await postNotification("Your Start-up application has been accepted.");
		} catch (error) {
			console.error("Error updating data:", error);
		}
	};

	const postNotification = async (notificationMessage, docLink = null, subtitle = "Startup Profile Application") => {
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
				"http://51.20.52.245:3007/api/notifications/",
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
	const handleViewImage = (url) => {
		setImageUrl(url);
		setIsImageModalVisible(true);
	};

	const closeImageModal = () => {
		setImageUrl("");
		setIsImageModalVisible(false);
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

	const handleCommentChange = (e) => {
		setComment(e.target.value);
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			setComment((prevComment) => `${prevComment}\n• `);
		}
	};

	return (
		<div
			className="h-screen overflow-y-auto"
			style={{
				msOverflowStyle: "none", //for no scrollbar
				scrollbarWidth: "none",
			}}
		>
			<h1 className="pt-5 pl-8 text-2xl">Startup Profile Details </h1>
			<p className="pt-5 pl-8 text-l text-indigo-600">
  {data?.user?.company_name || "Company Name Unavailable"} | 
  Startup ID: {data?.user?.user_id || "ID Unavailable"}
</p>
			<div className="px-8 py-5">
				<table className="min-w-full bg-white">
					{/* <tbody>
						{Object.entries(data).map(([key, value], index) => (
							<tr key={index} className="">
								<td className="py-4 px-4 border-b border-l border-t">{key}</td>
								<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
									{value}
								</td>
							</tr>
						))} */}

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
							<td className="py-4 px-4 border-b border-l border-t">ID</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{data.id}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">
								Registration No
							</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{data.registrationNo}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">
								Founder Name
							</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{data.founderName}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">
								Founder Aadhar Number
							</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{data.founderAadharNumber}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">
								Co-funder Names
							</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{Array.isArray(data.coFounderNames)
									? data.coFounderNames.join(", ")
									: data.coFounderNames}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">
								Co-funder Aadhar Numbers
							</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{Array.isArray(data.coFounderAadharNumbers)
									? data.coFounderAadharNumbers.join(", ")
									: data.coFounderAadharNumbers}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">Sector</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{data.sector}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">
								Brief on the Business Concept
							</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{data.businessConcept}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">
								Mobile Numbers
							</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{Array.isArray(data.mobileNumbers)
									? data.mobileNumbers.join(", ")
									: data.mobileNumbers}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">Email</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw] text-blue-600 hover:underline">
								<a href={`mailto:${data.email}`}>{data.email}</a>
							</td>
						</tr>

						<tr>
							<td className="py-4 px-4 border-b border-l border-t">
								Company Logo
							</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								<button
									onClick={() => handleViewImage(data.logoPath)}
									className="text-blue-600 hover:underline"
									type="button"
								>
									Click to View Logo
								</button>
							</td>
						</tr>

						{isImageModalVisible && (
							<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
								<div className="bg-white rounded-lg shadow-lg p-4 w-3/4 max-w-[500px]">
									<div className="flex justify-end">
										<button
											className="text-gray-600 hover:text-gray-900"
											onClick={closeImageModal}
											type="button"
										>
											
											
											
											
											
											
											✕
										</button>
									</div>
									<img
										src={imageUrl}
										alt="Company Logo"
										className="w-full h-auto object-contain"
									/>
								</div>
							</div>
						)}

						<tr>
							<td className="py-4 px-4 border-b border-l border-t">
								Website Link
							</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw] text-blue-600 hover:underline">
								<a
									href={data.websiteLink}
									target="_blank"
									rel="noopener noreferrer"
								>
									{data.websiteLink}
								</a>
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">Category</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{data.category}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">Gender</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{data.gender}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">
								DPIIT Recognition Number
							</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{data.dpiitRecognitionNo}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">
								Has your startup applied for any IPR (Intellectual Property
								Right) (Yes/No)
							</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{data.appliedIPR ? "Yes" : "No"}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">DPIIT Certificate</td>
							<td className="border-b border-l border-t border-r w-[35vw]">
								<FileViewPanel
									field={data.certPath}
									handleViewPdf={handleViewPdf}
								/>
							</td>
						</tr>
					</tbody>
				</table>

				<div className="flex items-center justify-end gap-x-2 pr-4 py-3">
					<button
						type="button"
						className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
						onClick={handleAccept}
					>
						Accept
					</button>
					<button
						type="button"
						className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white"
						onClick={() => {
							setIsCommentVisible(true);
							setComment("•");
						}}
					>
						Reject
					</button>
					<button
						type="button"
						className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white"
						onClick={() => {
							setIsCommentVisible(true);
							setComment("•");
						}}
					>
						Partial Reject
					</button>
				</div>
			</div>

			{isCommentVisible && (
				<div className="fixed top-1/4 w-5/12 bg-white/40 rounded-md shadow-xl p-4 z-10 left-1/3 bg-opacity-30 backdrop-filter backdrop-blur-lg border border-white border-opacity-30">
					<h2 className="text-lg font-semibold">Add Comment</h2>
					<textarea
						value={comment}
						onChange={handleCommentChange}
						onKeyDown={handleKeyDown}
						className="mt-2 border rounded-md w-full h-20 pl-2 pt-2"
					/>
					<button
						type="button"
						className="absolute top-24 right-6 bg-blue-500 px-2 my-1 rounded-md"
						onClick={() => setComment((prevComment) => `${prevComment}\n• `)}
					>
						•
					</button>
					<p className="my-2 text-slate-950">
						Select documents for partial reject
					</p>
					<hr />
					{/* Checkbox Group */}
					<div className="my-4 space-y-2">
						<label className="flex items-center space-x-2 cursor-pointer">
							<input
								type="checkbox"
								name="rejectReason"
								value="certPath"
								checked={selectedOptions.includes("certPath")}
								onChange={handleCheckboxChange}
								className="form-checkbox h-4 w-4 text-indigo-600 rounded-none"
							/>
							<span className="text-sm text-slate-950">DPIIT Certificate</span>
						</label>
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
								type="button"
								className="text-gray-600 hover:text-gray-900"
								onClick={closePdfModal}
							>
								Close
							</button>
						</div>
						<iframe src={pdfUrl} className="w-full h-full" frameBorder="0" />
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
	);
};

export default StartupProfileDetails;
