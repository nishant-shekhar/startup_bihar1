import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaBuilding, FaUserTie, FaPhoneAlt, FaGlobe, FaHashtag, FaMoneyCheckAlt, FaRocket,
  FaEnvelope, FaFlagCheckered, FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp,
  FaMale, FaFemale,
  FaTwitter
} from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";



const InputField = ({ icon: Icon, label, name, value, onChange, placeholder, readOnly = false }) => (
  <div className="flex flex-col text-xs gap-1">
    <label className="text-gray-600 font-medium">{label}</label>
    <div className={`flex items-center gap-2 px-3 py-2 ${readOnly ? 'bg-gray-100' : 'bg-white/70'} border border-gray-200 rounded-lg shadow-sm`}>
      <Icon className="text-gray-400 text-sm" />
      {readOnly ? (
        <span className="text-sm text-gray-800">{value || "—"}</span>
      ) : (
        <input
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full text-sm bg-transparent outline-none border-none placeholder:text-gray-400"
        />
      )}
    </div>
  </div>
);
const DropdownField = ({ icon: Icon, label, name, value, options, onChange }) => (
  <div className="flex flex-col text-xs gap-1">
    <label className="text-gray-600 font-medium">{label}</label>
    <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
      <Icon className="text-gray-400 text-sm" />
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full text-sm bg-transparent outline-none border-none"
      >
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  </div>
);


