import React, { useState, useEffect } from "react";

const Response = () => {
	const [formData, setFormData] = useState({
		basicDetails: null,
		entityDetails: null,
		startupDetails: null,
		cofounderDetails: null,
		businessIdea: null,
	});

	const [loading, setLoading] = useState(true);
	const [activeSection, setActiveSection] = useState("all");
	// Admin review states
	const [recommendation, setRecommendation] = useState(null); // 'recommended', 'not-recommended', null
	const [rating, setRating] = useState(null); // 'A', 'B', 'C', or 'D' grade
	const [comments, setComments] = useState("");
	const [notification, setNotification] = useState({
		show: false,
		message: "",
		type: "",
	});
	const [saveStatus, setSaveStatus] = useState("idle"); // idle, saving, success, error

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
	}; // Helper function to render a data section
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
								{Object.entries(otherFields).map(([key, value], index) => {
									// We'll create two columns of 4 elements each
									const column = Math.floor(index / 4); // 0 for first 4 items (0-3), 1 for next 4 (4-7)

									// Return the field in the appropriate column
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
			{" "}
			<link
				rel="stylesheet"
				href="https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css"
			/>{" "}
			{/* Notification Toast */}
			{notification.show && (
				<div
					className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-md flex items-center ${
						notification.type === "success"
							? "bg-green-500 text-white"
							: notification.type === "error"
								? "bg-red-500 text-white"
								: notification.type === "warning"
									? "bg-amber-500 text-white"
									: "bg-blue-500 text-white"
					} transform transition-all duration-500 ease-in-out`}
				>
					<i
						className={`mdi mr-2 ${
							notification.type === "success"
								? "mdi-check-circle"
								: notification.type === "error"
									? "mdi-alert-circle"
									: notification.type === "warning"
										? "mdi-alert"
										: "mdi-information"
						}`}
					/>
					<span>{notification.message}</span>
				</div>
			)}
			<div className="max-w-5xl mx-auto">
				<div className="text-center mb-10">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">
						Startup Registration Response
					</h1>
					<p className="text-lg text-gray-600">
						Complete information from all form steps
					</p>
				</div>
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
				)}{" "}
				{!hasData && (
					<div className="text-center py-16 bg-white rounded-lg shadow-md">
						<div className="text-6xl text-gray-300 mb-4">
							<i className="mdi mdi-file-document-outline" />
						</div>
						<h3 className="text-2xl font-medium text-gray-600">
							No form data available
						</h3>
						<p className="text-gray-500 mt-2 mb-6">
							Please complete the registration form to see the responses
						</p>
						<a
							href="/startup-registration"
							className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
						>
							<i className="mdi mdi-pencil mr-2" />
							Start Registration
						</a>
					</div>
				)}
				{/* Admin Review Section */}
				{hasData && (
					<div className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg">
						<div className="flex items-center mb-6 pb-2 border-b border-gray-100">
							<i className="mdi mdi-shield-account text-purple-600 text-2xl mr-3" />
							<h2 className="text-xl font-semibold text-gray-800">
								Admin Review
							</h2>
						</div>

						<div className="grid grid-cols-1 gap-6">
							{" "}
							{/* Recommendation */}
							<div className="space-y-4">
								<h3 className="text-lg font-medium text-gray-700">
									Recommendation Status
								</h3>
								<div className="flex items-center space-x-4">
									<button
										type="button"
										onClick={() => {
											setRecommendation("recommended");
											setNotification({
												show: true,
												message: "Marked as Recommended",
												type: "success",
											});
											setTimeout(
												() =>
													setNotification({
														show: false,
														message: "",
														type: "",
													}),
												3000,
											);
										}}
										className={`px-4 py-2 rounded-md text-white flex items-center transition-all duration-200 ${
											recommendation === "recommended"
												? "bg-green-600 ring-2 ring-offset-2 ring-green-500 scale-105"
												: "bg-green-500 hover:bg-green-600"
										}`}
									>
										<i
											className={`mdi ${recommendation === "recommended" ? "mdi-check-bold" : "mdi-check-circle"} mr-2`}
										/>
										{recommendation === "recommended"
											? "Recommended ✓"
											: "Recommend"}
									</button>
									<button
										type="button"
										onClick={() => {
											setRecommendation("not-recommended");
											setNotification({
												show: true,
												message: "Marked as Not Recommended",
												type: "warning",
											});
											setTimeout(
												() =>
													setNotification({
														show: false,
														message: "",
														type: "",
													}),
												3000,
											);
										}}
										className={`px-4 py-2 rounded-md text-white flex items-center transition-all duration-200 ${
											recommendation === "not-recommended"
												? "bg-red-600 ring-2 ring-offset-2 ring-red-500 scale-105"
												: "bg-red-500 hover:bg-red-600"
										}`}
									>
										<i
											className={`mdi ${recommendation === "not-recommended" ? "mdi-close-bold" : "mdi-close-circle"} mr-2`}
										/>
										{recommendation === "not-recommended"
											? "Not Recommended ✓"
											: "Do Not Recommend"}
									</button>
								</div>
							</div>{" "}							{/* Grade Rating */}
							<div className="space-y-4">
								<h3 className="text-lg font-medium text-gray-700">
									Grade{" "}
									{rating && (
										<span className={`text-sm ml-2 ${
											rating === 'A' ? 'text-green-600' : 
											rating === 'B' ? 'text-green-500' : 
											rating === 'C' ? 'text-amber-500' : 
											'text-red-600'
										}`}>
											(Grade {rating})
										</span>
									)}
								</h3>
								<div className="flex items-center space-x-3">
									<button
										key="A"
										type="button"
										onClick={() => {
											setRating('A');
											setNotification({
												show: true,
												message: `Grade set to A`,
												type: "success",
											});
											setTimeout(
												() =>
													setNotification({
														show: false,
														message: "",
														type: "",
													}),
												2000,
											);
										}}
										className={`w-14 h-14 rounded-md border-2 font-bold text-lg focus:outline-none transform transition-all hover:scale-105 ${
											rating === 'A' 
												? "bg-green-600 text-white border-green-700 shadow-md" 
												: "bg-white text-green-600 border-green-500 hover:bg-green-50"
										}`}
									>
										A
									</button>
									<button
										key="B"
										type="button"
										onClick={() => {
											setRating('B');
											setNotification({
												show: true,
												message: `Grade set to B`,
												type: "info",
											});
											setTimeout(
												() =>
													setNotification({
														show: false,
														message: "",
														type: "",
													}),
												2000,
											);
										}}
										className={`w-14 h-14 rounded-md border-2 font-bold text-lg focus:outline-none transform transition-all hover:scale-105 ${
											rating === 'B' 
												? "bg-green-400 text-white border-green-500 shadow-md" 
												: "bg-white text-green-500 border-green-400 hover:bg-green-50"
										}`}
									>
										B
									</button>
									<button
										key="C"
										type="button"
										onClick={() => {
											setRating('C');
											setNotification({
												show: true,
												message: `Grade set to C`,
												type: "warning",
											});
											setTimeout(
												() =>
													setNotification({
														show: false,
														message: "",
														type: "",
													}),
												2000,
											);
										}}
										className={`w-14 h-14 rounded-md border-2 font-bold text-lg focus:outline-none transform transition-all hover:scale-105 ${
											rating === 'C' 
												? "bg-amber-500 text-white border-amber-600 shadow-md" 
												: "bg-white text-amber-600 border-amber-400 hover:bg-amber-50"
										}`}
									>
										C
									</button>
									<button
										key="D"
										type="button"
										onClick={() => {
											setRating('D');
											setNotification({
												show: true,
												message: `Grade set to D`,
												type: "error",
											});
											setTimeout(
												() =>
													setNotification({
														show: false,
														message: "",
														type: "",
													}),
												2000,
											);
										}}
										className={`w-14 h-14 rounded-md border-2 font-bold text-lg focus:outline-none transform transition-all hover:scale-105 ${
											rating === 'D' 
												? "bg-red-600 text-white border-red-700 shadow-md" 
												: "bg-white text-red-600 border-red-400 hover:bg-red-50"
										}`}
									>
										D
									</button>
								</div>
							</div>{" "}
							{/* Comments */}
							<div className="space-y-4">
								<h3 className="text-lg font-medium text-gray-700">Comments</h3>
								{/* Frequent Comments Dropdown */}
								<div className="mb-3">
									<label
										htmlFor="frequent-comments"
										className="block text-sm text-gray-600 mb-1"
									>
										Quick Comments:
									</label>
									<select
										id="frequent-comments"
										className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
										onChange={(e) => {
											if (e.target.value) {
												setComments(e.target.value);
												e.target.value = ""; // Reset dropdown
											}
										}}
									>
										<option value="">-- Select a pre-written comment --</option>
										<option value="The business idea shows good potential but requires more market validation.">
											Business idea needs market validation
										</option>
										<option value="The financial projections appear realistic and well-researched.">
											Realistic financial projections
										</option>
										<option value="The proposed solution doesn't clearly address the stated problem.">
											Solution misaligned with problem
										</option>
										<option value="The target market is well-defined and the go-to-market strategy is solid.">
											Strong target market definition
										</option>
										<option value="The team lacks necessary experience in this industry sector.">
											Team lacks industry experience
										</option>
										<option value="The startup demonstrates a clear competitive advantage and unique value proposition.">
											Clear competitive advantage
										</option>
										<option value="The revenue model needs further development and clarification.">
											Revenue model needs work
										</option>
										<option value="Good understanding of market challenges and opportunities.">
											Good market understanding
										</option>
									</select>
								</div>
								<textarea
									className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
									rows="4"
									placeholder="Add your comments about this startup application..."
									value={comments}
									onChange={(e) => setComments(e.target.value)}
								/>
							</div>{" "}
							{/* Submit Button */}
							<div className="mt-4 flex justify-end">
								<button
									type="button"
									onClick={() => {
										// Set saving state
										setSaveStatus("saving");

										// Simulate API call with setTimeout
										setTimeout(() => {
											// Here you would typically save the data to a backend or localStorage
											setSaveStatus("success");
											setNotification({
												show: true,
												message: "Review saved successfully!",
												type: "success",
											});

											// Reset status after delay
											setTimeout(() => {
												setSaveStatus("idle");
												setNotification({ show: false, message: "", type: "" });
											}, 3000);

											// You can save to localStorage as a demonstration
											localStorage.setItem(
												"startupReview",
												JSON.stringify({
													recommendation,
													rating,
													comments,
													timestamp: new Date().toISOString(),
												}),
											);
										}, 800);
									}}
									className={`px-6 py-2 text-white rounded-md font-medium flex items-center transition-all ${
										!recommendation
											? "bg-gray-400 cursor-not-allowed opacity-60"
											: saveStatus === "saving"
												? "bg-blue-500 cursor-wait"
												: saveStatus === "success"
													? "bg-green-600"
													: "bg-purple-600 hover:bg-purple-700"
									}`}
									disabled={!recommendation || saveStatus === "saving"}
								>
									{saveStatus === "saving" ? (
										<>
											<i className="mdi mdi-loading mdi-spin mr-2" />
											Saving...
										</>
									) : saveStatus === "success" ? (
										<>
											<i className="mdi mdi-check-circle mr-2" />
											Saved!
										</>
									) : (
										<>
											<i className="mdi mdi-content-save mr-2" />
											Save Review
										</>
									)}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Response;
