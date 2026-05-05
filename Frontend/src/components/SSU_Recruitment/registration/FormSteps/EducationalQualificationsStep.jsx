import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { NavButtons, inputClass } from "./PersonalDetailsStep";

const DEGREE_ROWS = [
  "10th / Matriculation",
  "12th / Intermediate",
  "Bachelor's Degree",
  "Master's / PG Diploma",
  "Ph.D. / Other",
];

const STATUS_OPTIONS = ["Completed", "Pursuing", "Not Applicable"];

const emptyEduRow = (degree = "") => ({
  degree,
  institution: "",
  specialisation: "",
  yearOfPassing: "",
  percentage: "",
  status: "",
});

const emptyCert = () => ({
  certName: "",
  issuingOrg: "",
  year: "",
  duration: "",
});

const validationSchema = Yup.object().shape({
  education: Yup.array().of(
    Yup.object().shape({
      institution: Yup.string().nullable(),
      yearOfPassing: Yup.string().nullable(),
      percentage: Yup.string().nullable(),
      status: Yup.string().nullable(),
    })
  ),
  certifications: Yup.array().of(
    Yup.object().shape({
      certName: Yup.string().nullable(),
    })
  ),
});

export default function EducationalQualificationsStep({
  onSubmit,
  onPrevious,
  initialValues,
  isReadOnly,
}) {
  const initial = {
    education:
      initialValues?.education ||
      DEGREE_ROWS.map((d) => emptyEduRow(d)),
    certifications:
      initialValues?.certifications && initialValues.certifications.length > 0
        ? initialValues.certifications
        : [emptyCert(), emptyCert()],
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6">
        <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          Step 3 of 6
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Educational Qualifications
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Provide your academic background and any professional certifications.
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
            {/* Section C — Education */}
            <div className="rounded-[32px] border border-white/80 bg-white/72 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
              <SectionHeader label="C" title="Educational Qualifications" />

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-800 text-white">
                      {[
                        "Degree / Course",
                        "Institution / University",
                        "Specialisation / Stream",
                        "Year of Passing",
                        "% / CGPA",
                        "Status",
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
                    <FieldArray name="education">
                      {() =>
                        values.education.map((row, idx) => (
                          <tr
                            key={idx}
                            className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                          >
                            <td className="border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
                              {row.degree}
                            </td>
                            {[
                              "institution",
                              "specialisation",
                              "yearOfPassing",
                              "percentage",
                            ].map((field) => (
                              <td
                                key={field}
                                className="border border-slate-200 px-2 py-2"
                              >
                                <Field
                                  name={`education.${idx}.${field}`}
                                  disabled={isReadOnly}
                                  placeholder="—"
                                  className="w-full rounded-lg border border-slate-200 bg-white/80 px-2 py-1.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white disabled:bg-slate-100 disabled:text-slate-400"
                                />
                              </td>
                            ))}
                            <td className="border border-slate-200 px-2 py-2">
                              <Field
                                as="select"
                                name={`education.${idx}.status`}
                                disabled={isReadOnly}
                                className="w-full rounded-lg border border-slate-200 bg-white/80 px-2 py-1.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:bg-slate-100 disabled:text-slate-400"
                              >
                                <option value="">—</option>
                                {STATUS_OPTIONS.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </Field>
                            </td>
                          </tr>
                        ))
                      }
                    </FieldArray>
                  </tbody>
                </table>
              </div>

              {/* Professional Certifications */}
              <div className="mt-8">
                <p className="mb-3 text-sm font-semibold text-slate-700">
                  Professional Certifications / Courses (if any):
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-800 text-white">
                        {[
                          "Certification Name",
                          "Issuing Organisation",
                          "Year",
                          "Duration",
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
                      <FieldArray name="certifications">
                        {({ push, remove }) => (
                          <>
                            {values.certifications.map((_, idx) => (
                              <tr
                                key={idx}
                                className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                              >
                                {["certName", "issuingOrg", "year", "duration"].map(
                                  (field) => (
                                    <td
                                      key={field}
                                      className="border border-slate-200 px-2 py-2"
                                    >
                                      <Field
                                        name={`certifications.${idx}.${field}`}
                                        disabled={isReadOnly}
                                        placeholder="—"
                                        className="w-full rounded-lg border border-slate-200 bg-white/80 px-2 py-1.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:bg-slate-100 disabled:text-slate-400"
                                      />
                                    </td>
                                  )
                                )}
                                <td className="border border-slate-200 px-2 py-2 text-center">
                                  {!isReadOnly && values.certifications.length > 1 && (
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
                                <td colSpan={5} className="border border-slate-200 px-3 py-2">
                                  <button
                                    type="button"
                                    onClick={() => push(emptyCert())}
                                    className="text-sm font-semibold text-slate-700 underline hover:text-slate-900"
                                  >
                                    + Add row
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