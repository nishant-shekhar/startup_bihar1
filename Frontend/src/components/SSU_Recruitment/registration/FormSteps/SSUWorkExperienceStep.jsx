import React, { useMemo } from "react";
import { Field, FieldArray, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBriefcase,
  FaInfoCircle,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

const emptyExperience = {
  organisation: "",
  designation: "",
  from: "",
  to: "",
  currentlyWorking: false,
  natureOfWork: "",
};

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  label: `${index} Month${index === 1 ? "" : "s"}`,
  value: String(index),
}));

const YEAR_OPTIONS = Array.from({ length: 41 }, (_, index) => ({
  label: `${index} Year${index === 1 ? "" : "s"}`,
  value: String(index),
}));

const inputClass =
  "block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:shadow-[0_0_0_4px_rgba(148,163,184,0.12)] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

const labelClass = "mb-2 block text-sm font-semibold text-slate-800";

const buildInitialValues = (initialValues) => ({
  totalExpYears: initialValues?.totalExpYears || "",
  totalExpMonths: initialValues?.totalExpMonths || "0",
  relevantExpYears: initialValues?.relevantExpYears || "",
  relevantExpMonths: initialValues?.relevantExpMonths || "0",
  workExperience:
    initialValues?.workExperience?.length > 0
      ? initialValues.workExperience
      : [{ ...emptyExperience }],
  experienceDeclaration: initialValues?.experienceDeclaration || false,
});

