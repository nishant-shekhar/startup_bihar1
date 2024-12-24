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

const StartupPublicProfile = () => {
	const { id } = useParams(); // Fetch the dynamic id from the URL

	const [startup, setStartup] = useState([]);
	const [showcases, setShowcases] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const categories = ['Showcase', "About Startup"];

    const [selectedCategory, setSelectedCategory] = useState('Showcase');

    // Handle category click
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };








	const fetchDetails = async () => {
		try {
			const response = await axios.get(
				`http://localhost:3007/api/userlogin/startup-details?user_id=${id}`,
			);

			setStartup(response.data.startup);
			// Fetch showcase data
			const showcaseResponse = await axios.get(
				`http://localhost:3007/api/showcase/get-showcase/${id}`
			);
			setShowcases(showcaseResponse.data.showcase);

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
							src={startup.logo || "default-logo.png"}
							alt="Profile"
							className="object-cover w-full h-full rounded-lg"
						/>
					</div>
				</div>

				{/* Green Container */}
				<div className="sm:col-span-8 md:col-span-9 lg:col-span-6 h-[150px] sm:h-[150px] lg:h-[180px] flex flex-col justify-center sm:justify-start items-center sm:items-start  p-4">
					<div className="flex items-center gap-2 text-center sm:text-left">
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

					<div className="text-lg mt-1 text-center sm:text-left">
						{startup.moto}
					</div>

					<p className="text-gray-600 text-center sm:text-left">
						{startup.founder_name} (Founder)
						<br />
					</p>

					<div className="flex gap-3 mb-2 mt-5 justify-center sm:justify-start">
						<button className="px-6 py-2 bg-black text-white rounded-lg">
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


				{/* Purple Container */}
				<div className="sm:col-span-12 lg:col-span-4  ">
					{/* Add content here if needed to ensure the height expands properly */}
					<div className="">
						<div className="flex justify-center lg:justify-end items-center gap-4 sm:my-4">
							<div className="text-center">
								<div className="text-xl font-semibold">12</div>
								<div className="text-gray-600">Employees</div>
							</div>
							<div className="text-center">
								<div className="text-xl font-semibold">16</div>
								<div className="text-gray-600">Work Order</div>
							</div>
							<div className="text-center">
								<div className="text-xl font-semibold">3</div>
								<div className="text-gray-600">Projects</div>
							</div>
						</div>
						<div className="flex justify-center lg:justify-end  gap-6 mt-3 lg:mt-6">
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
								href={startup.Instagram || "#"}
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
								href={startup.website || "#"}
								target="_blank"
								rel="noopener noreferrer"
							>
								<FaGlobe className="text-3xl cursor-pointer hover:text-green-600" />
							</a>
						</div>
					</div>
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
										? "bg-[#bac2cd] text-[#0E0C22] font-semibold rounded-full scale-105" // Selected styles with slight scale animation
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
						<p className="text-gray-700 text-lg">{startup.about}</p>
					</>
				)}
			</div>
		</div>
	);
};

export default StartupPublicProfile;
