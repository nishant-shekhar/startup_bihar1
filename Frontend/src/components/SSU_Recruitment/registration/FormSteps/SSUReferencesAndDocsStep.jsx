import React, { useMemo, useState } from "react";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCloudUploadAlt,
  FaFileAlt,
  FaPlus,
  FaTrash,
  FaUsers,
  FaTimes,
} from "react-icons/fa";

const emptyReference = {
  name: "",
  orgDesignation: "",
  contactNumber: "",
  email: "",
};

const inputClass =
  "block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:shadow-[0_0_0_4px_rgba(148,163,184,0.12)] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

const labelClass = "mb-2 block text-sm font-semibold text-slate-800";

const FILE_LIMITS = {
  resume: 2 * 1024 * 1024,
  qualification: 3 * 1024 * 1024,
  experience: 3 * 1024 * 1024,
  identity: 2 * 1024 * 1024,
  caste: 2 * 1024 * 1024,
  other: 3 * 1024 * 1024,
  signature: 500 * 1024,
};

const allowedFileTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const todayIso = () => new Date().toISOString().slice(0, 10);

const normalizePhone = (value = "") =>
  String(value || "").replace(/\D/g, "").slice(0, 10);

const buildInitialValues = (initialValues) => ({
  references:
    initialValues?.references?.length > 0
      ? initialValues.references
      : [{ ...emptyReference }],

  documents: initialValues?.documents || {},
  documentFiles: {},

  signatureMeta: initialValues?.signatureMeta || null,
  signatureFile: null,

  place: initialValues?.place || "",
  declarationDate: initialValues?.declarationDate || todayIso(),
  declarationAccepted: initialValues?.declarationAccepted || false,
});

const validationSchema = Yup.object().shape({
  references: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().trim().required("Reference name is required"),
        orgDesignation: Yup.string()
          .trim()
          .required("Organisation/designation is required"),
        contactNumber: Yup.string()
          .matches(/^[0-9]{10}$/, "Contact number must be 10 digits")
          .required("Contact number is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
      })
    )
    .min(1, "Add at least one reference"),

  place: Yup.string().trim().required("Place is required"),
  declarationDate: Yup.string().required("Declaration date is required"),
  declarationAccepted: Yup.boolean().oneOf(
    [true],
    "Please accept the declaration"
  ),
});

const requiredDocumentKeys = [
  {
    key: "resume",
    label: "Resume / CV",
    help: "PDF/Image, max 2 MB",
    limit: FILE_LIMITS.resume,
  },
  {
    key: "qualification",
    label: "Highest Qualification Certificate",
    help: "PDF/Image, max 3 MB",
    limit: FILE_LIMITS.qualification,
  },
  {
    key: "identity",
    label: "Identity Proof",
    help: "Aadhaar/PAN/Voter ID/Passport, max 2 MB",
    limit: FILE_LIMITS.identity,
  },
];

const optionalDocumentKeys = [
  {
    key: "experience",
    label: "Experience Certificate",
    help: "Optional, PDF/Image, max 3 MB",
    limit: FILE_LIMITS.experience,
  },
  {
    key: "caste",
    label: "Category / Caste Certificate",
    help: "If applicable, PDF/Image, max 2 MB",
    limit: FILE_LIMITS.caste,
  },
  {
    key: "other",
    label: "Other Supporting Document",
    help: "Optional, PDF/Image, max 3 MB",
    limit: FILE_LIMITS.other,
  },
];

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
  placeholder,
  type = "text",
  disabled,
  maxLength,
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <Field
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={inputClass}
      />
      <ErrorText name={name} />
    </div>
  );
}

