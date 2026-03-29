import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import stateDistrictData from "./stateDistrictData.json";
import { useLanguage } from "../../shared/LanguageContext";
import { FaLock } from "react-icons/fa";

export default function EntityDetailsStep({
  onSubmit,
  onPrevious,
  initialValues,
  isReadOnly = false,
}) {
  const { t } = useLanguage();
  const biharDistricts = stateDistrictData["Bihar"] || [];
  const [hasRegisteredEntity, setHasRegisteredEntity] = useState(
    initialValues?.hasRegisteredEntity ?? false
  );

  useEffect(() => {
    setHasRegisteredEntity(initialValues?.hasRegisteredEntity ?? false);
  }, [initialValues?.hasRegisteredEntity]);

  const today = new Date().toISOString().split("T")[0];

  const getValidationSchema = () => {
    if (!hasRegisteredEntity) {
      return Yup.object().shape({
        hasRegisteredEntity: Yup.boolean(),
        entityName: Yup.string().notRequired(),
        entityType: Yup.string().notRequired(),
        entityRegistrationNumber: Yup.string().notRequired(),
        dateOfRegistration: Yup.string().notRequired(),
        businessAddress: Yup.string().notRequired(),
        state: Yup.string().notRequired(),
        district: Yup.string().notRequired(),
        certificate: Yup.mixed().nullable().notRequired(),
        certificateMeta: Yup.mixed().nullable().notRequired(),
      });
    }

    return Yup.object().shape({
      hasRegisteredEntity: Yup.boolean(),
      entityName: Yup.string().required("Entity name is required"),
      entityType: Yup.string().required("Entity type is required"),
      entityRegistrationNumber: Yup.string().required(
        "Registration number is required"
      ),
      dateOfRegistration: Yup.string().required(
        "Date of registration is required"
      ),
      businessAddress: Yup.string().required("Business address is required"),
      state: Yup.string().required("State is required"),
      district: Yup.string().required("District is required"),
      certificate: Yup.mixed().nullable(),
      certificateMeta: Yup.mixed().nullable(),
    });
  };

  const handleSubmit = (values) => {
    if (!hasRegisteredEntity) {
      onSubmit({
        hasRegisteredEntity: false,
        entityName: "",
        entityType: "",
        entityRegistrationNumber: "",
        dateOfRegistration: "",
        businessAddress: "",
        state: "",
        district: "",
        certificate: null,
        certificateMeta: null,
      });
      return;
    }

    onSubmit({
      ...values,
      hasRegisteredEntity: true,
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            Step 3 of 6
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Entity details
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Add registered company details if already available.
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
            hasRegisteredEntity: false,
            entityName: "",
            entityType: "",
            entityRegistrationNumber: "",
            dateOfRegistration: "",
            businessAddress: "",
            state: "Bihar",
            district: "",
            certificate: null,
            certificateMeta: null,
          }
        }
        validationSchema={getValidationSchema()}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik) => (
          <Form className="space-y-6">
            <div className="rounded-[32px] border border-white/80 bg-white/72 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
              <div className="mb-6 rounded-[24px] border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-indigo-50/60 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-lg font-semibold text-slate-800">
                      {t("entityDetails.toggleTitle")}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {t("entityDetails.toggleDescription")}
                    </div>
                  </div>

                  <label className="inline-flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700">
                      {hasRegisteredEntity ? t("common.yes") : t("common.no")}
                    </span>
                    <button
                      type="button"
                      disabled={isReadOnly}
                      onClick={() => {
                        if (isReadOnly) return;
                        const next = !hasRegisteredEntity;
                        setHasRegisteredEntity(next);
                        formik.setFieldValue("hasRegisteredEntity", next);
                      }}
                      className={`relative h-7 w-12 rounded-full transition ${
                        hasRegisteredEntity ? "bg-slate-900" : "bg-slate-300"
                      } ${isReadOnly ? "cursor-not-allowed opacity-60" : ""}`}
                    >
                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                          hasRegisteredEntity ? "left-6" : "left-1"
                        }`}
                      />
                    </button>
                  </label>
                </div>
              </div>

              {hasRegisteredEntity ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <InputField
                    name="entityName"
                    label={t("entityDetails.entityName")}
                    placeholder="ABC Startup Pvt Ltd"
                    disabled={isReadOnly}
                  />

                  <SelectField
                    name="entityType"
                    label={t("entityDetails.entityType")}
                    disabled={isReadOnly}
                  >
                    <option value="">{t("common.select")}</option>
                    <option value="Private Limited">
                      {t("entityDetails.privateLimited")}
                    </option>
                    <option value="Partnership">
                      {t("entityDetails.partnership")}
                    </option>
                    <option value="LLP">{t("entityDetails.llp")}</option>
                    <option value="OPC">{t("entityDetails.opc")}</option>
                    <option value="Proprietorship">
                      {t("entityDetails.proprietorship")}
                    </option>
                  </SelectField>

                  <InputField
                    name="entityRegistrationNumber"
                    label={t("entityDetails.registrationNumber")}
                    placeholder="U12345BR2026PTC000001"
                    disabled={isReadOnly}
                  />

                  <InputField
                    name="dateOfRegistration"
                    type="date"
                    label={t("entityDetails.dateOfRegistration")}
                    max={today}
                    disabled={isReadOnly}
                  />

                  <div className="md:col-span-2">
                    <InputField
                      name="businessAddress"
                      label={t("entityDetails.businessAddress")}
                      placeholder={t("entityDetails.businessAddressPlaceholder")}
                      disabled={isReadOnly}
                    />
                  </div>

                  <ReadOnlyField
                    name="state"
                    label={t("entityDetails.state")}
                    value="Bihar"
                  />

                  <SelectField
                    name="district"
                    label={t("entityDetails.district")}
                    disabled={isReadOnly}
                  >
                    <option value="">{t("entityDetails.selectDistrict")}</option>
                    {biharDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </SelectField>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="certificate"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      {t("entityDetails.certificate")}
                    </label>
                    <input
                      id="certificate"
                      name="certificate"
                      type="file"
                      accept=".pdf"
                      disabled={isReadOnly}
                      onChange={(event) => {
                        if (isReadOnly) return;
                        formik.setFieldValue(
                          "certificate",
                          event.currentTarget.files?.[0] || null
                        );
                      }}
                      className={`block w-full rounded-2xl border px-4 py-3 ${
                        isReadOnly
                          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                          : "border-slate-200 bg-white/85 text-slate-700"
                      }`}
                    />
                    {formik.values.certificate?.name ? (
                      <div className="mt-2 text-sm text-slate-500">
                        Selected: <span className="font-medium">{formik.values.certificate.name}</span>
                      </div>
                    ) : null}
                    {formik.values.certificateMeta?.fileName ? (
                      <div className="mt-2 text-xs text-slate-500">
                        Uploaded: {formik.values.certificateMeta.fileName}
                      </div>
                    ) : null}
                    <ErrorMessage
                      name="certificate"
                      component="p"
                      className="mt-2 text-sm text-red-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-8 text-center">
                  <div className="text-lg font-semibold text-slate-700">
                    {t("entityDetails.lockedTitle")}
                  </div>
                  <div className="mt-2 text-sm text-slate-500">
                    {t("entityDetails.lockedDescription")}
                  </div>
                  <div className="mt-2 text-xs text-slate-400">
                    {t("entityDetails.lockedNote")}
                  </div>
                </div>
              )}

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
        )}
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

function ReadOnlyField({ name, label, value }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        disabled
        readOnly
        className="block w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500"
      />
    </div>
  );
}