import React, { useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";

const POST_OPTIONS = [
  "Consultant — Startup Ecosystem & Policy",
  "Consultant — Technology & Innovation",
  "Consultant — Finance & Investment",
  "Consultant — Mentorship & Capacity Building",
  "Consultant — Marketing & Branding",
  "Consultant — Legal & Compliance",
  "Consultant — Data Analytics & Research",
  "Consultant — Event Management",
  "Consultant — HR & Administration",
  "Other",
];

const GENDER_OPTIONS = ["Male", "Female", "Transgender", "Other"];
const CATEGORY_OPTIONS = ["General", "OBC", "SC", "ST", "EWS"];

const validationSchema = Yup.object().shape({
  postAppliedFor: Yup.string().required("Please select the post applied for"),
  fathersName: Yup.string().trim().required("Father's / Husband's name is required"),
  dateOfBirth: Yup.string().required("Date of birth is required"),
  gender: Yup.string().required("Gender is required"),
  category: Yup.string().required("Category is required"),
  nationality: Yup.string().trim().required("Nationality is required"),
  alternateNumber: Yup.string().matches(/^[0-9]{10}$/, "Must be 10 digits").nullable(),
  presentAddress: Yup.string().trim().required("Present address is required"),
  permanentAddressSameAsPresent: Yup.boolean(),
  permanentAddress: Yup.string().when("permanentAddressSameAsPresent", {
    is: false,
    then: (s) => s.trim().required("Permanent address is required"),
    otherwise: (s) => s.nullable(),
  }),
});

export default function PersonalDetailsStep({ onSubmit, onPrevious, initialValues, isReadOnly }) {
  const initial = {
    postAppliedFor: initialValues?.postAppliedFor || "",
    fathersName: initialValues?.fathersName || "",
    dateOfBirth: initialValues?.dateOfBirth || "",
    gender: initialValues?.gender || "",
    category: initialValues?.category || "",
    nationality: initialValues?.nationality || "Indian",
    alternateNumber: initialValues?.alternateNumber || "",
    presentAddress: initialValues?.presentAddress || "",
    permanentAddressSameAsPresent: initialValues?.permanentAddressSameAsPresent ?? true,
    permanentAddress: initialValues?.permanentAddress || "",
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6">
        <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          Step 2 of 6
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Personal Details
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Fill in your personal and contact information as per official records.
        </p>
      </div>

      <Formik
        initialValues={initial}
        validationSchema={validationSchema}
        onSubmit={(values) => onSubmit(values)}
        enableReinitialize
      >
        {({ values, errors, touched, isSubmitting }) => (
          <Form className="space-y-6">
            {/* Section A — Post Applied For */}
            <div className="rounded-[32px] border border-white/80 bg-white/72 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
              <SectionHeader label="A" title="Post Applied For" />
              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Post Applied For <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  name="postAppliedFor"
                  disabled={isReadOnly}
                  className={selectClass(errors.postAppliedFor && touched.postAppliedFor, isReadOnly)}
                >
                  <option value="">— Select Post —</option>
                  {POST_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </Field>
                <ErrorMessage name="postAppliedFor" component="p" className="mt-2 text-sm text-red-500" />
              </div>
            </div>

            {/* Section B — Personal Details */}
            <div className="rounded-[32px] border border-white/80 bg-white/72 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
              <SectionHeader label="B" title="Personal Details" />

              <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Father's/Husband's Name */}
                <FieldBlock
                  name="fathersName"
                  label="Father's / Husband's Name"
                  placeholder="Enter name"
                  errors={errors} touched={touched} disabled={isReadOnly}
                />

                {/* Date of Birth */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="date"
                    name="dateOfBirth"
                    disabled={isReadOnly}
                    className={inputClass(errors.dateOfBirth && touched.dateOfBirth, isReadOnly)}
                  />
                  <ErrorMessage name="dateOfBirth" component="p" className="mt-2 text-sm text-red-500" />
                </div>

                {/* Gender */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="gender"
                    disabled={isReadOnly}
                    className={selectClass(errors.gender && touched.gender, isReadOnly)}
                  >
                    <option value="">— Select —</option>
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="gender" component="p" className="mt-2 text-sm text-red-500" />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-3 pt-1">
                    {CATEGORY_OPTIONS.map((cat) => (
                      <label key={cat} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                        <Field
                          type="radio"
                          name="category"
                          value={cat}
                          disabled={isReadOnly}
                          className="accent-slate-800"
                        />
                        {cat}
                      </label>
                    ))}
                  </div>
                  <ErrorMessage name="category" component="p" className="mt-2 text-sm text-red-500" />
                </div>

                {/* Nationality */}
                <FieldBlock
                  name="nationality"
                  label="Nationality"
                  placeholder="e.g. Indian"
                  errors={errors} touched={touched} disabled={isReadOnly}
                />

                {/* Alternate Number */}
                <FieldBlock
                  name="alternateNumber"
                  label="Alternate Number"
                  placeholder="Optional"
                  maxLength={10}
                  errors={errors} touched={touched} disabled={isReadOnly}
                />
              </div>

              {/* Addresses */}
              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Present Address <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="textarea"
                    name="presentAddress"
                    rows={3}
                    disabled={isReadOnly}
                    placeholder="Full present address"
                    className={`${inputClass(errors.presentAddress && touched.presentAddress, isReadOnly)} resize-none`}
                  />
                  <ErrorMessage name="presentAddress" component="p" className="mt-2 text-sm text-red-500" />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-800">
                      Permanent Address
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                      <Field
                        type="checkbox"
                        name="permanentAddressSameAsPresent"
                        disabled={isReadOnly}
                        className="accent-slate-800"
                      />
                      Same as Present Address
                    </label>
                  </div>
                  {!values.permanentAddressSameAsPresent && (
                    <>
                      <Field
                        as="textarea"
                        name="permanentAddress"
                        rows={3}
                        disabled={isReadOnly}
                        placeholder="Full permanent address"
                        className={`${inputClass(errors.permanentAddress && touched.permanentAddress, isReadOnly)} resize-none`}
                      />
                      <ErrorMessage name="permanentAddress" component="p" className="mt-2 text-sm text-red-500" />
                    </>
                  )}
                </div>
              </div>
            </div>

            <NavButtons onPrevious={onPrevious} isSubmitting={isSubmitting} isReadOnly={isReadOnly} />
          </Form>
        )}
      </Formik>
    </div>
  );
}

/* ── Shared helpers ── */
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

function FieldBlock({ name, label, placeholder, type = "text", maxLength, errors, touched, disabled }) {
  const hasError = errors[name] && touched[name];
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        maxLength={maxLength}
        disabled={disabled}
        placeholder={placeholder}
        className={inputClass(hasError, disabled)}
      />
      <ErrorMessage name={name} component="p" className="mt-2 text-sm text-red-500" />
    </div>
  );
}

export function NavButtons({ onPrevious, isSubmitting, isReadOnly }) {
  return (
    <div className="flex items-center justify-between border-t border-slate-100 pt-5">
      <button
        type="button"
        onClick={onPrevious}
        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        ← Back
      </button>
      {!isReadOnly && (
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Saving...
            </>
          ) : (
            "Save & Continue →"
          )}
        </button>
      )}
    </div>
  );
}

export function inputClass(hasError, disabled) {
  return `block w-full rounded-2xl border px-4 py-3 text-slate-900 outline-none transition ${
    disabled
      ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
      : hasError
      ? "border-red-400 bg-red-50"
      : "border-slate-200 bg-white/85 focus:border-slate-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(148,163,184,0.10)]"
  }`;
}

export function selectClass(hasError, disabled) {
  return `block w-full rounded-2xl border px-4 py-3 text-slate-900 outline-none transition ${
    disabled
      ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
      : hasError
      ? "border-red-400 bg-red-50"
      : "border-slate-200 bg-white/85 focus:border-slate-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(148,163,184,0.10)]"
  }`;
}