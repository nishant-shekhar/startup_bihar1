import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import {
	FaTwitter,
	FaFacebook,
	FaInstagram,
	FaLinkedin,
	FaGlobe,
} from "react-icons/fa";
import ShowcaseCard from "./ShowcaseCard";
import EmployeeDetails from "../StartupProfile/FieldsUpdate/EmployeeDetails";

const StartupPublicProfile = () => {
	const { id } = useParams(); // Fetch the dynamic id from the URL

	const [startup, setStartup] = useState([]);
	const [showcases, setShowcases] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isContactVisible, setIsContactVisible] = useState(false);
	const [employees, setEmployees] = useState([]);
	const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);

	const categories = ['Showcase', "About Startup"];

	const [selectedCategory, setSelectedCategory] = useState('Showcase');

	// Handle category click
	const handleCategoryClick = (category) => {
		setSelectedCategory(category);
	};

	const getWebsiteUrl = (url) => {
		if (!url) return "#";
		return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
	};

	const fetchDetails = async () => {
		try {
			const response = await axios.get(
				`http://localhost:3007/api/userlogin/public-startup-details?user_id=${id}`,
			);

			setStartup(response.data.startup);
			//console.log(response.data.startup)
			//console.log(startup.about)
			// Fetch showcase data
			const showcaseResponse = await axios.get(
				`http://localhost:3007/api/showcase/get-showcase/${id}`
			);
			setShowcases(showcaseResponse.data.showcase);

			const employeeResponse = await axios.get(`http://localhost:3007/api/userlogin/getEmployees/${id}`);
			setEmployees(employeeResponse.data.employee); // Access `data.employee` based on your API response

			console.log(employeeResponse.data)
			setIsLoading(false);
		} catch (error) {
			console.error("Failed to fetch data:", error);
			setIsLoading(false);
		}
	};
	console.log(showcases.id);


	useEffect(() => {
		fetchDetails();
	}, []);


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

		<div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-100">
			{/* Navigation */}
			<nav className="px-4 py-2 flex items-center justify-between">
				<div className="flex items-center space-x-1">
					<div className="text-purple-600 font-semibold">✦</div>
					<a href="/" className="font-semibold">
						Startup Bihar
					</a>
				</div>

				<div className="flex items-center space-x-4">
				</div>
			</nav>

			<img
				src={startup.founder_dp || "https://firebasestorage.googleapis.com/v0/b/iimv-ae907.appspot.com/o/Website%2Fcover_pic.png?alt=media&token=2f48030e-daa7-4e20-80c5-218bd6a93a25"}
				className="w-full h-52 object-cover"
				alt="Cover Pic"
			/>
			{/* Profile Section */}
			<div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 mx-4 sm:mx-10 lg:mx-20 my-2 sm:my-4">
				{/* Image Container */}
				<div className="sm:col-span-4 md:col-span-3 lg:col-span-2 flex items-center justify-center lg:justify-start h-[120px] sm:h-[150px] lg:h-[180px]">
					<div className="w-[120px] sm:w-[150px] lg:w-[180px] aspect-w-1 aspect-h-1 overflow-hidden flex items-center justify-center">
						<img
							src={startup.logo || "https://dummyimage.com/100x100/000/fff.png&text=Logo"}
							alt="Logo"
							className="object-cover w-full h-full rounded-lg"
						/>
					</div>
				</div>

				{/* Green Container */}
				<div className="sm:col-span-8 md:col-span-9 lg:col-span-6 h-[150px] sm:h-[150px] lg:h-[180px] flex flex-col justify-center sm:justify-start items-center sm:items-start  p-4">
					
					<div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-1">
						{/* On mobile, this badge appears first; on sm and above, it appears second */}
						<span className="order-1 sm:order-2 px-2 py-1 bg-purple-600 text-white text-xs rounded-full flex items-center mt-4 sm:mt-0">
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
						{/* On mobile, this appears second; on sm and above, it appears first */}
						<h1 className="order-2 sm:order-1 text-2xl font-semibold ">
							{startup.company_name}
						</h1>
					</div>




					<div className="text-gray-800 sm:text-lg mt-1 text-center sm:text-left text-base ">
						{startup.moto}
					</div>

					<p className="text-gray-600 text-center sm:text-left">
						{startup.founder_name} (Founder)
						<br />
					</p>

					<div className="flex gap-3 mb-2 mt-5 justify-center sm:justify-start">
						<button
							className="px-6 py-2 bg-black text-white rounded-lg"
							onClick={() => setIsContactVisible(true)}
						>
							Contact
						</button>
						<a
							href={getWebsiteUrl(startup.website)}
							target="_blank"
							rel="noopener noreferrer"
							className="px-6 py-2 border border-gray-300 rounded-lg"
						>
							Visit Website
						</a>
					</div>
				</div>


				{/* Purple Container */}
				<div className="sm:col-span-12 lg:col-span-4  ">
					{/* Add content here if needed to ensure the height expands properly */}
					<div className="mt-4 sm:mt-0">
						<div className="flex justify-center lg:justify-end items-center gap-4 sm:my-4">
							<div className="text-center border-r px-3">
								<div className="text-xl font-semibold">{startup.employeeCount || '—'}</div>
								<div className="text-gray-600">Employees</div>
							</div>
							<div className="text-center border-r px-3">
								<div className="text-xl font-semibold">{startup.workOrders || '—'}</div>
								<div className="text-gray-600">Work Orders</div>
							</div>
							<div className="text-center ">
								<div className="text-xl font-semibold">{startup.projects || '—'}</div>
								<div className="text-gray-600">Projects</div>
							</div>

						</div>
						<div className="flex justify-center lg:justify-end  gap-6 mt-3 lg:mt-6 py-2">
							<a
								href={startup.twitter || "#"}
								target="_blank"
								rel="noopener noreferrer"
							>
								<FaTwitter className="text-3xl cursor-pointer hover:text-blue-500" />
							</a>
							<a
								href={startup.facebook || "#"}
								target="_blank"
								rel="noopener noreferrer"
							>
								<FaFacebook className="text-3xl cursor-pointer hover:text-blue-700" />
							</a>
							<a
								href={startup.instagram || "#"}
								target="_blank"
								rel="noopener noreferrer"
							>
								<FaInstagram className="text-3xl cursor-pointer hover:text-pink-500" />
							</a>
							<a
								href={startup.linkedin || "#"}
								target="_blank"
								rel="noopener noreferrer"
							>
								<FaLinkedin className="text-3xl cursor-pointer hover:text-blue-600" />
							</a>
							<a
								href={getWebsiteUrl(startup.website) || "#"}
								target="_blank"
								rel="noopener noreferrer"
							>
								<FaGlobe className="text-3xl cursor-pointer hover:text-green-600" />
							</a>
						</div>

						<div
							className="mt-4 flex sm:justify-end justify-center -space-x-2 overflow-hidden flex-wrap"
							onClick={() => setShowEmployeeDetails(true)}
						>
							{employees && employees.length > 0 ? (
								employees.map((employee, index) => (
									<img
										key={index}
										alt={employee.name}
										src={employee.dp}
										className="inline-block size-10 rounded-full ring-2 ring-white"
									/>
								))
							) : (
								<p className="text-sm text-gray-500">No employees found</p>
							)}
						</div>

					</div>
					{showEmployeeDetails && (
						<EmployeeDetails
							onClose={() => setShowEmployeeDetails(false)}
							deleteBtn={false}
							userId={id}
						/>
					)}
				</div>
			</div>
			<div className="mx-5 lg:mx-20 justify-start mt-10 mb-4">
				{/* Tabs Section */}
				<div className="border-2 border-white rounded-2xl px-4 py-2 bg-transparent">
					<nav className="justify-start space-x-2">
						{categories.map((category) => (
							<button
								key={category}
								onClick={() => handleCategoryClick(category)}
								className={`py-1 px-4 transition-all duration-300 transform ${selectedCategory === category
									? "bg-slate-200 text-[#0E0C22] font-semibold rounded-full scale-105" // Selected styles with slight scale animation
									: "text-[#151334] font-medium hover:text-opacity-70 hover:bg-[#F8F7F3] hover:text-[#0E0C22] rounded-full" // Unselected styles with hover effect
									}`}
							>
								{category}
							</button>
						))}
					</nav>
				</div>
			</div>


			<div className="mx-5 lg:mx-20 p-6 bg-white shadow rounded-md">
				{/* Showcase Content */}
				{selectedCategory === "Showcase" && (
					<>
						<h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4">
							Showcase
						</h1>
						<hr className="mb-6 border-gray-500/30" />
						{isLoading ? (
							<p className="text-center text-gray-500 mt-8">Loading...</p>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
								{[...showcases].reverse().map((showcase, index) => (
									<ShowcaseCard
										key={index}
										imgurl={showcase.picUrl}
										dateandtime={showcase.date}
										title={showcase.title}
										subtitle={showcase.subtitle}
										tag={showcase.location}
										projectLink={showcase.projectLink}
										delhidden={true}
									/>
								))}
							</div>
						)}
					</>
				)}

				{/* About Content */}
				{selectedCategory === "About Startup" && (
					<>
						<h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4">
							About Startup
						</h1>
						<hr className="mb-6 border-gray-500/30" />
						<p
							style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
						>
							{startup.about}
						</p>
					</>
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
							<h1 className="mb-3 ">{startup.moto}</h1>
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
								href={startup.address || "#"}
								className="text-blue-600 underline"
							>
								{" "}
							</a>
						</div>
					</div>
				)}

			</div>
		</div>
	);
};

export default StartupPublicProfile;