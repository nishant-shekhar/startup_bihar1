// render1.jsx
import React from 'react';
import DashboardPage from './AdityaDashboard/DashboardPage';
import Table from './AdityaDashboard/Table';
import NewApplication from './NewApplicationAdmin/NewApplication';
import Response from '../New_Applications/Response';
import ExpertReview from './NewApplicationAdmin/ExpertReview';
import AssignExamDate from './NewApplicationAdmin/AssignExamDate';
import AssignMarks from './NewApplicationAdmin/AssignMarks';
import AssignPIDate from './NewApplicationAdmin/AssignPIDate';
import AssignPIMarks from './NewApplicationAdmin/AssignPIMarks';
import DataAnylatics from './NewApplicationAdmin/DataAnylatics';
import AIReviewSection from './NewApplicationAdmin/AIReviewSection';
import AIReviewOldStyle from './NewApplicationAdmin/AIReviewOldStyle';
import AIReviewedData from './NewApplicationAdmin/AIReviewedData';
import AIReviewedDataNew from './NewApplicationAdmin/AIReviewedDataNew';

const Render1 = ({ activePanel, selectedRowData, onRowClick, onBack }) => {
  const renderContent = () => {
    switch (activePanel) {
      case "Dashboard":
        return <DashboardPage />;

      case "Second Tranche Module":
        return <Table />;

      case "Startup Application":
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

      case "AI Review":
        return (
          <div className="p-6 h-full overflow-y-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">AI Enhanced Review</h1>
            <AIReviewSection />
          </div>
        );

      case "AI Review Old Style":
        return (
          <div className="p-6 h-full overflow-y-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">AI Enhanced Review Old Style</h1>
            <AIReviewOldStyle />
          </div>
        );

      case "AI Reviewed Data":
        return (
          <div className="p-6 h-full overflow-y-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">AI Reviewed Data</h1>
            <AIReviewedData />
          </div>
        );

      case "AI Reviewed Data New":
        return (
          <div className="p-6 h-full overflow-y-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">AI Reviewed Data New</h1>
            <AIReviewedDataNew />
          </div>
        );

      case "Event Management":
        return <div><h1>Event Management Panel</h1></div>;

      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="w-full h-full overflow-hidden">
      {renderContent()}
    </div>
  );
};

export default Render1;