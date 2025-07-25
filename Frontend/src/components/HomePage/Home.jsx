import React, { useState, useEffect }from "react"; // Import useState
import { motion } from "framer-motion";
import NavBarNew from "./NavBarNew";
import ThirdPage from "./ThirdPage";
import FourthPage from "./FourthPage";
import FifthPage from "./FifthPage";
import MovingPage from "./MovinPage/MovingPage";
import SixthPage from "./SixthPage";
import Countdown from "react-countdown";
import Footer from "./footer";
import CountdownTimer from "./CountdownTimer";
import CountUp from 'react-countup';
import DashboardPagePublic from "../Profile/PublicProfile/DashboardPage";
import { Lightbulb } from "lucide-react"; // or any icon library you're using

const HomePage = () => {
	const [isCountdownComplete, setCountdownComplete] = useState(false);

	const [showDialog, setShowDialog] = useState(true);
const [secondsLeft, setSecondsLeft] = useState(2);
const [totalIdeas, setTotalIdeas] = useState(null);

  useEffect(() => {
    const fetchIdeasCount = async () => {
      try {
        const response = await fetch("https://9w19cua4ga.execute-api.ap-south-1.amazonaws.com/prod/count");
        const data = await response.json();
        setTotalIdeas(data.count);
      } catch (error) {
        console.error("Error fetching ideas count:", error);
      }
    };

    fetchIdeasCount();
  }, []);
useEffect(() => {
  if (!showDialog) return;

  const interval = setInterval(() => {
    setSecondsLeft((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        //setShowDialog(false);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [showDialog]);



	const fadeIn = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.8, ease: "easeOut" },
		},
	};

	const staggerContainer = {
		hidden: {},
		visible: {
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	// coundown code here

	const targetDate = new Date("2025-01-14T12:00:00").getTime();

	const renderer = ({ days, hours, minutes, seconds, completed }) => {
		if (completed) {
			setCountdownComplete(true); // Update state when countdown finishes
			return null; // Stop rendering countdown timer
		}

		return (
			<div className="">
				<CountdownTimer
					days={days}
					hours={hours}
					minutes={minutes}
					seconds={seconds}
				/>
			</div>
		);
	};

	return (
		<div className="grid grid-cols-1 overflow-x-hidden">
			<NavBarNew />

			{/* 1st Page */}
			<div className="isolate bg-white px-6 py-24 sm:py-3 lg:px-8 min-h-screen flex flex-col items-center relative">
				{/* Background elements */}
				<div
					className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
					aria-hidden="true"
				>
					{/* Background content */}
				</div>

				{/* mobile content */}
				<div className="grid grid-cols-4 gap-2 scale-75 sm:mt-24 md:hidden">


					<div className="col-span-1 flex flex-col items-center  h-full ">
						<img
							src="cm2.png"
							alt="CM Image"
							className="w-24 h-auto object-cover "
						/>
						<h3 className="mt-2 text-sm sm:text-base md:text-lg font-semibold text-center">
							Shri Nitish Kumar
						</h3>
						<p className="text-xs sm:text-sm md:text- text-gray-600 text-center">
							Hon'ble Chief Minister, Bihar
						</p>
					</div>
					<div className="col-span-1 flex flex-col items-center h-full  ">
						<img
							src="5.png"
							alt="bihar"
							className="w-24 h-auto object-cover "
						/>
						<h3 className="mt-2 text-sm sm:text-base md:text-lg font-semibold text-center">
							Government of Bihar
						</h3>
						<p className="text-xs sm:text-sm md:text- text-gray-600 text-center">
							Bihar, India
						</p>
					</div>
					<div className="col-span-1 flex flex-col items-center  h-full  ">
						<img
							src="4.png"
							alt="industry Image"
							className="w-24 h-auto object-cover "
						/>
						<h3 className="mt-2 text-sm sm:text-base md:text-lg font-semibold text-center">
							Department of Industries
						</h3>
						<p className="text-xs sm:text-sm md:text- text-gray-600 text-center">
							Govt. of Bihar
						</p>
					</div>
					<div className="col-span-1 flex flex-col items-center  h-full ">
						<img
							src="minister.png"
							alt="minister Image"
							className="w-24 h-auto object-cover "
						/>
						<h3 className="mt-2 text-sm sm:text-base md:text-lg font-semibold text-center">
							Shri Nitish Mishra
						</h3>
						<p className="text-xs sm:text-sm md:text- text-gray-600 text-center">
							Hon'ble Minister, Industry Dept, Bihar
						</p>
					</div>


				</div>


				{/* Left-middle image with name and designation */}
				<div className="absolute left-0 top-40 sm:top-64 transform flex-col items-center scale-75 hidden md:flex">
					<div className="flex flex-col items-center justify-center h-full">
						<img
							src="cm2.png"
							alt="CM Image"
							className="w-24 md:w-36 lg:w-48 h-auto object-cover"
						/>
						<h3 className="mt-2 text-sm sm:text-base md:text-lg font-semibold text-center">
							Shri Nitish Kumar
						</h3>
						<p className="text-xs sm:text-sm md:text- text-gray-600 text-center">
							Hon'ble Chief Minister, Bihar
						</p>
					</div>

					<div className="flex flex-col items-center justify-center mt-2 h-full">
						<img
							src="minister.png"
							alt="minister Image"
							className="w-24 md:w-36 lg:w-48 h-auto object-cover"
						/>
						<h3 className="mt-2 text-sm sm:text-base md:text-lg font-semibold text-center">
							Shri Nitish Mishra
						</h3>
						<p className="text-xs sm:text-sm md:text- text-gray-600 text-center">
							Hon'ble Minister, Industry Dept, Bihar
						</p>
					</div>
				</div>

				{/* Right-middle image with name and designation */}
				<div className="absolute right-0 top-40 sm:top-64 transform flex-col items-center scale-75 hidden md:flex">
					<div className="flex flex-col items-center justify-center h-full">
						<img
							src="5.png"
							alt="bihar"
							className="w-24 md:w-36 lg:w-48 h-auto object-cover"
							style={{ clipPath: "inset(0 0 0 0)" }}
						/>
						<h3 className="mt-2 text-sm sm:text-base md:text-lg font-semibold text-center">
							Govt. of Bihar
						</h3>
						<p className="text-xs sm:text-sm md:text- text-gray-600 text-center">
							Bihar, India
						</p>
					</div>

					<div className="flex flex-col items-center justify-center mt-2 h-full">
						<img
							src="4.png"
							alt="industry Image"
							className="w-24 md:w-36 lg:w-48 h-auto object-cover"
							style={{ clipPath: "inset(0 0 0 0)" }}
						/>
						<h3 className="mt-2 text-sm sm:text-base md:text-lg font-semibold text-center">
							Dept. of Industries
						</h3>
						<p className="text-xs sm:text-sm md:text- text-gray-600 text-center">
							Govt. of Bihar
						</p>
					</div>
				</div>



				{/* Title and Countdown */}
				{!isCountdownComplete && (
					<div className="text-center pt-6 sm:pt-40 md:pt-32 lg:pt-32 pb-4 md:pb-10">
						<h1 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-4 text-[#303462]">
							Countdown to Launch
						</h1>
						<Countdown date={targetDate} renderer={renderer} />
					</div>
				)}
				{/* Main content section */}
				<motion.div
					className={`text-center mx-auto max-w-2xl pt-4 mb-12 sm:pt-16 lg:pt-16 ${isCountdownComplete ? "mt-10 sm:mt-20 md:mt-40 lg:mt-56" : ""
						}`}
					initial="hidden"
					animate="visible"
					variants={fadeIn}
				>
					<h1
						className="text-4xl font-bold tracking-tight text-gray-600 opacity-35 sm:text-5xl"
						style={{ fontFamily: "Amsterdam" }}
					>
						Startup Bihar
					</h1>
				</motion.div>


				<motion.div
					className="mx-auto max-w-2xl pb-18 pt-10 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-16"
					variants={staggerContainer}
					initial="hidden"
					animate="visible"
				>
					<motion.div
						className="mb-6 flex justify-center sm:mb-8 sm:flex sm:justify-center"
						variants={fadeIn}
					>
						<div className="relative rounded-full px-3 py-1 text-xs sm:text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
							Get Familiar with Startup Bihar.
							<a href="/ecosystem" className="font-semibold text-indigo-600 ml-2">
								<span className="absolute inset-0" aria-hidden="true"></span>
								Read more <span aria-hidden="true">&rarr;</span>
							</a>
						</div>
					</motion.div>

					<motion.div className="text-center" variants={fadeIn}>
						<h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
							Empowering Startups, Shaping Tomorrow Together
						</h1>
						<p className="mt-6 text-base sm:text-lg leading-6 lg:leading-8 text-gray-600 px-6 sm:px-0">
							Driving innovation, growth, and entrepreneurial success by supporting startups across diverse sectors in Bihar.
						</p>
					</motion.div>

					<motion.div
						className="mt-16 flex items-center justify-center gap-x-6"
						variants={fadeIn}
					>
						{/*<a
							href="/AllStartups"
							className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Explore Startups
						</a>*/}
						<a
							href="https://startup.bihar.gov.in/apply-new"
							target="blank"
							className="text-sm font-semibold leading-6 text-gray-900"
						>
							Register New Startup <span aria-hidden="true">→</span>
						</a>
					</motion.div>
					{/* Notification Section */}
					<motion.div
						className="mt-6 flex justify-center sm:mb-8 sm:flex sm:justify-center"
						variants={fadeIn}
					>
						<div className="relative rounded-full px-3 py-1 text-sm sm:text-xm leading-6 text-red-700 ring-1 ring-red-700/10 hover:ring-red-700/20 bg-red-50 flex items-center space-x-2">
							
							<span className="animate-pulse text-xs  text-white bg-red-600 px-2 py-0.5 rounded-full">
								New
							</span>
							<span>
								Request for Quotation For Appointment of Statutory Auditor for BSFT
								<a
									href="https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FNotification%2FMemo%20No.-2624%2C%20Dated-16.07.2025.pdf?alt=media&token=b9090b01-f9d7-4987-9f0c-e8a94ceb00f4"
									target="_blank"
									rel="noopener noreferrer"
									className="font-semibold text-red-800 ml-2"
								>
									View. <span aria-hidden="true">&rarr;</span>
								</a>
							</span>
						</div>
					</motion.div>

				</motion.div>




				{/* Moving Page Component */}
				<MovingPage />
			</div>

			<ThirdPage />
			<FourthPage />
			<FifthPage />

			<SixthPage />
			<Footer />
			{showDialog && (
  <div
    className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center"
    onClick={() => setShowDialog(false)}
  >
   <div
  className="relative bg-white rounded-2xl overflow-hidden w-[90%] max-w-7xl h-[80vh] shadow-xl"
  onClick={(e) => e.stopPropagation()}
>
  {/* Close button */}
  <button
    className="absolute top-3 left-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center z-10"
    onClick={() => setShowDialog(false)}
  >
    ×
  </button>

  {/* Image link */}
  <a
    href="https://thebharatproject.co.in/bihar-idea-festival.html"
    target="_blank"
    rel="noopener noreferrer"
    className="cursor-pointer"
  >
    <img
      src="banneridea.png"
      alt="Promotion"
      className="w-full h-full object-contain cursor-pointer"
    />
  </a>

  {totalIdeas !== null && (
      <div className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 bg-white/90 border border-yellow-400 shadow-lg rounded-xl px-6 py-3 flex items-center gap-2 backdrop-blur-sm">
        <Lightbulb className="text-yellow-500" size={20} />
        <span className="text-sm font-semibold text-gray-800">
          Total ideas submitted: <span className="text-yellow-600">{totalIdeas}</span>
        </span>
      </div>
    )}
</div>
  </div>
)}


		</div>
	);
};

export default HomePage;
