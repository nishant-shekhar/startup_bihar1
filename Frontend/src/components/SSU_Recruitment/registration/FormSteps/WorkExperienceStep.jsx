import React from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { NavButtons, inputClass } from "./PersonalDetailsStep";

const emptyWorkRow = () => ({
  organisation: "",
  designation: "",
  from: "",
  to: "",
  natureOfWork: "",
});

const validationSchema = Yup.object().shape({
  workExperience: Yup.array().of(
    Yup.object().shape({
      organisation: Yup.string().nullable(),
      designation: Yup.string().nullable(),
      from: Yup.string().nullable(),
      to: Yup.string().nullable(),
      natureOfWork: Yup.string().nullable(),
    })
  ),
  totalExpYears: Yup.number().min(0).nullable(),
  totalExpMonths: Yup.number().min(0).max(11).nullable(),
  relevantExpYears: Yup.number().min(0).nullable(),
  relevantExpMonths: Yup.number().min(0).max(11).nullable(),
});

export default function WorkExperienceStep({
  onSubmit,
  onPrevious,
  initialValues,
  isReadOnly,
}) {
  const initial = {
    workExperience:
      initialValues?.workExperience && initialValues.workExperience.length > 0
        ? initialValues.workExperience
        : [emptyWorkRow(), emptyWorkRow(), emptyWorkRow()],
    totalExpYears: initialValues?.totalExpYears || "",
    totalExpMonths: initialValues?.totalExpMonths || "",
    relevantExpYears: initialValues?.relevantExpYears || "",
    relevantExpMonths: initialValues?.relevantExpMonths || "",
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6">
        <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          Step 4 of 6
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Work Experience
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          List all relevant work experience, starting with the most recent.
        </p>
      </div>

      <Formik
        initialValues={initial}
        validationSchema={validationSchema}
        onSubmit={(values) => onSubmit(values)}
        enableReinitialize
      >
        {({ values, isSubmitting }) => (
          <Form className="space-y-6">
            <div className="rounded-[32px] border border-white/80 bg-white/72 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
              <SectionHeader label="D" title="Work Experience" />

              {/* Work Table */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-800 text-white">
                      {[
                        "Organisation / Company",
                        "Designation",
                        "From",
                        "To",
                        "Nature of Work",
                        "",
                      ].map((h) => (
                        <th
                          key={h}
                          className="border border-slate-600 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <FieldArray name="workExperience">
                      {({ push, remove }) => (
                        <>
                          {values.workExperience.map((_, idx) => (
                            <tr
                              key={idx}
                              className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                            >
                              {[
                                "organisation",
                                "designation",
                                "from",
                                "to",
                                "natureOfWork",
                              ].map((field) => (
                                <td
                                  key={field}
                                  className="border border-slate-200 px-2 py-2"
                                >
                                  <Field
                                    name={`workExperience.${idx}.${field}`}
                                    type={
                                      field === "from" || field === "to"
                                        ? "month"
                                        : "text"
                                    }
                                    disabled={isReadOnly}
                                    placeholder="—"
                                    className="w-full rounded-lg border border-slate-200 bg-white/80 px-2 py-1.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white disabled:bg-slate-100 disabled:text-slate-400"
                                  />
                                </td>
                              ))}
                              <td className="border border-slate-200 px-2 py-2 text-center">
                                {!isReadOnly &&
                                  values.workExperience.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => remove(idx)}
                                      className="text-red-500 hover:text-red-700 text-xs font-semibold"
                                    >
                                      ✕
                                    </button>
                                  )}
                              </td>
                            </tr>
                          ))}
                          {!isReadOnly && (
                            <tr>
                              <td
                                colSpan={6}
                                className="border border-slate-200 px-3 py-2"
                              >
                                <button
                                  type="button"
                                  onClick={() => push(emptyWorkRow())}
                                  className="text-sm font-semibold text-slate-700 underline hover:text-slate-900"
                                >
                                  + Add more rows
                                </button>
                              </td>
                            </tr>
                          )}
                        </>
                      )}
                    </FieldArray>
                  </tbody>
                </table>
              </div>

              {/* Total & Relevant Experience */}
              <div className="mt-6 grid grid-cols-1 gap-5 rounded-2xl border border-slate-100 bg-slate-50 p-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Total Work Experience
                  </label>
                  <div className="flex items-center gap-3">
                    <Field
                      name="totalExpYears"
                      type="number"
                      min="0"
                      disabled={isReadOnly}
                      placeholder="0"
                      className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 disabled:bg-slate-100"
                    />
                    <span className="text-sm text-slate-600">Years</span>
                    <Field
                      name="totalExpMonths"
                      type="number"
                      min="0"
                      max="11"
                      disabled={isReadOnly}
                      placeholder="0"
                      className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 disabled:bg-slate-100"
                    />
                    <span className="text-sm text-slate-600">Months</span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Relevant Experience (in Startup Ecosystem)
                  </label>
                  <div className="flex items-center gap-3">
                    <Field
                      name="relevantExpYears"
                      type="number"
                      min="0"
                      disabled={isReadOnly}
                      placeholder="0"
                      className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 disabled:bg-slate-100"
                    />
                    <span className="text-sm text-slate-600">Years</span>
                    <Field
                      name="relevantExpMonths"
                      type="number"
                      min="0"
                      max="11"
                      disabled={isReadOnly}
                      placeholder="0"
                      className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 disabled:bg-slate-100"
                    />
                    <span className="text-sm text-slate-600">Months</span>
                  </div>
                </div>
              </div>
            </div>

            <NavButtons
              onPrevious={onPrevious}
              isSubmitting={isSubmitting}
              isReadOnly={isReadOnly}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}

function SectionHeader({ label, title }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
        {label}
      </span>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
    </div>
  );
}