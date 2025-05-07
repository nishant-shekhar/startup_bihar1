import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PostSeedFundModuleDetails = ({ id }) => {
	const [data, setData] = useState({});
	const [isCommentVisible, setIsCommentVisible] = useState(false);
	const [comment, setComment] = useState("•");
	const [showDialog, setShowDialog] = useState(false);
	const [dialogMessage, setDialogMessage] = useState("");
	const token = localStorage.getItem("token");

	const [pdfUrl, setPdfUrl] = useState("");
	const [isPdfModalVisible, setIsPdfModalVisible] = useState(false);
	const [selectedOptions, setSelectedOptions] = useState([]);
	const adminRole = localStorage.getItem("admin_role") || "admin";
	const adminId = localStorage.getItem("admin_id") || "admin";
	const fetchData = async () => {
		if (id) {
			try {
				const response = await axios.get(
					`https://startupbihar.in/api/post-seed/v1/${id}`,
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
		}
	};

	useEffect(() => {
		fetchData();
	}, [id]);

	const handleDialog = (message) => {
		setDialogMessage(message);
		setShowDialog(true);
		setTimeout(() => setShowDialog(false), 2000);
	};

	const handleReject = async () => {
		handleDialog("Updating status to reject...");
		try {
			await axios.patch(
				`https://startupbihar.in/api/post-seed/u1/${id}`,
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
			await fetchData();

			// Post notification
			await postNotification("Your Post seed Fund application has been rejected.", `Reason: ${comment}`);
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
				const docName = option === "projectReport" ? "Project Report" :
					option === "gstReturn" ? "GST Return" :
						option === "auditedBalanceSheet" ? "Audited Balance Sheet" : option;
				return `${data[option]}^${docName}`;

			}).join(", ");


			await axios.patch(
				`https://startupbihar.in/api/post-seed/u1/${id}`,
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
			await fetchData();

			// Post notification
			await postNotification("Your Post Seed Fund application has been partially rejected.", docLinks, `Reason: ${comment}`);
		} catch (error) {
			console.error("Error updating data:", error);
		}
	};

	const handleAccept = async () => {
		handleDialog("Updating status to accept...");
		try {
			await axios.patch(
				`https://startupbihar.in/api/post-seed/u1/${id}`,
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
			await fetchData();

			// Post notification
			await postNotification("Your Post Seed Fund application has been accepted.");
		} catch (error) {
			console.error("Error updating data:", error);
		}
	};
	const postNotification = async (notificationMessage, docLink = null, subtitle = "Post Seed Fund Application") => {
		try {
			if (!data?.userId || !adminId || !adminRole || !notificationMessage) {
				console.error("Missing required fields to post a notification.");
				return;
			}
			console.log(data?.user?.user_id)
			console.log(data?.user_id)

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
			return "Document has been Partially rejected";
		return "";
	};

	const handleViewPdf = (url) => {
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
	console.log(selectedOptions);

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
				msOverflowStyle: "none",
				scrollbarWidth: "none",
			}}
		>
			<h1 className="pt-5 pl-8 text-2xl">Post Seed Fund Module Details</h1>
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
									{`${data.documentStatus} | Comment: ${getComment()}`}
								</td>
							</tr>
						)}
						<tr>
							<td className="py-4 px-4 border">
								Current stage of your startup
							</td>
							<td className="py-4 px-4 border">{data.currentStage}</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">
								Does the founders/ Key employees possess technical
								knowledge/necessary skills to operate and scale the business?
							</td>
							<td className="py-4 px-4 border">
								{data.technicalKnowledge ? "Yes" : "No"}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">
								Has Startup raised any fund/investment from recognised SEBI CAT
								1 AIF / angel investors or Venture Capitalist, Bank Loan
								excluding Seed Fund received under Bihar Startup Policy or
								assistance under any Government institution?
							</td>
							<td className="py-4 px-4 border">
								{data.raisedFunds ? "Yes" : "No"}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">
								Has startup has given the employment to 5-10 employees working
								continuously for atleast 6 months?
							</td>
							<td className="py-4 px-4 border">
								{data.employment ? "Yes" : "No"}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">
								Startups has to submit the Project Report of their future plan
								with milestone and time frame
							</td>
							<td className=" border-b border-l border-t border-r w-[35vw]">
								<div className="px-4 py-4 ">
									<dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
										<ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
											<li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6">
												<div className="flex w-0 flex-1 items-center">
													<svg
														className="h-5 w-5 shrink-0 text-gray-400"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
														data-slot="icon"
													>
														<path
															fillRule="evenodd"
															d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z"
															clipRule="evenodd"
														/>
													</svg>
													<div className="ml-4 flex min-w-0 flex-1 gap-2">
														<span className="truncate font-medium">
															{data.projectReport ? (
																data.projectReport
															) : (
																<span className="text-red-500">
																	File is either rejected or not available
																</span>
															)}
														</span>
													</div>
												</div>
												<div className="ml-4 shrink-0">
													<button
														onClick={() => handleViewPdf(data.projectReport)}
														className="font-medium text-indigo-600 hover:text-indigo-900"
													>
														View
													</button>
												</div>
												<div className="ml-4 shrink-0">
													<a
														href={data.projectReport} // Ensure it's used as an absolute URL

														download
														className="font-medium text-indigo-600 hover:text-indigo-900"
													>
														Download
													</a>
												</div>
												
											</li>
										</ul>
									</dd>
								</div>
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">
								Upload GST return of current Financial Year.(Startup must have
								shown the growth of at least 20% since previous Financial Year)
							</td>
							<td className=" border-b border-l border-t border-r w-[35vw]">
								<div className="px-4 py-4 ">
									<dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
										<ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
											<li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6">
												<div className="flex w-0 flex-1 items-center">
													<svg
														className="h-5 w-5 shrink-0 text-gray-400"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
														data-slot="icon"
													>
														<path
															fillRule="evenodd"
															d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z"
															clipRule="evenodd"
														/>
													</svg>
													<div className="ml-4 flex min-w-0 flex-1 gap-2">
														<span className="truncate font-medium">
															{data.gstReturn ? (
																data.gstReturn
															) : (
																<span className="text-red-500">
																	File is either rejected or not available
																</span>
															)}
														</span>
													</div>
												</div>
												<div className="ml-4 shrink-0">
													<button
														onClick={() => handleViewPdf(data.gstReturn)}
														className="font-medium text-indigo-600 hover:text-indigo-900"
													>
														View
													</button>
												</div>
												<div className="ml-4 shrink-0">
													<a
														href={data.gstReturn} // Ensure it's used as an absolute URL
														download
														className="font-medium text-indigo-600 hover:text-indigo-900"
													>
														Download
													</a>
												</div>
											</li>
										</ul>
									</dd>
								</div>
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">
								Upload Audited Balance Sheet of Previous Financial Year
							</td>
							<td className=" border-b border-l border-t border-r w-[35vw]">
								<div className="px-4 py-4 ">
									<dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
										<ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
											<li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6">
												<div className="flex w-0 flex-1 items-center">
													<svg
														className="h-5 w-5 shrink-0 text-gray-400"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
														data-slot="icon"
													>
														<path
															fillRule="evenodd"
															d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z"
															clipRule="evenodd"
														/>
													</svg>
													<div className="ml-4 flex min-w-0 flex-1 gap-2">
														<span className="truncate font-medium">
															{data.auditedBalanceSheet ? (
																data.auditedBalanceSheet
															) : (
																<span className="text-red-500">
																	File is either rejected or not available
																</span>
															)}
														</span>
													</div>
												</div>
												<div className="ml-4 shrink-0">
													<button
														onClick={() =>
															handleViewPdf(data.auditedBalanceSheet)
														}
														className="font-medium text-indigo-600 hover:text-indigo-900"
													>
														View
													</button>
												</div>
												<div className="ml-4 shrink-0">
													<a
														href={data.auditedBalanceSheet}
														download
														className="font-medium text-indigo-600 hover:text-indigo-900"
													>
														Download
													</a>
												</div>
											</li>
										</ul>
									</dd>
								</div>
							</td>
						</tr>
						{/* New Row: File1 - Startup Certificate */}
						<tr>
							<td className="py-4 px-4 border">
								Startup Certificate
							</td>
							<td className="border-b border-l border-t border-r w-[35vw]">
								<div className="px-4 py-4">
									<dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
										<ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
											<li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6">
												<div className="flex w-0 flex-1 items-center">
													<svg className="h-5 w-5 shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
														<path fillRule="evenodd" d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z" clipRule="evenodd" />
													</svg>
													<div className="ml-4 flex min-w-0 flex-1 gap-2">
														<span className="truncate font-medium">
															{data.file1 ? data.file1 : <span className="text-red-500">File is either rejected or not available</span>}
														</span>
													</div>
												</div>
												<div className="ml-4 shrink-0">
													<button onClick={() => handleViewPdf(data.file1)} className="font-medium text-indigo-600 hover:text-indigo-900">
														View
													</button>
												</div>
												<div className="ml-4 shrink-0">
													<a href={data.file1} download className="font-medium text-indigo-600 hover:text-indigo-900">
														Download
													</a>
												</div>
											</li>
										</ul>
									</dd>
								</div>
							</td>
						</tr>

						{/* New Row: File2 - Bank Statement/ Salary Slip */}
						<tr>
							<td className="py-4 px-4 border">
								Bank Statement/ Salary Slip
							</td>
							<td className="border-b border-l border-t border-r w-[35vw]">
								<div className="px-4 py-4">
									<dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
										<ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
											<li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6">
												<div className="flex w-0 flex-1 items-center">
													<svg className="h-5 w-5 shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
														<path fillRule="evenodd" d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z" clipRule="evenodd" />
													</svg>
													<div className="ml-4 flex min-w-0 flex-1 gap-2">
														<span className="truncate font-medium">
															{data.file2 ? data.file2 : <span className="text-red-500">File is either rejected or not available</span>}
														</span>
													</div>
												</div>
												<div className="ml-4 shrink-0">
													<button onClick={() => handleViewPdf(data.file2)} className="font-medium text-indigo-600 hover:text-indigo-900">
														View
													</button>
												</div>
												<div className="ml-4 shrink-0">
													<a href={data.file2} download className="font-medium text-indigo-600 hover:text-indigo-900">
														Download
													</a>
												</div>
											</li>
										</ul>
									</dd>
								</div>
							</td>
						</tr>

						{/* New Row: File3 - Proof of Technical Knowledge */}
						<tr>
							<td className="py-4 px-4 border">
								Proof of Technical Knowledge
							</td>
							<td className="border-b border-l border-t border-r w-[35vw]">
								<div className="px-4 py-4">
									<dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
										<ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
											<li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6">
												<div className="flex w-0 flex-1 items-center">
													<svg className="h-5 w-5 shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
														<path fillRule="evenodd" d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z" clipRule="evenodd" />
													</svg>
													<div className="ml-4 flex min-w-0 flex-1 gap-2">
														<span className="truncate font-medium">
															{data.file3 ? data.file3 : <span className="text-red-500">File is either rejected or not available</span>}
														</span>
													</div>
												</div>
												<div className="ml-4 shrink-0">
													<button onClick={() => handleViewPdf(data.file3)} className="font-medium text-indigo-600 hover:text-indigo-900">
														View
													</button>
												</div>
												<div className="ml-4 shrink-0">
													<a href={data.file3} download className="font-medium text-indigo-600 hover:text-indigo-900">
														Download
													</a>
												</div>
											</li>
										</ul>
									</dd>
								</div>
							</td>
						</tr>

						{/* New Row: File4 - Audited Balance Sheet on Fund Receipt */}
						<tr>
							<td className="py-4 px-4 border">
							Fund Utilization certificate
							</td>
							<td className="border-b border-l border-t border-r w-[35vw]">
								<div className="px-4 py-4">
									<dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
										<ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
											<li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6">
												<div className="flex w-0 flex-1 items-center">
													<svg className="h-5 w-5 shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
														<path fillRule="evenodd" d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z" clipRule="evenodd" />
													</svg>
													<div className="ml-4 flex min-w-0 flex-1 gap-2">
														<span className="truncate font-medium">
															{data.file4 ? data.file4 : <span className="text-red-500">File is either rejected or not available</span>}
														</span>
													</div>
												</div>
												<div className="ml-4 shrink-0">
													<button onClick={() => handleViewPdf(data.file4)} className="font-medium text-indigo-600 hover:text-indigo-900">
														View
													</button>
												</div>
												<div className="ml-4 shrink-0">
													<a href={data.file4} download className="font-medium text-indigo-600 hover:text-indigo-900">
														Download
													</a>
												</div>
												
											</li>
										</ul>
									</dd>
								</div>
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
							<div className="my-4 space-y-2 ">
								{[
									{ key: "projectReport", label: "Project Report" },
									{ key: "gstReturn", label: "GST Return" },
									{ key: "auditedBalanceSheet", label: "Audited Balance Sheet" },
									{ key: "file1", label: "Startup Certificate" },
									{ key: "file2", label: "Bank Statement/ Salary Slip" },
									{ key: "file3", label: "Proof of Technical Knowledge" },
									{ key: "file4", label: "Audited Balance Sheet on Fund Receipt" },
								].map(({ key, label }) => (
									<label key={key} className="flex items-center space-x-2 cursor-pointer">
										<input
											type="checkbox"
											name="rejectReason"
											value={key}
											checked={selectedOptions.includes(key)}
											onChange={handleCheckboxChange}
											className="form-checkbox h-4 w-4 text-indigo-600 rounded-none"
										/>
										<span className="text-sm text-slate-950">{label}</span>
									</label>
								))}
							</div>

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
		</div>
	);
};

export default PostSeedFundModuleDetails;
