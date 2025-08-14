import React, { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const RepaymentModuleDetails = ({ id }) => {
	const [repaymentData, setRepaymentData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeTab, setActiveTab] = useState("overview");
	const token = localStorage.getItem("token");
	useEffect(() => {
		const fetchRepaymentData = async () => {
			// Use a default test ID if none is provided
			const startupId = id || "test-id-123";

			setLoading(true);
			try {
				const response = await axios.get(
					`https://startupbihar.in/api/repayment/v1/${startupId}`,
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: `${token}`,
						},
					},
				);

				// For demo purposes, if API doesn't return data yet
				if (!response.data || Object.keys(response.data).length === 0) {
					setRepaymentData(generateDemoData());
				} else {
					setRepaymentData(response.data);
				}

				setLoading(false);
			} catch (error) {
				console.error("Error fetching repayment data:", error);
				setError("Failed to load repayment details. Please try again later.");
				setRepaymentData(generateDemoData()); // Use demo data for now
				setLoading(false);
			}
		};

		fetchRepaymentData();
	}, [id, token]);
	// Generate demo data for development purposes
	const generateDemoData = () => {
		return {
			startupName: "EcoSolutions Private Limited",
			founderName: "Rajesh Kumar",
			loanAmount: 2500000,
			loanTerm: 36, // months
			interestRate: 7.5,
			startDate: "2024-02-15",
			totalPaid: 695000,
			totalRemaining: 1805000,
			nextPaymentDate: "2025-05-20",
			nextPaymentAmount: 83500,
			status: "Active",
			emiHistory: [
				{
					id: 1,
					dueDate: "2024-03-15",
					amount: 83500,
					status: "Paid",
					paidOn: "2024-03-12",
				},
				{
					id: 2,
					dueDate: "2024-04-15",
					amount: 83500,
					status: "Paid",
					paidOn: "2024-04-14",
				},
				{
					id: 3,
					dueDate: "2024-05-15",
					amount: 83500,
					status: "Paid",
					paidOn: "2024-05-10",
				},
				{
					id: 4,
					dueDate: "2025-05-20",
					amount: 83500,
					status: "Upcoming",
					paidOn: null,
				},
				{
					id: 5,
					dueDate: "2025-06-15",
					amount: 83500,
					status: "Upcoming",
					paidOn: null,
				},
				{
					id: 6,
					dueDate: "2025-07-15",
					amount: 83500,
					status: "Upcoming",
					paidOn: null,
				},
				{
					id: 7,
					dueDate: "2025-08-15",
					amount: 83500,
					status: "Upcoming",
					paidOn: null,
				},
				{
					id: 8,
					dueDate: "2025-09-15",
					amount: 83500,
					status: "Upcoming",
					paidOn: null,
				},
			],
			documents: [
				{ id: 1, name: "Loan Agreement", url: "#" },
				{ id: 2, name: "Payment Schedule", url: "#" },
				{ id: 3, name: "Bank Statements", url: "#" },
			],
		};
	};

	// Format currency values
	const formatCurrency = (value) => {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			maximumFractionDigits: 0,
		}).format(value);
	};

	// Format date values
	const formatDate = (dateString) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		return date.toLocaleDateString("en-IN", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	// Calculate progress percentage
	const calculateProgress = (paid, total) => {
		return (paid / total) * 100;
	};

	// Handle tab switching
	const handleTabChange = (tab) => {
		setActiveTab(tab);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-6 bg-white rounded-lg shadow-md">
				<div className="text-red-500 text-center">
					<i className="mdi mdi-alert-circle text-3xl mb-2"></i>
					<p>{error}</p>
				</div>
			</div>
		);
	}

	// Early return if no data
	if (!repaymentData) {
		return (
			<div className="p-6 bg-white rounded-lg shadow-md">
				<p className="text-center text-gray-600">
					No repayment data available.
				</p>
			</div>
		);
	}

	const progressPercentage = calculateProgress(
		repaymentData.totalPaid,
		repaymentData.totalPaid + repaymentData.totalRemaining,
	);

	return (
		<div className="bg-gray-50 p-6 h-full overflow-auto">
			{/* Header Section */}
			<div className="bg-white rounded-lg shadow-md p-6 mb-6">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center">
					<div>
						<h1 className="text-2xl font-bold text-gray-800 mb-2">
							{repaymentData.startupName}
						</h1>
						<p className="text-gray-600">
							Founder: {repaymentData.founderName}
						</p>
					</div>
					<div className="mt-4 md:mt-0">
						<span
							className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
								repaymentData.status === "Active"
									? "bg-green-100 text-green-800"
									: repaymentData.status === "Overdue"
										? "bg-red-100 text-red-800"
										: "bg-yellow-100 text-yellow-800"
							}`}
						>
							<span
								className={`h-2 w-2 rounded-full mr-2 ${
									repaymentData.status === "Active"
										? "bg-green-600"
										: repaymentData.status === "Overdue"
											? "bg-red-600"
											: "bg-yellow-600"
								}`}
							></span>
							{repaymentData.status}
						</span>
					</div>
				</div>
			</div>

			{/* Tab Navigation */}
			<div className="flex mb-6 border-b border-gray-200">
				<button
					onClick={() => handleTabChange("overview")}
					className={`px-4 py-2 font-medium text-sm ${
						activeTab === "overview"
							? "text-purple-600 border-b-2 border-purple-600"
							: "text-gray-500 hover:text-gray-700"
					}`}
				>
					Overview
				</button>
				<button
					onClick={() => handleTabChange("emi-history")}
					className={`px-4 py-2 font-medium text-sm ${
						activeTab === "emi-history"
							? "text-purple-600 border-b-2 border-purple-600"
							: "text-gray-500 hover:text-gray-700"
					}`}
				>
					EMI History
				</button>
				<button
					onClick={() => handleTabChange("documents")}
					className={`px-4 py-2 font-medium text-sm ${
						activeTab === "documents"
							? "text-purple-600 border-b-2 border-purple-600"
							: "text-gray-500 hover:text-gray-700"
					}`}
				>
					Documents
				</button>
			</div>

			{/* Overview Tab Content */}
			{activeTab === "overview" && (
				<>
					{/* Loan Summary Section */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
						<div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
							<div className="w-24 h-24 mb-4">
								<CircularProgressbar
									value={progressPercentage}
									text={`${Math.round(progressPercentage)}%`}
									styles={buildStyles({
										textSize: "16px",
										pathColor: `rgba(124, 58, 237, ${progressPercentage / 100})`,
										textColor: "#7c3aed",
										trailColor: "#d6d6d6",
									})}
								/>
							</div>
							<h3 className="text-gray-600 font-medium text-sm">
								Repayment Progress
							</h3>
							<p className="text-gray-800 font-semibold mt-2">
								{formatCurrency(repaymentData.totalPaid)} of{" "}
								{formatCurrency(
									repaymentData.totalPaid + repaymentData.totalRemaining,
								)}
							</p>
						</div>

						<div className="bg-white rounded-lg shadow-md p-6">
							<h3 className="text-gray-600 font-medium text-sm mb-4">
								Loan Details
							</h3>
							<div className="space-y-3">
								<div className="flex justify-between">
									<span className="text-gray-500">Loan Amount</span>
									<span className="text-gray-800 font-medium">
										{formatCurrency(repaymentData.loanAmount)}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-500">Term Length</span>
									<span className="text-gray-800 font-medium">
										{repaymentData.loanTerm} months
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-500">Interest Rate</span>
									<span className="text-gray-800 font-medium">
										{repaymentData.interestRate}%
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-500">Start Date</span>
									<span className="text-gray-800 font-medium">
										{formatDate(repaymentData.startDate)}
									</span>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-lg shadow-md p-6">
							<h3 className="text-gray-600 font-medium text-sm mb-4">
								Next Payment
							</h3>
							<div className="space-y-3">
								<div className="flex justify-between">
									<span className="text-gray-500">Due Date</span>
									<span className="text-gray-800 font-medium">
										{formatDate(repaymentData.nextPaymentDate)}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-500">Amount Due</span>
									<span className="text-gray-800 font-medium">
										{formatCurrency(repaymentData.nextPaymentAmount)}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-500">Remaining Balance</span>
									<span className="text-gray-800 font-medium">
										{formatCurrency(repaymentData.totalRemaining)}
									</span>
								</div>
							</div>
							<button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors">
								Record Payment
							</button>
						</div>
					</div>

					{/* Payment Stats Section */}
					<div className="bg-white rounded-lg shadow-md p-6">
						<h3 className="text-gray-800 font-medium mb-4">
							Payment Statistics
						</h3>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="bg-purple-50 p-4 rounded-lg">
								<p className="text-sm text-gray-500">Total EMIs</p>
								<p className="text-xl font-semibold text-gray-800">
									{repaymentData.loanTerm}
								</p>
							</div>{" "}
							<div className="bg-green-50 p-4 rounded-lg">
								<p className="text-sm text-gray-500">EMIs Paid</p>
								<p className="text-xl font-semibold text-green-600">
									{" "}
									{repaymentData.emiHistory?.filter(
										(emi) => emi.status === "Paid",
									)?.length || 0}
								</p>
							</div>
							<div className="bg-yellow-50 p-4 rounded-lg">
								<p className="text-sm text-gray-500">Upcoming EMIs</p>
								<p className="text-xl font-semibold text-yellow-600">
									{" "}
									{repaymentData.emiHistory?.filter(
										(emi) => emi.status === "Upcoming",
									)?.length || 0}
								</p>
							</div>
							<div className="bg-red-50 p-4 rounded-lg">
								<p className="text-sm text-gray-500">Overdue EMIs</p>
								<p className="text-xl font-semibold text-red-600">
									{" "}
									{repaymentData.emiHistory?.filter(
										(emi) => emi.status === "Overdue",
									)?.length || 0}
								</p>
							</div>
						</div>
					</div>
				</>
			)}

			{/* EMI History Tab Content */}
			{activeTab === "emi-history" && (
				<div className="bg-white rounded-lg shadow-md p-6">
					<h3 className="text-gray-800 font-medium mb-4">
						EMI Payment History
					</h3>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										EMI No.
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Due Date
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Amount
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Status
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Payment Date
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{repaymentData.emiHistory?.map((emi) => (
									<tr key={emi.id}>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{emi.id}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{formatDate(emi.dueDate)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{formatCurrency(emi.amount)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
													emi.status === "Paid"
														? "bg-green-100 text-green-800"
														: emi.status === "Overdue"
															? "bg-red-100 text-red-800"
															: "bg-yellow-100 text-yellow-800"
												}`}
											>
												{emi.status}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{emi.paidOn ? formatDate(emi.paidOn) : "—"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* Documents Tab Content */}
			{activeTab === "documents" && (
				<div className="bg-white rounded-lg shadow-md p-6">
					<h3 className="text-gray-800 font-medium mb-4">Related Documents</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{repaymentData.documents?.map((doc) => (
							<div
								key={doc.id}
								className="border border-gray-200 rounded-lg p-4 flex items-center"
							>
								<div className="bg-purple-100 rounded-lg p-3 mr-3">
									<i className="mdi mdi-file-document-outline text-purple-600 text-xl"></i>
								</div>
								<div className="flex-1">
									<h4 className="text-sm font-medium text-gray-800">
										{doc.name}
									</h4>
								</div>
								<button className="text-purple-600 hover:text-purple-800">
									<i className="mdi mdi-eye text-xl"></i>
								</button>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default RepaymentModuleDetails;
