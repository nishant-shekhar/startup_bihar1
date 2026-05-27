import React, { useMemo } from "react";
import { FieldArray, Form, Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBook,
  FaCertificate,
  FaGraduationCap,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

const CURRENT_YEAR = new Date().getFullYear();

const DEGREE_OPTIONS = [
  "10th / Matriculation",
  "12th / Intermediate",
  "Diploma",
  "Graduation",
  "Post Graduation",
  "MBA / PGDM",
  "M.Tech / ME",
  "PhD",
  "Other",
];

const STATUS_OPTIONS = ["Completed", "Pursuing"];

const emptyEducation = {
  degree: "",
  otherDegree: "",
  institution: "",
  boardUniversity: "",
  specialisation: "",
  yearOfPassing: "",
  percentage: "",
  status: "",
};

const emptyCertification = {
  certName: "",
  issuingOrg: "",
  year: "",
  duration: "",
};

const inputClass =
  "block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:shadow-[0_0_0_4px_rgba(148,163,184,0.12)] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

const labelClass = "mb-2 block text-sm font-semibold text-slate-800";

const buildInitialValues = (initialValues) => ({
  education:
    initialValues?.education?.length > 0
      ? initialValues.education
      : [{ ...emptyEducation }],
  certifications:
    initialValues?.certifications?.length > 0
      ? initialValues.certifications
      : [{ ...emptyCertification }],
});

const validationSchema = Yup.object().shape({
  education: Yup.array()
    .of(
      Yup.object().shape({
        degree: Yup.string().required("Qualification is required"),
        otherDegree: Yup.string().when("degree", {
          is: "Other",
          then: (schema) => schema.trim().required("Mention qualification"),
          otherwise: (schema) => schema.notRequired(),
        }),
        institution: Yup.string().trim().required("Institution is required"),
        boardUniversity: Yup.string().trim().required("Board/University is required"),
        specialisation: Yup.string().trim(),
        yearOfPassing: Yup.number()
          .typeError("Enter valid year")
          .min(1950, "Invalid year")
          .max(CURRENT_YEAR + 5, "Invalid year")
          .required("Year is required"),
        percentage: Yup.string().trim().required("% / CGPA is required"),
        status: Yup.string().required("Status is required"),
      })
    )
    .min(1, "Add at least one qualification"),
  certifications: Yup.array().of(
    Yup.object().shape({
      certName: Yup.string().trim(),
      issuingOrg: Yup.string().trim(),
      year: Yup.string().trim(),
      duration: Yup.string().trim(),
    })
  ),
});

function ErrorText({ name }) {
  return (
    <ErrorMessage
      name={name}
      component="div"
      className="mt-1 text-xs font-medium text-red-600"
    />
  );
}

function TextField({ name, label, placeholder, type = "text", disabled }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <Field
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClass}
      />
      <ErrorText name={name} />
    </div>
  );
}

function SelectField({ name, label, children, disabled }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <Field as="select" name={name} disabled={disabled} className={inputClass}>
        {children}
      </Field>
      <ErrorText name={name} />
    </div>
  );
}

