import React, { useState, useEffect } from "react";

const UserResponseView = () => {
	const [formData, setFormData] = useState({
		basicDetails: null,
		entityDetails: null,
		startupDetails: null,
		cofounderDetails: null,
		businessIdea: null,
	});

	const [loading, setLoading] = useState(true);
	const [activeSection, setActiveSection] = useState("all");

	useEffect(() => {
		// Load saved data for each step from localStorage
		const basicDetails = localStorage.getItem("basicDetails");
		const entityDetails = localStorage.getItem("entityDetails");
		const startupDetails = localStorage.getItem("startupDetails");
		const cofounderDetails = localStorage.getItem("cofounderDetails");
		const businessIdea = localStorage.getItem("businessIdea");

		setFormData({
			basicDetails: basicDetails ? JSON.parse(basicDetails) : null,
			entityDetails: entityDetails ? JSON.parse(entityDetails) : null,
			startupDetails: startupDetails ? JSON.parse(startupDetails) : null,
			cofounderDetails: cofounderDetails ? JSON.parse(cofounderDetails) : null,
			businessIdea: businessIdea ? JSON.parse(businessIdea) : null,
		});

		setLoading(false);
	}, []);

	// Helper function to format date strings
	const formatDate = (dateString) => {
		if (!dateString) return "";
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString();
		} catch (e) {
			return dateString;
		}
	};

	// Helper function to format currency values
	const formatCurrency = (value) => {
		if (!value && value !== 0) return "";
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			maximumFractionDigits: 0,
		}).format(value);
	};

	// Helper function to render a single field
	const renderField = (key, value, sectionTitle) => {
		// Skip null values
		if (value === null || value === undefined) return null;

		// Skip logo field for Entity Details section
		if (key === "logo" && sectionTitle === "Entity Details") return null;

		// Format key for display (convert camelCase to Title Case)
		const formattedKey = key
			.replace(/([A-Z])/g, " $1")
			.replace(/^./, (str) => str.toUpperCase());

		// Special handling for logo/image field - only for Basic Details
		if (key === "logo" && sectionTitle === "Basic Details") {
			return (
				<div key={key} className="w-full flex justify-center">
					{typeof value === "string" ? (
						<img
							src={value}
							alt="Logo"
							className="max-w-full h-auto rounded-md shadow-sm"
						/>
					) : (
						<div className="bg-purple-100 p-6 rounded-lg text-center">
							<i className="mdi mdi-file-image-outline text-5xl text-purple-600 mb-2" />
							<div className="text-purple-800 font-medium">
								{value instanceof File ? value.name : "Logo Image"}
							</div>
						</div>
					)}
				</div>
			);
		}

		// Special handling for Business Idea section with vertical label-value layout
		if (sectionTitle === "Business Idea") {
			// Format different types of values appropriately
			let displayValue = value;

			if (typeof value === "object") {
				if (value instanceof File) {
					displayValue = (
						<span className="text-purple-600">
							<i className="mdi mdi-file-document-outline mr-1" />
							{value.name}
						</span>
					);
				} else if (value instanceof Date) {
					displayValue = formatDate(value);
				} else {
					return null; // Skip complex objects we can't display
				}
			} else if (typeof value === "boolean") {
				displayValue = value ? "Yes" : "No";
			} else if (key.toLowerCase().includes("date")) {
				displayValue = formatDate(value);
			} else if (
				key.toLowerCase().includes("fund") &&
				typeof value === "number"
			) {
				displayValue = formatCurrency(value);
			}

			return (
				<div key={key} className="p-3 bg-gray-50 rounded-md">
					<div className="text-gray-700 font-medium text-lg mb-2">
						{formattedKey}
					</div>
					<div className="text-gray-800 pl-2">{displayValue.toString()}</div>
				</div>
			);
		}

		// Format different types of values appropriately
		let displayValue = value;

		if (typeof value === "object") {
			if (value instanceof File) {
				displayValue = (
					<span className="text-purple-600">
						<i className="mdi mdi-file-document-outline mr-1" />
						{value.name}
					</span>
				);
			} else if (value instanceof Date) {
				displayValue = formatDate(value);
			} else {
				return null; // Skip complex objects we can't display
			}
		} else if (typeof value === "boolean") {
			displayValue = value ? "Yes" : "No";
		} else if (key.toLowerCase().includes("date")) {
			displayValue = formatDate(value);
		} else if (
			key.toLowerCase().includes("fund") &&
			typeof value === "number"
		) {
			displayValue = formatCurrency(value);
		}

		return (
			<div key={key} className="p-3 bg-gray-50 rounded-md flex">
				<div className="text-gray-600 font-medium block mb- mr-2">
					{formattedKey} :{" "}
				</div>
				<div className="text-gray-800">{displayValue.toString()}</div>
			</div>
		);
	};

	// Helper function to render a data section
	const renderSection = (title, data, icon) => {
		if (!data) return null;

		if (
			activeSection !== "all" &&
			activeSection !== title.toLowerCase().replace(/\s+/g, "")
		) {
			return null;
		}

		// Special handling for Basic Details section with image on left and fields on right
		if (title === "Basic Details" && data) {
			// Extract logo if it exists
			const { logo, ...otherFields } = data;

			return (
				<div className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg">
					<div className="flex items-center mb-6 pb-2 border-b border-gray-100">
						<i className={`${icon} text-purple-600 text-2xl mr-3`} />
						<h2 className="text-xl font-semibold text-gray-800">{title}</h2>
					</div>{" "}
					<div className="flex flex-col md:flex-row gap-6">
						<div className="md:w-1/3 flex justify-center items-start">
							<div className="w-full max-w-xs bg-gray-50 rounded-lg p-4 flex justify-center">
								{" "}
								{logo ? (
									renderField("logo", logo, title)
								) : (
									<div className="bg-gray-50 p-2 rounded-lg text-center">
										<img
											src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
											alt="Sample Profile"
											className="w-32 h-32 mx-auto rounded-md"
										/>
										<div className="text-gray-500 mt-2">
											Sample Profile Image
										</div>
									</div>
								)}
							</div>
						</div>{" "}
						<div className="md:w-2/3">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
								{Object.entries(otherFields).map(([key, value]) => {
									return renderField(key, value, title);
								})}
							</div>
						</div>
					</div>
				</div>
			);
		}

		// Special handling for Business Idea section - single column layout
		if (title === "Business Idea" && data) {
			return (
				<div className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg">
					<div className="flex items-center mb-6 pb-2 border-b border-gray-100">
						<i className={`${icon} text-purple-600 text-2xl mr-3`} />
						<h2 className="text-xl font-semibold text-gray-800">{title}</h2>
					</div>{" "}
					<div className="grid grid-cols-1 gap-4">
						{Object.entries(data).map(([key, value]) =>
							renderField(key, value, title),
						)}
					</div>
				</div>
			);
		}

		// Default rendering for other sections
		return (
			<div className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg">
				<div className="flex items-center mb-6 pb-2 border-b border-gray-100">
					<i className={`${icon} text-purple-600 text-2xl mr-3`} />
					<h2 className="text-xl font-semibold text-gray-800">{title}</h2>
				</div>{" "}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{Object.entries(data).map(([key, value]) =>
						renderField(key, value, title),
					)}
				</div>
			</div>
		);
	};

	// Navigation tabs
	const renderTabs = () => {
		const tabs = [
			{ id: "all", label: "All Sections", icon: "mdi-view-dashboard" },
			{
				id: "basicdetails",
				label: "Basic Details",
				icon: "mdi-account-outline",
			},
			{
				id: "entitydetails",
				label: "Entity Details",
				icon: "mdi-office-building-outline",
			},
			{
				id: "startupdetails",
				label: "Startup Details",
				icon: "mdi-rocket-launch-outline",
			},
			{
				id: "cofounderdetails",
				label: "Co-Founder Details",
				icon: "mdi-account-group-outline",
			},
			{
				id: "businessidea",
				label: "Business Idea",
				icon: "mdi-lightbulb-outline",
			},
		];

		return (
			<div className="flex flex-wrap gap-2 mb-8 justify-center">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						type="button"
						onClick={() => setActiveSection(tab.id)}
						className={`px-4 py-2 rounded-full text-sm font-medium flex items-center transition-colors ${
							activeSection === tab.id
								? "bg-purple-600 text-white shadow-md"
								: "bg-white text-gray-700 hover:bg-purple-100"
						}`}
					>
						<i className={`mdi ${tab.icon} mr-2`} />
						{tab.label}
					</button>
				))}
			</div>
		);
	};

	// Timeline data
	const timelineSteps = [
		{
			id: "applied",
			label: "Date Applied",
			date: "2025-05-01",
			status: "completed",
		},
		{
			id: "review",
			label: "Form Under Review",
			date: "2025-05-05",
			status: "completed",
		},
		{ id: "decision", label: "Form Decision", date: null, status: "pending" },
		{ id: "exam", label: "Exam Date", date: "2025-06-01", status: "pending" },
		{
			id: "interview",
			label: "Interview Date",
			date: "2025-06-15",
			status: "pending",
		},
	];

	// Helper function to render the timeline
	const renderTimeline = () => {
		return (
			<div className="relative flex flex-col md:flex-row items-center justify-between mb-10">
				{/* Connecting line */}
				<div className="absolute top-4 left-0 right-0 h-1 bg-gray-300 z-0 mx-10" />
				{timelineSteps.map((step, index) => (
					<div
						key={step.id}
						className={`relative z-10 flex flex-col items-center ${
							index !== timelineSteps.length - 1 ? "md:mr-8" : ""
						}`}
					>
						<div
							className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold ${
								step.status === "completed"
									? "bg-green-500"
									: step.status === "pending"
										? "bg-gray-300"
										: "bg-red-500"
							}`}
						>
							{index + 1}
						</div>

						<p className="text-sm mt-2 text-center  items-center justify-center gap-2">
							<h1 className={step.status === "pending" ? "invisible" : ""}>
								{step.label}
							</h1>
							<h1
								className={`text-xs ${step.status === "pending" ? "invisible" : "text-gray-500"}`}
							>
								{step.date || "Placeholder Date"}
							</h1>
						</p>
					</div>
				))}
			</div>
		);
	};

	if (loading) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-100">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mb-4" />
				<p className="text-purple-800 font-medium">
					Loading registration data...
				</p>
			</div>
		);
	}

	const hasData =
		formData.basicDetails ||
		formData.entityDetails ||
		formData.startupDetails ||
		formData.cofounderDetails ||
		formData.businessIdea;

	return (
		<div
			className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
			style={{
				backgroundImage:
					"linear-gradient(to bottom right, rgba(254, 226, 254, 0.6), rgba(255, 255, 255, 0.8), rgba(236, 222, 253, 0.6)), url('/webb.png')",
				backgroundSize: "auto",
				backgroundPosition: "center",
				backgroundRepeat: "repeat",
				backgroundAttachment: "fixed",
			}}
		>
			<link
				rel="stylesheet"
				href="https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css"
			/>
			<div className="max-w-5xl mx-auto">
				<div className="text-center mb-10">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">
						Your Submitted Startup Registration
					</h1>
					<p className="text-lg text-gray-600">
						This is a read-only view of the information you submitted.
					</p>
				</div>

				{/* Timeline */}
				{renderTimeline()}

				{hasData && renderTabs()}

				{renderSection(
					"Basic Details",
					formData.basicDetails,
					"mdi mdi-account-outline",
				)}
				{renderSection(
					"Entity Details",
					formData.entityDetails,
					"mdi mdi-office-building-outline",
				)}
				{renderSection(
					"Startup Details",
					formData.startupDetails,
					"mdi mdi-rocket-launch-outline",
				)}
				{renderSection(
					"Co-Founder Details",
					formData.cofounderDetails,
					"mdi mdi-account-group-outline",
				)}
				{renderSection(
					"Business Idea",
					formData.businessIdea,
					"mdi mdi-lightbulb-outline",
				)}

				{!hasData && (
					<div className="text-center py-16 bg-white rounded-lg shadow-md">
						<div className="text-6xl text-gray-300 mb-4">
							<i className="mdi mdi-file-document-outline" />
						</div>
						<h3 className="text-2xl font-medium text-gray-600">
							No form data available
						</h3>
						<p className="text-gray-500 mt-2 mb-6">
							It seems you haven&apos;t submitted the registration form yet.
						</p>
						<a
							href="/startup-registration" // Assuming this is your registration form route
							className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
						>
							<i className="mdi mdi-pencil mr-2" />
							Go to Registration Form
						</a>
					</div>
				)}
			</div>
		</div>
	);
};

export default UserResponseView;
