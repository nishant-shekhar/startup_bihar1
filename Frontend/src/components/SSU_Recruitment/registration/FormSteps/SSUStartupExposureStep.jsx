import React, { useMemo } from "react";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBuilding,
  FaLightbulb,
  FaRocket,
} from "react-icons/fa";

const inputClass =
  "block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:shadow-[0_0_0_4px_rgba(148,163,184,0.12)] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

const labelClass = "mb-2 block text-sm font-semibold text-slate-800";

const YES_NO = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

const DOMAIN_OPTIONS = [
  "Startup Ecosystem",
  "Incubation",
  "Investment / Finance",
  "Technology / Innovation",
  "Policy / Governance",
  "Program Management",
  "Research & Documentation",
  "Public Sector / Government Projects",
  "Training / Capacity Building",
  "Marketing / Outreach",
  "Other",
];

const buildInitialValues = (initialValues) => ({
  workedWithStartupEcosystem:
    initialValues?.workedWithStartupEcosystem || "",
  startupEcosystemDetails:
    initialValues?.startupEcosystemDetails || "",
  ecosystemIncubators:
    initialValues?.ecosystemIncubators || "",

  govtPublicSectorExp:
    initialValues?.govtPublicSectorExp || "",
  govtPublicSectorDetails:
    initialValues?.govtPublicSectorDetails || "",

  keyDomainExpertise:
    initialValues?.keyDomainExpertise || "",
  otherDomainExpertise:
    initialValues?.otherDomainExpertise || "",

  startupProgramsHandled:
    initialValues?.startupProgramsHandled || "",
  investmentExposure:
    initialValues?.investmentExposure || "",
  policyExposure:
    initialValues?.policyExposure || "",
  technologyExposure:
    initialValues?.technologyExposure || "",
});

