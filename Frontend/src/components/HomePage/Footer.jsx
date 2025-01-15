import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { FaPhoneAlt } from "react-icons/fa";

const Footer = () => {
	return (
		<div>
			<footer className="bg-[#270a3c]">
				<div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
					<div className="md:flex md:justify-between">
						<div className="mb-6 md:mb-0">
							<a className="flex items-center">
								<img
									src="Seal_of_Bihar.svg"
									className="h-24 me-3"
									alt="startup Bihar"
								/>
								<span className="self-center text-sm whitespace-nowrap text-white dark:text-white pl-3 pt-1">
									DEPARTMENT OF INDUSTRIES <br />
									Government of Bihar <br />
									Copyright owned by DoI Bihar,
									<br /> All Rights Reserved <br /> Privacy and Policy | Terms
									of use | Copyright Policy
									<div className="flex items-center gap-4 mt-4">
										<h2 className="text-sm py-4 font-semibold text-gray-100 dark:text-white flex items-center gap-2 transform transition-transform duration-300 hover:scale-105">
											<HiOutlineMail />
											startup-bihar@gov.in
										</h2>
										<h2 className="text-sm font-semibold text-gray-100 dark:text-white flex items-center gap-2 transform transition-transform duration-300 hover:scale-105">
											<FaPhoneAlt />
											1800 345 6214
										</h2>
									</div>
								</span>
							</a>
						</div>

						<div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3 items-end ">
							<div>

								<ul className="text-gray-300 dark:text-gray-400 font-medium">
									<li className="mb-4">
										<Link to="/contact-us" className="hover:underline">
											Contact Us
										</Link>
									</li>

									<li>
										<a
											href="/DeveloperTeam"
											className="hover:underline"
										>
											Developer's Team
										</a>

									</li>
								</ul>
							</div>
							<div>

								<ul className="text-gray-300 dark:text-gray-400 font-medium">
									<li className="mb-4">
										<Link to="/about-us" className="hover:underline">
											About Us
										</Link>
									</li>
									<li className="">
										<a
											href="https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FCopyright%20Policy.pdf?alt=media&token=0ba2d4c6-36a3-436d-a58f-2654ff621050"
											className="hover:underline"
											target="_blank"
											rel="noopener noreferrer"
										>
											Copyright
										</a>
									</li>
								</ul>
							</div>

							<div>

								<ul className="text-gray-300 dark:text-gray-400 font-medium">
									<li className="mb-4">
										<a
											href="https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FPRIVACY%20POLICY.pdf?alt=media&token=5feaa5fd-2e0d-4a01-bc44-09ab8ad9b0cd"
											className="hover:underline"
											target="_blank"
											rel="noopener noreferrer"
										>
											Privacy Policy
										</a>
									</li>
									<li>
										<a
											href="https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FTERMS%20OF%20USE_DRAFT.pdf?alt=media&token=5831df8f-0a32-4480-88c1-59e88fa76537"
											className="hover:underline"
											target="_blank"
											rel="noopener noreferrer"
										>
											Terms of Use
										</a>
									</li>
								</ul>

							</div>
						</div>
					</div>
					<hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
					<div className="sm:flex sm:items-center sm:justify-between">
						<span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
							© DoI Bihar, All Rights Reserved.
						</span>

						<a
	href="/DeveloperTeam"
	className="text-sm text-gray-400 sm:text-center dark:text-gray-400"
>
	This website is developed and maintained by <span className="font-bold">NS Apps Innovations</span>, a product of Startup Bihar.
</a>


						<div className="flex mt-4 sm:justify-center sm:mt-0">
							<a
								href="https://www.facebook.com/startupbihar2022/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
							>
								<svg
									className="w-4 h-4"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 8 19"
								>
									<path
										fillRule="evenodd"
										d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
										clipRule="evenodd"
									/>
								</svg>
								<span className="sr-only">Facebook page</span>
							</a>
							<a
								href="https://x.com/startup_bihar"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
							>
								<svg
									className="w-4 h-4"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 20 17"
								>
									<path
										fillRule="evenodd"
										d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z"
										clipRule="evenodd"
									/>
								</svg>
								<span className="sr-only">Twitter page</span>
							</a>
							<a
								href="https://www.instagram.com/startupbihar23/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
							>
								<svg
									className="w-4 h-4"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										fillRule="evenodd"
										d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.31.975.975 1.248 2.242 1.31 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.31 3.608-.975.975-2.242 1.248-3.608 1.31-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.31-.975-.975-1.248-2.242-1.31-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.334-2.633 1.31-3.608.975-.975 2.242-1.248 3.608-1.31 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.281.058-2.563.334-3.637 1.408-1.074 1.074-1.35 2.356-1.408 3.637-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.058 1.281.334 2.563 1.408 3.637 1.074 1.074 2.356 1.35 3.637 1.408 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.281-.058 2.563-.334 3.637-1.408 1.074-1.074 1.35-2.356 1.408-3.637.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.058-1.281-.334-2.563-1.408-3.637-1.074-1.074-2.356-1.35-3.637-1.408-1.28-.058-1.688-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.324c-2.297 0-4.162-1.865-4.162-4.162s1.865-4.162 4.162-4.162 4.162 1.865 4.162 4.162-1.865 4.162-4.162 4.162zm6.406-11.845c-.796 0-1.441.645-1.441 1.441s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.441-1.441-1.441z"
										clipRule="evenodd"
									/>
								</svg>
								<span className="sr-only">Instagram Page</span>
							</a>
							<a
								href="https://www.linkedin.com/company/startup-bihar/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
							>
								<svg
									className="w-4 h-4"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										fillRule="evenodd"
										d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11.75 19h-2.5v-10h2.5v10zm-1.25-11.25c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm13.25 11.25h-2.5v-5.5c0-1.378-1.122-2.5-2.5-2.5s-2.5 1.122-2.5 2.5v5.5h-2.5v-10h2.5v1.25c.691-.691 1.622-1.25 2.5-1.25 1.878 0 3.5 1.622 3.5 3.5v6.5z"
										clipRule="evenodd"
									/>
								</svg>
								<span className="sr-only">Linkedin Account</span>
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Footer;