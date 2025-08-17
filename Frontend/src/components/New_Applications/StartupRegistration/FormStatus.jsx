import React, { useState } from "react";
import {
  FaCheck,
  FaClock,
  FaFileAlt,
  FaUsers,
  FaPen,
  FaUserTie,
  FaTrophy,
} from "react-icons/fa";

const FormStatus = ({ onPrevious }) => {
  // Mock data - you can replace this with actual data from props or API
  const [timelineStatus, setTimelineStatus] = useState({
    formSubmitted: { completed: true, date: "2024-11-15" },
    stageOneAccepted: { completed: true, date: "2024-11-18" },
    expertPanelReview: { completed: false, date: null },
    writtenExam: { completed: false, date: null },
    personalInterview: { completed: false, date: null },
    startupRecognised: { completed: false, date: null },
  });

  const timelineSteps = [
    {
      key: "formSubmitted",
      title: "Form Submitted",
      icon: <FaFileAlt />,
      description: "Application form submitted successfully",
    },
    {
      key: "stageOneAccepted",
      title: "Accepted on Stage 1",
      icon: <FaCheck />,
      description: "Initial review completed and accepted",
    },
    {
      key: "expertPanelReview",
      title: "Expert Panel Review",
      icon: <FaUsers />,
      description: "Business plan reviewed by expert panel",
    },
    {
      key: "writtenExam",
      title: "Written Exam",
      icon: <FaPen />,
      description: "Technical and business knowledge assessment",
    },
    {
      key: "personalInterview",
      title: "Personal Interview (PI)",
      icon: <FaUserTie />,
      description: "Face-to-face interview with evaluation committee",
    },
    {
      key: "startupRecognised",
      title: "Startup Successfully Recognised",
      icon: <FaTrophy />,
      description: "Congratulations! Your startup is now officially recognised",
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Application Status
        </h2>
        <p className="text-gray-600">Track your startup recognition journey</p>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

        {timelineSteps.map((step, index) => {
          const status = timelineStatus[step.key];
          const isCompleted = status.completed;
          const isLast = index === timelineSteps.length - 1;

          return (
            <div key={step.key} className="relative flex items-start mb-8">
              {/* Timeline dot */}
              <div
                className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 
                  ${
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-gray-200 border-gray-300 text-gray-500"
                  }`}
              >
                {isCompleted ? <FaCheck className="text-xl" /> : step.icon}
              </div>

              {/* Content */}
              <div className="ml-6 flex-1">
                <div
                  className={`p-6 rounded-lg shadow-sm border-l-4 
                  ${
                    isCompleted
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3
                      className={`text-xl font-semibold 
                      ${isCompleted ? "text-green-800" : "text-gray-600"}`}
                    >
                      {step.title}
                    </h3>
                    {isCompleted && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Completed
                      </span>
                    )}
                    {!isCompleted && (
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <FaClock className="mr-1" /> Pending
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-sm mb-2 
                    ${isCompleted ? "text-green-700" : "text-gray-600"}`}
                  >
                    {step.description}
                  </p>

                  {status.date && (
                    <div
                      className={`text-sm font-medium 
                      ${isCompleted ? "text-green-600" : "text-gray-500"}`}
                    >
                      Completed on: {formatDate(status.date)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Summary */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Progress Summary
        </h3>
        <div className="flex items-center">
          <div className="flex-1 bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${
                  (Object.values(timelineStatus).filter((s) => s.completed)
                    .length /
                    timelineSteps.length) *
                  100
                }%`,
              }}
            ></div>
          </div>
          <span className="ml-4 text-blue-800 font-medium">
            {Object.values(timelineStatus).filter((s) => s.completed).length} of{" "}
            {timelineSteps.length} stages completed
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        {onPrevious && (
          <button
            type="button"
            onClick={() => onPrevious()}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← Previous
          </button>
        )}
        <div></div> {/* Spacer */}
      </div>
    </div>
  );
};

export default FormStatus;
