
      import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import StatusDialog from "./StatusDialog";

const Incubation = ({ onFormSubmitSuccess }) => {
  const [dialogStatus, setDialogStatus] = useState({
    isVisible: false,
    title: "",
    subtitle: "",
    buttonVisible: false,
    status: "",
  });

  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [assignedCenter, setAssignedCenter] = useState(null);
  const [preferences, setPreferences] = useState({
    preference1: "",
    preference2: "",
    preference3: "",
  });
  

  const [selectedValues, setSelectedValues] = useState({
    preference1: "",
    preference2: "",
    preference3: "",
  });

  const incubationCenters = [
    "Chandragupt Institute of Management (CIMP) Patna",
    "Indian Institute of Technology (IIT), Patna",
    "Birla Institute of Technology (BIT), Patna",
    "Bihar Agricultural University (BAU), SABOUR, Bhagalpur",
    "Central Institute of Petrochemicals Engineering & Technology (CIPET), Hajipur",
    "Tool Room & Training Centre (TRTC)",
    "Dr. Rajendra Prasad Central Agricultural University (PUSA), Samastipur",
    "Amity University (AMITY), Patna",
    "Muzaffarpur Institute of Technology (MIT), Muzaffarpur",
    "Development Management Institute (DMI), Patna",
    "National Institute of Electronics & Information Technology (NIELIT), Patna",
    "Chanakya National Law University (CNLU), Patna",
    "National Institute of Technology (NIT), Patna",
    "Footwear Design and Development Institute (FDDI), Patna",
    "Upendra Maharathi Shilp Anusandhan Sansthan (UMSAS), Patna",
    "Indian Institute of Information Technology (IIIT), Bhagalpur",
    "Darbhanga College of Engineering (DCE), Darbhanga",
    "Indian Institute of Management (IIM), Gaya",
    "Software Technology Park of India (STPI), Patna",
    "Aryabhatt Knowledge University (AKU), Patna",
    "Loknayak Jai Prakash Institute of Technology",
  ];

  const validationSchema = Yup.object({
    preference1: Yup.string().required("Select your first preference"),
    preference2: Yup.string().required("Select your second preference"),
    preference3: Yup.string().required("Select your third preference"),
  });

  const formik = useFormik({
    initialValues: {
      preference1: "",
      preference2: "",
      preference3: "",
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post("https://startupbihar.in/api/incubation", values, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        setDialogStatus({
          isVisible: true,
          title: "Form submitted successfully!",
          subtitle: `Your form has been submitted successfully.`,
          buttonVisible: true,
          actionButton: "Ok Thanks",
          status: "success",
        });
        resetForm();
      } catch (error) {
        setDialogStatus({
          isVisible: true,
          title: "Some Error occurred",
          subtitle: `An error occurred during submission.`,
          buttonVisible: true,
          status: "failed",
          actionButton: "Retry Later",
        });
      }
    },
  });

  const handleSelectionChange = (e) => {
    const { name, value } = e.target;
    setSelectedValues((prev) => ({ ...prev, [name]: value }));
    formik.setFieldValue(name, value);
  };

  const getFilteredOptions = (excludeValues) => {
    return incubationCenters.filter((center) => !excludeValues.includes(center));
  };

  const goBacktoHome = () => {
    setDialogStatus({ ...dialogStatus, isVisible: false });
    onFormSubmitSuccess();
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get("https://startupbihar.in/api/incubation/status", {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
  
        const doc = res.data?.document;
        const docStatus = doc?.documentStatus;
        const comment = doc?.comment;
  
        setCurrentStatus(docStatus);
        setAssignedCenter(comment);
        if (docStatus) {
          setIsAlreadyApplied(true);
          setPreferences({
            preference1: doc.preference1,
            preference2: doc.preference2,
            preference3: doc.preference3,
          });
        }
      } catch (err) {
        console.error("Error checking status", err);
      } finally {
        setIsCheckingStatus(false);
      }
    };
  
    fetchStatus();
  }, []);
  

  return (
    <div className="overflow-x-hidden">
  <div className="relative w-full h-[250px]">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" width="1440" height="250" preserveAspectRatio="none" viewBox="0 0 1440 250">
          <g mask="url(#SvgjsMask1000)" fill="none">
            <rect width="1440" height="250" x="0" y="0" fill="#0e2a47"></rect>
            <path d="M38 250L288 0L538.5 0L288.5 250z" fill="url(#SvgjsLinearGradient1001)"></path>
            <path d="M244.60000000000002 250L494.6 0L647.6 0L397.6 250z" fill="url(#SvgjsLinearGradient1001)"></path>
            <path d="M490.20000000000005 250L740.2 0L911.2 0L661.2 250z" fill="url(#SvgjsLinearGradient1001)"></path>
            <path d="M728.8000000000001 250L978.8000000000001 0L1289.3000000000002 0L1039.3000000000002 250z" fill="url(#SvgjsLinearGradient1001)"></path>
            <path d="M1406 250L1156 0L982 0L1232 250z" fill="url(#SvgjsLinearGradient1002)"></path>
            <path d="M1199.4 250L949.4000000000001 0L749.9000000000001 0L999.9000000000001 250z" fill="url(#SvgjsLinearGradient1002)"></path>
            <path d="M940.8 250L690.8 0L375.79999999999995 0L625.8 250z" fill="url(#SvgjsLinearGradient1002)"></path>
            <path d="M704.1999999999999 250L454.19999999999993 0L146.69999999999993 0L396.69999999999993 250z" fill="url(#SvgjsLinearGradient1002)"></path>
            <path d="M1205.2767553797382 250L1440 15.276755379738262L1440 250z" fill="url(#SvgjsLinearGradient1001)"></path>
            <path d="M0 250L234.72324462026174 250L 0 15.276755379738262z" fill="url(#SvgjsLinearGradient1002)"></path>
          </g>
          <defs>
            <mask id="SvgjsMask1000">
              <rect width="1440" height="250" fill="#ffffff"></rect>
            </mask>
            <linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="SvgjsLinearGradient1001">
              <stop stop-color="rgba(15, 70, 185, 0.2)" offset="0"></stop>
              <stop stop-opacity="0" stop-color="rgba(15, 70, 185, 0.2)" offset="0.66"></stop>
            </linearGradient>
            <linearGradient x1="100%" y1="100%" x2="0%" y2="0%" id="SvgjsLinearGradient1002">
              <stop stop-color="rgba(15, 70, 185, 0.2)" offset="0"></stop>
              <stop stop-opacity="0" stop-color="rgba(15, 70, 185, 0.2)" offset="0.66"></stop>
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute top-9 left-0 w-full p-6 text-white">
          <h1 className="text-3xl font-bold mb-2 relative top-10">Apply for Incubation</h1>
          <p className="text-lg max-w-xl relative top-10">
          
          </p>
        </div>
      </div>

      <div className="w-full rounded-lg p-10 flex justify-center items-center align-middle mt-10">
        {isCheckingStatus ? (
          <div className="text-center text-gray-600 text-lg">Checking your incubation status...</div>
        ) : isAlreadyApplied && currentStatus === "Accepted" ? (
          <div className="text-center text-green-700 text-xl font-semibold space-y-2">
            <p>Your application has been <span className="text-green-900 font-bold">Accepted</span>.</p>
            <p>✅ Allotted Incubation Center:</p>
            <p className="text-indigo-600 font-bold">{assignedCenter}</p>
          </div>
        ) : isAlreadyApplied ? (
          <div className="text-left text-yellow-800 bg-yellow-50 border border-yellow-200 p-4 rounded-md max-w-md space-y-2">
            <p className="font-semibold">You have already applied for incubation.</p>
            <p>📄 <strong>Status:</strong> {currentStatus === "created" ? "Applied" : currentStatus}</p>
            <p><strong>Preference 1:</strong> {preferences.preference1}</p>
            <p><strong>Preference 2:</strong> {preferences.preference2}</p>
            <p><strong>Preference 3:</strong> {preferences.preference3}</p>
          </div>

      
        ) : (
          <form onSubmit={formik.handleSubmit} className="w-full max-w-md space-y-6">
            {/* Preference 1 */}
            <div className="mb-4">
              <label htmlFor="preference1" className="block font-medium">
                Select Incubation Center Preference 1
              </label>
              <select
                id="preference1"
                name="preference1"
                value={selectedValues.preference1}
                onChange={handleSelectionChange}
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              >
                <option value="">Select</option>
                {incubationCenters.map((center) => (
                  <option key={center} value={center}>
                    {center}
                  </option>
                ))}
              </select>
              {formik.errors.preference1 && (
                <div className="text-red-600">{formik.errors.preference1}</div>
              )}
            </div>

            {/* Preference 2 */}
            <div className="mb-4">
              <label htmlFor="preference2" className="block font-medium">
                Select Incubation Center Preference 2
              </label>
              <select
                id="preference2"
                name="preference2"
                value={selectedValues.preference2}
                onChange={handleSelectionChange}
                disabled={!selectedValues.preference1}
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              >
                <option value="">Select</option>
                {getFilteredOptions([selectedValues.preference1]).map((center) => (
                  <option key={center} value={center}>
                    {center}
                  </option>
                ))}
              </select>
              {formik.errors.preference2 && (
                <div className="text-red-600">{formik.errors.preference2}</div>
              )}
            </div>

            {/* Preference 3 */}
            <div className="mb-4">
              <label htmlFor="preference3" className="block font-medium">
                Select Incubation Center Preference 3
              </label>
              <select
                id="preference3"
                name="preference3"
                value={selectedValues.preference3}
                onChange={handleSelectionChange}
                disabled={!selectedValues.preference2}
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              >
                <option value="">Select</option>
                {getFilteredOptions([selectedValues.preference1, selectedValues.preference2]).map((center) => (
                  <option key={center} value={center}>
                    {center}
                  </option>
                ))}
              </select>
              {formik.errors.preference3 && (
                <div className="text-red-600">{formik.errors.preference3}</div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Submit
              </button>
            </div>
          </form>
        )}

        {/* Final Submission Dialog */}
        <StatusDialog
          isVisible={dialogStatus.isVisible}
          title={dialogStatus.title}
          subtitle={dialogStatus.subtitle}
          buttonVisible={dialogStatus.buttonVisible}
          onClose={goBacktoHome}
          status={dialogStatus.status}
        />
      </div>
    </div>
  );
};

export default Incubation;
