import React, { useState } from "react";
import { useFormik } from "formik";
import userData from "./userDetalis";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "./Navbar/Navbar";

function AdminForm() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [formAccepted, setFormAccepted] = useState(false);
  const { users, userDetails } = userData();
  const [activeTab, setActiveTab] = useState("list");

  const formik = useFormik({
    initialValues: selectedUserId
      ? userDetails[selectedUserId]
      : {
          registrationNo: "",
          founderName: "",
          founderAadharNumber: "",
          cofunderName: "",
          cofunderAadharNumber: "",
          sector: "",
          businessConceptBrief: "",
          mobileNumber: "",
          email: "",
          companyLogo: "",
          websiteLink: "",
          businessCategory: "",
          gender: "",
          dpiitRecognitionNumber: "",
          dippCertificate: "",
          iprApplied: "",
        },
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log("Submitted data:", values);
    },
  });

  const handleAccept = () => {
    if (formik.values.dippCertificate === "") {
      toast.error("Data is missing!");
    } else {
      toast.success("Upload Certificate Accepted");
      setFormAccepted(true);
    }
  };

  const handleReject = () => {
    toast.error("Upload Certificate Rejected");
    setFormAccepted(false);
  };

  const handleFormAccept = () => {
    if (formik.values.registrationNo === "") {
      toast.error("Data is missing!");
    } else {
      toast.success("Form Accepted");
      setFormAccepted(true);
    }
  };

  const handleFormReject = () => {
    toast.error("Form Rejected");
    setFormAccepted(false);
  };

  const handleViewClick = (id) => {
    const userDetails = users.find((user) => user.id === id);
    console.log("Viewing details for:", userDetails);
    setSelectedUserId(id);
    setActiveTab("form");
  };

  return (
    <div className="">
      
    
    <div className=" px-4 sm:px-0 flex h-screen ">
      <div className="w-1/3 border-r p-4">
        <h3 className="text-lg font-mont mb-4">Startup Profile</h3>
        <ul className="p-4 bg-white shadow-md rounded-md space-y-4">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between p-4 border rounded-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border">
                  {user.companyLogo ? (
                    <img
                      src={user.companyLogo}
                      alt={user.companyName || "Company Logo"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-gray-700">
                      {user.companyName ? user.companyName.charAt(0) : "N/A"}
                    </span>
                  )}
                </div>

                <div>
                  <div className="text-lg font-semibold text-gray-800">
                    {user.companyName || (
                      <span className="text-xs">No Name</span>
                    )}
                  </div>

                  <div className="text-sm text-gray-500">
                    Reg No: {user.registrationNumber || "N/A"}
                  </div>
                </div>
              </div>

              <button
                className="px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-full transition-colors duration-200"
                onClick={() => handleViewClick(user.id)}
              >
                <p>&rarr;</p>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        {activeTab === "form" && (
          <div>
            <div className="px-4 sm:px-0">
              <p className="mt-1 max-w-2xl text-lg leading-6 text-gray-500">
                Startup Profile
              </p>
              <div
                className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
                aria-hidden="true"
              >
                <div
                  className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
                  style={{
                    clipPath:
                      "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                  }}
                ></div>
              </div>
              <div
                className="absolute right-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl"
                aria-hidden="true"
              >
                <div
                  className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
                  style={{
                    clipPath:
                      "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                  }}
                ></div>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    Registration No
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.registrationNo}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    Founder Name
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.founderName}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    Founder Aadhar Number
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.founderAadharNumber}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    Co-Funder Name
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.cofunderName}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    Co-Funder Aadhar Number
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.cofunderAadharNumber}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    Sector
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.sector}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    Brief on the Business Concept
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.businessConceptBrief}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    Mobile No
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.mobileNumber}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    Email
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.email}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    Company Logo
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.companyLogo}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    Website Link
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.websiteLink}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    Business Category
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.businessCategory}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    Gender
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.gender}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    DPIIT Recognition Number
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.dpiitRecognitionNumber}
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    DIPP Certificate
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.dippCertificate}
                    <div className="flex mt-2 space-x-2">
                      {!formAccepted && (
                        <button
                          type="button"
                          onClick={handleAccept}
                          className="bg-green-400 text-white px-4 py-2 rounded-md hover:bg-green-500 transition-colors"
                        >
                          ✔
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleReject}
                        className="bg-red-400 text-white px-4 py-2 rounded-md hover:bg-red-500 transition-colors"
                      >
                        ✘
                      </button>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              {!formAccepted && (
                <button
                  type="button"
                  onClick={handleFormAccept}
                  className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  Accept Form
                </button>
              )}

              <button
                type="button"
                onClick={handleFormReject}
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Reject Form
              </button>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </div>
    </div>
  );
}

export default AdminForm;