const validationSchema = Yup.object().shape({
  totalExpYears: Yup.number()
    .typeError("Select years")
    .min(0, "Invalid value")
    .max(40, "Invalid value")
    .required("Total experience years is required"),

  totalExpMonths: Yup.number()
    .typeError("Select months")
    .min(0, "Invalid value")
    .max(11, "Months must be 0-11")
    .required("Total experience months is required"),

  relevantExpYears: Yup.number()
    .typeError("Select years")
    .min(0, "Invalid value")
    .max(40, "Invalid value")
    .required("Relevant experience years is required"),

  relevantExpMonths: Yup.number()
    .typeError("Select months")
    .min(0, "Invalid value")
    .max(11, "Months must be 0-11")
    .required("Relevant experience months is required"),

  workExperience: Yup.array()
    .of(
      Yup.object().shape({
        organisation: Yup.string().trim().required("Organisation is required"),
        designation: Yup.string().trim().required("Designation is required"),
        from: Yup.string().required("From date is required"),
        to: Yup.string().when("currentlyWorking", {
          is: false,
          then: (schema) => schema.required("To date is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
        currentlyWorking: Yup.boolean(),
        natureOfWork: Yup.string().trim().required("Nature of work is required"),
      })
    )
    .min(1, "Add at least one experience"),

  experienceDeclaration: Yup.boolean().oneOf(
    [true],
    "Please confirm that you meet the required experience criteria for the selected post."
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

function TextField({
  name,
  label,
  type = "text",
  placeholder,
  disabled,
  as,
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>

      <Field
        as={as}
        type={type}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        className={`${inputClass} ${
          as === "textarea" ? "min-h-[104px] resize-none" : ""
        }`}
      />

      <ErrorText name={name} />
    </div>
  );
}

function SelectField({ name, label, disabled, children }) {
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

function ExperienceDurationGroup({
  title,
  subtitle,
  yearsName,
  monthsName,
  values,
  disabled,
}) {
  const yearsValue = values?.[yearsName];
  const monthsValue = values?.[monthsName];

  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4">
      <div className="mb-4">
        <div className="text-sm font-bold text-slate-900">{title}</div>
        <div className="mt-1 text-xs leading-relaxed text-slate-500">
          {subtitle}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField name={yearsName} label="Years" disabled={disabled}>
          <option value="">Select Years</option>
          {YEAR_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </SelectField>

        <SelectField name={monthsName} label="Months" disabled={disabled}>
          {MONTH_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="mt-4 rounded-2xl border border-white bg-white px-4 py-3 text-sm font-semibold text-slate-700">
        Selected:{" "}
        <span className="text-slate-950">
          {yearsValue !== "" && yearsValue !== undefined ? yearsValue : "-"}{" "}
          Year
          {String(yearsValue) === "1" ? "" : "s"}{" "}
          {monthsValue !== "" && monthsValue !== undefined ? monthsValue : "0"}{" "}
          Month
          {String(monthsValue) === "1" ? "" : "s"}
        </span>
      </div>
    </div>
  );
}

function RequiredExperienceBox({ selectedPost }) {
  if (!selectedPost) {
    return (
      <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
        Select post in Personal Details first to view required experience.
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-indigo-100 bg-indigo-50/80 p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-700 text-white">
          <FaBriefcase />
        </div>

        <div>
          <div className="text-lg font-bold text-indigo-950">
            Required Experience for {selectedPost.postName}
          </div>
          <div className="text-sm text-indigo-700">
            {selectedPost.level} • {selectedPost.category} •{" "}
            {selectedPost.emoluments}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-indigo-100 bg-white px-4 py-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-indigo-400">
          As per ToR
        </div>
        <div className="mt-1 text-sm font-bold leading-relaxed text-slate-900">
          {selectedPost.experience}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        <div className="flex gap-2">
          <FaInfoCircle className="mt-0.5 shrink-0" />
          <span>
            Enter total experience and relevant experience carefully. These
            details will be verified with uploaded experience documents and
            departmental scrutiny.
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SSUWorkExperienceStep({
  onSubmit,
  onPrevious,
  initialValues,
  isReadOnly = false,
  formData,
}) {
  const formInitialValues = useMemo(
    () => buildInitialValues(initialValues),
    [initialValues]
  );

  const selectedPost = formData?.personalDetails?.postEligibilitySnapshot || null;

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setStatus("");

    const cleaned = {
      selectedPostEligibilitySnapshot: selectedPost || null,

      totalExpYears: String(values.totalExpYears || "0"),
      totalExpMonths: String(values.totalExpMonths || "0"),
      relevantExpYears: String(values.relevantExpYears || "0"),
      relevantExpMonths: String(values.relevantExpMonths || "0"),

      totalExperienceText: `${String(values.totalExpYears || "0")} Year${
        String(values.totalExpYears) === "1" ? "" : "s"
      } ${String(values.totalExpMonths || "0")} Month${
        String(values.totalExpMonths) === "1" ? "" : "s"
      }`,

      relevantExperienceText: `${String(values.relevantExpYears || "0")} Year${
        String(values.relevantExpYears) === "1" ? "" : "s"
      } ${String(values.relevantExpMonths || "0")} Month${
        String(values.relevantExpMonths) === "1" ? "" : "s"
      }`,

      workExperience: values.workExperience.map((item) => ({
        organisation: String(item.organisation || "").trim(),
        designation: String(item.designation || "").trim(),
        from: item.from || "",
        to: item.currentlyWorking ? "Present" : item.to || "",
        currentlyWorking: !!item.currentlyWorking,
        natureOfWork: String(item.natureOfWork || "").trim(),
      })),

      experienceDeclaration: values.experienceDeclaration === true,
      requiredExperienceText: selectedPost?.experience || "",
      updatedAtIso: new Date().toISOString(),
    };

    const result = await onSubmit?.(cleaned);

    if (result?.ok === false) {
      setStatus(result.error || "Could not save work experience.");
    }

    setSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 rounded-[32px] border border-white/80 bg-white/78 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-7">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
            <FaBriefcase />
            Step 4
          </div>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Work Experience
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
            Add total experience, relevant experience and employment history as
            per the ToR requirement for your selected post.
          </p>
        </div>
      </div>

      <RequiredExperienceBox selectedPost={selectedPost} />

      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, isSubmitting, status, setFieldValue }) => (
          <Form className="mt-6 space-y-6">
            <div className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <FaBriefcase />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Experience Summary
                  </h3>
                  <p className="text-sm text-slate-500">
                    Select experience duration in years and months.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <ExperienceDurationGroup
                  title="Total Experience"
                  subtitle="Overall professional experience across all roles."
                  yearsName="totalExpYears"
                  monthsName="totalExpMonths"
                  values={values}
                  disabled={isReadOnly}
                />

                <ExperienceDurationGroup
                  title="Relevant Experience"
                  subtitle="Experience relevant to the selected post."
                  yearsName="relevantExpYears"
                  monthsName="relevantExpMonths"
                  values={values}
                  disabled={isReadOnly}
                />
              </div>
            </div>

            <FieldArray name="workExperience">
              {({ push, remove }) => (
                <div className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
                  <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Employment History
                      </h3>
                      <p className="text-sm text-slate-500">
                        Add one or more work experience records.
                      </p>
                    </div>

                    {!isReadOnly ? (
                      <button
                        type="button"
                        onClick={() => push({ ...emptyExperience })}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <FaPlus />
                        Add Experience
                      </button>
                    ) : null}
                  </div>

                  <div className="space-y-5">
                    {values.workExperience.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <div className="font-semibold text-slate-900">
                            Experience {index + 1}
                          </div>

                          {!isReadOnly && values.workExperience.length > 1 ? (
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

                        <div className="grid gap-5 md:grid-cols-2">
                          <TextField
                            name={`workExperience.${index}.organisation`}
                            label="Organisation"
                            placeholder="Organisation name"
                            disabled={isReadOnly}
                          />

                          <TextField
                            name={`workExperience.${index}.designation`}
                            label="Designation"
                            placeholder="Designation"
                            disabled={isReadOnly}
                          />

                          <TextField
                            name={`workExperience.${index}.from`}
                            label="From"
                            type="date"
                            disabled={isReadOnly}
                          />

                          <div>
                            <TextField
                              name={`workExperience.${index}.to`}
                              label="To"
                              type="date"
                              disabled={isReadOnly || item.currentlyWorking}
                            />

                            <label className="mt-3 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
                              <Field
                                type="checkbox"
                                name={`workExperience.${index}.currentlyWorking`}
                                disabled={isReadOnly}
                                className="h-4 w-4 rounded border-slate-300"
                                onChange={(e) => {
                                  setFieldValue(
                                    `workExperience.${index}.currentlyWorking`,
                                    e.target.checked
                                  );

                                  if (e.target.checked) {
                                    setFieldValue(
                                      `workExperience.${index}.to`,
                                      ""
                                    );
                                  }
                                }}
                              />
                              Currently working here
                            </label>
                          </div>

                          <div className="md:col-span-2">
                            <TextField
                              name={`workExperience.${index}.natureOfWork`}
                              label="Nature of Work / Responsibilities"
                              placeholder="Briefly describe your role and work"
                              disabled={isReadOnly}
                              as="textarea"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </FieldArray>

            <label className="flex items-start gap-3 rounded-[28px] border border-indigo-100 bg-indigo-50/80 px-5 py-4">
              <Field
                type="checkbox"
                name="experienceDeclaration"
                disabled={isReadOnly}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />

              <span className="text-sm leading-relaxed text-indigo-950">
                I confirm that I meet the required experience criteria for the
                selected post as per the ToR. I understand that proof of
                experience will be verified by the department.
              </span>
            </label>
            <ErrorText name="experienceDeclaration" />

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