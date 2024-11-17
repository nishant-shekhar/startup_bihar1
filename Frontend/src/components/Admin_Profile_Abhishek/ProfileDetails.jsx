import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const ProfileDetails = ({ id }) => {
	const [data, setData] = useState([]);
	const [isCommentVisible, setIsCommentVisible] = useState(false);
	const token = localStorage.getItem("token");

	useEffect(() => {
		const fetchData = async () => {
			if (id) {
				try {
					const response = await axios.get(
						`http://localhost:3010/api/StartupProfile/v1/${id}`,

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

		fetchData();
	}, [id]);
	console.log(data);

	const handleReject = async () => {
		try {
			const response = await axios.put(
				`http://localhost:3010/api/StartupProfile/v2/${id}`,
				{

					documentStatus: "Rejected",
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `${token}`,
					},
				},
			);
			console.log("Response:", response.data);
		} catch (error) {
			console.error("Error updating data:", error);
		}
	};

	const handleAccept = async () => {
		try {
			const response = await axios.put(
				`http://localhost:3010/api/StartupProfile/v2/${id}`,
				{
					documentStatus: "Accepted",
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: ` ${token}`,
					},
				},
			);
			console.log("Response:", response.data);
		} catch (error) {
			console.error("Error updating data:", error);
		}
	};

	return (
		<div
			className="h-screen overflow-y-auto"
			style={{
				msOverflowStyle: "none", //for no scrollbar
				scrollbarWidth: "none",
			}}
		>
			<h1 className="pt-5 pl-8 text-2xl">Startup Profile Details </h1>
			<div className="px-8 py-5">
				<table className="min-w-full bg-white">
					{/* <tbody>
						{Object.entries(data).map(([key, value], index) => (
							<tr key={index} className="">
								<td className="py-4 px-4 border-b border-l border-t">{key}</td>
								<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
									{value}
								</td>
							</tr>
						))} */}

					<tbody>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">
								Registration No
							</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{data.registrationNo}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">
								Founder Name
							</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{data.founderName}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">
								Founder Aadhar Number
							</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{data.founderAadharNumber}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">
								Co-funder Names
							</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{Array.isArray(data.coFounderNames)
									? data.coFounderNames.join(", ")
									: data.coFounderNames}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">
								Co-funder Aadhar Numbers
							</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{Array.isArray(data.coFounderAadharNumbers)
									? data.coFounderAadharNumbers.join(", ")
									: data.coFounderAadharNumbers}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">Sector</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{data.sector}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">
								Brief on the Business Concept
							</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{data.businessConcept}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">
								Mobile Numbers
							</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{Array.isArray(data.mobileNumbers)
									? data.mobileNumbers.join(", ")
									: data.mobileNumbers}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">Email</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw] text-blue-600 hover:underline">
								<a href={`mailto:${data.email}`}>{data.email}</a>
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">
								Company Logo
							</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{data.logoName}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">
								Website Link
							</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw] text-blue-600 hover:underline">
								<a
									href={data.websiteLink}
									target="_blank"
									rel="noopener noreferrer"
								>
									{data.websiteLink}
								</a>
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">Category</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{data.category}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">Gender</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{data.gender}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">
								DPIIT Recognition Number
							</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{data.dpiitRecognitionNo}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">
								Has your startup applied for any IPR (Intellectual Property
								Right) (Yes/No)
							</td>
							<td className="py-4 px-4 border-b border-l border-t border-r w-[35vw]">
								{data.appliedIPR ? "Yes" : "No"}
							</td>
						</tr>
						<tr>
							<td className="py-4 px-4 border-b border-l border-t">
								Upload DIPP Certificate
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
															{data.certName}
														</span>
														<span className="shrink-0 text-gray-400">
															2.4mb
														</span>
													</div>
												</div>
												<div className="ml-4 shrink-0">
													<a
														href={`/${data.certPath}`} // Ensure this path points to the correct relative URL of the PDF file
														target="_blank"
														rel="noopener noreferrer"
														className="font-medium text-indigo-600 hover:text-indigo-900"
													>
														View
													</a>
												</div>
												<div className="ml-4 shrink-0">
													<a
														href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" // Ensure this path points to the correct relative URL of the PDF file
														download
														className="font-medium text-indigo-600 hover:text-indigo-900"
													>
														Download
													</a>
												</div>
												<div
													className="ml-4 shrink-0"
													onClick={() => setIsCommentVisible(true)}
												>
													<a
														href="#"
														className="font-medium text-indigo-600 hover:text-indigo-900"
													>
														Reject
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

				<div className="flex items-center justify-end gap-x-2 pr-4 py-3 ">
					<button
						type="submit"
						className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						onClick={handleAccept}
					>
						Accept
					</button>
					<button
						type="button"
						className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						onClick={handleReject}
					>
						Reject
					</button>
				</div>
			</div>

			{isCommentVisible && (
				<div className="absolute top-64 w-3/12 bg-white rounded-md shadow-xl p-4 z-10 left-[37%] ">
					<h2 className="text-lg font-semibold">Add Comment</h2>
					<textarea
						onChange={(e) => setComment(e.target.value)}
						className="mt-2  border rounded-md w-full h-20 pl-2 pt-2"
					/>
					<div className="flex justify-end gap-x-2 mt-4">
						<button
							type="button"
							className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500"
							onClick={() => setIsCommentVisible(false)}
						>
							Cancel
						</button>
						<button
							type="button"
							className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
							onClick={handleReject}
						>
							Reject
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProfileDetails;
