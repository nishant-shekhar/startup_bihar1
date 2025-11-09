import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { renderField, renderFileInput } from "./FormFieldUtils";
import { useLanguage } from "../LanguageContext";

const BusinessIdeaStep = ({ onSubmit, initialValues, onPrevious }) => {
  const { t } = useLanguage();
  const validationSchema = Yup.object().shape({
    problemStatement: Yup.string().required("Problem statement is required"),
    solution: Yup.string().required("Solution is required"),
    innovation: Yup.string().required("Innovation is required"),
    businessModel: Yup.string().required(
      "Business model and revenue model is required"
    ),
    pitchDeck: Yup.mixed().required("Pitch deck is required"),
  });

  return (
    <Formik
      initialValues={
        initialValues || {
          problemStatement: "",
          solution: "",
          innovation: "",
          businessModel: "",
          pitchDeck: null,
        }
      }
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Form className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">
            {t("businessIdea.title")}
          </h2>
          <hr className="mb-4 border-gray-300" />

          <div>
            {/* Problem Statement */}
            <div>
              <label
                htmlFor="problemStatement"
                className="block mb-2 text-sm font-semibold text-gray-900"
              >
                {t("businessIdea.problemStatement")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                as="textarea"
                name="problemStatement"
                id="problemStatement"
                rows={3}
                placeholder={t("businessIdea.problemStatementPlaceholder")}
                className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
              />
              <ErrorMessage
                name="problemStatement"
                component="p"
                className="mt-1 text-sm text-red-500"
              />
            </div>
          </div>

          <div>
            {/* Solution */}
            <div>
              <label
                htmlFor="solution"
                className="block mb-2 text-sm font-semibold text-gray-900"
              >
                {t("businessIdea.solution")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                as="textarea"
                name="solution"
                id="solution"
                rows={3}
                placeholder={t("businessIdea.solutionPlaceholder")}
                className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
              />
              <ErrorMessage
                name="solution"
                component="p"
                className="mt-1 text-sm text-red-500"
              />
            </div>
          </div>

          <div>
            {/* Innovation */}
            <div>
              <label
                htmlFor="innovation"
                className="block mb-2 text-sm font-semibold text-gray-900"
              >
                {t("businessIdea.innovation")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                as="textarea"
                name="innovation"
                id="innovation"
                rows={3}
                placeholder={t("businessIdea.innovationPlaceholder")}
                className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
              />
              <ErrorMessage
                name="innovation"
                component="p"
                className="mt-1 text-sm text-red-500"
              />
            </div>
          </div>

          <div>
            {/* Business Model */}
            <div>
              <label
                htmlFor="businessModel"
                className="block mb-2 text-sm font-semibold text-gray-900"
              >
                {t("businessIdea.businessModel")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                as="textarea"
                name="businessModel"
                id="businessModel"
                rows={3}
                placeholder={t("businessIdea.businessModelPlaceholder")}
                className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
              />
              <ErrorMessage
                name="businessModel"
                component="p"
                className="mt-1 text-sm text-red-500"
              />
            </div>
          </div>

          <div>
            {/* Pitch Deck */}
            <div>
              <label
                htmlFor="pitchDeck"
                className="block mb-2 text-sm font-semibold text-gray-900"
              >
                {t("businessIdea.pitchDeck")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="pitchDeck"
                id="pitchDeck"
                accept=".pdf,.ppt,.pptx"
                onChange={(event) => {
                  formik.setFieldValue(
                    "pitchDeck",
                    event.currentTarget.files[0]
                  );
                }}
                className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
              />
              <ErrorMessage
                name="pitchDeck"
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

export default BusinessIdeaStep;
