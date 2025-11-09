import React from "react";
import { Formik, Form, FieldArray, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { renderField, qualificationOptions } from "./FormFieldUtils";
import { useLanguage } from "../LanguageContext";

const CoFounderDetailsStep = ({ onSubmit, initialValues, onPrevious }) => {
  const { t } = useLanguage();
  const validationSchema = Yup.object().shape({
    coFounders: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        phoneNumber: Yup.string().required("Phone number is required"),
        qualification: Yup.string().required("Qualification is required"),
        linkedinProfile: Yup.string().url("Must be a valid URL"),
      })
    ),
  });

  return (
    <Formik
      initialValues={
        initialValues || {
          coFounders: [
            {
              name: "",
              email: "",
              phoneNumber: "",
              qualification: "",
              linkedinProfile: "",
            },
          ],
        }
      }
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Form className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">
            {t("cofounderDetails.title")}
          </h2>
          <hr className="mb-4 border-gray-300" />

          <FieldArray name="coFounders">
            {({ push, remove }) => (
              <div className="space-y-8">
                {formik.values.coFounders.map((cofounder, index) => (
                  <div key={index} className="border p-4 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-medium">
                        {t("cofounderDetails.cofounderLabel")} {index + 1}
                      </h3>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                        >
                          {t("cofounderDetails.remove")}
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label
                          htmlFor={`coFounders.${index}.name`}
                          className="block mb-2 text-sm font-semibold text-gray-900"
                        >
                          {t("cofounderDetails.name")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Field
                          type="text"
                          name={`coFounders.${index}.name`}
                          id={`coFounders.${index}.name`}
                          className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                        />
                        <ErrorMessage
                          name={`coFounders.${index}.name`}
                          component="p"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor={`coFounders.${index}.email`}
                          className="block mb-2 text-sm font-semibold text-gray-900"
                        >
                          {t("cofounderDetails.email")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Field
                          type="email"
                          name={`coFounders.${index}.email`}
                          id={`coFounders.${index}.email`}
                          className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                        />
                        <ErrorMessage
                          name={`coFounders.${index}.email`}
                          component="p"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {/* Phone */}
                      <div>
                        <label
                          htmlFor={`coFounders.${index}.phoneNumber`}
                          className="block mb-2 text-sm font-semibold text-gray-900"
                        >
                          {t("cofounderDetails.phoneNumber")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Field
                          type="text"
                          name={`coFounders.${index}.phoneNumber`}
                          id={`coFounders.${index}.phoneNumber`}
                          className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                        />
                        <ErrorMessage
                          name={`coFounders.${index}.phoneNumber`}
                          component="p"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>

                      {/* Qualification */}
                      <div>
                        <label
                          htmlFor={`coFounders.${index}.qualification`}
                          className="block mb-2 text-sm font-semibold text-gray-900"
                        >
                          {t("cofounderDetails.qualification")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Field
                          as="select"
                          name={`coFounders.${index}.qualification`}
                          id={`coFounders.${index}.qualification`}
                          className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                        >
                          <option value="">{t("common.select")}</option>
                          {qualificationOptions.map((qual) => (
                            <option key={qual} value={qual}>
                              {qual}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name={`coFounders.${index}.qualification`}
                          component="p"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>
                    </div>

                    <div>
                      {/* LinkedIn */}
                      <div>
                        <label
                          htmlFor={`coFounders.${index}.linkedinProfile`}
                          className="block mb-2 text-sm font-semibold text-gray-900"
                        >
                          {t("cofounderDetails.linkedinProfile")}{" "}
                          <span className="text-gray-500">
                            ({t("common.optional")})
                          </span>
                        </label>
                        <Field
                          type="url"
                          name={`coFounders.${index}.linkedinProfile`}
                          id={`coFounders.${index}.linkedinProfile`}
                          placeholder={t(
                            "cofounderDetails.linkedinPlaceholder"
                          )}
                          className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                        />
                        <ErrorMessage
                          name={`coFounders.${index}.linkedinProfile`}
                          component="p"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-center mt-4">
                  <button
                    type="button"
                    onClick={() =>
                      push({
                        name: "",
                        email: "",
                        phoneNumber: "",
                        qualification: "",
                        linkedinProfile: "",
                      })
                    }
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
                  >
                    {t("cofounderDetails.addCofounder")}
                  </button>
                </div>
              </div>
            )}
          </FieldArray>

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

export default CoFounderDetailsStep;
