import React, { useState, useEffect } from "react";
import axios from 'axios';

const StartupDetailsDialog = ({ data, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    await axios.put('/api/admin/update-startup-details', formData);
    onUpdate();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl overflow-auto max-h-[80vh] shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Edit Startup Details</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Basic Information */}
          <div className="col-span-2 border-b pb-2 font-semibold text-indigo-600">Basic Info</div>
          <input className="input" name="company_name" value={formData.company_name || ''} onChange={handleChange} placeholder="Company Name" />
          <input className="input" name="registration_year" value={formData.registration_year || ''} onChange={handleChange} placeholder="Registration Year" />
          <input className="input" name="startup_since" value={formData.startup_since || ''} onChange={handleChange} placeholder="Startup Since" />

          {/* Contact Information */}
          <div className="col-span-2 border-b pb-2 font-semibold text-indigo-600">Contact Info</div>
          <input className="input" name="email" value={formData.email || ''} onChange={handleChange} placeholder="Email" />
          <input className="input" name="mobile" value={formData.mobile || ''} onChange={handleChange} placeholder="Mobile" />
          <input className="input" name="website" value={formData.website || ''} onChange={handleChange} placeholder="Website" />

          {/* Financial Information */}
          <div className="col-span-2 border-b pb-2 font-semibold text-indigo-600">Financial Info</div>
          <input className="input" type="number" name="matchingLoanAmount" value={formData.matchingLoanAmount || 0} onChange={handleChange} placeholder="Matching Loan Amount" />
          <input className="input" type="number" name="seedFundAmount" value={formData.seedFundAmount || 0} onChange={handleChange} placeholder="Seed Fund Amount" />

          {/* Password */}
          <div className="col-span-2 border-b pb-2 font-semibold text-indigo-600">Security</div>
          <div className="flex gap-2">
            <input type={showPassword ? "text" : "password"} name="password" value={formData.password || ''} onChange={handleChange} className="input flex-1" placeholder="Password" />
            <button className="text-indigo-600" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "View"}
            </button>
          </div>

          {/* Top Startup */}
          <div className="col-span-2">
            <label className="font-semibold">Top Startup:</label>
            <select className="input" name="topStartup" value={formData.topStartup} onChange={handleChange}>
              <option value={true}>True</option>
              <option value={false}>False</option>
            </select>
          </div>

          {/* Address */}
          <div className="col-span-2 border-b pb-2 font-semibold text-indigo-600">Address Info</div>
          <input className="input" name="address" value={formData.address || ''} onChange={handleChange} placeholder="Address" />
          <input className="input" name="districtRoc" value={formData.districtRoc || ''} onChange={handleChange} placeholder="District ROC" />
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button className="btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn-indigo" onClick={handleUpdate}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default StartupDetailsDialog;
