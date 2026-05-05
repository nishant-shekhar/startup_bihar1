import React from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { NavButtons, inputClass } from "./PersonalDetailsStep";

const DOCUMENTS = [
  { key: "cv", label: "Upload updated CV" },
  { key: "photograph", label: "Recent Passport-size Photograph" },
  { key: "dobProof", label: "Date of Birth proof (10th Certificate/Marksheet)" },
  { key: "aadhaar", label: "Aadhaar Card / Photo ID Proof" },
  { key: "degreePdf", label: "All Educational Degree Certificates & Marksheets (from 10th onwards in a single PDF)" },
  { key: "workExpCert", label: "Work Experience Certificates" },
  { key: "salarySLip", label: "Last Drawn Salary Slip (if applicable)" },
  { key: "caProfMembership", label: "CA / Professional Membership Certificate (if applicable)" },
];

const emptyRef = () => ({
  name: "",
  orgDesignation: "",
  contactNumber: "",
  email: "",
});

const validationSchema = Yup.object().shape({
  references: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().nullable(),
      orgDesignation: Yup.string().nullable(),
      contactNumber: Yup.string().nullable(),
      email: Yup.string().email("Invalid email").nullable(),
    })
  ),
  place: Yup.string().trim().required("Place is required"),
  declarationDate: Yup.string().required("Date is required"),
  declarationAccepted: Yup.boolean().oneOf([true], "You must accept the declaration to submit"),
});