const validationSchema = Yup.object().shape({
  workedWithStartupEcosystem: Yup.string().required(
    "Please select an option"
  ),
  startupEcosystemDetails: Yup.string().when("workedWithStartupEcosystem", {
    is: "yes",
    then: (schema) =>
      schema
        .trim()
        .min(20, "Please provide at least 20 characters")
        .required("Startup ecosystem details are required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  govtPublicSectorExp: Yup.string().required("Please select an option"),
  govtPublicSectorDetails: Yup.string().when("govtPublicSectorExp", {
    is: "yes",
    then: (schema) =>
      schema
        .trim()
        .min(20, "Please provide at least 20 characters")
        .required("Government/public sector experience details are required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  keyDomainExpertise: Yup.string().required("Domain expertise is required"),
  otherDomainExpertise: Yup.string().when("keyDomainExpertise", {
    is: "Other",
    then: (schema) => schema.trim().required("Please mention domain expertise"),
    otherwise: (schema) => schema.notRequired(),
  }),
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

function SelectField({ name, label, children, required, disabled }) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      <Field as="select" name={name} disabled={disabled} className={inputClass}>
        {children}
      </Field>
      <ErrorText name={name} />
    </div>
  );
}

function TextAreaField({
  name,
  label,
  placeholder,
  required,
  disabled,
  rows = 4,
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      <Field
        as="textarea"
        name={name}
        rows={rows}
        disabled={disabled}
        placeholder={placeholder}
        className={`${inputClass} resize-none`}
      />
      <ErrorText name={name} />
    </div>
  );
}

function TextField({ name, label, placeholder, required, disabled }) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      <Field
        name={name}
        disabled={disabled}
        placeholder={placeholder}
        className={inputClass}
      />
      <ErrorText name={name} />
    </div>
  );
}

export default function SSUStartupExposureStep({
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
      ...values,
      workedWithStartupEcosystem: values.workedWithStartupEcosystem || "",
      startupEcosystemDetails:
        values.workedWithStartupEcosystem === "yes"
          ? String(values.startupEcosystemDetails || "").trim()
          : "",
      ecosystemIncubators:
        values.workedWithStartupEcosystem === "yes"
          ? String(values.ecosystemIncubators || "").trim()
          : "",

      govtPublicSectorExp: values.govtPublicSectorExp || "",
      govtPublicSectorDetails:
        values.govtPublicSectorExp === "yes"
          ? String(values.govtPublicSectorDetails || "").trim()
          : "",

      keyDomainExpertise:
        values.keyDomainExpertise === "Other"
          ? String(values.otherDomainExpertise || "").trim()
          : values.keyDomainExpertise,
      originalKeyDomainExpertise: values.keyDomainExpertise,
      otherDomainExpertise: String(values.otherDomainExpertise || "").trim(),

      startupProgramsHandled: String(values.startupProgramsHandled || "").trim(),
      investmentExposure: String(values.investmentExposure || "").trim(),
      policyExposure: String(values.policyExposure || "").trim(),
      technologyExposure: String(values.technologyExposure || "").trim(),

      updatedAtIso: new Date().toISOString(),
    };

    const result = await onSubmit?.(cleaned);

    if (result?.ok === false) {
      setStatus(result.error || "Could not save startup exposure details.");
    }

    setSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 rounded-[32px] border border-white/80 bg-white/78 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-7">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
            <FaRocket />
            Step 5
          </div>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Startup & Domain Exposure
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
            Mention startup ecosystem, government/public sector exposure and
            relevant domain experience.
          </p>
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
            <div className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <FaLightbulb />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Startup Ecosystem Exposure
                  </h3>
                  <p className="text-sm text-slate-500">
                    Incubators, startups, entrepreneurship programs, investment
                    or mentorship exposure
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <SelectField
                  name="workedWithStartupEcosystem"
                  label="Have you worked with startup ecosystem?"
                  required
                  disabled={isReadOnly}
                >
                  <option value="">Select</option>
                  {YES_NO.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </SelectField>

                <TextField
                  name="ecosystemIncubators"
                  label="Incubators / Organisations Worked With"
                  placeholder="Example: Startup Bihar, Incubation Centre, etc."
                  disabled={
                    isReadOnly || values.workedWithStartupEcosystem !== "yes"
                  }
                />

                {values.workedWithStartupEcosystem === "yes" ? (
                  <div className="md:col-span-2">
                    <TextAreaField
                      name="startupEcosystemDetails"
                      label="Startup Ecosystem Experience Details"
                      placeholder="Describe your work with startups, incubation, mentoring, funding, program management, outreach, etc."
                      required
                      disabled={isReadOnly}
                    />
                  </div>
                ) : null}

                <div className="md:col-span-2">
                  <TextAreaField
                    name="startupProgramsHandled"
                    label="Startup Programs / Projects Handled"
                    placeholder="Mention startup-related programs, events, schemes, outreach, application evaluation, incubation activities, etc."
                    disabled={isReadOnly}
                  />
                </div>

                <TextAreaField
                  name="investmentExposure"
                  label="Investment / Funding Exposure"
                  placeholder="Mention exposure to seed fund, investor connect, funding proposals, due diligence, etc."
                  disabled={isReadOnly}
                />

                <TextAreaField
                  name="technologyExposure"
                  label="Technology / Innovation Exposure"
                  placeholder="Mention exposure to technology startups, AI, SaaS, product development, innovation programs, etc."
                  disabled={isReadOnly}
                />
              </div>
            </div>

            <div className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-700 text-white">
                  <FaBuilding />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Government / Public Sector Exposure
                  </h3>
                  <p className="text-sm text-slate-500">
                    Departmental, policy, governance, scheme or public project
                    experience
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <SelectField
                  name="govtPublicSectorExp"
                  label="Have you worked with Government / Public Sector?"
                  required
                  disabled={isReadOnly}
                >
                  <option value="">Select</option>
                  {YES_NO.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </SelectField>

                <SelectField
                  name="keyDomainExpertise"
                  label="Key Domain Expertise"
                  required
                  disabled={isReadOnly}
                >
                  <option value="">Select Domain</option>
                  {DOMAIN_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </SelectField>

                {values.keyDomainExpertise === "Other" ? (
                  <TextField
                    name="otherDomainExpertise"
                    label="Mention Domain Expertise"
                    placeholder="Enter domain"
                    required
                    disabled={isReadOnly}
                  />
                ) : null}

                {values.govtPublicSectorExp === "yes" ? (
                  <div className="md:col-span-2">
                    <TextAreaField
                      name="govtPublicSectorDetails"
                      label="Government / Public Sector Experience Details"
                      placeholder="Describe department/project/scheme handled, role, duration, responsibility, etc."
                      required
                      disabled={isReadOnly}
                    />
                  </div>
                ) : null}

                <div className="md:col-span-2">
                  <TextAreaField
                    name="policyExposure"
                    label="Policy / Governance Exposure"
                    placeholder="Mention scheme implementation, policy notes, government file work, compliance, reporting, etc."
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </div>

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