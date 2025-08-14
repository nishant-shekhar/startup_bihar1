import React, { useState, useEffect } from "react";
import BasicDetailsStep from "./FormSteps/BasicDetailsStep";
import EntityDetailsStep from "./FormSteps/EntityDetailsStep";
import StartupDetailsStep from "./FormSteps/StartupDetailsStep";
import CoFounderDetailsStep from "./FormSteps/CoFounderDetailsStep";
import BusinessIdeaStep from "./FormSteps/BusinessIdeaStep";
import { FaCheck } from "react-icons/fa";

const stepLabels = [
	"Basic Details",
	"Entity Details",
	"Startup Details",
	"Co-Founder Details",
	"Business Idea",
];

const StartupDetailsForm = () => {
	const [currentStep, setCurrentStep] = useState(() => {
		const savedStep = localStorage.getItem("currentFormStep");
		return savedStep ? Number.parseInt(savedStep) : 1;
	});

	const [formData, setFormData] = useState(() => {
		const data = {};
		for (let key of ["basicDetails", "entityDetails", "startupDetails", "cofounderDetails", "businessIdea"]) {
			const item = localStorage.getItem(key);
			data[key] = item ? JSON.parse(item) : null;
		}
		return data;
	});

	useEffect(() => {
		localStorage.setItem("currentFormStep", currentStep.toString());
	}, [currentStep]);

	const handleStepSubmit = async (stepData, step) => {
		const updatedFormData = { ...formData };

		const storageKeys = [
			"basicDetails",
			"entityDetails",
			"startupDetails",
			"cofounderDetails",
			"businessIdea",
		];

		updatedFormData[storageKeys[step - 1]] = stepData;
		localStorage.setItem(storageKeys[step - 1], JSON.stringify(stepData));

		setFormData(updatedFormData);

		if (step === 5) {
			try {
				await submitFullForm(updatedFormData);
				clearLocalStorage();
			} catch (error) {
				console.error("Form submission error:", error);
				return;
			}
		} else {
			setCurrentStep(step + 1);
		}
	};

	const handlePrevious = (stepData, step) => {
		handleStepSubmit(stepData, step); // Save before going back
		if (step > 1) setCurrentStep(step - 1);
	};

	const handleTabClick = (stepIndex) => {
		setCurrentStep(stepIndex + 1);
	};

	const clearLocalStorage = () => {
		localStorage.removeItem("currentFormStep");
		for (let key of ["basicDetails", "entityDetails", "startupDetails", "cofounderDetails", "businessIdea"]) {
			localStorage.removeItem(key);
		}
	};

	const submitFullForm = async (data) => {
		console.log("Submitting full form data:", data);
		// your API integration here
	};

	const renderStep = () => {
		const props = {
			onSubmit: (values) => handleStepSubmit(values, currentStep),
			initialValues: formData[Object.keys(formData)[currentStep - 1]],
			onPrevious: currentStep > 1 ? (values) => handlePrevious(values, currentStep) : undefined,
		};

		switch (currentStep) {
			case 1: return <BasicDetailsStep {...props} />;
			case 2: return <EntityDetailsStep {...props} />;
			case 3: return <StartupDetailsStep {...props} />;
			case 4: return <CoFounderDetailsStep {...props} />;
			case 5: return <BusinessIdeaStep {...props} />;
			default: return null;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-purple-100 p-6">
			<div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
				<h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Startup Registration</h1>

				{/* Top Step Tabs */}
				<div className="flex justify-between mb-8 overflow-x-auto space-x-2 sm:space-x-4">
  {stepLabels.map((label, index) => {
    const stepNumber = index + 1;
    const isActive = currentStep === stepNumber;
    const isCompleted = (() => {
      switch (stepNumber) {
        case 1: return formData.basicDetails !== null;
        case 2: return formData.entityDetails !== null;
        case 3: return formData.startupDetails !== null;
        case 4: return formData.cofounderDetails !== null;
        case 5: return formData.businessIdea !== null;
        default: return false;
      }
    })();

    const baseClasses = "flex items-center justify-center text-sm sm:text-base px-4 py-2 rounded-full border font-medium transition-all duration-200";
    const activeClasses = "bg-purple-600 text-white";
    const completedClasses = "bg-green-500 text-white";
    const defaultClasses = "bg-gray-100 text-gray-700 hover:bg-purple-100";

    return (
      <button
        key={index}
        onClick={() => handleTabClick(index)}
        className={`${baseClasses} ${
          isCompleted ? completedClasses : isActive ? activeClasses : defaultClasses
        }`}
      >
        <span className="flex items-center gap-2">
          {isCompleted && <FaCheck className="text-white" />}
          {label}
        </span>
      </button>
    );
  })}
</div>


				{/* Form Step */}
				<div>{renderStep()}</div>
			</div>
		</div>
	);
};

export default StartupDetailsForm;
