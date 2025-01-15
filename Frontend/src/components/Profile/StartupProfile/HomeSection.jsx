import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import StatusDialog from "../../UserForm/StatusDialog";
import UpdateSocialMediaURL from "./FieldsUpdate/UpdateUserField";
import ShowcaseCard from "../PublicProfile/ShowcaseCard";
import UpdateMetrics from "./FieldsUpdate/UpdateMetrics";
import UpdateEmployees from "./FieldsUpdate/updateEmployees";
import EmployeeDetails from "./FieldsUpdate/EmployeeDetails";
import UserNotification from "../../Userform/UserNotification";

// Icons
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaGlobe, FaPlus } from "react-icons/fa";
import { IoPencil } from "react-icons/io5";

// <-- Import the new popup component
import ShowcasePopup from "./FieldsUpdate/AddNewShowcase";

const HomeSection = () => {
  const [startup, setStartup] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showcases, setShowcases] = useState([]);

  // Popups & Dialogs
  const [isContactVisible, setIsContactVisible] = useState(false);
  const [statusPopup, setStatusPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [buttonVisible, setButtonVisible] = useState(true);
  const [isSuccess, setIsSuccess] = useState(""); // "success" | "failed" | "uploading"
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Showcase");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  // UI states
  const [selectedPlatform, setSelectedPlatform] = useState(false);
  const [showUpdateMetrics, setShowUpdateMetrics] = useState(false);
  const [showUpdateEmployees, setShowUpdateEmployees] = useState(false);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);

  // Misc
  const [updateCount, setUpdateCount] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileInputRef = useRef(null);

  // For the category tabs
  const categories = ["Showcase", "Notifications", "Action History"];
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // File Selector
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue("imgUrl", file);
      setUploadedFileName(file.name);
    }
  };

  // Fetch data on mount or when updateCount changes
  const fetchDetails = async () => {
    try {
      const [detailsResponse, showcasesResponse, employeesResponse] =
        await Promise.all([
          axios.get(
            `https://startupbihar.in/api/userlogin/startup-details?user_id=${localStorage.getItem("user_id")}`
          ),
          axios.get(
            `https://startupbihar.in/api/showcase/get-showcase/${localStorage.getItem("user_id")}`
          ),
         axios.get(`https://startupbihar.in/api/userlogin/getEmployees/${localStorage.getItem("user_id")}`),

        ]);


      setStartup(detailsResponse.data.startup);
      setShowcases(showcasesResponse.data.showcase || []);
      setEmployees(employeesResponse.data.employee || []);

      //console.log("Startup details:", detailsResponse.data.startup);
      //console.log("Showcases:", showcasesResponse.data.showcase);
      console.log(employeesResponse.data.employee);
      console.log(employees)
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [updateCount]);

  return (
    <div className="h-screen overflow-y-auto">
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-100">
        {/* ---------------------- NAVIGATION ---------------------- */}
        <nav className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div className="text-purple-600 font-semibold">✦</div>
            <a href="/" className="font-semibold">
              Startup Bihar
            </a>
          </div>
        </nav>

        {/* ---------------------- COVER IMAGE ---------------------- */}
        <img
          src={startup.founder_dp || "https://firebasestorage.googleapis.com/v0/b/iimv-ae907.appspot.com/o/Website%2Fcover_pic.png?alt=media&token=2f48030e-daa7-4e20-80c5-218bd6a93a25"}
          className="w-full h-52 object-cover"
          alt="Cover Pic"
        />

        {/* ---------------------- PROFILE SECTION ---------------------- */}
        <div className="px-4">
          <div className="flex md:flex-row items-start">
            {/* Profile Image */}
            <div className="rounded-3xl overflow-hidden w-5/12">
              <img
                src={startup.logo || "default-logo.png"}
                alt="Profile"
                className="mt-3 mx-2 object-cover rounded-3xl border-8 border-gray-200/30"
              />
            </div>

            {/* Info & Stats */}
            <div className="flex pl-8 max-w-screen-lg w-screen ml-5 justify-between py-8">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold">
                    {startup.company_name}
                  </h1>
                  <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full flex items-center">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Top Startup
                  </span>
                </div>
                <div className="text-lg mt-1">{startup.moto}</div>
                <p className="text-gray-600">
                  {startup.founder_name} (Founder)
                </p>

                {/* Contact & Website Buttons */}
                <div className="flex gap-3 mb-2 mt-5">
                  <button
                    className="px-6 py-2 bg-black text-white rounded-lg"
                    onClick={() => setIsContactVisible(true)}
                  >
                    Contact
                  </button>
                  <a
                    href={startup.website || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 border border-gray-300 rounded-lg"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            </div>

            {/* Stats & Social */}
            <div className="py-10 pr-4 w-3/4">
              {/* Stats Row */}
              <div className="flex justify-between items-center gap-3">
                <div className="text-center">
                  <div className="text-xl font-semibold">
                    {startup.employeeCount || 0}
                  </div>
                  <div className="text-gray-600">Employees</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold">
                    {startup.revenueLY || 0}
                  </div>
                  <div className="text-gray-600">Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold">
                    {startup.projects || 0}
                  </div>
                  <div className="text-gray-600">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold">
                    {startup.workOrders || 0}
                  </div>
                  <div className="text-gray-600">Orders</div>
                </div>
                {/* Pencil icon to update stats */}
                <div>
                  <button type="button" onClick={() => setShowUpdateMetrics(true)}>
                    <IoPencil className="h-5 w-auto mt-2 pr-1" />
                  </button>
                </div>
                {showUpdateMetrics && (
                  <UpdateMetrics
                    startup={startup}
                    onClose={() => setShowUpdateMetrics(false)}
                    onUpdate={() => setUpdateCount(updateCount + 1)}
                  />
                )}
              </div>

              {/* Social Links */}
              <div className="flex gap-6 mt-4">
                <a href={startup.twitter || "#"} target="_blank" rel="noopener noreferrer">
                  <FaTwitter className="text-4xl cursor-pointer hover:text-blue-500" />
                </a>
                <a href={startup.facebook || "#"} target="_blank" rel="noopener noreferrer">
                  <FaFacebook className="text-4xl cursor-pointer hover:text-blue-700" />
                </a>
                <a href={startup.instagram || "#"} target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="text-4xl cursor-pointer hover:text-pink-500" />
                </a>
                <a href={startup.linkedin || "#"} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="text-4xl cursor-pointer hover:text-blue-600" />
                </a>
                <a href={startup.website || "#"} target="_blank" rel="noopener noreferrer">
                  <FaGlobe className="text-4xl cursor-pointer hover:text-green-600" />
                </a>
                <div>
                  <button type="button" onClick={() => setSelectedPlatform(true)}>
                    <IoPencil className="h-5 w-auto mt-2" />
                  </button>
                </div>
              </div>

              {/* Employee Avatars */}
              <div className="flex w-full">
                <div
                  className=" -space-x-2 overflow-hidden mt-4 flex justify-end"
                  onClick={() => setShowEmployeeDetails(true)}
                >
                  {employees && employees.length > 0 ? (
                    employees.map((employee, index) => (
                      <img
                        key={index}
                        alt={employee.name}
                        src={employee.dp}
                        className="inline-block size-10 rounded-full ring-2 ring-white"
                      />
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No employees found</p>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => setShowUpdateEmployees(true)}
                  >
                    <FaPlus className="h-6 w-auto pr-1 mt-6" />
                  </button>
                </div>
              </div>

              {/* Social Media popup */}
              {selectedPlatform && (
                <UpdateSocialMediaURL
                  startup={startup}
                  onPlatformSelect={setSelectedPlatform}
                  onUpdate={() => setUpdateCount(updateCount + 1)}
                />
              )}

              {/* Show Employee Details */}
              {showEmployeeDetails && (
                <EmployeeDetails
                  startup={startup}
                  onClose={() => setShowEmployeeDetails(false)}
                  onUpdate={() => setUpdateCount(updateCount + 1)}
                  deleteBtn={true}
                  userId={localStorage.getItem("user_id")}
                />
              )}

              {/* Update Employees popup */}
              {showUpdateEmployees && (
                <UpdateEmployees
                  startup={startup}
                  onClose={() => setShowUpdateEmployees(false)}
                  onUpdate={() => setUpdateCount(updateCount + 1)}
                />
              )}
            </div>
          </div>
          <hr className="mx-10 border-gray-500/30" />
        </div>

        {/* ---------------------- CATEGORIES SECTION ---------------------- */}
        <div className="mx-5 lg:mx-12 justify-start mt-5 mb-4">
          <div className="border-2 border-white rounded-2xl px-4 py-2 bg-transparent">
            <nav className="justify-start space-x-2">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`py-1 px-4 transition-all duration-300 transform ${selectedCategory === category
                      ? "bg-gray-200 text-[#0E0C22] font-semibold rounded-full scale-105"
                      : "text-[#151334] font-medium hover:text-opacity-70 hover:bg-gray-100 hover:text-[#0E0C22] rounded-full"
                    }`}
                >
                  {category}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* ---------------------- MAIN CONTENT AREA ---------------------- */}
        <div className="mx-5 lg:mx-12 p-6 bg-white shadow rounded-md">
          {/* SHOWCASE TAB */}
          {selectedCategory === "Showcase" && (
            <>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4">
                Showcase
              </h1>
              <hr className="mb-6 border-gray-500/30" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* The "Add New" card */}
                <div className="flex justify-center items-center">
                  <div className="bg-gray-200 shadow-md rounded-lg max-w-sm w-full animate-pulse h-[367px]">
                    <div className="bg-gray-300 h-40 rounded-lg mb-4 mx-5 mt-4"></div>
                    <div className="pl-6">
                      <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                      <div className="bg-gray-300 h-6 rounded w-3/5 mt-4"></div>
                      <div className="bg-gray-300 h-5 rounded w-4/5 mt-4"></div>
                      <button
                        type="button"
                        className="bg-blue-600 py-2 px-5 rounded-md mt-4 text-white"
                        style={{ animation: "none !important" }}
                        onClick={() => setIsPopupVisible(true)}
                      >
                        Add New
                      </button>
                    </div>
                  </div>
                </div>

                {/* Render existing showcases (reverse order) */}
                {[...showcases].reverse().map((showcase, index) => (
                  <ShowcaseCard
                    key={index}
                    imgurl={showcase.picUrl}
                    dateandtime={showcase.date}
                    title={showcase.title}
                    subtitle={showcase.subtitle}
                    tag={showcase.location}
                    projectLink={showcase.projectLink}
                    id={showcase.id}
                  />
                ))}
              </div>
            </>
          )}

          {/* NOTIFICATIONS TAB */}
          {selectedCategory === "Notifications" && (
            <>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4">
                Notifications
              </h1>
              <hr className="mb-3 border-gray-500/30 " />
              <UserNotification />
            </>
          )}

          {/* ACTION HISTORY TAB */}
          {selectedCategory === "Action History" && (
            <>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4">
                Action History
              </h1>
              <hr className="mb-3 border-gray-500/30 " />
              <UserNotification />
            </>
          )}
        </div>



        {/* ---------------------- SHOWCASE POPUP (our new component) ---------------------- */}
        <ShowcasePopup
          isVisible={isPopupVisible}
          onClose={() => setIsPopupVisible(false)}
          setTitle={setTitle}
          setSubtitle={setSubtitle}
          setButtonVisible={setButtonVisible}
          setStatusPopup={setStatusPopup}
          setIsSuccess={setIsSuccess}
          setIsPopupVisible={setIsPopupVisible}
          uploadedFileName={uploadedFileName}
          openFileSelector={openFileSelector}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
        />

        {/* ---------------------- CONTACT POPUP ---------------------- */}
        {isContactVisible && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg border border-white border-opacity-30 w-5/12 p-8 rounded-lg shadow-lg">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                onClick={() => setIsContactVisible(false)}
              >
                &times;
              </button>
              <h1 className="text-2xl font-bold">{startup.company_name}</h1>
              <h1 className="mb-3">{startup.about}</h1>
              <h2 className="text-xl font-semibold ">Contact:</h2>
              <p>
                <strong>Phone:</strong>{" "}
                <a href={`tel:${startup.mobile}`} className="text-blue-600">
                  {startup.mobile || "N/A"}
                </a>
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <a
                  href={startup.website || "#"}
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {startup.website || "#"}
                </a>
              </p>
             {/*  <p>
                <strong>Address:</strong> {/* Insert address logic if available
              </p>
               */}
            </div>
          </div>
        )}

        {/* ---------------------- GENERIC DIALOG ---------------------- */}
        {showDialog && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="bg-white p-4 rounded shadow-lg z-10">
              <p>{dialogMessage}</p>
            </div>
          </div>
        )}
      </div>
      {/* ---------------------- STATUS DIALOG ---------------------- */}
      <StatusDialog
        isVisible={statusPopup}
        title={title}
        subtitle={subtitle}
        buttonVisible={buttonVisible}
        status={isSuccess}
        onClose={() => setStatusPopup(false)}
      />
    </div>
  );
};

export default HomeSection;
