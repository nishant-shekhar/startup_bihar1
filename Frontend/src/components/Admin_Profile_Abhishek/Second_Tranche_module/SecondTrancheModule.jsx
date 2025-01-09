import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const SecondTrancheModuleDetails = ({ id }) => {
	const [data, setData] = useState({});
	const [isCommentVisible, setIsCommentVisible] = useState(false);
	const [comment, setComment] = useState("•");
	const [showDialog, setShowDialog] = useState(false);
	const [dialogMessage, setDialogMessage] = useState("");
	const token = localStorage.getItem("token");
	const [selectedOptions, setSelectedOptions] = useState([]);
	const adminRole = localStorage.getItem("admin_role") || "admin";
	const adminId = localStorage.getItem("admin_id") || "admin";

	const [pdfUrl, setPdfUrl] = useState("");
	const [isPdfModalVisible, setIsPdfModalVisible] = useState(false); // State to manage PDF modal visibility

	const fetchData = async () => {
		if (id) {
			try {
				const response = await axios.get(
					`http://51.20.52.245:3007/api/second-tranche/v1/${id}`,
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: `${token}`,
						},
					},
				);
				setData(response.data);
			} catch (error) {
				console.error({ id } + "Error fetching data:", error);
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

	const handleCheckboxChange = (event) => {
		const { value } = event.target;
		setSelectedOptions((prevSelectedOptions) =>
			prevSelectedOptions.includes(value)
				? prevSelectedOptions.filter((option) => option !== value)
				: [...prevSelectedOptions, value],
		);
	};
	console.log(selectedOptions);

	const handleReject = async () => {
		handleDialog("Updating status to reject...");
		try {
			await axios.patch(
				`http://51.20.52.245:3007/api/second-tranche/u1/${id}`,
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
			await postNotification("Your Second Tranche application has been rejected.", `Reason: ${comment}`);
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
				const docName = option === "utilizationCertificate" ? "C.A certified utilization certificate" :
								option === "statusReport" ? "Status Report" :
								option === "expenditurePlan" ? "Self declared second tranche expenditure plan in the letter head of entity" :
								option === "bankStatement" ? "Bank statement (Highlight the fund received and expenditure made)" :
								option === "expenditureInvoice" ? "Expenditure Invoice" :
								option === "geoTaggedPhotos" ? "Geo-tagged photos of your offices/units" : option;
				return `${data[option]}:${docName}`;
			}).join(", ");

			await axios.patch(
				`http://51.20.52.245:3007/api/second-tranche/u1/${id}`,
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
			await postNotification("Your Second Tranche application has been partially rejected.", docLinks, `Reason: ${comment}`);
		} catch (error) {
			console.error("Error updating data:", error);
		}
	};

	const handleAccept = async () => {
		handleDialog("Updating status to accept...");
		try {
			await axios.patch(
				`http://51.20.52.245:3007/api/second-tranche/u1/${id}`,
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
			await postNotification("Your Second Tranche application has been accepted.");
		} catch (error) {
			console.error("Error updating data:", error);
		}
	};

	const postNotification = async (notificationMessage, docLink = null, subtitle = "Second Tranche Application") => {
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
				msOverflowStyle: "none",
				scrollbarWidth: "none",
			}}
		>
			<h1 className="pt-5 pl-8 text-2xl">Second Tranche Application Details </h1>
			<p className="pt-5 pl-8 text-l text-indigo-600">
  {data?.user?.company_name || "Company Name Unavailable"} | 
  Startup ID: {data?.user?.user_id || "ID Unavailable"}
</p>
<p className="pl-8 text-sm font-light text-gray-600">
  First Applied on: {data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : "N/A"} | 
  Last Updated on: {data?.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : "N/A"}
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
							<td className="py-4 px-4 border">
								C.A  certified utilization certificate
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
															{data.utilizationCertificate ? (
																data.utilizationCertificate
															) : (
																<span className="text-red-500">
																	File is either rejected or not available
																</span>
															)}
														</span>
													</div>
												</div>
												<div className="ml-4 shrink-0">
													{/* <a
														href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" // Ensure this path points to the correct relative URL of the PDF file
														target="_blank"
														rel="noopener noreferrer"
														className="font-medium text-indigo-600 hover:text-indigo-900"
													>
														View
													</a> */}

													<button
														onClick={() =>
															handleViewPdf(data.utilizationCertificate)
														}
														className="font-medium text-indigo-600 hover:text-indigo-900"
													>
														View
													</button>
												</div>
												<div className="ml-4 shrink-0">
													<a
														href={`/${data.utilizationCertificate}`}
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
							<td className="py-4 px-4 border">Status Report</td>
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
															{data.statusReport ? (
																data.statusReport
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
														onClick={() => handleViewPdf(data.statusReport)}
														className="font-medium text-indigo-600 hover:text-indigo-900"
													>
														View
													</button>
												</div>
												<div className="ml-4 shrink-0">
													<a
														href={`/${data.statusReport}`}
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
								Self declared second tranche expenditure plan in the letter head
								of entity
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
															{data.expenditurePlan ? (
																data.expenditurePlan
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
														onClick={() => handleViewPdf(data.expenditurePlan)}
														className="font-medium text-indigo-600 hover:text-indigo-900"
													>
														View
													</button>
												</div>
												<div className="ml-4 shrink-0">
													<a
														href={`/${data.expenditurePlan}`}
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
								Bank statement (Highlight the fund received and expenditure
								made)
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
															{data.bankStatement ? (
																data.bankStatement
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
														onClick={() => handleViewPdf(data.bankStatement)}
														className="font-medium text-indigo-600 hover:text-indigo-900"
													>
														View
													</button>
												</div>
												<div className="ml-4 shrink-0">
													<a
														href={`/${data.bankStatement}`}
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
							<td className="py-4 px-4 border">Expenditure Invoice</td>
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
															{data.expenditureInvoice ? (
																data.expenditureInvoice
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
															handleViewPdf(data.expenditureInvoice)
														}
														className="font-medium text-indigo-600 hover:text-indigo-900"
													>
														View
													</button>
												</div>
												<div className="ml-4 shrink-0">
													<a
														href={`/${data.expenditureInvoice}`}
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
								Geo-tagged photos of your offices/units
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
															{data.geoTaggedPhotos ? (
																data.geoTaggedPhotos
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
														onClick={() => handleViewPdf(data.geoTaggedPhotos)}
														className="font-medium text-indigo-600 hover:text-indigo-900"
													>
														View
													</button>
												</div>
												<div className="ml-4 shrink-0">
													<a
														href={`/${data.geoTaggedPhotos}`}
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
							<label className="flex items-center space-x-2 cursor-pointer">
								<input
									type="checkbox"
									name="rejectReason"
									value="utilizationCertificate"
									checked={selectedOptions.includes("utilizationCertificate")}
									onChange={handleCheckboxChange}
									className="form-checkbox h-4 w-4 text-indigo-600 rounded-none" // square checkbox
								/>
								<span className="text-sm text-slate-950">
									C.A certified utilization certificate
								</span>
							</label>

							<label className="flex items-center space-x-2 cursor-pointer">
								<input
									type="checkbox"
									name="rejectReason"
									value="statusReport"
									checked={selectedOptions.includes("statusReport")}
									onChange={handleCheckboxChange}
									className="form-checkbox h-4 w-4 text-indigo-600 rounded-none"
								/>
								<span className="text-sm text-slate-950">Status Report</span>
							</label>

							<label className="flex items-center space-x-2 cursor-pointer">
								<input
									type="checkbox"
									name="rejectReason"
									value="expenditurePlan"
									checked={selectedOptions.includes("expenditurePlan")}
									onChange={handleCheckboxChange}
									className="form-checkbox h-4 w-4 text-indigo-600 rounded-none"
								/>
								<span className="text-sm text-slate-950">
									Upload Self declared second tranche expenditure plan in the
									letter head of entity
								</span>
							</label>

							<label className="flex items-center space-x-2 cursor-pointer">
								<input
									type="checkbox"
									name="rejectReason"
									value="bankStatement"
									checked={selectedOptions.includes("bankStatement")}
									onChange={handleCheckboxChange}
									className="form-checkbox h-4 w-4 text-indigo-600 rounded-none"
								/>
								<span className="text-sm text-slate-950">
									Bank statement (Highlight the fund received and expenditure
									made)
								</span>
							</label>

							<label className="flex items-center space-x-2 cursor-pointer">
								<input
									type="checkbox"
									name="rejectReason"
									value="expenditureInvoice"
									checked={selectedOptions.includes("expenditureInvoice")}
									onChange={handleCheckboxChange}
									className="form-checkbox h-4 w-4 text-indigo-600 rounded-none"
								/>
								<span className="text-sm text-slate-950">
									Upload Expenditure Invoice
								</span>
							</label>

							<label className="flex items-center space-x-2 cursor-pointer">
								<input
									type="checkbox"
									name="rejectReason"
									value="geoTaggedPhotos"
									checked={selectedOptions.includes("geoTaggedPhotos")}
									onChange={handleCheckboxChange}
									className="form-checkbox h-4 w-4 text-indigo-600 rounded-none"
								/>
								<span className="text-sm text-slate-950">
									Upload geo-tagged photos of your offices/ units
								</span>
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
		</div>
	);
};

export default SecondTrancheModuleDetails;
