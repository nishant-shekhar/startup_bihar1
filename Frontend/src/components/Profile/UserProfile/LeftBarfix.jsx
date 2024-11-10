import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LeftBar from './Navbar/LeftBar';

const LeftBarfix = ({ isLoggedIn }) => {
  const location = useLocation();
  const showLeftBarRoutes = [
    '/UserProfile',
    '/Userprofile',
    '/StartupForm',
    '/upload',
    '/SecondTrance',
    '/seedfunded',
    '/postseed',
    '/matchingloan',
    '/reimbursement',
    '/coworking',
    '/acceleration',
    '/qpr',
    '/incubation',
    '/grievance'
  ];

  const showLeftBar = isLoggedIn || showLeftBarRoutes.includes(location.pathname);

  return (
    <div className="flex min-h-screen"
      style={{
        background: 'linear-gradient(90deg, rgb(241, 241, 241) 0%, rgb(211, 208, 227) 85%, rgb(224, 224, 224) 100%)',
      }}>
      {showLeftBar && <LeftBar />}
      <div className="flex-grow">
        <Outlet /> {/* This will render the nested route content */}
      </div>
    </div>
  );
};

export default LeftBarfix;
