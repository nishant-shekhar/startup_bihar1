import React from "react";
import { Link as ScrollLink } from "react-scroll";
import ThirdPage from "./images/SMIC.png";
import FourthPage from "./images/BSFT.png";
import FifthPage from "./images/PSC.png";

import NavBarNew from "../HomePage/NavBarNew";
import SixthPage from "./images/SSU.png";
import Footer from "../HomePage/Footer";

const Ecosystem = () => {
	return (
		<div className="grid grid-cols-1">
			<NavBarNew />
			<div>
				<div class="fixed left-0 top-[200px] flex flex-col gap-4 md:gap-6 lg:gap-8 z-10 mt-4">
					<ScrollLink
						to="bfsc-image"
						smooth={true}
						offset={-50}
						duration={500}
						className="bg-indigo-600 text-white px-4 py-2 md:px-6 hover:bg-indigo-700 hover:scale-105 transition-transform duration-1000 ease-in-out transform rounded-l-none rounded-r-2xl"
					>
						BSFT
					</ScrollLink>

					<ScrollLink
						to="psc-image"
						smooth={true}
						offset={-50}
						duration={500}
						className="bg-indigo-600 text-white px-5 py-2 md:px-7 hover:bg-indigo-700 hover:scale-105 transition-transform duration-1000 ease-in-out transform rounded-l-none rounded-r-2xl"
					>
						PSC
					</ScrollLink>

					<ScrollLink
						to="smic-image"
						smooth={true}
						offset={-50}
						duration={500}
						className="bg-indigo-600 text-white px-4 py-2 md:px-6 hover:bg-indigo-700 hover:scale-105 transition-transform duration-1000 ease-in-out transform rounded-l-none rounded-r-2xl"
					>
						SMIC
					</ScrollLink>

					<ScrollLink
						to="ssu-image"
						smooth={true}
						offset={-50}
						duration={500}
						className="bg-indigo-600 text-white px-5 py-2 md:px-7 hover:bg-indigo-700 hover:scale-105 transition-transform duration-1000 ease-in-out transform rounded-l-none rounded-r-2xl"
					>
						SSU
					</ScrollLink>
				</div>

				<div
					class="flex justify-center items-center mt-16 sm:mt-20 md:mt-28 pt-6"
					id="bfsc-image"
				>
					<div class="border border-black flex justify-center rounded-3xl w-11/12 md:w-9/12 max-w-4xl mt-10">
						<div class="w-full p-4">
							<h1 class="p-2 font-bold text-2xl md:text-3xl">
								Bihar Start-up Fund Trust (BSFT)
							</h1>
							<p class="p-3 text-sm md:text-base">
								The Bihar Start-up Fund Trust is an autonomous body constituted
								under the Chairmanship of Development Commissioner, Government
								of Bihar.
							</p>
							<img src={FourthPage} alt="" class="w-full rounded-lg" />
						</div>
					</div>
				</div>

				<div
					class="flex justify-center items-center mt-16 sm:mt-20 md:mt-28 p-6"
					id="psc-image"
				>
					<div class="border border-black flex justify-center rounded-3xl w-11/12 md:w-9/12 max-w-4xl">
						<div class="w-full p-4">
							<h1 class="p-2 font-bold text-2xl md:text-3xl">
								Preliminary Scrutiny Committee (PSC)
							</h1>
							<p class="p-4 text-sm md:text-base">
								A Preliminary Scrutiny Committee shall be constituted under the
								Chairmanship of Director to be notified by the Department of
								Industries, Government of Bihar.
							</p>
							<img src={FifthPage} alt="" class="w-full rounded-lg" />
						</div>
					</div>
				</div>

				<div
					class="flex justify-center items-center mt-16 sm:mt-20 md:mt-28 p-6"
					id="smic-image"
				>
					<div class="border border-black flex justify-center rounded-3xl w-11/12 md:w-9/12 max-w-4xl">
						<div class="w-full p-4">
							<h1 class="p-2 font-bold text-2xl md:text-3xl">
								Start-up Monitoring and Implementation Committee (SMIC)
							</h1>
							<p class="p-4 text-sm md:text-base">
								SMIC shall be constituted under the Chairmanship of Principal
								Secretary Department of Industries, Government of Bihar.
							</p>
							<img src={ThirdPage} alt="" class="w-full rounded-lg" />
						</div>
					</div>
				</div>

				<div
					class="flex justify-center items-center mt-16 sm:mt-20 md:mt-28 p-6"
					id="ssu-image"
				>
					<div class="border border-black flex justify-center rounded-3xl w-11/12 md:w-9/12 max-w-4xl">
						<div class="w-full p-4">
							<img src={SixthPage} alt="" class="w-full rounded-lg" />
						</div>
					</div>
				</div>
			</div>
      <Footer />
		</div>
	);
};

export default Ecosystem;
