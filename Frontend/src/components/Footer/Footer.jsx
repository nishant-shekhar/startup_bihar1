import React from 'react';

function Footer() {
  return (
    <footer className=" bg-gray-900 text-gray-300 py-4">
      <div className="container mx-auto text-center">
        <p>© 2024 NS APPS INNOVATIONS. All rights reserved.</p>
        <div className="space-x-4 mt-2">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Changelog</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;