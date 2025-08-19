// src/components/StartupMainForm.jsx
import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaCheck,
  FaHome,
  FaClipboardList,
  FaInfoCircle,
  FaChartBar,
  FaWallet,
  FaUserCheck,
  FaEye,
  FaClipboardCheck,
  FaLock,
  FaPrint,
} from "react-icons/fa";
import UserSignup from "./UserSignup";
import BasicDetailsStep from "./FormSteps/BasicDetailsStep";
import EntityDetailsStep from "./FormSteps/EntityDetailsStep";
import StartupDetailsStep from "./FormSteps/StartupDetailsStep";
import CoFounderDetailsStep from "./FormSteps/CoFounderDetailsStep";
import BusinessIdeaStep from "./FormSteps/BusinessIdeaStep";
import Preview from "./Preview";
import PrintAcknowledgement from "./PrintAcknowledgement";
import FormStatus from "./FormStatus";

const stepLabels = [
  "Register",
  "Basic Details",
  "Entity Details",
  "Startup Details",
  "Co-Founder Details",
  "Business Idea",
  "Preview & Confirm",
  "Print Acknowledgement",
  "Application Status",
];

const icons = [
  <FaUserCheck />,
  <FaHome />,
  <FaClipboardList />,
  <FaInfoCircle />,
  <FaChartBar />,
  <FaWallet />,
  <FaEye />,
  <FaPrint />,
  <FaClipboardCheck />,
];

const StartupMainForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    userSignup: null,
    basicDetails: null,
    entityDetails: null,
    startupDetails: null,
    cofounderDetails: null,
    businessIdea: null,
  });

  const handleStepSubmit = async (stepData, step) => {
    const updatedFormData = { ...formData };

    const storageKeys = [
      "userSignup",
      "basicDetails",
      "entityDetails",
      "startupDetails",
      "cofounderDetails",
      "businessIdea",
    ];

    updatedFormData[storageKeys[step - 1]] = stepData;
    setFormData(updatedFormData);

    if (step === 6) {
      // After completing Business Idea, go to Preview
      setCurrentStep(7);
    } else {
      setCurrentStep(step + 1);
    }
  };

  const handlePrevious = (stepData, step) => {
    handleStepSubmit(stepData, step);
    if (step > 1) setCurrentStep(step - 1);
  };

  const handleTabClick = (stepIndex) => {
    const stepNumber = stepIndex + 1;
    setCurrentStep(stepNumber);
  };

  const submitFullForm = async (data) => {
    console.log("Submitting full form data:", data);
    setIsFormSubmitted(true);
    setCurrentStep(8); // Navigate to Print Acknowledgement after submission
  };

  const handleFormSubmit = () => {
    submitFullForm(formData);
  };

  const renderStep = () => {
    const stepKeys = [
      "userSignup",
      "basicDetails",
      "entityDetails",
      "startupDetails",
      "cofounderDetails",
      "businessIdea",
      "preview",
      "printAck",
      "formStatus",
    ];
    const props = {
      onSubmit: (values) => handleStepSubmit(values, currentStep),
      initialValues: formData[stepKeys[currentStep - 1]],
      onPrevious:
        currentStep > 1
          ? (values) => handlePrevious(values, currentStep)
          : undefined,
    };

    switch (currentStep) {
      case 1:
        return <UserSignup {...props} />;
      case 2:
        return <BasicDetailsStep {...props} />;
      case 3:
        return <EntityDetailsStep {...props} />;
      case 4:
        return <StartupDetailsStep {...props} />;
      case 5:
        return <CoFounderDetailsStep {...props} />;
      case 6:
        return <BusinessIdeaStep {...props} />;
      case 7:
        return (
          <Preview
            {...props}
            formData={formData}
            onFormSubmit={handleFormSubmit}
          />
        );
      case 8:
        return <PrintAcknowledgement formData={formData} />;
      case 9:
        return <FormStatus {...props} />;
      default:
        return null;
    }
  };

  const gray = "#94A3B8";

  return (
    <div
      className="min-h-screen w-full px-10 py-10 bg-cover bg-center"
      style={{ backgroundImage: `url('/bg1.jpg')` }}
    >
      <div className="flex w-full h-[80vh] rounded-3xl overflow-hidden shadow-2xl bg-white/20 backdrop-blur-sm">
        {/* Left Sidebar */}
        <div className="w-1/5 bg-white/30 backdrop-blur-md p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/favicon_full.png"
                alt="Logo"
                className="w-10 h-10 rounded-full"
              />
              <h2 className="text-xl font-semibold text-gray-800">
                Startup Bihar
              </h2>
            </div>

            <div className="mb-8">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="font-semibold text-gray-800">Abhishek Kumar</p>
            </div>

            <nav className="flex flex-col gap-2 text-gray-700 font-medium">
              {stepLabels.map((label, index) => {
                const stepNumber = index + 1;
                const isActive = currentStep === stepNumber;
                const isCompleted = (() => {
                  switch (stepNumber) {
                    case 1:
                      return formData.userSignup !== null;
                    case 2:
                      return formData.basicDetails !== null;
                    case 3:
                      return formData.entityDetails !== null;
                    case 4:
                      return formData.startupDetails !== null;
                    case 5:
                      return formData.cofounderDetails !== null;
                    case 6:
                      return formData.businessIdea !== null;
                    case 7:
                      return false; // Preview is never "completed"
                    case 8:
                      return false; // Form Status is never "completed"
                    default:
                      return false;
                  }
                })();

                // Check if step is locked
                // Step 1 (Register & Verify) is always unlocked
                // Steps 2-7 (Basic Details to Preview) unlock after completing registration
                // Step 8 (Form Status) unlocks only after form submission
                const isLocked = (() => {
                  if (stepNumber === 1) {
                    return false; // Register & Verify is always unlocked
                  } else if (stepNumber >= 2 && stepNumber <= 7) {
                    return formData.userSignup === null; // Unlock after registration
                  } else if (stepNumber === 8) {
                    // Print Acknowledgement unlocks after submission
                    return !isFormSubmitted;
                  } else if (stepNumber === 9) {
                    // Form Status unlocks after submission
                    return !isFormSubmitted;
                  }
                  return false;
                })();

                return (
                  <button
                    key={index}
                    onClick={() => !isLocked && handleTabClick(index)}
                    disabled={isLocked}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-md transition-all duration-150 ${
                      isActive
                        ? "bg-white text-gray-800 shadow-sm"
                        : isLocked
                        ? "text-gray-400 cursor-not-allowed opacity-60"
                        : "hover:bg-white/20 text-gray-600"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="text-[16px]"
                        style={{
                          color: isLocked ? "#D1D5DB" : gray,
                        }}
                      >
                        {isLocked ? <FaLock /> : icons[index]}
                      </span>
                      <span className="text-sm font-medium">{label}</span>
                    </span>
                    {isCompleted && !isLocked && (
                      <span
                        className="w-5 h-5 flex items-center justify-center rounded-full border text-xs"
                        style={{ color: gray, borderColor: gray }}
                      >
                        <FaCheck />
                      </span>
                    )}
                    {isLocked && (
                      <span className="text-xs text-gray-400">Locked</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="text-sm text-gray-500">
            <a
              href="/contact-us"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 cursor-pointer"
            >
              Support
            </a>
            <p className="hover:text-gray-700 cursor-pointer">Sign Out</p>
          </div>
        </div>

        {/* Main Renderer */}
        <div className="w-4/5 bg-white p-6 flex flex-col">
          <div className="flex-1 overflow-y-auto">{renderStep()}</div>
        </div>
      </div>
    </div>
  );
};

export default StartupMainForm;
