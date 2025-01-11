import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const QprForm = () => {
  const validationSchema = Yup.object({
    currentStage: Yup.string().required("Current Stage is required"),
    averageTurnover: Yup.string().required("Average Turnover is required"),
    currentRevenue: Yup.string().required("Current Revenue is required"),
    netProfitOrLoss: Yup.string().required("Net Profit or Loss is required"),
    fundRaised: Yup.string().required("Fund Raised is required"),
    workOrders: Yup.string().required("Work Orders are required"),
    directEmployment: Yup.string().required(
      "Direct Employment Generated is required"
    ),
    indirectEmployment: Yup.string().required(
      "Indirect Employment Generated is required"
    ),
    maleEmployees: Yup.string().required("Male Employees is required"),
    femaleEmployees: Yup.string().required("Female Employees is required"),
    partnerships: Yup.string().required("Partnerships are required"),
    nextQuarterGoals: Yup.string().required("Next Quarter Goals are required"),
  });

  const formik = useFormik({
    initialValues: {
      currentStage: "",
      averageTurnover: "",
      currentRevenue: "",
      netProfitOrLoss: "",
      fundRaised: "",
      workOrders: "",
      directEmployment: "",
      indirectEmployment: "",
      maleEmployees: "",
      femaleEmployees: "",
      partnerships: "",
      nextQuarterGoals: "",
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      try {
        console.log("Submitting data:", values);
        const response = await axios.post(
          "http://51.20.148.118:3007/api/Qreport",
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
    <div className="h-screen overflow-y-auto">

    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-4xl p-8 "
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Quarterly Progress Report
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1 */}
          <div>
            {/* Current Stage */}
            <div className="mb-4">
              <label htmlFor="currentStage" className="block font-medium">
                Current Stage
              </label>
              <select
                id="currentStage"
                name="currentStage"
                value={formik.values.currentStage}
                onChange={formik.handleChange}
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              >
                <option value="">Select Stage</option>
                <option value="Ideation">Ideation</option>
                <option value="Prototype">Prototype</option>
                <option value="Validation">Validation</option>
                <option value="Growth">Growth</option>
                <option value="Scaling">Scaling</option>
              </select>
              {formik.errors.currentStage && (
                <div className="text-red-600">{formik.errors.currentStage}</div>
              )}
            </div>

            {/* Average Turnover */}
            <div className="mb-4">
              <label htmlFor="averageTurnover" className="block font-medium">
                Average Turnover (In Lakhs)
              </label>
              <input
                type="text"
                id="averageTurnover"
                name="averageTurnover"
                value={formik.values.averageTurnover}
                onChange={formik.handleChange}
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
              {formik.errors.averageTurnover && (
                <div className="text-red-600">{formik.errors.averageTurnover}</div>
              )}
            </div>

            {/* Current Revenue */}
            <div className="mb-4">
              <label htmlFor="currentRevenue" className="block font-medium">
                Current Revenue (In Lakhs)
              </label>
              <input
                type="text"
                id="currentRevenue"
                name="currentRevenue"
                value={formik.values.currentRevenue}
                onChange={formik.handleChange}
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
              {formik.errors.currentRevenue && (
                <div className="text-red-600">{formik.errors.currentRevenue}</div>
              )}
            </div>

            {/* Net Profit or Loss */}
            <div className="mb-4">
              <label htmlFor="netProfitOrLoss" className="block font-medium">
                Net Profit or Loss
              </label>
              <select
                id="netProfitOrLoss"
                name="netProfitOrLoss"
                value={formik.values.netProfitOrLoss}
                onChange={formik.handleChange}
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              >
                <option value="">Select</option>
                <option value="Profit">Profit</option>
                <option value="Loss">Loss</option>
              </select>
              {formik.errors.netProfitOrLoss && (
                <div className="text-red-600">{formik.errors.netProfitOrLoss}</div>
              )}
            </div>
          </div>

          {/* Column 2 */}
          <div>
            {/* Fund Raised */}
            <div className="mb-4">
              <label htmlFor="fundRaised" className="block font-medium">
                Any funds raised or grants received?
              </label>
              <select
                id="fundRaised"
                name="fundRaised"
                value={formik.values.fundRaised}
                onChange={formik.handleChange}
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {formik.errors.fundRaised && (
                <div className="text-red-600">{formik.errors.fundRaised}</div>
              )}
            </div>

            {/* Work Orders */}
            <div className="mb-4">
              <label htmlFor="workOrders" className="block font-medium">
                Work Orders Received
              </label>
              <input
                type="number"
                id="workOrders"
                name="workOrders"
                value={formik.values.workOrders}
                onChange={formik.handleChange}
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
              {formik.errors.workOrders && (
                <div className="text-red-600">{formik.errors.workOrders}</div>
              )}
            </div>

            {/* Direct Employment */}
            <div className="mb-4">
              <label htmlFor="directEmployment" className="block font-medium">
                Direct Employment Generated
              </label>
              <input
                type="number"
                id="directEmployment"
                name="directEmployment"
                value={formik.values.directEmployment}
                onChange={formik.handleChange}
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
              {formik.errors.directEmployment && (
                <div className="text-red-600">
                  {formik.errors.directEmployment}
                </div>
              )}
            </div>

            {/* Indirect Employment */}
            <div className="mb-4">
              <label htmlFor="indirectEmployment" className="block font-medium">
                Indirect Employment Generated
              </label>
              <input
                type="number"
                id="indirectEmployment"
                name="indirectEmployment"
                value={formik.values.indirectEmployment}
                onChange={formik.handleChange}
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
              {formik.errors.indirectEmployment && (
                <div className="text-red-600">
                  {formik.errors.indirectEmployment}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Fields */}
        {["maleEmployees", "femaleEmployees", "partnerships", "nextQuarterGoals"].map((field, index) => (
          <div className="mb-4" key={index}>
            <label htmlFor={field} className="block font-medium capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="text"
              id={field}
              name={field}
              value={formik.values[field]}
              onChange={formik.handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
            {formik.errors[field] && (
              <div className="text-red-600">{formik.errors[field]}</div>
            )}
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {formik.isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      </div>
      </div>
    );
};

export default QprForm;
