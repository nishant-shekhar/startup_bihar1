import React, { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import ThirdPage from "./images/SMIC.jpeg";
import FourthPage from "./images/BSFT.jpeg";
import FifthPage from "./images/PSC.png";

import NavBarNew from "../HomePage/NavBarNew";
import SixthPage from "./images/SSU.png";
import Footer from "../HomePage/footer";
import { Link } from "react-router-dom";


const Ecosystem = () => {

	const [opacity, setOpacity] = useState(1);
	const handleScroll = () => {
		const scrollTop = window.scrollY;
		const newOpacity = Math.max(1 - scrollTop / 300, 0);
		setOpacity(newOpacity);
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	useEffect(() => {
		const hash = window.location.hash;
		if (hash) {
			const element = document.querySelector(hash);
			if (element) {
				setTimeout(() => {
					element.scrollIntoView({ behavior: "smooth", block: "start" });
				}, 100); // wait for page render
			}
		}
	}, []);

	return (
		<div className="grid grid-cols-1">
			<NavBarNew />
			<div>
				<div className="fixed left-0 top-[200px] flex flex-col gap-4 md:gap-6 lg:gap-8 z-10 mt-4 " >
					
					<ScrollLink
						to="bfsc-image"
						smooth={true}
						offset={-50}
						duration={500}
						className="bg-indigo-600 text-white px-4 py-2 md:px-6 hover:bg-indigo-700 hover:scale-105 transition-transform duration-500 ease-in-out transform rounded-l-none rounded-full"
					>
						BSFT
					</ScrollLink>

					<ScrollLink
						to="psc-image"
						smooth={true}
						offset={-50}
						duration={500}
						className="bg-indigo-600 text-white px-5 py-2 md:px-7 hover:bg-indigo-700 hover:scale-105 transition-transform duration-500 ease-in-out transform rounded-l-none rounded-full"
					>
						PSC
					</ScrollLink>

					

				</div>

				<div className="fixed right-0 top-[200px] flex flex-col gap-4 md:gap-6 lg:gap-8 z-10 mt-4" >

				<ScrollLink
						to="smic-image"
						smooth={true}
						offset={-50}
						duration={500}
						className="bg-indigo-600 text-white px-4 py-2 md:px-6 hover:bg-indigo-700 hover:scale-105 transition-transform duration-500 ease-in-out transform rounded-l-none rounded-full"
					>
						SMIC
					</ScrollLink>

					<ScrollLink
						to="ssu-image"
						smooth={true}
						offset={-50}
						duration={500}
						className="bg-indigo-600 text-white px-5 py-2 md:px-7 hover:bg-indigo-700 hover:scale-105 transition-transform duration-500 ease-in-out transform rounded-l-none rounded-full"
					>
						SSU
					</ScrollLink>


				</div>


				<div
					className="flex justify-center items-center mt-16 sm:mt-20 md:mt-28 pt-6"
					id="bfsc-image"
				>
					<div className="border border-black flex justify-center rounded-3xl w-11/12 md:w-9/12 max-w-4xl mt-10">
						<div className="w-full p-4">
							<h1 className="p-2 font-bold text-2xl md:text-3xl">
								Bihar Start-up Fund Trust (BSFT)
							</h1>
							<p className="p-3 text-sm md:text-base">
								The Bihar Start-up Fund Trust is an autonomous body constituted
								under the Chairmanship of Development Commissioner, Government
								of Bihar.
							</p>
							<img src={FourthPage} alt="" className="w-full rounded-lg" />
						</div>
					</div>
				</div>

				<div
					className="flex justify-center items-center mt-16 sm:mt-20 md:mt-28 p-6"
					id="psc-image"
				>
					<div className="border border-black flex justify-center rounded-3xl w-11/12 md:w-9/12 max-w-4xl">
						<div className="w-full p-4">
							<h1 className="p-2 font-bold text-2xl md:text-3xl">
								Preliminary Scrutiny Committee (PSC)
							</h1>
							<p className="p-4 text-sm md:text-base">
								A Preliminary Scrutiny Committee shall be constituted under the
								Chairmanship of Director to be notified by the Department of
								Industries, Government of Bihar.
							</p>
							<img src={FifthPage} alt="" className="w-full rounded-lg" />
						</div>
					</div>
				</div>

				<div
					className="flex justify-center items-center mt-16 sm:mt-20 md:mt-28 p-6"
					id="smic-image"
				>
					<div className="border border-black flex justify-center rounded-3xl w-11/12 md:w-9/12 max-w-4xl">
						<div className="w-full p-4">
							<h1 className="p-2 font-bold text-2xl md:text-3xl">
								Start-up Monitoring and Implementation Committee (SMIC)
							</h1>
							<p className="p-4 text-sm md:text-base">
								SMIC shall be constituted under the Chairmanship of Principal
								Secretary Department of Industries, Government of Bihar.
							</p>
							<img src={ThirdPage} alt="" className="w-full rounded-lg" />
						</div>
					</div>
				</div>

				<div
					className="flex justify-center items-center mt-16 sm:mt-20 md:mt-28 p-6"
					id="ssu-image"
				>
					<div className="border border-black flex justify-center rounded-3xl w-11/12 md:w-9/12 max-w-4xl">
						<div className="w-full p-4">
							<img src={SixthPage} alt="" className="w-full rounded-lg" />
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default Ecosystem;
