import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const PostSeedFundModuleDetails = ({ id }) => {
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
					`http://localhost:3007/api/post-seed/v1/${id}`,
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
				`http://localhost:3007/api/post-seed/u1/${id}`,
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
				`http://localhost:3007/api/post-seed/u1/${id}`,
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
				`http://localhost:3007/api/post-seed/u1/${id}`,
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
			style={{
				msOverflowStyle: "none",
				scrollbarWidth: "none",
			}}
		>
			<h1 className="pt-5 pl-8 text-2xl">Post Seed Fund Module Details</h1>
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
															{data.projectReport}
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
														href={`/${data.projectReport}`}
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
															{data.gstReturn}
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
														href={`/${data.gstReturn}`}
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
															{data.auditedBalanceSheet}
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
														href={`/${data.auditedBalanceSheet}`}
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
