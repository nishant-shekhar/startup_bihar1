import React from "react";
import { useLanguage } from "./SSULanguageContext";

const SSULanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-3 bg-white rounded-full shadow-md px-4 py-2 border border-gray-200">
      <span
        className={`text-sm font-medium transition-colors ${
          language === "en" ? "text-indigo-600" : "text-gray-500"
        }`}
      >
        English
      </span>
      <button
        onClick={toggleLanguage}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        style={{ backgroundColor: language === "en" ? "#6366f1" : "#f97316" }}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            language === "en" ? "translate-x-1" : "translate-x-6"
          }`}
        />
      </button>
      <span
        className={`text-sm font-medium transition-colors ${
          language === "hi" ? "text-orange-600" : "text-gray-500"
        }`}
      >
        हिंदी
      </span>
    </div>
  );
};

export default SSULanguageToggle;
