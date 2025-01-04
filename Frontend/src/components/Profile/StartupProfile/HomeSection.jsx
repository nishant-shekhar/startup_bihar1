import React from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import StatusDialog from "../../UserForm/StatusDialog"; // Import the new dialog component
import UpdateSocialMediaURL from "./FieldsUpdate/UpdateUserField";
import {
	FaTwitter,
	FaFacebook,
	FaInstagram,
	FaLinkedin,
	FaGlobe,
	FaUserCircle,
} from "react-icons/fa";
import ShowcaseCard from "../PublicProfile/ShowcaseCard";
import { useRef } from "react";
import UpdateMetrics from "./FieldsUpdate/updateMetrics";
import UpdateEmployees from "./FieldsUpdate/updateEmployees";
import UserNotification from "../../Userform/UserNotification";

const HomeSection = () => {
	const [startup, setStartup] = useState([]);
	const [selectedPlatform, setSelectedPlatform] = useState(false);
	const [showUpdateMetrics, setShowUpdateMetrics] = useState(false);
	const [showUpdateEmployees, setShowUpdateEmployees] = useState(false);
	const [statusPopup, setStatusPopup] = useState(false);
	const [title, setTitle] = useState("");
	const [buttonVisible, setButtonVisible] = useState(true);
	const [subtitle, setSubtitle] = useState("");
	const [isSuccess, setIsSuccess] = useState(""); // Add success state
	const [updateCount, setUpdateCount] = useState(0);
	const [selectedCategory, setSelectedCategory] = useState("Showcase");

		const [showcases, setShowcases] = useState([]);
	

	const categories = ["Showcase", "Notifications", "Action History"];

	const handleCategoryClick = (category) => {
		setSelectedCategory(category);
	};

	const fileInputRef = useRef(null);

	// function to handle the icon click
	const handlePlatformSelect = (platform) => {
		setSelectedPlatform(platform);
	};

	const openFileSelector = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleFileChange = (event, setFieldValue) => {
		const file = event.target.files[0];
		if (file) {
			setFieldValue("imgUrl", file);
		}
	};

	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [showDialog, setShowDialog] = useState(false);
	const [dialogMessage, setDialogMessage] = useState("");
	const [isContactVisible, setIsContactVisible] = useState(false);

	const data = [
		{
			imgurl:
				"https://images.unsplash.com/photo-1497493292307-31c376b6e479?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700", // Food industry
			dateandtime: "5PM 15th May 2024",
			title: "TeamFusion",
			subtitle: "Bringing teams closer with collaborative tools",
			tag: "Technology",
		},
		{
			imgurl:
				"https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700", // Startup workspace
			dateandtime: "11AM 20th June 2024",
			title: "WorkSpaces",
			subtitle: "Redefining office spaces for startups",
			tag: "Design",
		},
		{
			imgurl:
				"https://images.unsplash.com/photo-1519389950473-47ba0277781c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700", // Innovative tech
			dateandtime: "4PM 10th August 2024",
			title: "InnoTech",
			subtitle: "Innovations powering the future",
			tag: "Technology",
		},
		{
			imgurl:
				"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700", // Entrepreneurs at work
			dateandtime: "3PM 5th July 2024",
			title: "HealthPioneers",
			subtitle: "Next-gen solutions in healthcare",
			tag: "Healthcare",
		},
		{
			imgurl:
				"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700", // Entrepreneurs at work
			dateandtime: "2PM 30th April 2024",
			title: "StartStrong",
			subtitle: "Empowering budding entrepreneurs",
			tag: "Business",
		},
		{
			imgurl:
				"https://images.unsplash.com/photo-1557164346-4db5b0c3a1d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700", // Renewable energy startup
			dateandtime: "12PM 28th June 2024",
			title: "GreenTech",
			subtitle: "Advancing sustainable solutions",
			tag: "Environment",
		},
		{
			imgurl:
				"https://images.unsplash.com/photo-1521790945508-bf2a36314e85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700", // E-learning innovation
			dateandtime: "10AM 12th May 2024",
			title: "LearnNext",
			subtitle: "Revolutionizing education with technology",
			tag: "Education",
		},
		{
			imgurl:
				"https://images.unsplash.com/photo-1599492000590-8e8ce215c7a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700", // Fintech solutions
			dateandtime: "9AM 25th April 2024",
			title: "FinFuture",
			subtitle: "Simplifying financial operations",
			tag: "Finance",
		},
		{
			imgurl:
				"https://images.unsplash.com/photo-1533750349088-cd871a92f312?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700", // AI-driven startups
			dateandtime: "8AM 30th May 2024",
			title: "AiGen",
			subtitle: "AI solutions for every industry",
			tag: "AI",
		},
		{
			imgurl:
				"https://images.unsplash.com/photo-1497493292307-31c376b6e479?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700", // Food industry
			dateandtime: "6PM 5th August 2024",
			title: "FoodVenture",
			subtitle: "Culinary innovations for modern dining",
			tag: "FoodTech",
		},
		{
			imgurl:
				"https://images.unsplash.com/photo-1581093588401-a093a8d8b5f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700", // Startup pitch meeting
			dateandtime: "1PM 22nd June 2024",
			title: "PitchHub",
			subtitle: "Empowering startups to ace their pitches",
			tag: "Business",
		},
		{
			imgurl:
				"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700", // Logistics and transportation
			dateandtime: "11AM 10th July 2024",
			title: "TransLogix",
			subtitle: "Streamlined logistics solutions",
			tag: "Logistics",
		},
		{
			imgurl:
				"https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700", // Fashion tech startup
			dateandtime: "7PM 17th May 2024",
			title: "StyleNow",
			subtitle: "Bringing technology into fashion",
			tag: "Fashion",
		},
		{
			imgurl:
				"https://images.unsplash.com/photo-1568495248636-643ea19a3be6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700", // Retail transformation
			dateandtime: "5PM 15th April 2024",
			title: "RetailX",
			subtitle: "Innovative solutions for retail spaces",
			tag: "Retail",
		},
		{
			imgurl:
				"https://images.unsplash.com/photo-1590608897129-79b8f5f14616?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700", // Transportation innovation
			dateandtime: "8AM 19th August 2024",
			title: "MoveSmart",
			subtitle: "Smart solutions for urban transport",
			tag: "Transport",
		},
		{
			imgurl:
				"https://images.unsplash.com/photo-1586274459732-9e3d42db9626?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700", // Software innovation
			dateandtime: "3PM 12th May 2024",
			title: "SoftSolutions",
			subtitle: "Developing next-gen software",
			tag: "Software",
		},
		{
			imgurl:
				"https://images.unsplash.com/photo-1517433456452-f9633a875f6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=700", // Clean energy startup
			dateandtime: "10AM 26th April 2024",
			title: "EcoCharge",
			subtitle: "Revolutionizing renewable energy",
			tag: "Energy",
		},
	];

	const fetchDetails = async () => {
		try {
			const response = await axios.get(
				`http://localhost:3007/api/userlogin/startup-details?user_id=${localStorage.getItem("user_id")}`,
			);

			setStartup(response.data.startup);
			const showcaseResponse = await axios.get(
				`http://localhost:3007/api/showcase/get-showcase/${localStorage.getItem("user_id")}`
			);
			setShowcases(showcaseResponse.data.showcase);

			console.log(startup);
		} catch (error) {
			console.error("Failed to fetch startup details:", error);
		}
	};

	useEffect(() => {
		fetchDetails();
	}, [updateCount]);

	

	return (
		// <div>
		// 	{/* Navbar */}
		// 	<div className="flex justify-between px-8 py-3">
		// 		<h1>Startup Bihar</h1>
		// 		<h1>Home</h1>
		// 	</div>
		// 	<img src="cover.jpg" alt="" className="w-full h-52 object-cover" />
		// 	<img
		// 		src="https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/50dab922-5d48-4c6b-8725-7fd0755d9334/3a3f2d35-8167-4708-9ef0-bdaa980989f9.png"
		// 		alt=""
		// 		className="absolute left-20 top-48 w-72 h-72 rounded-3xl border-8 border-gray-200/30"
		// 	/>
		// </div>
		<div className="h-screen overflow-y-auto">
			<div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-100">
				{/* Navigation */}
				<nav className="px-4 py-2 flex items-center justify-between">
					<div className="flex items-center space-x-1">
						<div className="text-purple-600 font-semibold">✦</div>
						<a href="#" className="font-semibold">
							Startup Bihar
						</a>
					</div>

					<div className="flex items-center space-x-4">
						<button className="p-2 text-gray-600 hover:text-gray-900">
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
						</button>
						<button className="p-2 text-gray-600 hover:text-gray-900">
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
								/>
							</svg>
						</button>

						<button className="px-4 py-2 bg-purple-600 text-white rounded-full flex items-center">
							{/* <svg
								className="w-4 h-4 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
								/>
							</svg> */}
							Home
						</button>
						<div className="w-8 h-8 rounded-full bg-gray-200"></div>
					</div>
				</nav>

				<img
					src={
						startup.founder_dp ||
						"https://firebasestorage.googleapis.com/v0/b/iimv-ae907.appspot.com/o/Website%2Fcover_pic.png?alt=media&token=2f48030e-daa7-4e20-80c5-218bd6a93a25"
					}
					className="w-full h-52 object-cover"
					alt="Cover Pic"
				/>

				{/* Profile Section */}
				<div className=" px-4 ">
					<div className="flex  md:flex-row items-start">
						{/* Profile Image */}
						<div className="rounded-3xl overflow-hidden w-5/12">
							<img
								src={startup.logo || "default-logo.png"}
								alt="Profile"
								className=" mt-3 mx-2 object-cover rounded-3xl border-8 border-gray-200/30"
							/>
						</div>

						{/* Startup Name and stuff */}
						<div className="flex pl-8 max-w-screen-lg w-screen ml-5 justify-between py-8">
							<div className="">
								<div className="flex items-center gap-2 ">
									<h1 className="text-2xl font-semibold">
										{startup.company_name}
									</h1>
									<span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full flex items-center">
										<svg
											className="w-3 h-3 mr-1"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13 10V3L4 14h7v7l9-11h-7z"
											/>
										</svg>
										Top Startup
									</span>
								</div>
								<div className="text-lg mt-1">{startup.moto}</div>
								<p className="text-gray-600 ">
									{startup.founder_name} (Founder)
									<br />
								</p>

								<div className="flex gap-3 mb-2 mt-5 ">
									<button
										className="px-6 py-2 bg-black text-white rounded-lg"
										onClick={() => setIsContactVisible(true)}
									>
										Contact
									</button>
									<a
										href={startup.website || "#"}
										target="_blank"
										rel="noopener noreferrer"
										className="px-6 py-2 border border-gray-300 rounded-lg"
									>
										Visit Website
									</a>
								</div>
							</div>
						</div>

						{/* Stats & Links*/}
						<div className="py-10 pr-10 w-3/4 ">
							<div className="flex justify-between items-center  gap-3">
								<div className="text-center">
									<div className="text-xl font-semibold">
										{startup.employeeCount || 0}
									</div>
									<div
										className="text-gray-600 cursor-pointer"
										onClick={() => setShowUpdateMetrics(true)}
									>
										Employees
									</div>
								</div>
								<div className="text-center">
									<div className="text-xl font-semibold">
										{startup.revenueLY || 0}
									</div>
									<div className="text-gray-600">Revenue</div>
								</div>
								<div className="text-center">
									<div className="text-xl font-semibold">
										{startup.projects || 0}
									</div>
									<div className="text-gray-600">Projects</div>
								</div>
								<div className="text-center">
									<div className="text-xl font-semibold">
										{startup.workOrders || 0}
									</div>
									<div className="text-gray-600">Orders</div>
								</div>
								{showUpdateMetrics && (
									<UpdateMetrics
										startup={startup}
										onClose={() => setShowUpdateMetrics(false)}
										onUpdate={() => setUpdateCount(updateCount + 1)}
									/>
								)}
							</div>
							<div className="flex gap-6 px-5 mt-3">
								<button type="button" onClick={() => setSelectedPlatform(true)}>
									<FaTwitter className="text-4xl cursor-pointer hover:text-blue-500" />
								</button>
								<a
									href={startup.facebook || "#"}
									target="_blank"
									rel="noopener noreferrer"
								>
									<FaFacebook className="text-4xl cursor-pointer hover:text-blue-700" />
								</a>
								<a
									href={startup.instagram || "#"}
									target="_blank"
									rel="noopener noreferrer"
								>
									<FaInstagram className="text-4xl cursor-pointer hover:text-pink-500" />
								</a>
								<a
									href={startup.linkedin || "#"}
									target="_blank"
									rel="noopener noreferrer"
								>
									<FaLinkedin className="text-4xl cursor-pointer hover:text-blue-600" />
								</a>
								<a
									href={startup.website || "#"}
									target="_blank"
									rel="noopener noreferrer"
								>
									<FaGlobe className="text-4xl cursor-pointer hover:text-green-600" />
								</a>
							</div>
							<div className="flex -space-x-2 overflow-hidden mt-4 pl-3 "
							onClick={() => setShowUpdateEmployees(true)}>
								<img
									alt=""
									src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
									className="inline-block size-10 rounded-full ring-2 ring-white"
								/>
								<img
									alt=""
									src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
									className="inline-block size-10 rounded-full ring-2 ring-white"
								/>
								<img
									alt=""
									src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
									className="inline-block size-10 rounded-full ring-2 ring-white"
								/>
								<img
									alt=""
									src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
									className="inline-block size-10 rounded-full ring-2 ring-white"
								/>
								<img
									alt=""
									src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
									className="inline-block size-10 rounded-full ring-2 ring-white"
								/>
								<img
									alt=""
									src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
									className="inline-block size-10 rounded-full ring-2 ring-white"
								/>
								<img
									alt=""
									src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
									className="inline-block size-10 rounded-full ring-2 ring-white"
								/>
								<img
									alt=""
									src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
									className="inline-block size-10 rounded-full ring-2 ring-white"
								/>
							</div>
							{selectedPlatform && (
								<UpdateSocialMediaURL
									startup={startup}
									onPlatformSelect={handlePlatformSelect}
									onUpdate={() => setUpdateCount(updateCount + 1)}
								/>
							)}
							{showUpdateEmployees && (
								<UpdateEmployees
									startup={startup}
									onClose={() => setShowUpdateEmployees(false)}
									onUpdate={() => setUpdateCount(updateCount + 1)}
								/>
							)}
						</div>
					</div>
					<hr className="mx-10 border-gray-500/30" />
				</div>
				{/* Categories Section */}
				<div className="mx-5 lg:mx-12 justify-start mt-5 mb-4">
					<div className="border-2 border-white rounded-2xl px-4 py-2 bg-transparent">
						<nav className="justify-start space-x-2">
							{categories.map((category) => (
								<button
									key={category}
									onClick={() => handleCategoryClick(category)}
									className={`py-1 px-4 transition-all duration-300 transform ${
										selectedCategory === category
											? "bg-gray-200 text-[#0E0C22] font-semibold rounded-full scale-105"
											: "text-[#151334] font-medium hover:text-opacity-70 hover:bg-gray-100 hover:text-[#0E0C22] rounded-full"
									}`}
								>
									{category}
								</button>
							))}
						</nav>
					</div>
				</div>

				<div className="mx-5 lg:mx-12 p-6 bg-white shadow rounded-md">
					{/* Showcase Content */}
					{selectedCategory === "Showcase" && (
						<>
							<h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4">
								Showcase
							</h1>
							<hr className="mb-6 border-gray-500/30" />
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
								<div className="flex justify-center items-center ">
									<div className="bg-gray-200 shadow-md rounded-lg max-w-sm w-full animate-pulse h-[367px]">
										<div className="bg-gray-300 h-40 rounded-lg mb-4 mx-5 mt-4 "></div>
										<div className="pl-6">
											<div className="bg-gray-300 h-4 rounded w-3/4"></div>
											<div className="bg-gray-300 h-6 rounded w-3/5 mt-4"></div>
											<div className="bg-gray-300 h-5 rounded w-4/5 mt-4"></div>
											<button
												type="button"
												className="bg-blue-600 py-2 px-5 rounded-md mt-4 text-white"
												style={{ animation: "none !important" }}
												onClick={() => setIsPopupVisible(true)}
											>
												Add New
											</button>
										</div>
									</div>
								</div>
								{[...showcases].reverse().map((showcase, index) => (
									<ShowcaseCard
										key={index}
										imgurl={showcase.picUrl}
										dateandtime={showcase.date}
										title={showcase.title}
										subtitle={showcase.subtitle}
										tag={showcase.location}
										projectLink={showcase.projectLink}
										id={showcase.id}
									/>
								))}
								
							</div>
						</>
					)}

					{/* Notifications Content */}
					{selectedCategory === "Notifications" && (
						<>
							<h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4">
								Notifications
							</h1>
							<hr className="mb-3 border-gray-500/30 " />
							<UserNotification />
						</>
					)}

					{selectedCategory === "Action History" && (
						<>
							<h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4">
								Action History
							</h1>
							<hr className="mb-3 border-gray-500/30 " />
							<UserNotification />
						</>
					)}
				</div>

				<StatusDialog
					isVisible={statusPopup}
					title={title}
					subtitle={subtitle}
					buttonVisible={buttonVisible}
					status={isSuccess} // Pass success state
					onClose={() => setStatusPopup(false)}
				/>

				{isPopupVisible && (
					<div className="fixed inset-0 flex items-center justify-center  z-50">
						<div className="absolute inset-0 bg-black opacity-10"></div>
						<div className="relative bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg border border-white border-opacity-30 w-5/12 p-8 rounded-lg shadow-lg">
							<button
								className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
								onClick={() => setIsPopupVisible(false)}
							>
								&times;
							</button>
							<h2 className="text-2xl font-bold mb-4">Add New Event</h2>
							<Formik
								initialValues={{
									title: "",
									subtitle: "",
									date: "",
									location: "",
									projectLink: "",
								}}
								validate={(values) => {
									const errors = {};
									if (!values.title) {
										errors.title = "Required";
									}
									if (!values.subtitle) {
										errors.subtitle = "Required";
									}
									if (!values.date) {
										errors.date = "Required";
									}
									if (!values.location) {
										errors.location = "Required";
									}
									return errors;
								}}
								onSubmit={(values, { setSubmitting }) => {
									setTitle("Uploading Schowcase Details");
									setSubtitle("Please wait while we post your update");
									setButtonVisible(false);
									setStatusPopup(true);
									setIsSuccess("uploading");

									const token = localStorage.getItem("token");
									console.log(token);

									const formData = new FormData();
									formData.append("title", values.title);
									formData.append("subtitle", values.subtitle);
									formData.append("date", values.date);
									formData.append("projectLink", values.projectLink);
									formData.append("location", values.location);
									if (values.imgUrl) {
										formData.append("picUrl", values.imgUrl);
									}

									axios
										.post("http://localhost:3007/api/showcase/post", formData, {
											headers: {
												Authorization: token, // Include the token in the request headers
											},
										})
										.then((response) => {
											console.log("Data posted successfully:", response.data);
											setSubmitting(false);
											setIsPopupVisible(false); // Close the popup on successful submission

											setTitle("Showcase Uploaded!");
											setSubtitle(response.data.message);
											setButtonVisible(true);
											setIsSuccess("success"); // Set success state
										})
										.catch((error) => {
											console.error("Error posting data:", error);
											setSubmitting(false);

											setTitle("Uploading Failed");
											setSubtitle(
												error.response?.data?.error ||
													"An error occurred during submission",
											);
											setButtonVisible(true);

											setIsSuccess("failed"); // Set success state
										});
								}}
							>
								{({ isSubmitting, setFieldValue }) => (
									<Form className=" rounded-lg  w-full p-6">
										<div className="mb-4">
											<div className="py-4">
												<dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
													<ul className="divide-y divide-gray-100 rounded-md border border-gray-200 w-5/6">
														<li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6 bg-white rounded-md">
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
																		Upload Profile Image
																	</span>
																</div>
															</div>
															<div className="shrink-0">
																<button
																	type="button"
																	className="font-medium text-indigo-600 hover:text-indigo-900"
																	onClick={openFileSelector}
																>
																	Upload
																</button>
																<input
																	type="file"
																	ref={fileInputRef}
																	style={{ display: "none" }}
																	accept="image/*"
																	onChange={(event) =>
																		handleFileChange(event, setFieldValue)
																	}
																/>
															</div>
														</li>
													</ul>
												</dd>
											</div>

											<label
												className="block text-gray-700 text-md font-bold mb-2"
												htmlFor="title"
											>
												Title
											</label>
											<Field
												className="shadow appearance-none border rounded w-5/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
												id="title"
												name="title"
												type="text"
												placeholder="Enter title"
											/>
											<ErrorMessage
												name="title"
												component="div"
												className="text-red-500 text-xs italic"
											/>
										</div>

										<div className="mb-4">
											<label
												className="block text-gray-700 text-md font-bold mb-2"
												htmlFor="subtitle"
											>
												Subtitle
											</label>
											<Field
												className="shadow appearance-none border rounded w-5/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
												id="subtitle"
												name="subtitle"
												type="text"
												placeholder="Enter subtitle"
											/>
											<ErrorMessage
												name="subtitle"
												component="div"
												className="text-red-500 text-xs italic"
											/>
										</div>

										<div className="mb-4">
											<label
												className="block text-gray-700 text-md font-bold mb-2"
												htmlFor="date"
											>
												Date
											</label>
											<Field
												className="shadow appearance-none border rounded w-5/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
												id="date"
												name="date"
												type="text"
												placeholder="Enter date"
											/>
											<ErrorMessage
												name="date"
												component="div"
												className="text-red-500 text-xs italic"
											/>
										</div>

										<div className="mb-4">
											<label
												className="block text-gray-700 text-md font-bold mb-2"
												htmlFor="location"
											>
												Location
											</label>
											<Field
												className="shadow appearance-none border rounded w-5/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
												id="location"
												name="location"
												type="text"
												placeholder="Enter Location"
											/>
											<ErrorMessage
												name="location"
												component="div"
												className="text-red-500 text-xs italic"
											/>
										</div>
										<div className="mb-4">
											<label
												className="block text-gray-700 text-md font-bold mb-2"
												htmlFor="date"
											>
												ProjectLink
											</label>
											<Field
												className="shadow appearance-none border rounded w-5/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
												id="projectLink"
												name="projectLink"
												type="text"
												placeholder="Enter Project Link"
											/>
											<ErrorMessage
												name="projectLink"
												component="div"
												className="text-red-500 text-xs italic"
											/>
										</div>

										<div className="flex items-center justify-between">
											<button
												className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
												type="submit"
												disabled={isSubmitting}
											>
												Save
											</button>
										</div>
									</Form>
								)}
							</Formik>
						</div>
					</div>
				)}

				{isContactVisible && (
					<div className="fixed inset-0 flex items-center justify-center  z-50">
						<div className="absolute inset-0 bg-black opacity-10"></div>
						<div className="relative bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg border border-white border-opacity-30 w-5/12 p-8 rounded-lg shadow-lg">
							<button
								className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
								onClick={() => setIsContactVisible(false)}
							>
								&times;
							</button>
							<h1 className="text-2xl font-bold">{startup.company_name}</h1>
							<h1 className="mb-3">{startup.about}</h1>
							<h2 className="text-xl font-semibold ">Contact :</h2>
							Phone :
							<a href={`tel:${startup.mobile}`} className="text-blue-600 ">
								{" "}
								{startup.mobile || "N/A"}
							</a>
							<br />
							Website:
							<a
								href={startup.website || "#"}
								className="text-blue-600 underline"
							>
								{" "}
								{startup.website || "#"}
							</a>
							<br />
							Address:
							<a
								href={startup.website || "#"}
								className="text-blue-600 underline"
							>
								{" "}
							</a>
						</div>
					</div>
				)}

				{showDialog && (
					<div className="fixed inset-0 flex items-center justify-center z-50">
						<div className="absolute inset-0 bg-black opacity-50"></div>
						<div className="bg-white p-4 rounded shadow-lg z-10">
							<p>{dialogMessage}</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default HomeSection;
