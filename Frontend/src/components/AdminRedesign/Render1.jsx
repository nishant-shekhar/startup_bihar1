// render1.jsx
import React from 'react';
import DashboardPage from './AdityaDashboard/DashboardPage';
import Table from './AdityaDashboard/Table';


const Render1 = ({ activePanel }) => {
  return (
    <div className="flex items-center justify-center h-full px-5">
      {/* <h1 className='text-red-500'>{activePanel}</h1>  */}
      <div className="w-full h-full">
        {activePanel === "Dashboard" && <DashboardPage />}
        {activePanel === "Second Tranche Module" && <Table />}
        {/* Add more conditions for other panels as needed */}
        </div>

    </div>
  );
};

export default Render1;
