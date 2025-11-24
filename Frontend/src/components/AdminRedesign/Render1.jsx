// render1.jsx
import React from 'react';
import DashboardPage from './AdityaDashboard/DashboardPage';
import Table from './AdityaDashboard/Table';
import NewApplication from './NewApplicationAdmin/NewApplication';
import NewApplicationDetail from './NewApplicationAdmin/NewApplicationDetail';
import Response from '../New_Applications/Response';
import ExpertReview from './NewApplicationAdmin/ExpertReview';
import AssignExamDate from './NewApplicationAdmin/AssignExamDate';
import AssignMarks from './NewApplicationAdmin/AssignMarks';
import AssignPIDate from './NewApplicationAdmin/AssignPIDate';
import AssignPIMarks from './NewApplicationAdmin/AssignPIMarks';
import DataAnylatics from './NewApplicationAdmin/DataAnylatics';


const Render1 = ({ activePanel, selectedRowData, onRowClick, onBack }) => {
  const renderContent = () => {
    switch(activePanel) {
      case "Dashboard":
        return <DashboardPage />;
      
      case "Second Tranche Module":
        return <Table />;
      
      case "New Application":
        return selectedRowData ? (
          <Response rowData={selectedRowData} onBack={onBack} />
        ) : (
          <NewApplication onRowClick={onRowClick} /> 
        );
      
      case "Expert Review":
        return <ExpertReview />;
      
      case "Assign Exam Date":
        return <AssignExamDate />;
      
      case "Assign Marks":
        return <AssignMarks />;
      
      case "Assign PI Date":
        return <AssignPIDate />;
      
      case "Assign PI Marks":
        return <AssignPIMarks />;
      
      case "Data Analytics":
        return <DataAnylatics rowData={selectedRowData} onBack={onBack} />;  
      
      case "Event Management":
        return <div><h1>Event Management Panel</h1></div>;
      
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex items-center justify-center h-full px-5">
      <div className="w-full h-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default Render1;
