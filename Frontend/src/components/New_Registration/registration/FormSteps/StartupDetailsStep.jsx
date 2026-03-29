import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import stateDistrictData from "./stateDistrictData.json";
import { useLanguage } from "../../shared/LanguageContext";
import { FaLock } from "react-icons/fa";

export default function StartupDetailsStep({
  onSubmit,
  onPrevious,
  initialValues,
  isReadOnly = false,
}) {
  const { t } = useLanguage();

  const stateOptions = Object.keys(stateDistrictData);

  const validationSchema = Yup.object().shape({
    teamSize: Yup.number()
      .transform((val, orig) => (orig === "" ? undefined : val))
      .min(1, "Team size must be at least 1")
      .required("Team size is required"),
    website: Yup.string()
      .nullable()
      .test(
        "valid-url",
        "Enter a valid URL",
        (value) => !value || /^https?:\/\/|^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(value)
      ),
    sector: Yup.string().required("Sector is required"),
    stage: Yup.string().required("Stage is required"),
    applicantAddress: Yup.string().required("Applicant address is required"),
    state: Yup.string().required("State is required"),
    district: Yup.string().required("District is required"),
    pincode: Yup.string()
      .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
      .required("Pincode is required"),
  });

  const ensureScheme = (value) => {
    if (!value) return "";
    if (/^https?:\/\//i.test(value)) return value;
    return `https://${value}`;
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            Step 4 of 6
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Startup details
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Add team, sector, stage and address details.
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
            teamSize: "",
            website: "",
            sector: "",
            stage: "",
            applicantAddress: "",
            state: "",
            district: "",
            pincode: "",
          }
        }
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit({
            ...values,
            website: values.website ? ensureScheme(values.website) : "",
          });
        }}
        enableReinitialize
      >
        {(formik) => {
          const availableDistricts = formik.values.state
            ? stateDistrictData[formik.values.state] || []
            : [];

          return (
            <Form className="space-y-6">
              <div className="rounded-[32px] border border-white/80 bg-white/72 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
                <div className="mb-6 rounded-[24px] border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-sky-50/60 p-4">
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    Startup profile
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Add operational details of the startup, including sector, stage and applicant location.
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <InputField
                    name="teamSize"
                    type="number"
                    min={1}
                    label={t("startupDetails.teamSize")}
                    placeholder="5"
                    disabled={isReadOnly}
                  />

                  <InputField
                    name="website"
                    label={t("startupDetails.website")}
                    placeholder={t("startupDetails.websitePlaceholder")}
                    disabled={isReadOnly}
                  />

                  <SelectField
                    name="sector"
                    label={t("startupDetails.sector")}
                    disabled={isReadOnly}
                  >
                    <option value="">{t("common.select")}</option>
                    <option value="Agriculture and allied sectors">
                      Agriculture and allied sectors
                    </option>
                    <option value="IT/ITES">IT/ITES</option>
                    <option value="IoT/ICT/Drone">IoT/ICT/Drone</option>
                    <option value="Edu-tech">Edu-tech</option>
                    <option value="Food Processing/FMCG">
                      Food Processing/FMCG
                    </option>
                    <option value="Healthcare/Health-tech">
                      Healthcare/Health-tech
                    </option>
                    <option value="Fashion and Apparels">
                      Fashion and Apparels
                    </option>
                    <option value="Art and handicrafts">
                      Art and handicrafts
                    </option>
                    <option value="Environment and Waste management">
                      Environment and Waste management
                    </option>
                    <option value="Packaging and logistics">
                      Packaging and logistics
                    </option>
                    <option value="Travel, tourism & hospitality">
                      Travel, tourism & hospitality
                    </option>
                    <option value="Automobile /EV">Automobile /EV</option>
                    <option value="Construction/ architecture/Proptech">
                      Construction/ architecture/Proptech
                    </option>
                    <option value="Media and Entertainment">
                      Media and Entertainment
                    </option>
                    <option value="AR/VR">AR/VR</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Finance and allied sectors">
                      Finance and allied sectors
                    </option>
                    <option value="HR Services">HR Services</option>
                    <option value="Manufacturing/Industrial Automation">
                      Manufacturing/Industrial Automation
                    </option>
                    <option value="Others">Others</option>
                  </SelectField>

                  <SelectField
                    name="stage"
                    label={t("startupDetails.stage")}
                    disabled={isReadOnly}
                  >
                    <option value="">{t("common.select")}</option>
                    <option value="Ideation">{t("startupDetails.ideation")}</option>
                    <option value="Validation">
                      {t("startupDetails.validation")}
                    </option>
                    <option value="Early Traction">
                      {t("startupDetails.earlyTraction")}
                    </option>
                    <option value="Scaling">{t("startupDetails.scaling")}</option>
                  </SelectField>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="applicantAddress"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      {t("startupDetails.applicantAddress")}
                    </label>
                    <Field
                      as="textarea"
                      id="applicantAddress"
                      name="applicantAddress"
                      rows={4}
                      disabled={isReadOnly}
                      className={`block w-full rounded-2xl border px-4 py-3 outline-none transition ${
                        isReadOnly
                          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                          : "border-slate-200 bg-white/85 text-slate-900 focus:border-slate-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(148,163,184,0.10)]"
                      }`}
                    />
                    <ErrorMessage
                      name="applicantAddress"
                      component="p"
                      className="mt-2 text-sm text-red-500"
                    />
                  </div>

                  <SelectField
                    name="state"
                    label={t("startupDetails.state")}
                    disabled={isReadOnly}
                    onChange={(e) => {
                      formik.setFieldValue("state", e.target.value);
                      formik.setFieldValue("district", "");
                    }}
                  >
                    <option value="">{t("common.select")}</option>
                    {stateOptions.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </SelectField>

                  <SelectField
                    name="district"
                    label={t("startupDetails.district")}
                    disabled={!formik.values.state || isReadOnly}
                  >
                    <option value="">{t("startupDetails.selectDistrict")}</option>
                    {availableDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </SelectField>

                  <InputField
                    name="pincode"
                    label={t("startupDetails.pincode")}
                    placeholder="800001"
                    disabled={isReadOnly}
                  />
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
          );
        }}
      </Formik>
    </div>
  );
}

function InputField({
  name,
  label,
  type = "text",
  placeholder,
  disabled = false,
  ...rest
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`block w-full rounded-2xl border px-4 py-3 outline-none transition ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
            : "border-slate-200 bg-white/85 text-slate-900 focus:border-slate-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(148,163,184,0.10)]"
        }`}
        {...rest}
      />
      <ErrorMessage
        name={name}
        component="p"
        className="mt-2 text-sm text-red-500"
      />
    </div>
  );
}

function SelectField({ name, label, children, disabled = false, ...rest }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <Field
        as="select"
        id={name}
        name={name}
        disabled={disabled}
        className={`block w-full rounded-2xl border px-4 py-3 outline-none transition ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
            : "border-slate-200 bg-white/85 text-slate-900 focus:border-slate-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(148,163,184,0.10)]"
        }`}
        {...rest}
      >
        {children}
      </Field>
      <ErrorMessage
        name={name}
        component="p"
        className="mt-2 text-sm text-red-500"
      />
    </div>
  );
}