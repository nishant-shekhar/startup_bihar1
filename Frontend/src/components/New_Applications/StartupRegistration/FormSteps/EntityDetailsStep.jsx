import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { renderField, renderFileInput } from "./FormFieldUtils";
import stateDistrictData from "./stateDistrictData.json";
import { useLanguage } from "../LanguageContext";

const EntityDetailsStep = ({ onSubmit, initialValues, onPrevious }) => {
  const { t } = useLanguage();
  // Get today's date in YYYY-MM-DD format for max date validation
  const today = new Date().toISOString().split("T")[0];

  // Get Bihar districts
  const biharDistricts = stateDistrictData["Bihar"] || [];

  // Toggle: whether user already has a registered company/firm in Bihar
  const [hasRegisteredEntity, setHasRegisteredEntity] = useState(
    initialValues?.hasRegisteredEntity ?? false
  );
  const entityTypeOptions = ["Pvt Ltd", "LLP", "Partnership", "OPC"];

  // Build validation schema based on toggle
  const getValidationSchema = () => {
    if (!hasRegisteredEntity) {
      // When locked, do not require entity fields - make everything optional
      return Yup.object().shape({
        hasRegisteredEntity: Yup.boolean(),
        entityName: Yup.string().notRequired(),
        entityType: Yup.string().notRequired(),
        entityRegistrationNumber: Yup.string().notRequired(),
        dateOfRegistration: Yup.mixed().notRequired().nullable(),
        businessAddress: Yup.string().notRequired(),
        state: Yup.string().notRequired(),
        district: Yup.string().notRequired(),
        certificate: Yup.mixed().notRequired().nullable(),
      });
    }
    // When unlocked, require all entity fields
    return Yup.object().shape({
      hasRegisteredEntity: Yup.boolean().oneOf([false, true]),
      entityName: Yup.string().required("Entity name is required"),
      entityType: Yup.string().required("Entity type is required"),
      entityRegistrationNumber: Yup.string().required(
        "Registration number is required"
      ),
      dateOfRegistration: Yup.date()
        .max(new Date(), "Date cannot be in the future")
        .required("Date of registration is required"),
      businessAddress: Yup.string().required(
        "Business operating address is required"
      ),
      state: Yup.string().required("State is required"),
      district: Yup.string().required("District is required"),
      certificate: Yup.mixed()
        .required("Registration certificate is required")
        .test(
          "fileType",
          "Only PDF files are allowed",
          (value) => !value || (value && value.type === "application/pdf")
        ),
    });
  };

  // Ensure we submit minimal/empty values when locked
  const handleSubmit = (values) => {
    if (!hasRegisteredEntity) {
      const cleaned = {
        hasRegisteredEntity: false,
        entityName: "",
        entityType: "",
        entityRegistrationNumber: "",
        dateOfRegistration: "",
        businessAddress: "",
        state: "",
        district: "",
        certificate: null,
      };
      onSubmit(cleaned);
    } else {
      onSubmit({ ...values, hasRegisteredEntity: true });
    }
  };

  return (
    <Formik
      key={hasRegisteredEntity ? "unlocked" : "locked"}
      initialValues={
        initialValues || {
          hasRegisteredEntity: false,
          entityName: "",
          entityType: "",
          entityRegistrationNumber: "",
          dateOfRegistration: "",
          businessAddress: "",
          state: "Bihar",
          district: "",
          certificate: null,
        }
      }
      validationSchema={getValidationSchema()}
      onSubmit={handleSubmit}
      enableReinitialize={false}
    >
      {(formik) => (
        <Form className="space-y-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {t("entityDetails.title")}
          </h2>
          <hr className="mb-4 border-gray-300" />

          {/* Toggle */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-blue-800 mb-1">
                  {t("entityDetails.toggleTitle")}
                </h3>
                <p className="text-sm text-blue-600">
                  {t("entityDetails.toggleDescription")}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={hasRegisteredEntity}
                  onChange={(e) => setHasRegisteredEntity(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {hasRegisteredEntity ? t("common.yes") : t("common.no")}
                </span>
              </label>
            </div>
          </div>

          {hasRegisteredEntity ? (
            <>
              <div className="grid grid-cols-2 gap-6 mt-4">
                {/* Entity Name */}
                <div>
                  <label
                    htmlFor="entityName"
                    className="block mb-2 text-sm font-semibold text-gray-900"
                  >
                    {t("entityDetails.entityName")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="entityName"
                    id="entityName"
                    placeholder={t("entityDetails.entityName")}
                    className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                  />
                  <ErrorMessage
                    name="entityName"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Entity Type */}
                <div>
                  <label
                    htmlFor="entityType"
                    className="block mb-2 text-sm font-semibold text-gray-900"
                  >
                    {t("entityDetails.entityType")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="entityType"
                    id="entityType"
                    className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                  >
                    <option value="">{t("common.select")}</option>
                    <option value="Private Limited">
                      {t("entityDetails.privateLimited")}
                    </option>
                    <option value="Partnership">
                      {t("entityDetails.partnership")}
                    </option>
                    <option value="LLP">{t("entityDetails.llp")}</option>
                    <option value="OPC">{t("entityDetails.opc")}</option>
                    <option value="Proprietorship">
                      {t("entityDetails.proprietorship")}
                    </option>
                  </Field>
                  <ErrorMessage
                    name="entityType"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Registration Number */}
                <div>
                  <label
                    htmlFor="entityRegistrationNumber"
                    className="block mb-2 text-sm font-semibold text-gray-900"
                  >
                    {t("entityDetails.registrationNumber")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="entityRegistrationNumber"
                    id="entityRegistrationNumber"
                    placeholder={t("entityDetails.registrationNumber")}
                    className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                  />
                  <ErrorMessage
                    name="entityRegistrationNumber"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Date of Registration */}
                <div>
                  <label
                    htmlFor="dateOfRegistration"
                    className="block mb-2 text-sm font-semibold text-gray-900"
                  >
                    {t("entityDetails.dateOfRegistration")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="date"
                    name="dateOfRegistration"
                    id="dateOfRegistration"
                    max={today}
                    className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                  />
                  <ErrorMessage
                    name="dateOfRegistration"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Business Address */}
                <div>
                  <label
                    htmlFor="businessAddress"
                    className="block mb-2 text-sm font-semibold text-gray-900"
                  >
                    {t("entityDetails.businessAddress")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="businessAddress"
                    id="businessAddress"
                    placeholder={t("entityDetails.businessAddressPlaceholder")}
                    className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                  />
                  <ErrorMessage
                    name="businessAddress"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* State - Bihar (disabled) */}
                <div>
                  <label
                    htmlFor="state"
                    className="block mb-2 text-sm font-semibold text-gray-900"
                  >
                    {t("entityDetails.state")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="state"
                    id="state"
                    value="Bihar"
                    disabled
                    className="bg-gray-100 border border-gray-400 text-gray-500 rounded-2xl block w-full p-2.5 cursor-not-allowed"
                  />
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
                    {t("entityDetails.district")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="district"
                    id="district"
                    className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                  >
                    <option value="">
                      {t("entityDetails.selectDistrict")}
                    </option>
                    {biharDistricts.map((district) => (
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
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Certificate Upload */}
                <div>
                  <label
                    htmlFor="certificate"
                    className="block mb-2 text-sm font-semibold text-gray-900"
                  >
                    {t("entityDetails.certificate")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="certificate"
                    id="certificate"
                    accept=".pdf"
                    onChange={(event) => {
                      formik.setFieldValue(
                        "certificate",
                        event.currentTarget.files[0]
                      );
                    }}
                    className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                  />
                  <ErrorMessage
                    name="certificate"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {t("entityDetails.lockedTitle")}
              </h3>
              <p className="text-gray-500 mb-2">
                {t("entityDetails.lockedDescription")}
              </p>
              <p className="text-sm text-gray-400">
                {t("entityDetails.lockedNote")}
              </p>
            </div>
          )}

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

export default EntityDetailsStep;
