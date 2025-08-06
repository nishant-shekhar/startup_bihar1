import React from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
  return (
    <div className="flex flex-1 bg-white">
      {/* Background elements for styling */}
      <div className="isolate bg-white px-6 py-24 sm:py-3 lg:px-8 min-h-screen flex flex-col items-center">
        <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
          {/* Abstract background design */}
          <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" />
        </div>
      </div>

      {/* Header with navigation and company logo */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex flex-1 justify-start">
            <Link to="/" className="text-sm font-semibold leading-6 text-gray-900">
              <span aria-hidden="true">&larr;</span> Back
            </Link>
          </div>
          <div className="flex lg:flex-1 justify-end">
            <img className="h-12 w-auto" src="startup_bihar_logo1.png" alt="Company Logo" />
          </div>
        </nav>
      </header>

      {/* Main content area for profile details */}
      <div className="mx-auto mt-20 bg-slate-900 w-2/3 h-auto p-6 rounded-lg shadow-lg text-white">
        <h1 className="text-3xl font-bold">Startup Name</h1>
        <p className="mt-2">Innovating future technology to enhance global solutions.</p>

        {/* About the company */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold">About Us</h2>
          <p className="mt-1">
            Startup Company is a leading provider of innovative solutions in the tech industry, specializing in developing advanced software and technologies that drive progress and efficiency.
          </p>
        </div>

        {/* Key Achievements */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Key Achievements</h2>
          <ul className="list-disc pl-5 mt-1">
            <li>Winner of the 2023 Tech Innovators Award.</li>
            <li>Partnership with major industry leaders in technology.</li>
            <li>Expansion to over 40 countries worldwide.</li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Contact Us</h2>
          <p className="mt-1">Email: contact@startupcompany.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
