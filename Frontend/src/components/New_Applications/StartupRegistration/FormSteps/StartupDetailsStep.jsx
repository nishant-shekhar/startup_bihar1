import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { renderField } from "./FormFieldUtils";
import stateDistrictData from "./stateDistrictData.json";
import { useLanguage } from "../LanguageContext";

const StartupDetailsStep = ({ onSubmit, initialValues, onPrevious }) => {
  const { t } = useLanguage();
  const stateOptions = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Delhi",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  const sectorOptions = [
    "Agriculture and allied sectors",
    "IT/ITES",
    "IoT/ICT/Drone",
    "Edu-tech",
    "Food Processing/FMCG",
    "Healthcare/Health-tech",
    "Fashion and Apparels",
    "Art and handicrafts",
    "Environment and Waste management",
    "Packaging and logistics",
    "Travel, tourism & hospitality",
    "Automobile /EV",
    "Construction/ architecture/Proptech",
    "Media and Entertainment",
    "AR/VR",
    "AI/ML",
    "Finance and allied sectors",
    "HR Services",
    "Manufacturing/Industrial Automation",
    "Others",
  ];

  const stageOptions = ["Ideation", "Validation", "Early Traction", "Scaling"];

  // Helpers to validate/normalize website
  const ensureScheme = (v) => {
    if (!v) return v;
    const trimmed = v.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };
  const isValidUrl = (v) => {
    try {
      // Accept if empty (optional)
      if (!v) return true;
      new URL(ensureScheme(v));
      return true;
    } catch {
      return false;
    }
  };

  const validationSchema = Yup.object().shape({
    teamSize: Yup.number()
      .transform((val, orig) => (orig === "" ? undefined : val))
      .min(1, "Team size must be at least 1")
      .required("Team size is required"),
    website: Yup.string()
      .test(
        "is-valid-url",
        "Enter a valid URL (e.g., example.com or https://example.com)",
        isValidUrl
      )
      .nullable(),
    sector: Yup.string().required("Sector is required"),
    stage: Yup.string().required("Stage is required"),
    applicantAddress: Yup.string().required("Applicant's address is required"),
    district: Yup.string().required("District is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string().required("Pincode is required"),
  });

  return (
    <Formik
      initialValues={
        initialValues || {
          teamSize: "",
          website: "",
          sector: "",
          stage: "",
          applicantAddress: "",
          district: "",
          state: "",
          pincode: "",
        }
      }
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const normalized = {
          ...values,
          website: values.website ? ensureScheme(values.website) : "",
        };
        onSubmit(normalized);
      }}
    >
      {(formik) => (
        <Form className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">
            {t("startupDetails.title")}
          </h2>
          <hr className="mb-4 border-gray-300" />

          <div className="grid grid-cols-2 gap-6">
            {/* Team Size */}
            <div>
              <label
                htmlFor="teamSize"
                className="block mb-2 text-sm font-semibold text-gray-900"
              >
                {t("startupDetails.teamSize")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                type="number"
                name="teamSize"
                id="teamSize"
                min={1}
                className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
              />
              <ErrorMessage
                name="teamSize"
                component="p"
                className="mt-1 text-sm text-red-500"
              />
            </div>

            {/* Website */}
            <div>
              <label
                htmlFor="website"
                className="block mb-2 text-sm font-semibold text-gray-900"
              >
                {t("startupDetails.website")}{" "}
                <span className="text-gray-500">({t("common.optional")})</span>
              </label>
              <Field
                type="text"
                name="website"
                id="website"
                placeholder={t("startupDetails.websitePlaceholder")}
                className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
              />
              <ErrorMessage
                name="website"
                component="p"
                className="mt-1 text-sm text-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Sector */}
            <div>
              <label
                htmlFor="sector"
                className="block mb-2 text-sm font-semibold text-gray-900"
              >
                {t("startupDetails.sector")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                as="select"
                name="sector"
                id="sector"
                className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
              >
                <option value="">{t("common.select")}</option>
                <option value="Agriculture">
                  {t("startupDetails.agriculture")}
                </option>
                <option value="Education">
                  {t("startupDetails.education")}
                </option>
                <option value="Healthcare">
                  {t("startupDetails.healthcare")}
                </option>
                <option value="Technology">
                  {t("startupDetails.technology")}
                </option>
                <option value="Finance">{t("startupDetails.finance")}</option>
                <option value="Retail">{t("startupDetails.retail")}</option>
                <option value="Manufacturing">
                  {t("startupDetails.manufacturing")}
                </option>
                <option value="Other">{t("startupDetails.other")}</option>
              </Field>
              <ErrorMessage
                name="sector"
                component="p"
                className="mt-1 text-sm text-red-500"
              />
            </div>

            {/* Stage */}
            <div>
              <label
                htmlFor="stage"
                className="block mb-2 text-sm font-semibold text-gray-900"
              >
                {t("startupDetails.stage")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                as="select"
                name="stage"
                id="stage"
                className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
              >
                <option value="">{t("common.select")}</option>
                <option value="Ideation">{t("startupDetails.ideation")}</option>
                <option value="Validation">
                  {t("startupDetails.validation")}
                </option>
                <option value="Early Traction">
                  {t("startupDetails.earlyTraction")}
                </option>
                <option value="Scaling">{t("startupDetails.scaling")}</option>
              </Field>
              <ErrorMessage
                name="stage"
                component="p"
                className="mt-1 text-sm text-red-500"
              />
            </div>
          </div>

          <div className="col-span-2">
            {/* Applicant Address */}
            <div>
              <label
                htmlFor="applicantAddress"
                className="block mb-2 text-sm font-semibold text-gray-900"
              >
                {t("startupDetails.applicantAddress")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                as="textarea"
                name="applicantAddress"
                id="applicantAddress"
                rows={3}
                className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
              />
              <ErrorMessage
                name="applicantAddress"
                component="p"
                className="mt-1 text-sm text-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* State */}
            <div>
              <label
                htmlFor="state"
                className="block mb-2 text-sm font-semibold text-gray-900"
              >
                {t("startupDetails.state")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                as="select"
                name="state"
                id="state"
                className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
              >
                <option value="">{t("common.select")}</option>
                {stateOptions.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="state"
                component="p"
                className="mt-1 text-sm text-red-500"
              />
            </div>

            {/* District Dropdown */}
            <div>
              <label
                htmlFor="district"
                className="block mb-2 text-sm font-semibold text-gray-900"
              >
                {t("startupDetails.district")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                as="select"
                name="district"
                id="district"
                disabled={!formik.values.state}
                className={`bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 ${
                  !formik.values.state ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  formik.errors.district && formik.touched.district
                    ? "border-red-500"
                    : ""
                }`}
              >
                <option value="">{t("startupDetails.selectDistrict")}</option>
                {formik.values.state &&
                  stateDistrictData[formik.values.state] &&
                  stateDistrictData[formik.values.state].map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
              </Field>
              <ErrorMessage
                name="district"
                component="p"
                className="mt-1 text-sm text-red-500"
              />
            </div>

            {/* Pincode */}
            <div>
              <label
                htmlFor="pincode"
                className="block mb-2 text-sm font-semibold text-gray-900"
              >
                {t("startupDetails.pincode")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                name="pincode"
                id="pincode"
                className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
              />
              <ErrorMessage
                name="pincode"
                component="p"
                className="mt-1 text-sm text-red-500"
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => onPrevious(formik.values)}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              {t("common.previous")}
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              {t("common.saveAndContinue")}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default StartupDetailsStep;
