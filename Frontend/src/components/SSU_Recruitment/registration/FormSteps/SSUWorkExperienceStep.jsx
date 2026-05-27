import React, { useMemo } from "react";
import { Field, FieldArray, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBriefcase,
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

const inputClass =
  "block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:shadow-[0_0_0_4px_rgba(148,163,184,0.12)] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

const labelClass = "mb-2 block text-sm font-semibold text-slate-800";

const buildInitialValues = (initialValues) => ({
  totalExpYears: initialValues?.totalExpYears || "",
  totalExpMonths: initialValues?.totalExpMonths || "",
  relevantExpYears: initialValues?.relevantExpYears || "",
  relevantExpMonths: initialValues?.relevantExpMonths || "",
  workExperience:
    initialValues?.workExperience?.length > 0
      ? initialValues.workExperience
      : [{ ...emptyExperience }],
});

const validationSchema = Yup.object().shape({
  totalExpYears: Yup.number()
    .typeError("Enter years")
    .min(0, "Invalid value")
    .max(60, "Invalid value")
    .required("Total experience years is required"),
  totalExpMonths: Yup.number()
    .typeError("Enter months")
    .min(0, "Invalid value")
    .max(11, "Months must be 0-11")
    .required("Total experience months is required"),
  relevantExpYears: Yup.number()
    .typeError("Enter years")
    .min(0, "Invalid value")
    .max(60, "Invalid value")
    .required("Relevant experience years is required"),
  relevantExpMonths: Yup.number()
    .typeError("Enter months")
    .min(0, "Invalid value")
    .max(11, "Months must be 0-11")
    .required("Relevant experience months is required"),
  workExperience: Yup.array().of(
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
        className={`${inputClass} ${as === "textarea" ? "min-h-[104px] resize-none" : ""}`}
      />
      <ErrorText name={name} />
    </div>
  );
}

export default function SSUWorkExperienceStep({
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
      totalExpYears: String(values.totalExpYears || "0"),
      totalExpMonths: String(values.totalExpMonths || "0"),
      relevantExpYears: String(values.relevantExpYears || "0"),
      relevantExpMonths: String(values.relevantExpMonths || "0"),
      workExperience: values.workExperience.map((item) => ({
        organisation: String(item.organisation || "").trim(),
        designation: String(item.designation || "").trim(),
        from: item.from || "",
        to: item.currentlyWorking ? "Present" : item.to || "",
        currentlyWorking: !!item.currentlyWorking,
        natureOfWork: String(item.natureOfWork || "").trim(),
      })),
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
            Add total experience, relevant experience and employment history.
          </p>
        </div>
      </div>

      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, isSubmitting, status, setFieldValue }) => (
          <Form className="space-y-6">
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
                    Mention total and relevant experience
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-4">
                <TextField
                  name="totalExpYears"
                  label="Total Exp. Years"
                  type="number"
                  disabled={isReadOnly}
                />
                <TextField
                  name="totalExpMonths"
                  label="Total Exp. Months"
                  type="number"
                  disabled={isReadOnly}
                />
                <TextField
                  name="relevantExpYears"
                  label="Relevant Exp. Years"
                  type="number"
                  disabled={isReadOnly}
                />
                <TextField
                  name="relevantExpMonths"
                  label="Relevant Exp. Months"
                  type="number"
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
                        Add one or more work experience records
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
                                    setFieldValue(`workExperience.${index}.to`, "");
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