function FileUploadCard({
  item,
  value,
  file,
  disabled,
  error,
  onFile,
  onRemove,
}) {
  const hasUploadedFile = value?.downloadURL;
  const hasNewFile = file instanceof File;

  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-sm font-bold text-slate-900">{item.label}</div>
          <div className="mt-1 text-xs text-slate-500">{item.help}</div>
        </div>

        {hasUploadedFile || hasNewFile ? (
          <button
            type="button"
            disabled={disabled}
            onClick={onRemove}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 disabled:opacity-50"
          >
            <FaTimes />
            Remove
          </button>
        ) : null}
      </div>

      <div className="mt-4">
        {hasUploadedFile ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="flex items-start gap-3">
              <FaFileAlt className="mt-1 shrink-0 text-emerald-600" />
              <div className="min-w-0">
                <div className="break-all text-sm font-semibold text-emerald-800">
                  {value.fileName || "Uploaded file"}
                </div>
                <a
                  href={value.downloadURL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex text-xs font-semibold text-emerald-700 underline"
                >
                  View uploaded file
                </a>
              </div>
            </div>
          </div>
        ) : hasNewFile ? (
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3">
            <div className="flex items-start gap-3">
              <FaFileAlt className="mt-1 shrink-0 text-indigo-600" />
              <div className="min-w-0">
                <div className="break-all text-sm font-semibold text-indigo-800">
                  {file.name}
                </div>
                <div className="mt-1 text-xs text-indigo-600">
                  Ready for upload
                </div>
              </div>
            </div>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-7 text-center transition hover:bg-slate-100">
            <FaCloudUploadAlt className="text-3xl text-slate-400" />
            <div className="mt-3 text-sm font-semibold text-slate-800">
              Upload File
            </div>
            <div className="mt-1 text-xs text-slate-500">
              PDF, JPG, PNG, WEBP
            </div>
            <input
              type="file"
              disabled={disabled}
              accept="application/pdf,image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </label>
        )}
      </div>

      {error ? (
        <div className="mt-2 text-xs font-medium text-red-600">{error}</div>
      ) : null}
    </div>
  );
}

