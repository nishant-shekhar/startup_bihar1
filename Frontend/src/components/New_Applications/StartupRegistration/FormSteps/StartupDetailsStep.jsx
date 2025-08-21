import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { renderField } from "./FormFieldUtils";

const StartupDetailsStep = ({ onSubmit, initialValues, onPrevious }) => {
  const stateOptions = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Delhi","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
  ];

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
      .test("is-valid-url", "Enter a valid URL (e.g., example.com or https://example.com)", isValidUrl)
      .nullable(),
    registeredAddress: Yup.string().required("Registered address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string().required("Pincode is required"),
  });

  return (
    <Formik
      initialValues={
        initialValues || {
          teamSize: "",
          website: "",
          registeredAddress: "",
          city: "",
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
          <h2 className="text-2xl font-semibold mb-4">Startup Details</h2>
          <hr className="mb-4 border-gray-300" />

          <div className="grid grid-cols-2 gap-6">
            {renderField({
              name: "teamSize",
              label: "Team Size",
              type: "number",
              min: 1,
              required: true,
            })}

            {renderField({
              name: "website",
              label: "Website",
              // change to text so browser doesn't block 'www.example.com'
              type: "text",
              placeholder: "example.com or https://example.com",
            })}
          </div>

          <div className="col-span-2">
            {renderField({
              name: "registeredAddress",
              label: "Registered Address",
              as: "textarea",
              rows: 3,
              required: true,
            })}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {renderField({
              name: "city",
              label: "City",
              required: true,
            })}

            {renderField({
              name: "state",
              label: "State",
              as: "select",
              options: stateOptions,
              required: true,
            })}

            {renderField({
              name: "pincode",
              label: "Pincode",
              required: true,
            })}
            
          </div>

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

export default StartupDetailsStep;