const StartupDetailsDialog = ({ data, onClose, onUpdate }) => {
  const [formData, setFormData] = useState(data || {});
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [originalData, setOriginalData] = useState(data || {});
  const navigate = useNavigate(); // Use this for redirection


  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoadingDetails(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`https://startupbihar.in/api/adminlogin/startup/details/${data.user_id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
        setFormData(res.data.startup);
        setOriginalData(res.data.startup);

      } catch (err) {
        console.error("Failed to load startup details", err);
        if (err.response?.status === 403) {
          localStorage.clear(); // Optional: clear invalid token
          navigate("/login");
        }
        console.error("Error status", err.response?.status);
      } finally {
        setIsLoadingDetails(false);
      }
    };
    fetchDetails();
  }, [data]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getChangedFields = (original, updated) => {
    const changed = {};
    for (const key in updated) {
      if (updated[key] !== original[key]) {
        changed[key] = updated[key];
      }
    }
    return changed;
  };
  

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const updatedFields = getChangedFields(originalData, formData);
  
      if (Object.keys(updatedFields).length === 0) {
        alert("No changes to save.");
        return;
      }
  
      await axios.put(
        "https://startupbihar.in/api/adminlogin/update-startup-details",
        { user_id: formData.user_id, ...updatedFields },
        { headers: { Authorization: `${token}` } }
      );
  
      alert("Startup details updated successfully.");
      
      onUpdate();
      onClose();
    } catch (err) {
      console.error("Failed to update startup", err);
      alert("Error updating startup.");
    }
  };
  
  const categories = [
    "Smart Innovations", "Finance", "Technology", "Food", "Art & Entertainment",
    "Logistics", "Edu-tech", "Health", "Retail", "E-comm", "Manufacturing",
    "Environment", "General", "Travel", "All"
  ];

  const handlePasswordReset = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://startupbihar.in/api/adminlogin/reset-user-password",
        { user_id: formData.user_id, newPassword },
        { headers: { Authorization: `${token}` } }
      );
      alert("Password reset successfully");
      setShowPasswordDialog(false);
    } catch (err) {
      console.error("Failed to reset password", err);
      alert("Failed to reset password");
    }
  };

  const renderSection = (title, icon, fields) => (
    <>
      <div className="text-sm text-indigo-600 font-medium mt-6 mb-2 flex items-center gap-2">
        {icon} {title}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field, i) => (
          <InputField key={i} {...field} value={formData[field.name] || ""} onChange={handleChange} />
        ))}
      </div>
    </>
  );

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-6 scrollbar-none"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src={formData.logo || "https://media.istockphoto.com/id/924915448/vector/startup-icon-simple-element-illustration.jpg?s=612x612&w=0&k=20&c=CQhjbpi6bX9F8Ajv8ZT2xEgpuCHaO_4UQ4mb1tHJJwE="} className="w-12 h-12 rounded-full border border-white shadow-lg" alt="Logo" />
            <h2 className="text-base font-semibold text-gray-700">{formData.company_name || "Edit Startup Details"}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-600 hover:bg-gray-200">
            <MdCancel size={20} />
          </button>
        </div>

        {renderSection("Basic Info", <FaCircleInfo />, [
          { icon: FaBuilding, label: "Company Name", name: "company_name", placeholder: "e.g. Tech Nova" },
          { icon: FaUserTie, label: "Founder's Name", name: "founder_name", placeholder: "e.g. John Smith" },
          { icon: FaPhoneAlt, label: "Phone Number", name: "mobile", placeholder: "e.g. +91 98765 43210" },
          { icon: FaEnvelope, label: "Email ID", name: "email", placeholder: "e.g. email@example.com" },
          { icon: FaHashtag, label: "Registration No.", name: "registration_no", placeholder: "e.g. SB12345678", readOnly: true },
          { icon: FaGlobe, label: "Website", name: "website", placeholder: "e.g. www.startup.com" },
        ])}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <DropdownField
            icon={FaFlagCheckered}
            label="Category"
            name="category"
            value={formData.category || ""}
            onChange={handleChange}
            options={[
              { value: "", label: "Select Category" },
              ...categories.map((category) => ({ value: category, label: category })),
            ]}
          />

          <DropdownField
            icon={FaFlagCheckered}
            label="Top Startup"
            name="topStartup"
            value={formData.topStartup ? "true" : "false"}
            onChange={(e) => setFormData(prev => ({ ...prev, topStartup: e.target.value === "true" }))}
            options={[
              { value: "true", label: "Yes" },
              { value: "false", label: "No" },
            ]}
          />
        </div>
      
         {/* Gender */}
         <div className="grid grid-flow-col mt-6 auto-cols-max gap-2 text-xs text-indigo-600 rounded-lg items-center">
          {formData.gender === "female" ? (
            <div className="flex items-center gap-1 bg-pink-400 text-white px-2 py-1 rounded-md">
              <FaFemale className="w-4 h-4" /> Female
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-blue-400 text-white px-2 py-1 rounded-md">
              <FaMale className="w-4 h-4" /> Male
            </div>
          )}
        </div>
        {isLoadingDetails && (
  <div className="text-xs text-gray-500 italic mb-4 ml-1 flex flex-1 justify-center">Fetching more details...</div>
)}
        {renderSection("Company Info", <FaBuilding />, [
          { icon: FaFlagCheckered, label: "About", name: "about", placeholder: "Company description" },
          { icon: FaFlagCheckered, label: "Motto", name: "moto", placeholder: "Company motto"  },
          { icon: FaFlagCheckered, label: "Startup Since", name: "startup_since", placeholder: "e.g. 2021" },
          { icon: FaFlagCheckered, label: "Date of Incorporation", name: "dateOfIncorporation", placeholder: "DD-MM-YYYY" },
          { icon: FaFlagCheckered, label: "CIN", name: "cin", placeholder: "e.g. U12345BR2022PTC123456" },
          { icon: FaFlagCheckered, label: "District ROC", name: "districtRoc", placeholder: "e.g. Patna" },
          { icon: FaFlagCheckered, label: "Address", name: "address", placeholder: "Registered address" },
          { icon: FaFlagCheckered, label: "DPIIT Certificate", name: "dpiitCert", placeholder: "Enter Link of Certificate" },



        ])}

        {renderSection("Financial Info", <FaMoneyCheckAlt />, [
          { icon: FaRocket, label: "Seed Fund", name: "seedFundAmount", placeholder: "e.g. ₹4,00,000" },
          { icon: FaRocket, label: "Second Tranche", name: "secondTrancheAmount", placeholder: "e.g. ₹6,00,000" },
          { icon: FaRocket, label: "Post Seed", name: "postSeedAmount", placeholder: "e.g. ₹15,00,000" },
          { icon: FaMoneyCheckAlt, label: "Matching Loan", name: "matchingLoanAmount", placeholder: "e.g. ₹10,00,000" },
          { icon: FaMoneyCheckAlt, label: "Revenue Last Year", name: "revenueLY", placeholder: "e.g. ₹50,00,000" },
          { icon: FaMoneyCheckAlt, label: "Employee Count", name: "employeeCount", placeholder: "e.g. 12" },
        ])}

        {/* Social Media Links */}
        {renderSection("Social Media", <FaLinkedinIn />, [
          { icon: FaFacebookF, label: "Facebook", name: "facebook", placeholder: "Facebook URL", readOnly: true  },
          { icon: FaInstagram, label: "Instagram", name: "instagram", placeholder: "Instagram URL", readOnly: true  },
          { icon: FaLinkedinIn, label: "LinkedIn", name: "linkedin", placeholder: "LinkedIn URL", readOnly: true  },
          { icon: FaTwitter, label: "Twitter", name: "twitter", placeholder: "Twitter URL" , readOnly: true },
        ])}

       

        {/* Action Buttons */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <button onClick={onClose} className="py-3 w-full text-sm font-medium rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm">Cancel</button>
          <button onClick={handleUpdate} className="py-3 w-full text-sm font-medium rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg flex items-center justify-center gap-2">
            <FaSave size={16} /> Save Changes
          </button>
          <button onClick={() => setShowPasswordDialog(true)} className="py-3 w-full text-sm font-medium rounded-xl bg-red-600 text-white hover:bg-red-700 shadow-lg">Reset Password</button>
        </div>

        {/* Reset Password Dialog */}
        {showPasswordDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">Reset Password</h3>
              <input
                type="text"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowPasswordDialog(false)} className="text-gray-600">Cancel</button>
                <button onClick={handlePasswordReset} className="bg-indigo-600 text-white px-4 py-2 rounded">Set Password</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupDetailsDialog;
