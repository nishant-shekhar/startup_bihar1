import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const AccelerationProgrammeModuleDetails = ({ id }) => {
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
					`https://startupbihar.in:3007/api/acceleration/v1/${id}`,
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
				`https://startupbihar.in:3007/api/acceleration/u1/${id}`,
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
				`https://startupbihar.in:3007/api/acceleration/u1/${id}`,
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
				`https://startupbihar.in:3007/api/acceleration/u1/${id}`,
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
			<h1 className="pt-5 pl-8 text-2xl">Acceleration Programme Module Details</h1>
			<p className="pt-5 pl-8 text-l text-indigo-600">
  {data?.user?.company_name || "Company Name Unavailable"} | 
  Startup ID: {data?.user?.user_id || "ID Unavailable"}
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
							<td className="py-4 px-4 border">Name of the Host Institute/Organisation</td>
							<td className="py-4 px-4 border">{data.hostInstitute}</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">Name of Programme/ Event</td>
							<td className="py-4 px-4 border">{data.programName}</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">Program/Event Start date</td>
							<td className="py-4 px-4 border">{data.startDate}</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">Program/Event End date</td>
							<td className="py-4 px-4 border">{data.endDate}</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">Website of the program/event (if any)</td>
							<td className="py-4 px-4 border">{data.programWebsite}</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">Name of founder attended the program/event</td>
							<td className="py-4 px-4 border">{data.founderName}</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">Name of Co-founder attended the program/event</td>
							<td className="py-4 px-4 border">{data.coFounderName}</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">Total Fees paid for the participation per person (INR)</td>
							<td className="py-4 px-4 border">{data.participationFee}</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">Total rail fare/ air tickets and hotel room charges (INR)</td>
							<td className="py-4 px-4 border">{data.travelAccommodationCost}</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">Total Persons</td>
							<td className="py-4 px-4 border">{data.totalPersons}</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border">Total Fees</td>
							<td className="py-4 px-4 border">{data.totalFee}</td>
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

export default AccelerationProgrammeModuleDetails;
