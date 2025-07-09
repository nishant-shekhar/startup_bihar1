import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';
import { FiChevronDown } from 'react-icons/fi';

import { Link as RouterLink } from 'react-router-dom';

import { FiZap } from 'react-icons/fi'; // bulb-like icon
import { IoBulb } from "react-icons/io5";


const NavBarNew = () => {
	const [sticky, setSticky] = useState(false);
	const [mobileMenu, setMobileMenu] = useState(false);
	const [lastScrollY, setLastScrollY] = useState(0);
	const [visible, setVisible] = useState(true);
	const [isDropDownOpen, setIsDropDownOpen] = useState(false);
	const dropdownRef = useRef(null);
	const timerRef = useRef(null);

	useEffect(() => {
		const handleScroll = () => {
			setSticky(window.scrollY > 50);

			// Determine scroll direction
			if (window.scrollY > lastScrollY) {
				setVisible(false); // Scrolling down
			} else {
				setVisible(true); // Scrolling up
			}
			setLastScrollY(window.scrollY);
		};

		window.addEventListener('scroll', handleScroll);

		// Clean up the event listener on component unmount
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [lastScrollY]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropDownOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const toggleMenu = () => {
		setMobileMenu((prev) => !prev);
	};

	return (
		<div className={`container ${sticky ? "dark-nav" : ""}`}>
			<div
				className={`transition-shadow duration-300 ${sticky ? "bg-[#3f1063] shadow-lg" : "bg-[#3f1063]"}`}
			>
				<header
					className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${visible ? "translate-y-0" : "-translate-y-full"}`}
				>
					<nav
						className={`flex items-center justify-between p-6 lg:px-8 ${sticky ? "bg-[#b37cdd]" : "bg-[#ba82e6]"}`}
						aria-label="Global"
					>
						<div className="flex lg:flex-1">
							{/* Smooth scroll to top on logo click */}
							<Link
								onClick={() => scroll.scrollToTop()}
								to={"/"}
								className="-m-1.5 p-1.5 cursor-pointer"
							>
								<span className="sr-only">Your Company</span>


								<img
									className="h-12 w-auto"
									src="https://startup.bihar.gov.in/static/media/new_logo.efdd49a20c5fb7fe0b73.png"
									alt="Company Logo"
								/>

							</Link>
						</div>

						{/* Desktop Menu */}
						<div className={`hidden lg:flex lg:gap-x-12`}>
							<ScrollLink
								to="startups"
								smooth={true}
								offset={-50}
								duration={500}
								className="text-sm font-semibold leading-6 text-white cursor-pointer hover:text-gray-200 active:text-gray-300"
							>
								<Link to="/">
									Startups List</Link>
							</ScrollLink>

							
							
							<ScrollLink
								to="work"
								smooth={true}
								offset={-50}
								duration={500}
								className="text-sm font-semibold leading-6 text-white cursor-pointer hover:text-gray-200 active:text-gray-300"
							>
								<Link to="/">At a Glance
</Link>
							</ScrollLink>
						
							
							<Link
								to="/PublicDashboard"
								smooth={true}
								offset={-50}
								duration={500}
								className="text-sm font-semibold leading-6 text-white cursor-pointer hover:text-gray-200 active:text-gray-300"
							>
								Dashboard
							</Link>
							

							<Link
								to="/about-us"
								smooth={true}
								offset={-50}
								duration={500}
								className="text-sm font-semibold leading-6 text-white cursor-pointer hover:text-gray-200 active:text-gray-300"
							>
								About Us
							</Link>
							<ScrollLink
								to="contact"
								smooth={true}
								offset={-50}
								duration={500}
								className="text-sm font-semibold leading-6 text-white cursor-pointer hover:text-gray-200 active:text-gray-300"
							>
								<Link to="/">	Contact Us</Link>
							</ScrollLink>

							<Link
								to="/contact-us"
								smooth={true}
								offset={-50}
								duration={500}
								className="text-sm font-semibold leading-6 text-white cursor-pointer hover:text-gray-200 active:text-gray-300"
							>
								Startup Team
							</Link>
							<Link
								to="/Events"
								smooth={true}
								offset={-50}
								duration={500}
								className="text-sm font-semibold leading-6 text-white cursor-pointer hover:text-gray-200 active:text-gray-300"
							>
								Events
							</Link>
							<div
								className="relative"
								ref={dropdownRef}
								onMouseEnter={() => setIsDropDownOpen(true)}
								onMouseLeave={() => setIsDropDownOpen(false)}
							>
								<RouterLink
									to="/ecosystem"
									className="text-sm font-semibold leading-6 text-white py-2 hover:text-gray-500 active:text-gray-600 cursor-pointer"
								>
									<span className="flex items-center gap-1">
										Startup Ecosystem
										<FiChevronDown
											className={`transition-transform duration-300 ${isDropDownOpen ? 'rotate-180' : 'rotate-0'
												}`}
										/>
									</span>
								</RouterLink>

								{isDropDownOpen && (
									<div
										className="absolute left-0 top-full mt-0.5 flex flex-col bg-white shadow-lg z-50 w-64 rounded-lg overflow-hidden transition-all duration-300 ease-in-out"
									>
										{/* Column 1 */}
										<a href="https://iciitp.com/zerolab/" target="_blank" className="px-4 py-2 text-sm hover:bg-indigo-100 text-gray-800">
											Zero Lab
										</a>
										<RouterLink to="/ecosystem#bfsc-image" className="px-4 py-2 text-sm hover:bg-indigo-100 text-gray-800">BSFT</RouterLink>
										<RouterLink to="/ecosystem#psc-image" className="px-4 py-2 text-sm hover:bg-indigo-100 text-gray-800">PSC</RouterLink>
										<RouterLink to="/ecosystem#smic-image" className="px-4 py-2 text-sm hover:bg-indigo-100 text-gray-800">SMIC</RouterLink>
										<RouterLink to="/ecosystem#ssu-image" className="px-4 py-2 text-sm hover:bg-indigo-100 text-gray-800">SSU</RouterLink>
										<RouterLink to="/StartupCell" className="px-4 py-2 text-sm hover:bg-indigo-100 text-gray-800">
											Startup Cell
										</RouterLink>
										<RouterLink to="/IncubationCell" className="px-4 py-2 text-sm hover:bg-indigo-100 text-gray-800">
											Incubation Cell
										</RouterLink>
										<RouterLink to="/Mentors" className="px-4 py-2 text-sm hover:bg-indigo-100 text-gray-800">
											Mentors
										</RouterLink>

										<hr className="border-t border-gray-200" />

										{/* Column 2 */}
										<a href="https://bhub.org.in/" target="_blank" className="px-4 py-2 text-sm hover:bg-indigo-100 text-gray-800">
											B-Hub
										</a>
										<a href="https://startup.bihar.gov.in/static/media/Acceleration%20Program.bf71b2d74535485bfc5f.pdf" target="_blank" className="px-4 py-2 text-sm hover:bg-indigo-100 text-gray-800">
											Acceleration Program
										</a>
										<a href="https://startup.bihar.gov.in/static/media/SOP%20for%20Early%20Stage%20Funding-%20Revised.51d15bea123ee299bd5f.pdf" target="_blank" className="px-4 py-2 text-sm hover:bg-indigo-100 text-gray-800">
											Early Stage Funding
										</a>
										<a href="https://startup.bihar.gov.in/static/media/Exit%20Policy.929b6eb912040f50f1f7.pdf" target="_blank" className="px-4 py-2 text-sm hover:bg-indigo-100 text-gray-800">
											Exit Policy
										</a>
										<a href="https://startup.bihar.gov.in/static/media/Intellectual%20Property%20Rights.fb6778157b1d80402ab0.pdf" target="_blank" className="px-4 py-2 text-sm hover:bg-indigo-100 text-gray-800">
											Intellectual Property Rights
										</a>
										<a href="https://startup.bihar.gov.in/static/media/Matching%20Loan.14234dba2d6580a941c6.pdf" target="_blank" className="px-4 py-2 text-sm hover:bg-indigo-100 text-gray-800">
											Matching Loan
										</a>
										<a href="https://startup.bihar.gov.in/static/media/Second%20Tranche.beabb8973b7e3b174e5d.pdf" target="_blank" className="px-4 py-2 text-sm hover:bg-indigo-100 text-gray-800">
											Second Tranche
										</a>
										<a href="https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FPdf%2FSeed%20Fund%20Document%20List.pdf?alt=media&token=adff7f46-1060-4d64-9740-bfe16cdd2362" target="_blank" className="px-4 py-2 text-sm hover:bg-indigo-100 text-gray-800">
											Documents Required for Seed Fund

										</a>
									</div>
								)}
							</div>
							<a
  href="https://thebharatproject.co.in/bihar-idea-festival.html"
  target="_blank"
  rel="noopener noreferrer"
  className="text-sm font-semibold leading-6 text-yellow-300 bg-indigo-900 px-3 py-1.5 rounded-md shadow hover:bg-yellow-400 hover:text-indigo-900 flex items-center gap-1 cursor-pointer transition duration-300 animate-fade-in"
>
<IoBulb className="text-lg animate-bounce-slow drop-shadow-[0_0_6px_#facc15]" />
  Bihar Idea Festival
</a>



						</div>

						{/* Login Button */}
						<div className="lg:flex lg:flex-1 lg:justify-end">
							<Link to="/login">
								<button className="ml-2 flex items-center text-m font-semibold leading-6 text-white hover:text-gray-200">
									Login
									<span aria-hidden="true" className="ml-1">
										&rarr;
									</span>
								</button>
							</Link>
						</div>

						{/* Mobile Menu Button */}
						<button
							onClick={toggleMenu}
							className="lg:hidden flex items-center text-white"
						>
							{mobileMenu ? "Close" : "Menu"}
						</button>
					</nav>

					{/* Mobile Menu */}
				{mobileMenu && (
  <div className="flex flex-col lg:hidden p-4 bg-white shadow-md space-y-2">
    <RouterLink to="/" onClick={toggleMenu} className="text-sm font-semibold text-gray-800 py-2 hover:text-gray-500">
      Startups List
    </RouterLink>
    <RouterLink to="/" onClick={toggleMenu} className="text-sm font-semibold text-gray-800 py-2 hover:text-gray-500">
      Vision
    </RouterLink>
    <RouterLink to="/" onClick={toggleMenu} className="text-sm font-semibold text-gray-800 py-2 hover:text-gray-500">
      At a Glance
    </RouterLink>
    <RouterLink to="/" onClick={toggleMenu} className="text-sm font-semibold text-gray-800 py-2 hover:text-gray-500">
      Contact Us
    </RouterLink>
    <RouterLink to="/PublicDashboard" onClick={toggleMenu} className="text-sm font-semibold text-gray-800 py-2 hover:text-gray-500">
      Dashboard
    </RouterLink>
	

    <RouterLink to="/about-us" onClick={toggleMenu} className="text-sm font-semibold text-gray-800 py-2 hover:text-gray-500">
      About Us
    </RouterLink>
    <RouterLink to="/contact-us" onClick={toggleMenu} className="text-sm font-semibold text-gray-800 py-2 hover:text-gray-500">
      Startup Team
    </RouterLink>
    <RouterLink to="/Events" onClick={toggleMenu} className="text-sm font-semibold text-gray-800 py-2 hover:text-gray-500">
      Events
    </RouterLink>

    {/* Startup Ecosystem dropdown for mobile */}
    <details className="group">
      <summary className="text-sm font-semibold text-gray-800 py-2 cursor-pointer list-none flex justify-between items-center">
        Startup Ecosystem
        <span className="ml-1 transition-transform group-open:rotate-180">
          <FiChevronDown />
        </span>
      </summary>
      <div className="pl-4 flex flex-col space-y-1 mt-1">
        <a href="https://iciitp.com/zerolab/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-800 hover:text-indigo-600">Zero Lab</a>
        <RouterLink to="/ecosystem#bfsc-image" onClick={toggleMenu} className="text-sm text-gray-800 hover:text-indigo-600">BSFT</RouterLink>
        <RouterLink to="/ecosystem#psc-image" onClick={toggleMenu} className="text-sm text-gray-800 hover:text-indigo-600">PSC</RouterLink>
        <RouterLink to="/ecosystem#smic-image" onClick={toggleMenu} className="text-sm text-gray-800 hover:text-indigo-600">SMIC</RouterLink>
        <RouterLink to="/ecosystem#ssu-image" onClick={toggleMenu} className="text-sm text-gray-800 hover:text-indigo-600">SSU</RouterLink>
        <RouterLink to="/StartupCell" onClick={toggleMenu} className="text-sm text-gray-800 hover:text-indigo-600">Startup Cell</RouterLink>
        <RouterLink to="/IncubationCell" onClick={toggleMenu} className="text-sm text-gray-800 hover:text-indigo-600">Incubation Cell</RouterLink>
        <RouterLink to="/Mentors" onClick={toggleMenu} className="text-sm text-gray-800 hover:text-indigo-600">Mentors</RouterLink>
        <hr className="my-2 border-gray-300" />
        <a href="https://bhub.org.in/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-800 hover:text-indigo-600">B-Hub</a>
        <a href="https://startup.bihar.gov.in/static/media/Acceleration%20Program.bf71b2d74535485bfc5f.pdf" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-800 hover:text-indigo-600">Acceleration Program</a>
        <a href="https://startup.bihar.gov.in/static/media/SOP%20for%20Early%20Stage%20Funding-%20Revised.51d15bea123ee299bd5f.pdf" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-800 hover:text-indigo-600">Early Stage Funding</a>
        <a href="https://startup.bihar.gov.in/static/media/Exit%20Policy.929b6eb912040f50f1f7.pdf" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-800 hover:text-indigo-600">Exit Policy</a>
        <a href="https://startup.bihar.gov.in/static/media/Intellectual%20Property%20Rights.fb6778157b1d80402ab0.pdf" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-800 hover:text-indigo-600">Intellectual Property Rights</a>
        <a href="https://startup.bihar.gov.in/static/media/Matching%20Loan.14234dba2d6580a941c6.pdf" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-800 hover:text-indigo-600">Matching Loan</a>
        <a href="https://startup.bihar.gov.in/static/media/Second%20Tranche.beabb8973b7e3b174e5d.pdf" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-800 hover:text-indigo-600">Second Tranche</a>
        <a href="https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FPdf%2FSeed%20Fund%20Document%20List.pdf?alt=media&token=adff7f46-1060-4d64-9740-bfe16cdd2362" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-800 hover:text-indigo-600">Documents for Seed Fund</a>
      </div>
    </details>
	<a
  href="https://thebharatproject.co.in/bihar-idea-festival.html"
  target="_blank"
  rel="noopener noreferrer"
  onClick={toggleMenu}
  className="text-sm font-semibold text-yellow-600 bg-yellow-100 px-3 py-2 rounded shadow hover:bg-yellow-200 flex items-center gap-2 animate-fade-in"
>
  <FiZap className="animate-bounce-slow text-yellow-600" />
  Bihar Idea Festival
</a>

  </div>
)}

				</header>
			</div>
		</div>
	);
};

export default NavBarNew;
