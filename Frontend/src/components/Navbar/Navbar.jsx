import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import SearchBox from '../SearchBox/SearchBox';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-transparent mx-10">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" className="h-10" />
      </div>
      <div className='flex items-center mr-2'>
        <SearchBox />
        <div className="navbar-login">
          <Link to="/login">
            <button className="ml-2 flex items-center text-m font-semibold leading-6 text-gray-900 hover:text-blue-600">
              Login<span aria-hidden="true" className="ml-1">&rarr;</span>
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
