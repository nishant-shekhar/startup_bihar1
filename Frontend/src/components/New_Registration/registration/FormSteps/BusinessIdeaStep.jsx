import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLanguage } from "../../shared/LanguageContext";
import { FaLock, FaUpload } from "react-icons/fa";

export default function BusinessIdeaStep({
  onSubmit,
  onPrevious,
  initialValues,
  isReadOnly = false,
}) {
  const { t } = useLanguage();

  const validationSchema = Yup.object().shape({
    problemStatement: Yup.string().required("Problem statement is required"),
    solution: Yup.string().required("Solution is required"),
    innovation: Yup.string().required("Innovation is required"),
    businessModel: Yup.string().required("Business model is required"),
    pitchDeck: Yup.mixed().nullable(),
    pitchDeckMeta: Yup.mixed().nullable(),
  });

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            Step 6 of 6
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Describe your business idea
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Add the core idea, innovation, business model, and pitch deck.
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
            problemStatement: "",
            solution: "",
            innovation: "",
            businessModel: "",
            pitchDeck: null,
            pitchDeckMeta: null,
          }
        }
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {(formik) => (
          <Form className="space-y-6">
            <div className="rounded-[32px] border border-white/80 bg-white/72 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
              <div className="mb-6 rounded-[24px] border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-emerald-50/60 p-4">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  Business concept
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Clearly explain the problem, your solution, innovation, and revenue approach.
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <TextAreaField
                  name="problemStatement"
                  label={t("businessIdea.problemStatement")}
                  placeholder={t("businessIdea.problemStatementPlaceholder")}
                  disabled={isReadOnly}
                />

                <TextAreaField
                  name="solution"
                  label={t("businessIdea.solution")}
                  placeholder={t("businessIdea.solutionPlaceholder")}
                  disabled={isReadOnly}
                />

                <TextAreaField
                  name="innovation"
                  label={t("businessIdea.innovation")}
                  placeholder={t("businessIdea.innovationPlaceholder")}
                  disabled={isReadOnly}
                />

                <TextAreaField
                  name="businessModel"
                  label={t("businessIdea.businessModel")}
                  placeholder={t("businessIdea.businessModelPlaceholder")}
                  disabled={isReadOnly}
                />

                <div>
                  <label
                    htmlFor="pitchDeck"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    {t("businessIdea.pitchDeck")}
                  </label>

                  <input
                    id="pitchDeck"
                    name="pitchDeck"
                    type="file"
                    accept=".pdf,.ppt,.pptx"
                    disabled={isReadOnly}
                    onChange={(event) => {
                      if (isReadOnly) return;
                      formik.setFieldValue(
                        "pitchDeck",
                        event.currentTarget.files?.[0] || null
                      );
                    }}
                    className={`block w-full rounded-2xl border px-4 py-3 ${
                      isReadOnly
                        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                        : "border-slate-200 bg-white/85 text-slate-700"
                    }`}
                  />

                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    {!isReadOnly ? <FaUpload /> : <FaLock />}
                    Accepted formats: PDF, PPT, PPTX
                  </div>

                  {formik.values.pitchDeck?.name ? (
                    <div className="mt-2 text-sm text-slate-500">
                      Selected: <span className="font-medium">{formik.values.pitchDeck.name}</span>
                    </div>
                  ) : null}

                  {formik.values.pitchDeckMeta?.fileName ? (
                    <div className="mt-2 text-xs text-slate-500">
                      Uploaded: {formik.values.pitchDeckMeta.fileName}
                    </div>
                  ) : null}

                  <ErrorMessage
                    name="pitchDeck"
                    component="p"
                    className="mt-2 text-sm text-red-500"
                  />
                </div>
              </div>

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

function TextAreaField({ name, label, placeholder, disabled = false }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <Field
        as="textarea"
        id={name}
        name={name}
        rows={4}
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