import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import userData from "./userDetalis";
import toast, { Toaster } from "react-hot-toast";
import TopNavbar from "./Navbar/TopNavBar";
import Navbar from "./Navbar/Navbar";

function SeedAdminForm() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { users, userDetails } = userData();

  const [activeTab, setActiveTab] = useState("list");

  const [certificateStatus, setCertificateStatus] = useState({
    formAccepted: null,
    companyCertificate: null,
    panNumber: null,
    gstNumber: null,
    cancelledChequePassbook: null,
  });

  const formik = useFormik({
    initialValues: selectedUserId
      ? userDetails[selectedUserId]
      : {
          companyName: "",
          registrationNumber: "",
          dateOfIncorporation: "",
          businessEntityType: "",
          companyCertificate: "",
          rocDistrict: "",
          companyAddress: "",
          pincode: "",
          bankName: "",
          ifscCode: "",
          currentAccountNumber: "",
          currentAccountHolderName: "",
          branchName: "",
          branchAddress: "",
          cancelledChequePassbook: "",
          panNumber: "",
          gstNumber: "",
        },
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log("Submitted data:", values);
      toast.success("Form Submitted Successfully!");
    },
  });

  useEffect(() => {
    if (selectedUserId) {
      const user = users.find((user) => user.id === selectedUserId);
      setCertificateStatus({
        formAccepted: null,
        companyCertificate: user?.companyCertificate
          ? user.companyCertificateStatus
          : null,
        panNumber: user?.panNumber ? user.panNumberStatus : null,
        gstNumber: user?.gstNumber ? user.gstNumberStatus : null,
        cancelledChequePassbook: user?.cancelledChequePassbook
          ? user.cancelledChequePassbookStatus
          : null,
      });
    } else {
      setCertificateStatus({
        formAccepted: null,
        companyCertificate: null,
        panNumber: null,
        gstNumber: null,
        cancelledChequePassbook: null,
      });
    }
  }, [selectedUserId, users]);

  const handleAccept = (certificate) => {
    if (!formik.values[certificate]) {
      toast.error(`"${getCertificateLabel(certificate)}" is missing!`);
      return;
    }
    setCertificateStatus((prevStatus) => ({
      ...prevStatus,
      [certificate]: true,
    }));
    toast.success(`"${getCertificateLabel(certificate)}" Accepted`);
  };

  const handleReject = (certificate) => {
    setCertificateStatus((prevStatus) => ({
      ...prevStatus,
      [certificate]: false,
    }));
    toast.error(`"${getCertificateLabel(certificate)}" Rejected`);
  };

  const getCertificateLabel = (certificate) => {
    const labels = {
      companyCertificate: "Company Certificate",
      panNumber: "PAN Number",
      gstNumber: "GST Number",
      cancelledChequePassbook: "Cancelled Cheque/Passbook",
    };
    return labels[certificate] || certificate;
  };

  const handleViewClick = (id) => {
    const selectedUserDetails = users.find((user) => user.id === id);
    console.log("Viewing details for:", selectedUserDetails);
    setSelectedUserId(id);
    setActiveTab("form");
  };

  const handleFormAccept = () => {
    const allCertificatesAccepted =
      certificateStatus.companyCertificate === true &&
      certificateStatus.panNumber === true &&
      certificateStatus.gstNumber === true &&
      certificateStatus.cancelledChequePassbook === true;

    if (!allCertificatesAccepted) {
      toast.error(
        "All certificates must be accepted before accepting the form."
      );
      return;
    }

    setCertificateStatus((prevStatus) => ({
      ...prevStatus,
      formAccepted: true,
    }));
    toast.success("Form Accepted");
  };

  const handleFormReject = () => {
    setCertificateStatus((prevStatus) => ({
      ...prevStatus,
      formAccepted: false,
    }));
    toast.error("Form Rejected");
  };

  return (
    <div className="">
      
    <div className="flex">
      
    

    <div className="px-4 sm:px-0 flex h-screen">
      <div className="w-1/3 border-r p-4">
        <h3 className="text-lg font-semibold mb-4">Seed Fund</h3>
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
                className="px-4 py-2 text-lg font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 transition-colors duration-200"
                onClick={() => handleViewClick(user.id)}
              >
                <p>&rarr;</p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        {activeTab === "form" && selectedUserId && (
          <div>
            <div className="px-4 sm:px-0">
              <p className="mt-1 max-w-2xl text-lg leading-6 text-gray-500">
                Seed Fund Details
              </p>
            </div>
            <div className="mt-6 border-t border-gray-100">
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
              <form onSubmit={formik.handleSubmit}>
                <dl className="divide-y divide-gray-100">
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                      Company Name
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {formik.values.companyName || "N/A"}
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                      Registration Number/CIN
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {formik.values.registrationNumber || "N/A"}
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                      Date of Incorporation
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {formik.values.dateOfIncorporation || "N/A"}
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                      Business Entity Type
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {formik.values.businessEntityType || "N/A"}
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                      Company Certificate
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {formik.values.companyCertificate || "N/A"}
                      <div className="flex mt-4 space-x-4">
                        {certificateStatus.companyCertificate === true ? (
                          <span className="text-green-500 font-bold">✔</span>
                        ) : certificateStatus.companyCertificate === false ? (
                          <span className="text-red-500 font-bold">✘</span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleAccept("companyCertificate")}
                              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                            >
                              ✔
                            </button>

                            <button
                              type="button"
                              onClick={() => handleReject("companyCertificate")}
                              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                            >
                              ✘
                            </button>
                          </>
                        )}
                      </div>
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                      ROC District
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {formik.values.rocDistrict || "N/A"}
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                      Company Address
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {formik.values.companyAddress || "N/A"}
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                      Pincode
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {formik.values.pincode || "N/A"}
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                      Bank Name
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {formik.values.bankName || "N/A"}
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                      IFSC Code
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {formik.values.ifscCode || "N/A"}
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                      Current Account Number
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {formik.values.currentAccountNumber || "N/A"}
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                      Current Account Holder Name
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {formik.values.currentAccountHolderName || "N/A"}
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                      Branch Name
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {formik.values.branchName || "N/A"}
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                      Branch Address
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {formik.values.branchAddress || "N/A"}
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                      Upload Cancelled Cheque/Passbook First Page (Where Account
                      Detail Mentioned)
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {formik.values.cancelledChequePassbook || "N/A"}
                      <div className="flex mt-4 space-x-4">
                        {certificateStatus.cancelledChequePassbook === true ? (
                          <span className="text-green-500 font-bold">✔</span>
                        ) : certificateStatus.cancelledChequePassbook ===
                          false ? (
                          <span className="text-red-500 font-bold">✘</span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleAccept("cancelledChequePassbook")
                              }
                              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                            >
                              ✔
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleReject("cancelledChequePassbook")
                              }
                              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                            >
                              ✘
                            </button>
                          </>
                        )}
                      </div>
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                      PAN Number
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {formik.values.panNumber || "N/A"}
                      <div className="flex mt-4 space-x-4">
                        {certificateStatus.panNumber === true ? (
                          <span className="text-green-500 font-bold">✔</span>
                        ) : certificateStatus.panNumber === false ? (
                          <span className="text-red-500 font-bold">✘</span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleAccept("panNumber")}
                              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                            >
                              ✔
                            </button>

                            <button
                              type="button"
                              onClick={() => handleReject("panNumber")}
                              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                            >
                              ✘
                            </button>
                          </>
                        )}
                      </div>
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="px-7 text-sm font-medium leading-6 text-gray-900">
                      GST Number
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {formik.values.gstNumber || "N/A"}
                      <div className="flex mt-4 space-x-4">
                        {certificateStatus.gstNumber === true ? (
                          <span className="text-green-500 font-bold">✔</span>
                        ) : certificateStatus.gstNumber === false ? (
                          <span className="text-red-500 font-bold">✘</span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleAccept("gstNumber")}
                              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                            >
                              ✔
                            </button>

                            <button
                              type="button"
                              onClick={() => handleReject("gstNumber")}
                              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                            >
                              ✘
                            </button>
                          </>
                        )}
                      </div>
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 sm:col-span-3">
                    <dt className="sr-only">Actions</dt>
                    <dd className="mt-1 text-sm leading-6 sm:mt-0 sm:col-span-2">
                      <div className="flex space-x-4">
                        {certificateStatus.formAccepted !== true && (
                          <button
                            type="button"
                            onClick={handleFormAccept}
                            className={`${
                              certificateStatus.formAccepted === false
                                ? "bg-green-500"
                                : "bg-green-500"
                            } text-white px-4 py-2 rounded-md hover:bg-green-600`}
                          >
                            ✔ Accept Form
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={handleFormReject}
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                          ✘ Reject Form
                        </button>
                      </div>
                      {certificateStatus.formAccepted === true && (
                        <span className="text-green-500 font-bold mt-2 inline-block">
                          ✔ Form Accepted
                        </span>
                      )}
                      {certificateStatus.formAccepted === false && (
                        <span className="text-red-500 font-bold mt-2 inline-block">
                          ✘ Form Rejected
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
              </form>
            </div>
          </div>
        )}
        <Toaster />
      </div>
    </div>
    </div>
    </div>
  );
}

export default SeedAdminForm;
