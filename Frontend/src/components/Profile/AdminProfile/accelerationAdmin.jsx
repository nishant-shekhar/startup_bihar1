import React, { useState } from "react";
import { useFormik } from "formik";
import userData from "./userDetalis";
import toast, { Toaster } from "react-hot-toast";

function accelerationAdmin() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [formAccepted, setFormAccepted] = useState(false);
  const { users, userDetails } = userData();
  const [activeTab, setActiveTab] = useState("list");

  const formik = useFormik({
    initialValues: selectedUserId
      ? userDetails[selectedUserId]
      : {
          hostInstitute: "",
          programName: "",
          programStartDate: "",
          programEndDate: "",
          programWebsite: "",
          founderName: "",
          cofounderName: "",
          feesPerPerson: "",
          travelFare: "",
          totalPersons: "",
          totalFees: "",
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
    <div className="px-4 sm:px-0 flex h-screen ">
      <div className="w-1/3 border-r p-4">
        <h3 className="text-lg font-semibold mb-4">Startup Profile</h3>
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
                className="px-4 py-2 text-lg font-bold text-white bg-blue-500 rounded-full transition-colors duration-200"
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
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
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
            </div>

            <div className="mt-6 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    Name of the Host Institute/Organisation
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.hostInstitute}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    Name of Programme/Event
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.programName}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    Program/Event Start Date
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.programStartDate}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    Program/Event End Date
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.programEndDate}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    Website of the Program/Event
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.programWebsite}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    Name of Founder attended
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.founderName}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    Name of Co-founder attended
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.cofunderName}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    Fees per person
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.feesPerPerson}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    Travel Fare
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.travelFare}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    Total Persons attended
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.totalPersons}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                    Total Fees Paid
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {formik.values.totalFees}
                  </dd>
                </div>
                <div className="flex justify-between px-4 py-4 sm:px-0">
                  <button
                    onClick={handleFormAccept}
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={handleFormReject}
                    className="bg-red-500 text-white font-bold py-2 px-4 rounded"
                  >
                    Reject
                  </button>
                </div>
                <Toaster />
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default accelerationAdmin;
