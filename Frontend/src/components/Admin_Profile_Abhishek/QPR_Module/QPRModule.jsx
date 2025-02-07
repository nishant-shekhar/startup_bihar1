import React, { useEffect, useState } from "react";
import axios from "axios";

const QPRModuleDetails = ({ id }) => {
	const [data, setData] = useState({});
	const [isCommentVisible, setIsCommentVisible] = useState(false);
	const [comment, setComment] = useState("");
	const [showDialog, setShowDialog] = useState(false);
	const [dialogMessage, setDialogMessage] = useState("");
	const token = localStorage.getItem("token");
	const [pdfUrl, setPdfUrl] = useState("");
	const [isPdfModalVisible, setIsPdfModalVisible] = useState(false);

	const fetchData = async () => {
		if (id) {
			try {
				const response = await axios.get(
					`https://startupbihar.in/api/Qreport/v1/${id}`,
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
	const display = (value) => (value !== undefined && value !== null && value !== "" ? value : "N/A");

	const handleReject = async () => {
		handleDialog("Updating status to reject...");
		try {
			await axios.patch(
				`https://startupbihar.in/api/Qreport/u1/${id}`,
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
		} catch (error) {
			console.error("Error updating data:", error);
		}
	};

	const handlePartialReject = async () => {
		handleDialog("Updating status to partial reject...");
		try {
			await axios.patch(
				`https://startupbihar.in/api/Qreport/u1/${id}`,
				{
					documentStatus: "Partially Rejected",
					comment: `Document has been partially rejected for reason: ${comment}`,
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
		} catch (error) {
			console.error("Error updating data:", error);
		}
	};

	const handleAccept = async () => {
		handleDialog("Updating status to accept...");
		try {
			await axios.patch(
				`https://startupbihar.in/api/Qreport/u1/${id}`,
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
		} catch (error) {
			console.error("Error updating data:", error);
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
		const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
		setPdfUrl(viewerUrl);
		setIsPdfModalVisible(true);
	};

	const closePdfModal = () => {
		setIsPdfModalVisible(false);
		setPdfUrl("");
	};

	return (
		<div
			className="h-screen overflow-y-auto"
			style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
		>
			<h1 className="pt-5 pl-8 text-2xl">QPR Module Details</h1>
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
							<tr className="border-b">

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
							<tr className="border-b">

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
									{`${data.documentStatus} | Comment: ${display(getComment())}`}
								</td>
							</tr>
						)}
						<tr className="border-b">

							<td className="px-6 py-4 border">Total Co-Founders</td>
							<td className="px-6 py-4 border">{display(data?.totalCoFounders)}</td>
						</tr>
						<tr className="border-b">

							<td className="px-6 py-4 border">Stage</td>
							<td className="px-6 py-4 border">{display(data?.stage)}</td>
						</tr>
						<tr className="border-b">

							<td className="px-6 py-4 border">Sector</td>
							<td className="px-6 py-4 border">{display(data?.sector)}</td>
						</tr>
						<tr className="border-b">

							<td className="px-6 py-4 border">Registered District</td>
							<td className="px-6 py-4 border">{display(data?.registeredDistrict)}</td>
						</tr>
						<tr className="border-b">

							<td className="px-6 py-4 border">Registered Block</td>
							<td className="px-6 py-4 border">{display(data?.registeredBlock)}</td>
						</tr>
						<tr className="border-b">

							<td className="px-6 py-4 border">About Startup</td>
							<td className="px-6 py-4 border">{display(data?.aboutStartup)}</td>
						</tr>
						{/* Financial & Operations */}
						<tr className="border-b">

							<td className="px-6 py-4 border">Funds Taken</td>
							<td className="px-6 py-4 border">{display(data?.fundsTaken)}</td>
						</tr>
						<tr className="border-b">

							<td className="px-6 py-4 border">Current Revenue</td>
							<td className="px-6 py-4 border">{display(data?.currentRevenue)}</td>
						</tr>
						<tr className="border-b">

							<td className="px-6 py-4 border">Net Profit or Loss</td>
							<td className="px-6 py-4 border">{display(data?.netProfitOrLoss)}</td>
						</tr>
						<tr className="border-b">

							<td className="px-6 py-4 border">Funds Raised</td>
							<td className="px-6 py-4 border">{data?.fundsRaised ? "Yes" : "No"}</td>
						</tr>
						<tr className="border-b">

							<td className="px-6 py-4 border">Funds Details</td>
							<td className="px-6 py-4 border">{display(data?.fundsDetails)}</td>
						</tr>
						<tr className="border-b">

							<td className="px-6 py-4 border">Fund Amount</td>
							<td className="px-6 py-4 border">{display(data?.fundAmount)}</td>
						</tr>
						<tr className="border-b">

							<td className="px-6 py-4 border">IPR Received</td>
							<td className="px-6 py-4 border">{display(data?.iprReceived)}</td>
						</tr>
						{/* Employment */}
						<tr className="border-b">

							<td className="px-6 py-4 border">Full Time Male</td>
							<td className="px-6 py-4 border">{display(data?.fullTimeMale)}</td>
						</tr>
						<tr className="border-b">

							<td className="px-6 py-4 border">Full Time Female</td>
							<td className="px-6 py-4 border">{display(data?.fullTimeFemale)}</td>
						</tr>
						<tr className="border-b">

							<td className="px-6 py-4 border">Part Time Male</td>
							<td className="px-6 py-4 border">{display(data?.partTimeMale)}</td>
						</tr>
						<tr className="border-b">

							<td className="px-6 py-4 border">Part Time Female</td>
							<td className="px-6 py-4 border">{display(data?.partTimeFemale)}</td>
						</tr>
						{/* Work & Customers */}
						<tr className="border-b">

							<td className="px-6 py-4 border">Work Orders</td>
							<td className="px-6 py-4 border">{display(data?.workOrders)}</td>
						</tr>
						<tr className="border-b">

							<td className="px-6 py-4 border">Total Work Order Amount</td>
							<td className="px-6 py-4 border">{display(data?.totalWorkOrderAmount)}</td>
						</tr>
						<tr className="border-b">

							<td className="px-6 py-4 border">Customers Acquired</td>
							<td className="px-6 py-4 border">{display(data?.customersAcquired)}</td>
						</tr>
						{/* Files & Uploads */}
						<tr className="border-b">

							<td className="px-6 py-4 border">Unit Photos</td>
							<td className="px-6 py-4 border">
								{data?.unitPhotos ? (
									data.unitPhotos.split(";").map((url, idx) => (
										url && (
											<a
												key={idx}
												href={url}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-block mr-2 mb-2"
											>
												<img
													src={url}
													alt={`Unit Photo ${idx + 1}`}
													className="w-16 h-16 object-cover rounded border"
												/>
											</a>
										)
									))
								) : (
									"N/A"
								)}
							</td>
						</tr>

					
						<tr className="border-b">

							<td className="py-4 px-4 border">
								Pitchdeck
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
															{data.pitchdeck ? (
																data.pitchdeck
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
														onClick={() => handleViewPdf(data.pitchdeck)}
														className="font-medium text-indigo-600 hover:text-indigo-900"
													>
														View
													</button>
												</div>
												<div className="ml-4 shrink-0">
													<a
														href={data.pitchdeck}
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
						<tr className="border-b">

							<td className="py-4 px-4 border">
							Audited Report
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
															{data.pitchdeck ? (
																data.pitchdeck
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
														onClick={() => handleViewPdf(data.auditedReport)}
														className="font-medium text-indigo-600 hover:text-indigo-900"
													>
														View
													</button>
												</div>
												<div className="ml-4 shrink-0">
													<a
														href={data.auditedReport}
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
						
						{/* Incubation & Achievements */}
						<tr className="border-b">

							<td className="px-6 py-4 border">Incubation Benefits</td>
							<td className="px-6 py-4 border">{display(data?.incubationBenefits)}</td>
						</tr>
						<tr className="border-b">

							<td className="px-6 py-4 border">Benefits Details</td>
							<td className="px-6 py-4 border">{display(data?.benefitsDetails)}</td>
						</tr>
						<tr className="border-b">

							<td className="px-6 py-4 border">Other Achievements</td>
							<td className="px-6 py-4 border">{display(data?.otherAchievements)}</td>
						</tr>
						{/* Meta Info */}


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
							setComment("");
						}}
					>
						Reject
					</button>
					<button
						type="button"
						className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white"
						onClick={() => {
							setIsCommentVisible(true);
							setComment("");
						}}
					>
						Partial Reject
					</button>
				</div>

				{isCommentVisible && (
					<div className="absolute top-64 w-3/12 bg-white rounded-md shadow-xl p-4 z-10 left-[37%]">
						<h2 className="text-lg font-semibold">Add Comment</h2>
						<textarea
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							className="mt-2 border rounded-md w-full h-20 pl-2 pt-2"
						/>
						<div className="flex justify-end gap-x-2 mt-4">
							<button
								type="button"
								className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white"
								onClick={() => setIsCommentVisible(false)}
							>
								Cancel
							</button>
							<button
								type="button"
								className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
								onClick={handleReject}
							>
								Reject
							</button>
							<button
								type="button"
								className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
								onClick={handlePartialReject}
							>
								Partial Reject
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
						<div className="bg-black bg-opacity-50 absolute inset-0" />
						<div className="bg-white p-6 rounded-md shadow-lg z-10">
							<p className="text-lg font-semibold">{dialogMessage}</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default QPRModuleDetails;