export default function SSUReferencesAndDocsStep({
  onSubmit,
  onPrevious,
  initialValues,
  isReadOnly = false,
}) {
  const [fileErrors, setFileErrors] = useState({});

  const formInitialValues = useMemo(
    () => buildInitialValues(initialValues),
    [initialValues]
  );

  const validateFile = (file, item) => {
    if (!file) return "";

    if (!allowedFileTypes.includes(file.type)) {
      return "Only PDF, JPG, PNG or WEBP file is allowed.";
    }

    if (file.size > item.limit) {
      return `File must be below ${Math.round(item.limit / (1024 * 1024))} MB.`;
    }

    return "";
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setStatus("");

    const nextFileErrors = {};

    requiredDocumentKeys.forEach((item) => {
      const hasExisting = values.documents?.[item.key]?.downloadURL;
      const hasNew = values.documentFiles?.[item.key] instanceof File;

      if (!hasExisting && !hasNew) {
        nextFileErrors[item.key] = `${item.label} is required.`;
      }
    });

    if (!values.signatureMeta?.downloadURL && !(values.signatureFile instanceof File)) {
      nextFileErrors.signature = "Signature is required.";
    }

    Object.entries(values.documentFiles || {}).forEach(([key, file]) => {
      const item =
        [...requiredDocumentKeys, ...optionalDocumentKeys].find(
          (entry) => entry.key === key
        ) || {};
      const error = validateFile(file, item);
      if (error) nextFileErrors[key] = error;
    });

    if (values.signatureFile instanceof File) {
      const error = validateFile(values.signatureFile, {
        key: "signature",
        label: "Signature",
        limit: FILE_LIMITS.signature,
      });
      if (error) nextFileErrors.signature = error;
    }

    setFileErrors(nextFileErrors);

    if (Object.keys(nextFileErrors).length > 0) {
      setSubmitting(false);
      return;
    }

    const cleaned = {
      references: values.references.map((item) => ({
        name: String(item.name || "").trim(),
        orgDesignation: String(item.orgDesignation || "").trim(),
        contactNumber: normalizePhone(item.contactNumber),
        email: String(item.email || "").trim().toLowerCase(),
      })),
      documents: values.documents || {},
      documentFiles: values.documentFiles || {},
      signatureMeta: values.signatureMeta || null,
      signatureFile: values.signatureFile || null,
      place: String(values.place || "").trim(),
      declarationDate: values.declarationDate || todayIso(),
      declarationAccepted: values.declarationAccepted === true,
      updatedAtIso: new Date().toISOString(),
    };

    const result = await onSubmit?.(cleaned);

    if (result?.ok === false) {
      setStatus(result.error || "Could not save references and documents.");
    }

    setSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 rounded-[32px] border border-white/80 bg-white/78 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-7">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
            <FaUsers />
            Step 6
          </div>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            References & Documents
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
            Add references, upload required documents and accept the final
            declaration before payment.
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
            <FieldArray name="references">
              {({ push, remove }) => (
                <div className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
                  <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        References
                      </h3>
                      <p className="text-sm text-slate-500">
                        Add professional references for verification
                      </p>
                    </div>

                    {!isReadOnly ? (
                      <button
                        type="button"
                        onClick={() => push({ ...emptyReference })}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <FaPlus />
                        Add Reference
                      </button>
                    ) : null}
                  </div>

                  <div className="space-y-5">
                    {values.references.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <div className="font-semibold text-slate-900">
                            Reference {index + 1}
                          </div>

                          {!isReadOnly && values.references.length > 1 ? (
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
                            name={`references.${index}.name`}
                            label="Reference Name"
                            placeholder="Enter name"
                            disabled={isReadOnly}
                          />

                          <TextField
                            name={`references.${index}.orgDesignation`}
                            label="Organisation & Designation"
                            placeholder="Organisation, designation"
                            disabled={isReadOnly}
                          />

                          <TextField
                            name={`references.${index}.contactNumber`}
                            label="Contact Number"
                            placeholder="10-digit mobile"
                            disabled={isReadOnly}
                            maxLength={10}
                          />

                          <TextField
                            name={`references.${index}.email`}
                            label="Email"
                            placeholder="email@example.com"
                            disabled={isReadOnly}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </FieldArray>

            <div className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-slate-900">
                  Required Documents
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Upload clear and readable documents.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {requiredDocumentKeys.map((item) => (
                  <FileUploadCard
                    key={item.key}
                    item={item}
                    value={values.documents?.[item.key]}
                    file={values.documentFiles?.[item.key]}
                    disabled={isReadOnly}
                    error={fileErrors[item.key]}
                    onFile={(file) => {
                      const error = validateFile(file, item);
                      setFileErrors((prev) => ({
                        ...prev,
                        [item.key]: error,
                      }));
                      if (!error) {
                        setFieldValue(`documentFiles.${item.key}`, file);
                        setFieldValue(`documents.${item.key}`, null);
                      }
                    }}
                    onRemove={() => {
                      setFieldValue(`documentFiles.${item.key}`, null);
                      setFieldValue(`documents.${item.key}`, null);
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-slate-900">
                  Optional Documents
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Upload if applicable.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {optionalDocumentKeys.map((item) => (
                  <FileUploadCard
                    key={item.key}
                    item={item}
                    value={values.documents?.[item.key]}
                    file={values.documentFiles?.[item.key]}
                    disabled={isReadOnly}
                    error={fileErrors[item.key]}
                    onFile={(file) => {
                      const error = validateFile(file, item);
                      setFileErrors((prev) => ({
                        ...prev,
                        [item.key]: error,
                      }));
                      if (!error) {
                        setFieldValue(`documentFiles.${item.key}`, file);
                        setFieldValue(`documents.${item.key}`, null);
                      }
                    }}
                    onRemove={() => {
                      setFieldValue(`documentFiles.${item.key}`, null);
                      setFieldValue(`documents.${item.key}`, null);
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-slate-900">
                  Signature & Declaration
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Upload signature and accept declaration.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <FileUploadCard
                  item={{
                    key: "signature",
                    label: "Signature",
                    help: "Image/PDF, max 500 KB",
                    limit: FILE_LIMITS.signature,
                  }}
                  value={values.signatureMeta}
                  file={values.signatureFile}
                  disabled={isReadOnly}
                  error={fileErrors.signature}
                  onFile={(file) => {
                    const error = validateFile(file, {
                      key: "signature",
                      label: "Signature",
                      limit: FILE_LIMITS.signature,
                    });
                    setFileErrors((prev) => ({
                      ...prev,
                      signature: error,
                    }));
                    if (!error) {
                      setFieldValue("signatureFile", file);
                      setFieldValue("signatureMeta", null);
                    }
                  }}
                  onRemove={() => {
                    setFieldValue("signatureFile", null);
                    setFieldValue("signatureMeta", null);
                  }}
                />

                <div className="grid gap-5">
                  <TextField
                    name="place"
                    label="Place"
                    placeholder="Enter place"
                    disabled={isReadOnly}
                  />

                  <TextField
                    name="declarationDate"
                    label="Declaration Date"
                    type="date"
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              <label className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Field
                  type="checkbox"
                  name="declarationAccepted"
                  disabled={isReadOnly}
                  className="mt-1 h-4 w-4 rounded border-slate-300"
                />
                <span className="text-sm leading-relaxed text-slate-700">
                  I hereby declare that the information provided by me is true
                  and correct to the best of my knowledge. I understand that
                  incorrect information or false documents may lead to rejection
                  of my application.
                </span>
              </label>
              <ErrorText name="declarationAccepted" />
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
                  {isSubmitting ? "Saving..." : "Save & Continue to Payment"}
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