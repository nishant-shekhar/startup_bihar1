// src/components/StartupMainForm.jsx
import React, { useState } from "react";
import {
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
  FaBars,
  FaTimes,
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
    if (step === 6) setCurrentStep(7);
    else setCurrentStep(step + 1);
  };

  const handlePrevious = (stepData, step) => {
    handleStepSubmit(stepData, step);
    if (step > 1) setCurrentStep(step - 1);
  };

  const handleTabClick = (stepIndex) => {
    const stepNumber = stepIndex + 1;
    setCurrentStep(stepNumber);
    setMobileNavOpen(false);
  };

  const submitFullForm = async (data) => {
    console.log("Submitting full form data:", data);
    setIsFormSubmitted(true);
    setCurrentStep(8);
  };

  const handleFormSubmit = () => submitFullForm(formData);

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
        return <Preview {...props} formData={formData} onFormSubmit={handleFormSubmit} />;
      case 8:
        return <PrintAcknowledgement formData={formData} />;
      case 9:
        return <FormStatus {...props} />;
      default:
        return null;
    }
  };

  const gray = "#94A3B8";

  // helpers for lock/completion states
  const isStepCompleted = (n) => {
    switch (n) {
      case 1: return formData.userSignup !== null;
      case 2: return formData.basicDetails !== null;
      case 3: return formData.entityDetails !== null;
      case 4: return formData.startupDetails !== null;
      case 5: return formData.cofounderDetails !== null;
      case 6: return formData.businessIdea !== null;
      default: return false;
    }
  };
  const isLocked = (n) => {
    if (n === 1) return false;
    if (n >= 2 && n <= 7) return formData.userSignup === null;
    if (n === 8 || n === 9) return !isFormSubmitted;
    return false;
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url('/bg1.jpg')` }}
    >
      {/* Top bar (mobile) */}
      <div className="md:hidden px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/favicon_full.png" alt="Logo" className="w-8 h-8 rounded-full" />
          <div className="font-semibold text-gray-800">Startup Bihar</div>
        </div>
        <button
          onClick={() => setMobileNavOpen(true)}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/70 shadow"
          aria-label="Open menu"
        >
          <FaBars />
        </button>
      </div>

      {/* Card container */}
      <div className="px-4 md:px-10 pb-6 md:py-10">
        <div className="flex flex-col md:flex-row w-full min-h-[calc(100svh-5rem)] md:min-h-[calc(100vh-5rem)] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-white/20 backdrop-blur-sm">
          {/* Sidebar (desktop) */}
          <aside className="hidden md:flex md:w-1/5 bg-white/30 backdrop-blur-md p-6 flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img src="/favicon_full.png" alt="Logo" className="w-10 h-10 rounded-full" />
                <h2 className="text-xl font-semibold text-gray-800">Startup Bihar</h2>
              </div>

              <div className="mb-8">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-800">Abhishek Kumar</p>
              </div>

              <nav className="flex flex-col gap-2 text-gray-700 font-medium">
                {stepLabels.map((label, index) => {
                  const stepNumber = index + 1;
                  const active = currentStep === stepNumber;
                  const locked = isLocked(stepNumber);
                  const completed = isStepCompleted(stepNumber);
                  return (
                    <button
                      key={index}
                      onClick={() => !locked && handleTabClick(index)}
                      disabled={locked}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-md transition-all duration-150 ${
                        active
                          ? "bg-white text-gray-800 shadow-sm"
                          : locked
                          ? "text-gray-400 cursor-not-allowed opacity-60"
                          : "hover:bg-white/20 text-gray-600"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-[16px]" style={{ color: locked ? "#D1D5DB" : gray }}>
                          {locked ? <FaLock /> : icons[index]}
                        </span>
                        <span className="text-sm font-medium line-clamp-1">{label}</span>
                      </span>
                      {completed && !locked && (
                        <span
                          className="w-5 h-5 flex items-center justify-center rounded-full border text-xs"
                          style={{ color: gray, borderColor: gray }}
                        >
                          <FaCheck />
                        </span>
                      )}
                      {locked && <span className="text-xs text-gray-400">Locked</span>}
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
          </aside>

          {/* Mobile slide-in drawer */}
          {mobileNavOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setMobileNavOpen(false)}
              />
              <div className="absolute left-0 top-0 h-full w-[82%] max-w-xs bg-white shadow-xl p-4 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <img src="/favicon_full.png" alt="Logo" className="w-8 h-8 rounded-full" />
                    <div className="font-semibold">Startup Bihar</div>
                  </div>
                  <button
                    onClick={() => setMobileNavOpen(false)}
                    className="w-9 h-9 inline-flex items-center justify-center rounded-full bg-gray-100"
                    aria-label="Close menu"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-600">Welcome back,</p>
                  <p className="font-medium text-gray-800">Abhishek Kumar</p>
                </div>

                <nav className="flex flex-col gap-1 text-gray-700">
                  {stepLabels.map((label, index) => {
                    const stepNumber = index + 1;
                    const active = currentStep === stepNumber;
                    const locked = isLocked(stepNumber);
                    const completed = isStepCompleted(stepNumber);
                    return (
                      <button
                        key={index}
                        onClick={() => !locked && handleTabClick(index)}
                        disabled={locked}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-md ${
                          active ? "bg-gray-100" : "hover:bg-gray-50"
                        } ${locked ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-[16px]" style={{ color: locked ? "#D1D5DB" : gray }}>
                            {locked ? <FaLock /> : icons[index]}
                          </span>
                          <span className="text-sm">{label}</span>
                        </span>
                        {completed && !locked && <FaCheck className="text-gray-400" />}
                      </button>
                    );
                  })}
                </nav>

                <div className="mt-auto pt-4 text-sm text-gray-500 flex items-center justify-between">
                  <a href="/contact-us" className="hover:text-gray-700">Support</a>
                  <span className="hover:text-gray-700">Sign Out</span>
                </div>
              </div>
            </div>
          )}

          {/* Mobile horizontal stepper (quick peek) */}
          <div className="md:hidden bg-white/70 backdrop-blur p-2 border-b border-white/50">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {stepLabels.map((label, i) => {
                const n = i + 1;
                const active = currentStep === n;
                const locked = isLocked(n);
                return (
                  <button
                    key={label}
                    onClick={() => !locked && handleTabClick(i)}
                    disabled={locked}
                    className={`whitespace-nowrap px-3 py-1.5 text-xs rounded-full border ${
                      active
                        ? "bg-black text-white border-black"
                        : locked
                        ? "border-gray-200 text-gray-400"
                        : "border-gray-300 text-gray-700"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Renderer */}
          <main className="w-full md:w-4/5 bg-white p-4 md:p-6 flex flex-col">
            <div className="flex-1 overflow-y-auto">{renderStep()}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default StartupMainForm;
