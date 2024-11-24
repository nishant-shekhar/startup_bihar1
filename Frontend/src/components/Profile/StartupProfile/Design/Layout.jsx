import React from 'react';
import LeftBar from '../Navbar/LeftBar'; // Adjust the import path as needed

const Layout = ({ children, showLeftBar }) => {
    return (
        <div className="flex">
            {showLeftBar && <LeftBar />}
            <div className={`flex-grow ${showLeftBar ? '' : ''} p-4`}>
                {children}
            </div>
        </div>
    );
};

export default Layout;
