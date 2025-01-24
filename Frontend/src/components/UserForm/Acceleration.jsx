import React from "react";
import { useFormik } from "formik";
import axios from "axios";

const validate = (values) => {
  const errors = {};

  if (!values.hostInstitute) {
    errors.hostInstitute = "Required";
  }
  if (!values.programName) {
    errors.programName = "Required";
  }
  if (!values.startDate) {
    errors.startDate = "Required";
  }
  if (!values.endDate) {
    errors.endDate = "Required";
  }
  if (!values.programWebsite) {
    errors.programWebsite = "Required";
  }
  if (!values.founderName) {
    errors.founderName = "Required";
  }
  if (!values.coFounderName) {
    errors.coFounderName = "Required";
  }
  if (!values.participationFee) {
    errors.participationFee = "Required";
  }
  if (!values.travelAccommodationCost) {
    errors.travelAccommodationCost = "Required";
  }
  if (!values.totalPersons) {
    errors.totalPersons = "Required";
  }
  if (!values.totalFee) {
    errors.totalFee = "Required";
  }

  return errors;
};

const Acceleration = () => {
  const formik = useFormik({
    initialValues: {
      hostInstitute: "",
      programName: "",
      startDate: "",
      endDate: "",
      programWebsite: "",
      founderName: "",
      coFounderName: "",
      participationFee: "",
      travelAccommodationCost: "",
      totalPersons: "",
      totalFee: "",
    },
    validate,
    onSubmit: async (values, { resetForm }) => {
      try {
        console.log("Submitting data:", values);
        const response = await axios.post(
          "https://startupbihar.in/api/acceleration",
          values,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Server response:", response.data);
        alert("Data submitted successfully!");
        resetForm();
      } catch (error) {
        console.error(
          "Error submitting data:",
          error.response?.data || error.message
        );
        alert("Failed to submit data. Check console for details.");
      }
    },
  });

  return (
    <div className="h-screen overflow-y-auto flex flex-col items-center">
      <div className="flex w-full max-w-5xl mt-10 space-x-10">
        {/* Left Column */}
        <form onSubmit={formik.handleSubmit} className="w-1/2 p-8 rounded-lg">
          <h3 className="font-semibold text-xl mb-6">
            Apply for Acceleration Program
          </h3>

          <div className="mb-6">
            <label
              htmlFor="hostInstitute"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name of the Host Institute/Organisation
            </label>
            <input
              id="hostInstitute"
              name="hostInstitute"
              type="text"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
              onChange={formik.handleChange}
              value={formik.values.hostInstitute}
            />
            {formik.errors.hostInstitute && (
              <div className="text-red-600">{formik.errors.hostInstitute}</div>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="programName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name of Programme/Event
            </label>
            <input
              id="programName"
              name="programName"
              type="text"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
              onChange={formik.handleChange}
              value={formik.values.programName}
            />
            {formik.errors.programName && (
              <div className="text-red-600">{formik.errors.programName}</div>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Program/Event Start Date
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
              onChange={formik.handleChange}
              value={formik.values.startDate}
            />
            {formik.errors.startDate && (
              <div className="text-red-600">{formik.errors.startDate}</div>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Program/Event End Date
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
              onChange={formik.handleChange}
              value={formik.values.endDate}
            />
            {formik.errors.endDate && (
              <div className="text-red-600">{formik.errors.endDate}</div>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="programWebsite"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Website of the Program/Event (if any)
            </label>
            <input
              id="programWebsite"
              name="programWebsite"
              type="url"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
              onChange={formik.handleChange}
              value={formik.values.programWebsite}
            />
            {formik.errors.programWebsite && (
              <div className="text-red-600">{formik.errors.programWebsite}</div>
            )}
          </div>
        </form>

        {/* Right Column */}
        <form onSubmit={formik.handleSubmit} className="w-1/2 p-8 rounded-lg">
          <div className="mb-6">
            <label
              htmlFor="founderName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name of Founder Attended the Program/Event
            </label>
            <input
              id="founderName"
              name="founderName"
              type="text"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
              onChange={formik.handleChange}
              value={formik.values.founderName}
            />
            {formik.errors.founderName && (
              <div className="text-red-600">{formik.errors.founderName}</div>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="coFounderName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name of Co-Founder Attended the Program/Event
            </label>
            <input
              id="coFounderName"
              name="coFounderName"
              type="text"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
              onChange={formik.handleChange}
              value={formik.values.coFounderName}
            />
            {formik.errors.coFounderName && (
              <div className="text-red-600">{formik.errors.coFounderName}</div>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="participationFee"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Participation Fee (INR)
            </label>
            <input
              id="participationFee"
              name="participationFee"
              type="number"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
              onChange={formik.handleChange}
              value={formik.values.participationFee}
            />
            {formik.errors.participationFee && (
              <div className="text-red-600">{formik.errors.participationFee}</div>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="travelAccommodationCost"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Travel & Accommodation Cost (INR)
            </label>
            <input
              id="travelAccommodationCost"
              name="travelAccommodationCost"
              type="number"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
              onChange={formik.handleChange}
              value={formik.values.travelAccommodationCost}
            />
            {formik.errors.travelAccommodationCost && (
              <div className="text-red-600">
                {formik.errors.travelAccommodationCost}
              </div>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="totalPersons"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Total Persons
            </label>
            <input
              id="totalPersons"
              name="totalPersons"
              type="number"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
              onChange={formik.handleChange}
              value={formik.values.totalPersons}
            />
            {formik.errors.totalPersons && (
              <div className="text-red-600">{formik.errors.totalPersons}</div>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="totalFee"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Total Fee (INR)
            </label>
            <input
              id="totalFee"
              name="totalFee"
              type="number"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
              onChange={formik.handleChange}
              value={formik.values.totalFee}
            />
            {formik.errors.totalFee && (
              <div className="text-red-600">{formik.errors.totalFee}</div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Acceleration;
