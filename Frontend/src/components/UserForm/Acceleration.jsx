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
					<h1 className="text-3xl font-bold mb-2 relative top-10">Apply for Acceleration Program </h1>
					<p className="text-lg max-w-xl relative top-10">
						
					</p>
				</div>
			</div>

			<div
				className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
				aria-hidden="true"
			/>
      <div className="flex w-full max-w-5xl mt-10 space-x-10">
        {/* Left Column */}
        <form onSubmit={formik.handleSubmit} className="w-1/2 p-8 rounded-lg">
          <h3 className="font-semibold text-xl mb-6">
           
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
