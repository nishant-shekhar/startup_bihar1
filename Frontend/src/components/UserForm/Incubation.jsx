import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";

const Incubation = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validationSchema = Yup.object({
    incubationCenter: Yup.string().required("Select Incubation Center"),
    status: Yup.string().required("Status is required"),

  });

  const formik = useFormik({
    initialValues: {
      incubationCenter: "",
      status: "",
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      try {
        console.log("Submitting data:", values);
        const response = await axios.post(
          "https://localhost:3007/api/incubation",
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
    <div className="isolate bg-white h-screen flex items-center justify-center px-6 py-24 sm:py-12 lg:px-8">
      <div className="w-full max-w-4xl bg-gray-50 shadow-lg rounded-lg p-10 flex justify-center">
        <form onSubmit={formik.handleSubmit} className="w-full max-w-md space-y-6">
          <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
            Apply for Incubation
          </h2>
          <div className="mb-4">
            <label htmlFor="incubationCenter" className="block font-medium">
              Select Incubation Center
            </label>
            <select
              id="incubationCenter"
              name="incubationCenter"
              value={formik.values.incubationCenter}
              onChange={formik.handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            >
              <option value="">Select</option>
              <option value="Inc1">Inc1</option>
              <option value="Inc2">Inc2</option>
              <option value="Inc3">Inc3</option>
              <option value="Inc4">Inc4</option>
            </select>
            {formik.errors.incubationCenter && (
              <div className="text-red-600">{formik.errors.incubationCenter}</div>
            )}
          </div>

          <div className="mb-6">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="status"
            >
              Status
            </label>
            <input
              id="status"
              type="text"
              name="status"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              onChange={formik.handleChange}
              value={formik.values.status}
            />
            {formik.errors.status && (
              <div className="text-red-600">{formik.errors.status}</div>
            )}
          </div>

          <button
            type="submit"
            className="w-full text-white bg-indigo-600 rounded py-2 px-4 font-semibold hover:bg-indigo-500"
          >
            Submit
          </button>

          {successMessage && (
            <div className="text-green-500 mt-4">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="text-red-500 mt-4">{errorMessage}</div>
          )}
        </form>
      </div>
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
        style={{ pointerEvents: 'none' }} // Makes the element not clickable
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        ></div>
      </div>

    </div>
  );
};

export default Incubation;
