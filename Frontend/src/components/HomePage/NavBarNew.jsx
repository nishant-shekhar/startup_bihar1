import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';

const NavBarNew = () => {
  const [sticky, setSticky] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);

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

  const toggleMenu = () => {
    setMobileMenu((prev) => !prev);
  };

  return (
    <div className={`container ${sticky ? 'dark-nav' : ''}`}>
      <div className={`transition-shadow duration-300 ${sticky ? 'bg-[#3f1063] shadow-lg' : 'bg-[#3f1063]'}`}>
        <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
          <nav className={`flex items-center justify-between p-6 lg:px-8 ${sticky ? 'bg-[#3f1063]' : 'bg-[#3f1063]'}`} aria-label="Global">
            <div className="flex lg:flex-1">
              {/* Smooth scroll to top on logo click */}
              <a onClick={() => scroll.scrollToTop()} className="-m-1.5 p-1.5 cursor-pointer">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-12 w-auto"
                  src="https://startup.bihar.gov.in/static/media/new_logo.efdd49a20c5fb7fe0b73.png"
                  alt="Company Logo"
                />
              </a>
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
                Startups List
              </ScrollLink>
              <ScrollLink
                to="mentors"
                smooth={true}
                offset={-50}
                duration={500}
                className="text-sm font-semibold leading-6 text-white cursor-pointer hover:text-gray-200 active:text-gray-300"
              >
                Mentors List
              </ScrollLink>
              <ScrollLink
                to="coworking"
                smooth={true}
                offset={-50}
                duration={500}
                className="text-sm font-semibold leading-6 text-white cursor-pointer hover:text-gray-200 active:text-gray-300"
              >
                Coworking Space
              </ScrollLink>
              <ScrollLink
                to="work"
                smooth={true}
                offset={-50}
                duration={500}
                className="text-sm font-semibold leading-6 text-white cursor-pointer hover:text-gray-200 active:text-gray-300"
              >
                Work with Us
              </ScrollLink>
              <ScrollLink
                to="contact"
                smooth={true}
                offset={-50}
                duration={500}
                className="text-sm font-semibold leading-6 text-white cursor-pointer hover:text-gray-200 active:text-gray-300"
              >
                Contact Us
              </ScrollLink>
            </div>

            {/* Login Button */}
            <div className="lg:flex lg:flex-1 lg:justify-end">
              <Link to="/login">
                <button className="ml-2 flex items-center text-m font-semibold leading-6 text-white hover:text-gray-200">
                  Login<span aria-hidden="true" className="ml-1">&rarr;</span>
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={toggleMenu} className="lg:hidden flex items-center">
              {mobileMenu ? 'Close' : 'Menu'}
            </button>
          </nav>

          {/* Mobile Menu */}
          {mobileMenu && (
            <div className="flex flex-col lg:hidden p-4 bg-white shadow-md">
              <ScrollLink
                to="startups"
                smooth={true}
                offset={-50}
                duration={500}
                className="text-sm font-semibold leading-6 text-gray-700 py-2 hover:text-gray-500 active:text-gray-600"
                onClick={toggleMenu}
              >
                Startups List
              </ScrollLink>
              <ScrollLink
                to="mentors"
                smooth={true}
                offset={-50}
                duration={500}
                className="text-sm font-semibold leading-6 text-gray-700 py-2 hover:text-gray-500 active:text-gray-600"
                onClick={toggleMenu}
              >
                Mentors List
              </ScrollLink>
              <ScrollLink
                to="coworking"
                smooth={true}
                offset={-50}
                duration={500}
                className="text-sm font-semibold leading-6 text-gray-700 py-2 hover:text-gray-500 active:text-gray-600"
                onClick={toggleMenu}
              >
                Coworking Space
              </ScrollLink>
              <ScrollLink
                to="work"
                smooth={true}
                offset={-50}
                duration={500}
                className="text-sm font-semibold leading-6 text-gray-700 py-2 hover:text-gray-500 active:text-gray-600"
                onClick={toggleMenu}
              >
                Work with Us
              </ScrollLink>
              <ScrollLink
                to="contact"
                smooth={true}
                offset={-50}
                duration={500}
                className="text-sm font-semibold leading-6 text-gray-700 py-2 hover:text-gray-500 active:text-gray-600"
                onClick={toggleMenu}
              >
                Contact Us
              </ScrollLink>
            </div>
          )}
        </header>
      </div>
    </div>
  );
};

export default NavBarNew;
