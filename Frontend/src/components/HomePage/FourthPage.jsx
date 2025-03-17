import React from "react";
import { FaBuildingUser } from "react-icons/fa6";
import { FaMoneyBill } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaHandshake } from "react-icons/fa";

const FourthPage = () => {
	return (
		<div>
			<div className="bg-white py-24 sm:py-32 mentors">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-3xl lg:text-center">
						<h2 className="text-base font-semibold leading-7 text-indigo-600">
							Deploy your ideas faster
						</h2>
						<p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
							Everything You Need to Grow Your Startup
						</p>
						<p className="mt-6 text-lg leading-8 text-gray-600">
							Access state-of-the-art coworking spaces, expert financial advice,
							and legal services to scale your startup effectively.
						</p>
					</div>
					<div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
						<dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
							<div className="relative pl-16">
								<dt className="text-base font-semibold leading-7 text-gray-900">
									<div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
										<FaBuildingUser className="text-white" />
									</div>
									Modern Workspaces
								</dt>
								<dd className="mt-2 text-base leading-7 text-gray-600">
									Fully equipped, collaborative workspaces available across
									Bihar, designed to boost productivity and innovation for
									startups.
								</dd>
							</div>
							<div className="relative pl-16">
								<dt className="text-base font-semibold leading-7 text-gray-900">
									<div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
										<FaMoneyBill className="text-white" />
									</div>
									Financial Guidance
								</dt>
								<dd className="mt-2 text-base leading-7 text-gray-600">
									Receive tailored financial advice from teams of empaneled
									Chartered Accountants to ensure your business thrives.
								</dd>
							</div>
							<div className="relative pl-16">
								<dt className="text-base font-semibold leading-7 text-gray-900">
									<div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
										<IoDocumentTextOutline className="text-white" />
									</div>
									Legal & IP Support
								</dt>
								<dd className="mt-2 text-base leading-7 text-gray-600">
									Access expert advice on copyrights, patents, and trademarks to
									protect your innovations and intellectual property.{" "}
								</dd>
							</div>
							<div className="relative pl-16">
								<dt className="text-base font-semibold leading-7 text-gray-900">
									<div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
										<FaHandshake className="text-white" />
									</div>
									Networking & Growth
								</dt>
								<dd className="mt-2 text-base leading-7 text-gray-600">
									Join a dynamic community of entrepreneurs, investors, and
									mentors to expand your network and accelerate growth.{" "}
								</dd>
							</div>
						</dl>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FourthPage;
