import React from 'react';
import { Helmet } from 'react-helmet';
import Startupfinanceandemployee from './startupfinanceandemployee';
import Applytranche from './applytranche';
import Query1 from './query1';
import GrievanceContainer from './grievance-container';

const UserProfile = (props) => {
  return (
    <div className="flex flex-col h-screen overflow-auto items-start justify-start p-4">
      <Helmet>
        <title>Startup Bihar Portal</title>
        <meta property="og:title" content="Startup Bihar Portal" />
      </Helmet>

      {/* Main Content Area */}
      <div className="flex-1 ml-4">
        {/* Row 1: Startup Finance */}
        <div className="flex items-start mb-6 space-x-6">
          {/* Startup Finance Section */}
          <div className="flex flex-col items-start">
            <Startupfinanceandemployee
              text={<span className="text-gray-800 text-sm font-medium">Employee</span>}
              text1={<span className="text-gray-400 text-xs font-medium">See All</span>}
              text2={<span className="text-white text-xs">Total</span>}
              text3={<span className="text-white text-lg font-bold">₹ 10,00,000</span>}
              text4={<span className="text-gray-800 text-xs">Invested</span>}
              text5={<span className="text-gray-800 text-lg font-bold">₹ 4,50,000</span>}
              text6={<span className="text-gray-800 text-xs">45%</span>}
            />
          </div>

          {/* About Company Section */}
          <div className="flex flex-col w-[45%] h-full">
            <h3 className="text-gray-800 text-lg font-semibold mb-2">About Company</h3>
            <textarea
              className="w-full p-4 h-40 bg-slate-100 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="Write about the company here..."
            />
          </div>
        </div>

        {/* Row 2: Nested Row with Three Columns */}
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row w-full items-start justify-between">
          {/* Column 1: Upload Bills and Grievance Redressal */}
          <div className="flex-1 flex flex-col items-start bg-slate-100 p-4 rounded-md shadow-md mr-4">
            <h3 className="text-gray-800 text-lg mb-4">Upload Your Bills</h3>
            <div className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-400 text-white p-4 rounded-lg shadow-md">
              <h4 className="text-sm font-semibold">Add New Bills</h4>
              <p className="mt-2 text-xs">Keep track of the bills and investments</p>
              <button className="mt-4 px-4 py-2 text-sm font-semibold rounded-lg bg-white text-purple-600 hover:bg-gray-100">
                ADD
              </button>
            </div>
            <h3 className="text-gray-800 text-lg mt-8">Grievance Redressal</h3>
            <GrievanceContainer
              text="Enter your grievance here"
              text1="Please describe the issue in detail"
              imageSrc="/external/grievance-image.png"
              imageAlt="Grievance Form Image"
              navigateTo="/grievance"
            />
          </div>

          {/* Column 2: Apply Tranche */}
          <div className="flex-1 flex flex-col items-start bg-slate-100 p-4 rounded-md shadow-md mr-4">
            <h3 className="text-gray-900 text-lg">Upload MPR</h3>
            <Applytranche
              text="MPR"
              text1="Upload MPR for verification"
              navigateTo="/Upload"
            />
            <h3 className="text-gray-900 text-lg mt-8">Post Seed Fund</h3>
            <Applytranche
              text="Apply for Post Seed Fund"
              text1="Fill all the required elements of the form."
              navigateTo="/postseed"
            />
          </div>

          {/* Column 3: Queries */}
          <div className="flex-1 flex flex-col items-start bg-slate-100 p-4 rounded-md shadow-md">
            <h3 className="text-gray-800 text-lg">Queries by Industry Dept</h3>
            <Query1
              text="Query Regarding Employee"
              text1="How many employees do you have employed in September 2024?"
            />
            <Query1
              text="Query Regarding Employee"
              text1="How many employees do you have employed in September 2024?"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
