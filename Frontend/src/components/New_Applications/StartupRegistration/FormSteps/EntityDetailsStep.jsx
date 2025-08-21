import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { renderField, renderFileInput } from "./FormFieldUtils";

const EntityDetailsStep = ({ onSubmit, initialValues, onPrevious }) => {
  // Toggle: whether user already has a registered company/firm in Bihar
  const [hasRegisteredEntity, setHasRegisteredEntity] = useState(
    initialValues?.hasRegisteredEntity ?? false
  );
  const entityTypeOptions = [
    "Pvt Ltd",
    "LLP",
    "Partnership",
    "OPC",
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

  // Build validation schema based on toggle
  const getValidationSchema = () => {
    if (!hasRegisteredEntity) {
      // When locked, do not require entity fields
      return Yup.object().shape({
        hasRegisteredEntity: Yup.boolean().oneOf([false, true]),
        entityName: Yup.string(),
        entityType: Yup.string(),
        entityRegistrationNumber: Yup.string(),
        dateOfRegistration: Yup.mixed().nullable(),
        sector: Yup.string(),
        stage: Yup.string(),
        certificate: Yup.mixed().nullable(),
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
      dateOfRegistration: Yup.date().required(
        "Date of registration is required"
      ),
      sector: Yup.string().required("Sector is required"),
      stage: Yup.string().required("Stage is required"),
      certificate: Yup.mixed().required("Registration certificate is required"),
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
        sector: "",
        stage: "",
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
          sector: "",
          stage: "",
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
            Entity Details
          </h2>
          <hr className="mb-4 border-gray-300" />

          {/* Toggle */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-blue-800 mb-1">
                  I already have a company/firm registered in Bihar
                </h3>
                <p className="text-sm text-blue-600">
                  Enable this if you have an existing registered entity in
                  Bihar.
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
                  {hasRegisteredEntity ? "Yes" : "No"}
                </span>
              </label>
            </div>
          </div>

          {hasRegisteredEntity ? (
            <>
              <div className="grid grid-cols-2 gap-6 mt-4">
                {renderField({
                  name: "entityName",
                  label: "Entity Name",
                  required: true,
                })}

                {renderField({
                  name: "entityType",
                  label: "Entity Type",
                  as: "select",
                  options: entityTypeOptions,
                  required: true,
                })}
              </div>

              <div className="grid grid-cols-2 gap-6">
                {renderField({
                  name: "entityRegistrationNumber",
                  label: "Registration Number",
                  required: true,
                })}

                {renderField({
                  name: "dateOfRegistration",
                  label: "Date of Registration",
                  type: "date",
                  required: true,
                })}
              </div>

              <div className="grid grid-cols-2 gap-6">
                {renderField({
                  name: "sector",
                  label: "Sector",
                  as: "select",
                  options: sectorOptions,
                  required: true,
                })}

                {renderField({
                  name: "stage",
                  label: "Stage",
                  as: "select",
                  options: stageOptions,
                  required: true,
                })}
              </div>

              <div className="grid grid-cols-2 gap-6">
                {renderFileInput({
                  name: "certificate",
                  label: "Registration Certificate",
                  accept: ".pdf",
                  required: true,
                  setFieldValue: formik.setFieldValue,
                })}
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
                Entity Details Locked
              </h3>
              <p className="text-gray-500 mb-2">
                Toggle above to provide your registered entity details.
              </p>
              <p className="text-sm text-gray-400">
                If you don't have a registered entity, you can continue without
                filling this section.
              </p>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => onPrevious(formik.values)}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              Previous
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Save & Continue
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EntityDetailsStep;
