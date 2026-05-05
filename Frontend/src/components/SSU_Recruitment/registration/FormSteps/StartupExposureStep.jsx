import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { NavButtons, inputClass } from "./PersonalDetailsStep";

const validationSchema = Yup.object().shape({
  workedWithStartupEcosystem: Yup.string().required("Please select an option"),
  startupEcosystemDetails: Yup.string().when("workedWithStartupEcosystem", {
    is: "yes",
    then: (s) => s.trim().required("Please specify the startup body/bodies"),
    otherwise: (s) => s.nullable(),
  }),
  ecosystemIncubators: Yup.string().nullable(),
  govtPublicSectorExp: Yup.string().required("Please select an option"),
  govtPublicSectorDetails: Yup.string().when("govtPublicSectorExp", {
    is: "yes",
    then: (s) => s.trim().required("Please specify the details"),
    otherwise: (s) => s.nullable(),
  }),
  keyDomainExpertise: Yup.string().nullable(),
});

export default function StartupExposureStep({
  onSubmit,
  onPrevious,
  initialValues,
  isReadOnly,
}) {
  const initial = {
    workedWithStartupEcosystem: initialValues?.workedWithStartupEcosystem || "",
    startupEcosystemDetails: initialValues?.startupEcosystemDetails || "",
    ecosystemIncubators: initialValues?.ecosystemIncubators || "",
    govtPublicSectorExp: initialValues?.govtPublicSectorExp || "",
    govtPublicSectorDetails: initialValues?.govtPublicSectorDetails || "",
    keyDomainExpertise: initialValues?.keyDomainExpertise || "",
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6">
        <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          Step 5 of 6
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Startup &amp; Domain Exposure
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Tell us about your experience in the startup ecosystem and government
          sector.
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
            <div className="rounded-[32px] border border-white/80 bg-white/72 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
              <SectionHeader label="E" title="Startup & Domain Exposure" />

              <div className="mt-6 divide-y divide-slate-100">
                {/* Q1 — Startup Ecosystem */}
                <div className="py-5">
                  <p className="text-sm font-semibold text-slate-800">
                    Have you worked with any Startup ecosystem body?{" "}
                    <span className="text-red-500">*</span>
                  </p>
                  <div className="mt-3 flex gap-6">
                    {["yes", "no"].map((val) => (
                      <label
                        key={val}
                        className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
                      >
                        <Field
                          type="radio"
                          name="workedWithStartupEcosystem"
                          value={val}
                          disabled={isReadOnly}
                          className="accent-slate-800"
                        />
                        {val === "yes" ? "Yes" : "No"}
                      </label>
                    ))}
                  </div>
                  {errors.workedWithStartupEcosystem && touched.workedWithStartupEcosystem && (
                    <p className="mt-1 text-sm text-red-500">{errors.workedWithStartupEcosystem}</p>
                  )}

                  {values.workedWithStartupEcosystem === "yes" && (
                    <div className="mt-4">
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        If yes, specify:
                      </label>
                      <Field
                        name="startupEcosystemDetails"
                        disabled={isReadOnly}
                        placeholder="Name of ecosystem bodies / programmes"
                        className={inputClass(
                          errors.startupEcosystemDetails && touched.startupEcosystemDetails,
                          isReadOnly
                        )}
                      />
                      {errors.startupEcosystemDetails && touched.startupEcosystemDetails && (
                        <p className="mt-1 text-sm text-red-500">{errors.startupEcosystemDetails}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Q2 — Names of Incubators */}
                <div className="py-5">
                  <label className="text-sm font-semibold text-slate-800">
                    Names of Startup Ecosystem / Incubators worked with:
                  </label>
                  <Field
                    name="ecosystemIncubators"
                    disabled={isReadOnly}
                    placeholder="e.g. Bihar Startup Centre, T-Hub, CIIE.CO"
                    className={`mt-3 ${inputClass(false, isReadOnly)}`}
                  />
                </div>

                {/* Q3 — Govt / Public Sector */}
                <div className="py-5">
                  <p className="text-sm font-semibold text-slate-800">
                    Government / Public Sector experience:{" "}
                    <span className="text-red-500">*</span>
                  </p>
                  <div className="mt-3 flex gap-6">
                    {["yes", "no"].map((val) => (
                      <label
                        key={val}
                        className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
                      >
                        <Field
                          type="radio"
                          name="govtPublicSectorExp"
                          value={val}
                          disabled={isReadOnly}
                          className="accent-slate-800"
                        />
                        {val === "yes" ? "Yes" : "No"}
                      </label>
                    ))}
                  </div>
                  {errors.govtPublicSectorExp && touched.govtPublicSectorExp && (
                    <p className="mt-1 text-sm text-red-500">{errors.govtPublicSectorExp}</p>
                  )}

                  {values.govtPublicSectorExp === "yes" && (
                    <div className="mt-4">
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        If yes, specify:
                      </label>
                      <Field
                        name="govtPublicSectorDetails"
                        disabled={isReadOnly}
                        placeholder="Department / Ministry / Organisation name"
                        className={inputClass(
                          errors.govtPublicSectorDetails && touched.govtPublicSectorDetails,
                          isReadOnly
                        )}
                      />
                      {errors.govtPublicSectorDetails && touched.govtPublicSectorDetails && (
                        <p className="mt-1 text-sm text-red-500">{errors.govtPublicSectorDetails}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Q4 — Key Domain Expertise */}
                <div className="py-5">
                  <label className="text-sm font-semibold text-slate-800">
                    Key domain expertise areas:
                  </label>
                  <Field
                    as="textarea"
                    name="keyDomainExpertise"
                    rows={3}
                    disabled={isReadOnly}
                    placeholder="e.g. Policy, Finance, Technology, Marketing, Legal..."
                    className={`mt-3 resize-none ${inputClass(false, isReadOnly)}`}
                  />
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