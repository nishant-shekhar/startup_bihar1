import React from "react";
import logo from "../../assets/logo.png";
import NavBarNew from "../HomePage/NavBarNew";
import Footer from "../HomePage/footer";

const AboutUs = () => {
	return (
		<div>
			<NavBarNew />
			<div className="flex flex-wrap md:flex-nowrap ml-5 md:ml-20 pb-10 md:pb-20 pt-10 md:pt-20">
				<div className="w-full md:w-6/12">
					<h1 className="text-3xl md:text-5xl font-semibold text-[#3f1063] mt-10 md:mt-36 mb-5 md:mb-8">
						About Us
					</h1>
					<p className="font-normal text-base md:text-xl mt-10 md:mt-20">
						Bihar is progressing fast on the track of development, with
						unrelenting efforts being made towards strengthening infrastructure
						and promoting industrial growth. The government of Bihar is
						committed to improve competitiveness of the state's economy and
						achieving inclusive growth. Start-ups and Innovation play a key role
						in economic growth. This can be realized by promoting innovation and
						creating an ecosystem that nurtures start-ups from concept to
						commissioning. Apart from creating jobs, start-ups focus on
						innovation to create next gen solutions which bring economic
						dynamism.
					</p>
				</div>
				<div className="w-full md:w-5/12 md:mx-16 mt-5 md:mt-2">
					<img src="startup_ilustration.png" alt="" className="mx-auto md:mx-0" />
				</div>
			</div>
			<hr className="h-[1px] bg-black/30" />
			<div className="flex flex-wrap md:flex-nowrap pt-5 md:pt-10">
				<div className="w-full md:w-6/12 ml-5 md:ml-20 mt-10 md:mt-28 text-base md:text-xl">
					Government of Bihar formulated and notified Bihar Start-up Policy,
					2016 to create an independent and transparent ecosystem, where the
					state shall provide funding, promotion and policy support which was
					later amended as Bihar Start-up Policy 2017.The State has setup a
					Trust, with an initial corpus of INR 500 crores, which acts as the
					nodal agency for implementation of this policy.
					<br /> <br />
					In order to further boost the ecosystem and to make it more holistic
					and beneficial for the youth and entrepreneurs of the state, the
					Government has approved the Bihar Start-up Policy, 2022. This policy
					also aims to broad base the coverage, with an effective and faster
					implementation process.
				</div>
				<div className="w-full md:w-5/12 md:mx-16 mt-5 md:mt-0 px-5">
					<img src="5287960.jpg" alt="" className="mx-auto md:mx-0" />
				</div>
			</div>
			<div className="mt-10 md:mt-20 pt-5">
				<div className="border border-black flex flex-wrap md:flex-nowrap mx-5 md:mx-20 rounded-3xl">
					<div className="w-full md:w-7/12 ml-5 md:ml-12 text-base md:text-[22px] mt-5 md:mt-16">
						To enable Bihar emerge as the most preferred destination for
						start-ups and entrepreneurs by leveraging the potential of local
						youth through a conducive start-up ecosystem for inclusive growth in
						the State.
					</div>
					<div className="w-full md:w-6/12 md:mx-16 px-4 mt-3">
						<img src="vision.png" alt="" className="mx-auto md:mx-0" />
					</div>
				</div>
			</div>
			<div className="mt-10 mb-10">
				<div className="border border-black flex flex-wrap md:flex-nowrap mx-5 md:mx-20 rounded-3xl">
					<div className="w-full md:w-7/12 ml-5 md:ml-12 text-sm md:text-[20px] my-5">
						<ul className="list-disc ml-3">
							<li>
								Support startups by seed funding as well as matching grants to
								increase their viability.
							</li>
							<li>
								Facilitate Entrepreneurship Development Centers and
								Entrepreneurship Facilitation Centers to increase awareness and
								promote entrepreneurship amongst the youth.
							</li>
							<li>
								Encourage Entrepreneurship through education by introducing
								learning modules in the University/ Schools, MOOC (Massive Open
								Online Courses), internships amongst others.
							</li>
							<li>
								Facilitate development of new and support expansion of existing
								Incubators/common infrastructure spaces/Coworking spaces.
							</li>
							<li>
								Enable hassle-free and time bound statutory clearances for
								startups.
							</li>
							<li>
								Provide appropriate institutional support to enable the
								nurturing of startups including mentoring, hand-holding and
								training/orientation visits.
							</li>
						</ul>
					</div>
					<div className="w-full md:w-6/12 md:mx-16 mt-3">
						<img src="mission.png" alt="" className="mx-auto md:mx-0" />
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default AboutUs;