export default function SSUEducationalQualificationsStep({
  onSubmit,
  onPrevious,
  initialValues,
  isReadOnly = false,
}) {
  const formInitialValues = useMemo(
    () => buildInitialValues(initialValues),
    [initialValues]
  );

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setStatus("");

    const cleaned = {
      education: values.education.map((item) => ({
        ...item,
        degree:
          item.degree === "Other"
            ? String(item.otherDegree || "").trim()
            : item.degree,
        originalDegree: item.degree,
        institution: String(item.institution || "").trim(),
        boardUniversity: String(item.boardUniversity || "").trim(),
        specialisation: String(item.specialisation || "").trim(),
        yearOfPassing: String(item.yearOfPassing || "").trim(),
        percentage: String(item.percentage || "").trim(),
        status: item.status || "",
      })),
      certifications: values.certifications
        .filter(
          (item) =>
            item.certName ||
            item.issuingOrg ||
            item.year ||
            item.duration
        )
        .map((item) => ({
          certName: String(item.certName || "").trim(),
          issuingOrg: String(item.issuingOrg || "").trim(),
          year: String(item.year || "").trim(),
          duration: String(item.duration || "").trim(),
        })),
      updatedAtIso: new Date().toISOString(),
    };

    const result = await onSubmit?.(cleaned);

    if (result?.ok === false) {
      setStatus(result.error || "Could not save educational details.");
    }

    setSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 rounded-[32px] border border-white/80 bg-white/78 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <FaGraduationCap />
              Step 3
            </div>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Educational Qualifications
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
              Add academic qualifications and relevant certifications.
            </p>
          </div>
        </div>
      </div>

      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, isSubmitting, status }) => (
          <Form className="space-y-6">
            <FieldArray name="education">
              {({ push, remove }) => (
                <div className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
                  <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                        <FaBook />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          Academic Qualifications
                        </h3>
                        <p className="text-sm text-slate-500">
                          Add highest and relevant qualifications
                        </p>
                      </div>
                    </div>

                    {!isReadOnly ? (
                      <button
                        type="button"
                        onClick={() => push({ ...emptyEducation })}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <FaPlus />
                        Add Qualification
                      </button>
                    ) : null}
                  </div>

                  <div className="space-y-5">
                    {values.education.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <div className="font-semibold text-slate-900">
                            Qualification {index + 1}
                          </div>

                          {!isReadOnly && values.education.length > 1 ? (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
                            >
                              <FaTrash />
                              Remove
                            </button>
                          ) : null}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <SelectField
                            name={`education.${index}.degree`}
                            label="Qualification"
                            disabled={isReadOnly}
                          >
                            <option value="">Select Qualification</option>
                            {DEGREE_OPTIONS.map((degree) => (
                              <option key={degree} value={degree}>
                                {degree}
                              </option>
                            ))}
                          </SelectField>

                          {item.degree === "Other" ? (
                            <TextField
                              name={`education.${index}.otherDegree`}
                              label="Mention Qualification"
                              placeholder="Enter qualification"
                              disabled={isReadOnly}
                            />
                          ) : (
                            <TextField
                              name={`education.${index}.specialisation`}
                              label="Specialisation / Subject"
                              placeholder="Enter specialisation"
                              disabled={isReadOnly}
                            />
                          )}

                          {item.degree === "Other" ? (
                            <TextField
                              name={`education.${index}.specialisation`}
                              label="Specialisation / Subject"
                              placeholder="Enter specialisation"
                              disabled={isReadOnly}
                            />
                          ) : null}

                          <TextField
                            name={`education.${index}.institution`}
                            label="Institution / College"
                            placeholder="Enter institution name"
                            disabled={isReadOnly}
                          />

                          <TextField
                            name={`education.${index}.boardUniversity`}
                            label="Board / University"
                            placeholder="Enter board/university"
                            disabled={isReadOnly}
                          />

                          <TextField
                            name={`education.${index}.yearOfPassing`}
                            label="Year of Passing"
                            type="number"
                            placeholder="YYYY"
                            disabled={isReadOnly}
                          />

                          <TextField
                            name={`education.${index}.percentage`}
                            label="% / CGPA"
                            placeholder="Enter percentage or CGPA"
                            disabled={isReadOnly}
                          />

                          <SelectField
                            name={`education.${index}.status`}
                            label="Status"
                            disabled={isReadOnly}
                          >
                            <option value="">Select Status</option>
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </SelectField>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </FieldArray>

            <FieldArray name="certifications">
              {({ push, remove }) => (
                <div className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
                  <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-700 text-white">
                        <FaCertificate />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          Certifications
                        </h3>
                        <p className="text-sm text-slate-500">
                          Optional but recommended
                        </p>
                      </div>
                    </div>

                    {!isReadOnly ? (
                      <button
                        type="button"
                        onClick={() => push({ ...emptyCertification })}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <FaPlus />
                        Add Certification
                      </button>
                    ) : null}
                  </div>

                  <div className="space-y-5">
                    {values.certifications.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <div className="font-semibold text-slate-900">
                            Certification {index + 1}
                          </div>

                          {!isReadOnly && values.certifications.length > 1 ? (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
                            >
                              <FaTrash />
                              Remove
                            </button>
                          ) : null}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <TextField
                            name={`certifications.${index}.certName`}
                            label="Certification Name"
                            placeholder="Enter certification name"
                            disabled={isReadOnly}
                          />

                          <TextField
                            name={`certifications.${index}.issuingOrg`}
                            label="Issuing Organisation"
                            placeholder="Enter organisation"
                            disabled={isReadOnly}
                          />

                          <TextField
                            name={`certifications.${index}.year`}
                            label="Year"
                            placeholder="YYYY"
                            disabled={isReadOnly}
                          />

                          <TextField
                            name={`certifications.${index}.duration`}
                            label="Duration"
                            placeholder="Example: 3 months"
                            disabled={isReadOnly}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </FieldArray>

            {status ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {status}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 rounded-[28px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={onPrevious}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                <FaArrowLeft />
                Back
              </button>

              {!isReadOnly ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
                >
                  {isSubmitting ? "Saving..." : "Save & Continue"}
                  <FaArrowRight />
                </button>
              ) : null}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}