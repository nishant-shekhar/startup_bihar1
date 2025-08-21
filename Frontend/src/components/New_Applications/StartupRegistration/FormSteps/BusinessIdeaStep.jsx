import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { renderField, renderFileInput } from "./FormFieldUtils";

const BusinessIdeaStep = ({ onSubmit, initialValues, onPrevious }) => {
  const validationSchema = Yup.object().shape({
    problemStatement: Yup.string().required("Problem statement is required"),
    solution: Yup.string().required("Solution is required"),
    targetMarket: Yup.string().required("Target market is required"),
    pitchDeck: Yup.mixed().required("Pitch deck is required"),
  });

  return (
    <Formik
      initialValues={
        initialValues || {
          problemStatement: "",
          solution: "",
          targetMarket: "",
          pitchDeck: null,
        }
      }
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Form className="space-y-4">
          {/* Updated section title */}
          <h2 className="text-2xl font-semibold mb-4">Describe Your Business Idea</h2>
          <hr className="mb-4 border-gray-300" />

          <div>
            {renderField({
              name: "problemStatement",
              // Updated label & placeholder text only
              label: "What problem are you addressing?",
              as: "textarea",
              rows: 3,
              placeholder: "Explain the challenge or gap you identified in the market.",
              required: true,
            })}
          </div>

          <div>
            {renderField({
              name: "solution",
              // Updated label & placeholder text only
              label: "What is your unique solution?",
              as: "textarea",
              rows: 3,
              placeholder: "Describe your product/service, technology involved and how it solves the problem better.",
              required: true,
            })}
          </div>

          <div>
            {renderField({
              name: "targetMarket",
              // Updated label & placeholder text only
              label: "Who is your target customer/market?",
              as: "textarea",
              rows: 2,
              placeholder: "Identify the specific people or businesses you are serving.",
              required: true,
            })}
          </div>

          <div>
            {renderFileInput({
              name: "pitchDeck",
              // Slightly refined label text; same accept/types
              label: "Upload your Pitch Deck (PDF/PPT/PPTX)",
              accept: ".pdf,.ppt,.pptx",
              required: true,
              setFieldValue: formik.setFieldValue,
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
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default BusinessIdeaStep;
