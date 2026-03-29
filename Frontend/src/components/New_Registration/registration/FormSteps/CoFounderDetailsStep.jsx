import React from "react";
import { Formik, Form, FieldArray, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { qualificationOptions } from "./FormFieldUtils";
import { useLanguage } from "../../shared/LanguageContext";
import { FaLock, FaPlus } from "react-icons/fa";

export default function CoFounderDetailsStep({
  onSubmit,
  onPrevious,
  initialValues,
  isReadOnly = false,
}) {
  const { t } = useLanguage();

  const validationSchema = Yup.object().shape({
    coFounders: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        phoneNumber: Yup.string()
          .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
          .required("Phone number is required"),
        qualification: Yup.string().required("Qualification is required"),
        linkedinProfile: Yup.string()
          .nullable()
          .test("valid-linkedin", "Enter a valid URL", (value) => {
            return !value || /^https?:\/\//.test(value);
          }),
      })
    ),
  });

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            Step 5 of 6
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Co-founder details
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Add one or more co-founders if applicable.
          </p>
        </div>

        {isReadOnly ? (
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <FaLock />
              Step locked
            </div>
            <div className="mt-1">This section is read-only after final submission.</div>
          </div>
        ) : null}
      </div>

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
        enableReinitialize
      >
        {(formik) => (
          <Form className="space-y-6">
            <div className="rounded-[32px] border border-white/80 bg-white/72 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
              <div className="mb-6 rounded-[24px] border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-violet-50/60 p-4">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  Founding team
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Add the profiles of co-founders associated with this startup.
                </div>
              </div>

              <FieldArray name="coFounders">
                {({ push, remove }) => (
                  <div className="space-y-5">
                    {formik.values.coFounders.map((_, index) => (
                      <div
                        key={index}
                        className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-5"
                      >
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div className="text-lg font-semibold text-slate-800">
                            {t("cofounderDetails.cofounderLabel")} {index + 1}
                          </div>

                          {index > 0 && !isReadOnly ? (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                            >
                              {t("cofounderDetails.remove")}
                            </button>
                          ) : index > 0 && isReadOnly ? (
                            <div className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-500">
                              Locked
                            </div>
                          ) : null}
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          <NestedInput
                            name={`coFounders.${index}.name`}
                            label={t("cofounderDetails.name")}
                            placeholder="Full name"
                            disabled={isReadOnly}
                          />

                          <NestedInput
                            name={`coFounders.${index}.email`}
                            type="email"
                            label={t("cofounderDetails.email")}
                            placeholder="name@example.com"
                            disabled={isReadOnly}
                          />

                          <NestedInput
                            name={`coFounders.${index}.phoneNumber`}
                            label={t("cofounderDetails.phoneNumber")}
                            placeholder="9876543210"
                            disabled={isReadOnly}
                          />

                          <div>
                            <label
                              htmlFor={`coFounders.${index}.qualification`}
                              className="mb-2 block text-sm font-semibold text-slate-800"
                            >
                              {t("cofounderDetails.qualification")}
                            </label>
                            <Field
                              as="select"
                              id={`coFounders.${index}.qualification`}
                              name={`coFounders.${index}.qualification`}
                              disabled={isReadOnly}
                              className={`block w-full rounded-2xl border px-4 py-3 outline-none transition ${
                                isReadOnly
                                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                                  : "border-slate-200 bg-white/85 text-slate-900 focus:border-slate-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(148,163,184,0.10)]"
                              }`}
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
                              className="mt-2 text-sm text-red-500"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <NestedInput
                              name={`coFounders.${index}.linkedinProfile`}
                              label={t("cofounderDetails.linkedinProfile")}
                              placeholder={t("cofounderDetails.linkedinPlaceholder")}
                              disabled={isReadOnly}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {!isReadOnly ? (
                      <div className="flex justify-center">
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
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <FaPlus />
                          {t("cofounderDetails.addCofounder")}
                        </button>
                      </div>
                    ) : null}
                  </div>
                )}
              </FieldArray>

              <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={onPrevious}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  {t("common.previous")}
                </button>

                {!isReadOnly ? (
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                  >
                    {t("common.saveAndContinue")}
                  </button>
                ) : (
                  <div className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-500">
                    Locked after submission
                  </div>
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

function NestedInput({
  name,
  label,
  type = "text",
  placeholder,
  disabled = false,
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`block w-full rounded-2xl border px-4 py-3 outline-none transition ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
            : "border-slate-200 bg-white/85 text-slate-900 focus:border-slate-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(148,163,184,0.10)]"
        }`}
      />
      <ErrorMessage
        name={name}
        component="p"
        className="mt-2 text-sm text-red-500"
      />
    </div>
  );
}