export default function ReferencesAndDocsStep({
  onSubmit,
  onPrevious,
  initialValues,
  isReadOnly,
}) {
  const initial = {
    references:
      initialValues?.references && initialValues.references.length >= 2
        ? initialValues.references
        : [emptyRef(), emptyRef()],
    documents: initialValues?.documents || {},
    documentFiles: {},
    place: initialValues?.place || "",
    declarationDate: initialValues?.declarationDate || new Date().toISOString().split("T")[0],
    declarationAccepted: initialValues?.declarationAccepted || false,
    signatureMeta: initialValues?.signatureMeta || null,
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6">
        <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          Step 6 of 6
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          References, Documents &amp; Declaration
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Provide two references, upload required documents and accept the
          declaration to complete your application.
        </p>
      </div>

      <Formik
        initialValues={initial}
        validationSchema={validationSchema}
        onSubmit={(values) => onSubmit(values)}
        enableReinitialize
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
          <Form className="space-y-6">

            {/* Section F — References */}
            <div className="rounded-[32px] border border-white/80 bg-white/72 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
              <SectionHeader label="F" title="References" />

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-800 text-white">
                      {["#", "Referee Name", "Organisation & Designation", "Contact Number", "Email"].map((h) => (
                        <th key={h} className="border border-slate-600 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <FieldArray name="references">
                      {() =>
                        values.references.map((_, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                            <td className="border border-slate-200 px-3 py-2 text-center text-sm font-semibold text-slate-600">
                              {idx + 1}
                            </td>
                            {["name", "orgDesignation", "contactNumber", "email"].map((field) => (
                              <td key={field} className="border border-slate-200 px-2 py-2">
                                <Field
                                  name={`references.${idx}.${field}`}
                                  type={field === "email" ? "email" : "text"}
                                  maxLength={field === "contactNumber" ? 10 : undefined}
                                  disabled={isReadOnly}
                                  placeholder="—"
                                  className="w-full rounded-lg border border-slate-200 bg-white/80 px-2 py-1.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white disabled:bg-slate-100 disabled:text-slate-400"
                                />
                              </td>
                            ))}
                          </tr>
                        ))
                      }
                    </FieldArray>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section G — Upload Documents */}
            <div className="rounded-[32px] border border-white/80 bg-white/72 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
              <SectionHeader label="G" title="Upload Documents (Enclose self-attested copies)" />

              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-800 text-white">
                      <th className="border border-slate-600 px-3 py-3 text-left text-xs font-semibold uppercase w-8">✓</th>
                      <th className="border border-slate-600 px-3 py-3 text-left text-xs font-semibold uppercase">Document</th>
                      <th className="border border-slate-600 px-3 py-3 text-left text-xs font-semibold uppercase w-48">Upload</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DOCUMENTS.map((doc, idx) => {
                      const uploaded = values.documents?.[doc.key]?.downloadURL || values.documentFiles?.[doc.key];
                      return (
                        <tr key={doc.key} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                          <td className="border border-slate-200 px-3 py-3 text-center">
                            {uploaded ? (
                              <span className="text-emerald-600 font-bold">✓</span>
                            ) : (
                              <span className="text-slate-300">[ ]</span>
                            )}
                          </td>
                          <td className="border border-slate-200 px-3 py-3 text-slate-700">
                            {doc.label}
                          </td>
                          <td className="border border-slate-200 px-3 py-3">
                            {!isReadOnly ? (
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                disabled={isReadOnly}
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  setFieldValue(`documentFiles.${doc.key}`, file);
                                }}
                                className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                              />
                            ) : uploaded ? (
                              <a
                                href={values.documents?.[doc.key]?.downloadURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-semibold text-indigo-600 underline"
                              >
                                View
                              </a>
                            ) : (
                              <span className="text-xs text-slate-400">Not uploaded</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section H — Declaration */}
            <div className="rounded-[32px] border border-white/80 bg-white/72 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
              <SectionHeader label="H" title="Declaration" />

              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 px-5 py-4 text-sm text-amber-900 leading-relaxed">
                I hereby declare that all the information furnished in this application form is true, complete, and correct to
                the best of my knowledge and belief. I understand that in the event of any information being found false or
                incorrect at any stage, my candidature/appointment is liable to be cancelled/terminated without any notice
                or compensation. I have read and understood the eligibility criteria and terms of engagement for the applied
                position.
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Place <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="place"
                    disabled={isReadOnly}
                    placeholder="City / Town"
                    className={inputClass(errors.place && touched.place, isReadOnly)}
                  />
                  {errors.place && touched.place && (
                    <p className="mt-1 text-sm text-red-500">{errors.place}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="date"
                    name="declarationDate"
                    disabled={isReadOnly}
                    className={inputClass(errors.declarationDate && touched.declarationDate, isReadOnly)}
                  />
                  {errors.declarationDate && touched.declarationDate && (
                    <p className="mt-1 text-sm text-red-500">{errors.declarationDate}</p>
                  )}
                </div>
              </div>

              {/* Signature Upload */}
              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Upload Applicant's Signature (PNG/JPG, max 200KB)
                </label>
                {!isReadOnly ? (
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setFieldValue("signatureFile", file);
                    }}
                    className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                  />
                ) : values.signatureMeta?.downloadURL ? (
                  <img
                    src={values.signatureMeta.downloadURL}
                    alt="Applicant Signature"
                    className="mt-2 h-16 rounded border border-slate-200 bg-white object-contain px-3"
                  />
                ) : (
                  <p className="text-sm text-slate-400">No signature uploaded</p>
                )}
              </div>

              {/* Declaration Checkbox */}
              {!isReadOnly && (
                <div className="mt-5">
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-700">
                    <Field
                      type="checkbox"
                      name="declarationAccepted"
                      className="mt-0.5 h-4 w-4 accent-slate-800"
                    />
                    <span>
                      I have read and accept the above declaration. I confirm all
                      information provided is true to the best of my knowledge.
                    </span>
                  </label>
                  {errors.declarationAccepted && touched.declarationAccepted && (
                    <p className="mt-2 text-sm text-red-500">{errors.declarationAccepted}</p>
                  )}
                </div>
              )}
            </div>

            <NavButtons
              onPrevious={onPrevious}
              isSubmitting={isSubmitting}
              isReadOnly={isReadOnly}
              submitLabel="Save & Preview →"
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