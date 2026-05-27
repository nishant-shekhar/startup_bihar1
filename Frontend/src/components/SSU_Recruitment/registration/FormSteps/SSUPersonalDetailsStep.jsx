import React, { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCloudUploadAlt,
  FaIdBadge,
  FaImage,
  FaMapMarkerAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";

import stateDistrictData from "./stateDistrictData.json";

const POSTS = [
  "Consultant - Startup Ecosystem & Policy",
  "Consultant - Technology & Innovation",
  "Consultant - Finance & Investment",
  "Consultant - Incubation & Program Management",
  "Program Associate",
  "Project Coordinator",
  "Other",
];

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const CATEGORY_OPTIONS = ["General", "EWS", "BC", "EBC", "SC", "ST", "Other"];

const PHOTO_MAX_SIZE = 1 * 1024 * 1024;
const PHOTO_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const inputClass =
  "block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:shadow-[0_0_0_4px_rgba(148,163,184,0.12)] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

const labelClass = "mb-2 block text-sm font-semibold text-slate-800";

const todayIso = () => new Date().toISOString().slice(0, 10);

const normalizePhone = (value = "") =>
  String(value || "").replace(/\D/g, "").slice(0, 10);

const buildInitialValues = (initialValues, userSignupData) => ({
  postAppliedFor: initialValues?.postAppliedFor || "",
  otherPostAppliedFor: initialValues?.otherPostAppliedFor || "",

  fullName: initialValues?.fullName || userSignupData?.fullName || "",
  fathersName: initialValues?.fathersName || "",
  mothersName: initialValues?.mothersName || "",
  dateOfBirth: initialValues?.dateOfBirth || "",
  gender: initialValues?.gender || "",
  category: initialValues?.category || "",
  nationality: initialValues?.nationality || "Indian",

  email: initialValues?.email || userSignupData?.email || "",
  phoneNumber: initialValues?.phoneNumber || userSignupData?.phoneNumber || "",
  alternateNumber: initialValues?.alternateNumber || "",

  profilePhotoMeta: initialValues?.profilePhotoMeta || null,
  profilePhotoFile: null,

  presentAddress: initialValues?.presentAddress || "",
  presentState: initialValues?.presentState || "Bihar",
  presentDistrict: initialValues?.presentDistrict || "",
  presentPincode: initialValues?.presentPincode || "",

  permanentAddressSameAsPresent:
    initialValues?.permanentAddressSameAsPresent !== undefined
      ? initialValues.permanentAddressSameAsPresent
      : true,

  permanentAddress: initialValues?.permanentAddress || "",
  permanentState: initialValues?.permanentState || "Bihar",
  permanentDistrict: initialValues?.permanentDistrict || "",
  permanentPincode: initialValues?.permanentPincode || "",
});

const validationSchema = Yup.object().shape({
  postAppliedFor: Yup.string().required("Post applied for is required"),
  otherPostAppliedFor: Yup.string().when("postAppliedFor", {
    is: "Other",
    then: (schema) => schema.trim().required("Please mention the post"),
    otherwise: (schema) => schema.notRequired(),
  }),

  fullName: Yup.string().trim().required("Full name is required"),
  fathersName: Yup.string()
    .trim()
    .required("Father's / Husband's name is required"),
  mothersName: Yup.string().trim(),
  dateOfBirth: Yup.string().required("Date of birth is required"),
  gender: Yup.string().required("Gender is required"),
  category: Yup.string().required("Category is required"),
  nationality: Yup.string().trim().required("Nationality is required"),

  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  alternateNumber: Yup.string().test(
    "alternate-phone",
    "Alternate number must be 10 digits",
    (value) => !value || /^[0-9]{10}$/.test(value)
  ),

  presentAddress: Yup.string().trim().required("Present address is required"),
  presentState: Yup.string().required("Present state is required"),
  presentDistrict: Yup.string().required("Present district is required"),
  presentPincode: Yup.string()
    .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
    .required("Present pincode is required"),

  permanentAddressSameAsPresent: Yup.boolean(),

  permanentAddress: Yup.string().when("permanentAddressSameAsPresent", {
    is: false,
    then: (schema) => schema.trim().required("Permanent address is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  permanentState: Yup.string().when("permanentAddressSameAsPresent", {
    is: false,
    then: (schema) => schema.required("Permanent state is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  permanentDistrict: Yup.string().when("permanentAddressSameAsPresent", {
    is: false,
    then: (schema) => schema.required("Permanent district is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  permanentPincode: Yup.string().when("permanentAddressSameAsPresent", {
    is: false,
    then: (schema) =>
      schema
        .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
        .required("Permanent pincode is required"),
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

function TextField({
  name,
  label,
  type = "text",
  placeholder,
  required,
  disabled,
  maxLength,
  as,
  max,
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      <Field
        as={as}
        type={type}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        max={max}
        className={`${inputClass} ${
          as === "textarea" ? "min-h-[104px] resize-none" : ""
        }`}
      />
      <ErrorText name={name} />
    </div>
  );
}

function SelectField({ name, label, children, required, disabled }) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      <Field
        as="select"
        name={name}
        disabled={disabled}
        className={inputClass}
      >
        {children}
      </Field>
      <ErrorText name={name} />
    </div>
  );
}

function ProfilePhotoCard({
  photoMeta,
  photoFile,
  previewUrl,
  error,
  disabled,
  onFile,
  onRemove,
}) {
  const hasUploaded = !!photoMeta?.downloadURL;
  const hasNewFile = photoFile instanceof File;

  return (
    <div>
      <label className={labelClass}>
        Profile Photo <span className="text-red-500">*</span>
      </label>

      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5">
        {hasUploaded || hasNewFile ? (
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white">
                {previewUrl || photoMeta?.downloadURL ? (
                  <img
                    src={previewUrl || photoMeta.downloadURL}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaImage className="text-3xl text-slate-400" />
                )}
              </div>

              <div className="min-w-0">
                <div className="break-all text-sm font-semibold text-slate-800">
                  {photoFile?.name || photoMeta?.fileName || "Profile photo"}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {hasNewFile ? "Ready for upload" : "Uploaded"}
                </div>
              </div>
            </div>

            {!disabled ? (
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"
              >
                <FaTimes />
                Replace
              </button>
            ) : null}
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl bg-white px-4 py-8 text-center transition hover:bg-slate-100">
            <FaCloudUploadAlt className="text-3xl text-slate-400" />
            <div className="mt-3 text-sm font-semibold text-slate-800">
              Upload profile photo
            </div>
            <div className="mt-1 text-xs text-slate-500">
              JPG, PNG or WEBP. Max 1 MB.
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              disabled={disabled}
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </label>
        )}
      </div>

      {error ? (
        <div className="mt-1 text-xs font-medium text-red-600">{error}</div>
      ) : null}
    </div>
  );
}

export default function SSUPersonalDetailsStep({
  onSubmit,
  onPrevious,
  initialValues,
  userSignupData,
  isReadOnly = false,
}) {
  const [photoError, setPhotoError] = useState("");
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");

  const formInitialValues = useMemo(
    () => buildInitialValues(initialValues, userSignupData),
    [initialValues, userSignupData]
  );

  const stateOptions = useMemo(() => Object.keys(stateDistrictData || {}), []);

  const validateProfilePhoto = (file) => {
    if (!file) return "Profile photo is required.";

    if (!PHOTO_ALLOWED_TYPES.includes(file.type)) {
      return "Only JPG, PNG or WEBP image is allowed.";
    }

    if (file.size > PHOTO_MAX_SIZE) {
      return "Profile photo must be below 1 MB.";
    }

    return "";
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setStatus("");
    setPhotoError("");

    if (!values.profilePhotoMeta?.downloadURL && !(values.profilePhotoFile instanceof File)) {
      setPhotoError("Profile photo is required.");
      setSubmitting(false);
      return;
    }

    if (values.profilePhotoFile instanceof File) {
      const err = validateProfilePhoto(values.profilePhotoFile);
      if (err) {
        setPhotoError(err);
        setSubmitting(false);
        return;
      }
    }

    const cleaned = {
      ...values,
      fullName: String(values.fullName || "").trim().replace(/\s+/g, " "),
      fathersName: String(values.fathersName || "").trim().replace(/\s+/g, " "),
      mothersName: String(values.mothersName || "").trim().replace(/\s+/g, " "),
      email: String(values.email || "").trim().toLowerCase(),
      phoneNumber: normalizePhone(values.phoneNumber),
      alternateNumber: normalizePhone(values.alternateNumber),

      profilePhotoMeta: values.profilePhotoMeta || null,
      profilePhotoFile: values.profilePhotoFile || null,

      presentAddress: String(values.presentAddress || "").trim(),
      permanentAddress: values.permanentAddressSameAsPresent
        ? String(values.presentAddress || "").trim()
        : String(values.permanentAddress || "").trim(),
      permanentState: values.permanentAddressSameAsPresent
        ? values.presentState
        : values.permanentState,
      permanentDistrict: values.permanentAddressSameAsPresent
        ? values.presentDistrict
        : values.permanentDistrict,
      permanentPincode: values.permanentAddressSameAsPresent
        ? values.presentPincode
        : values.permanentPincode,
      postAppliedFor:
        values.postAppliedFor === "Other"
          ? String(values.otherPostAppliedFor || "").trim()
          : values.postAppliedFor,
      originalPostAppliedFor: values.postAppliedFor,
      updatedAtIso: new Date().toISOString(),
    };

    const result = await onSubmit?.(cleaned);

    if (result?.ok === false) {
      setStatus(result.error || "Could not save personal details.");
    }

    setSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 rounded-[32px] border border-white/80 bg-white/78 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              <FaUser />
              Step 2
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Personal Details
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
              Fill applicant profile, photo, post applied for, contact and address
              details.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
            <div className="font-semibold text-slate-800">Profile photo required</div>
            <div className="mt-1">JPG, PNG or WEBP. Maximum 1 MB.</div>
          </div>
        </div>
      </div>

      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, isSubmitting, status, setFieldValue }) => {
          const presentDistricts = stateDistrictData?.[values.presentState] || [];
          const permanentDistricts =
            stateDistrictData?.[values.permanentState] || [];

          useEffect(() => {
            if (
              values.presentState &&
              values.presentDistrict &&
              !presentDistricts.includes(values.presentDistrict)
            ) {
              setFieldValue("presentDistrict", "");
            }
          }, [values.presentState]);

          useEffect(() => {
            if (
              values.permanentState &&
              values.permanentDistrict &&
              !permanentDistricts.includes(values.permanentDistrict)
            ) {
              setFieldValue("permanentDistrict", "");
            }
          }, [values.permanentState]);

          return (
            <Form className="space-y-6">
              <div className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    <FaIdBadge />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Applicant Information
                    </h3>
                    <p className="text-sm text-slate-500">
                      Basic identity, post preference and photo
                    </p>
                  </div>
                </div>

                <div className="mb-5">
                  <ProfilePhotoCard
                    photoMeta={values.profilePhotoMeta}
                    photoFile={values.profilePhotoFile}
                    previewUrl={photoPreviewUrl}
                    error={photoError}
                    disabled={isReadOnly}
                    onFile={(file) => {
                      const err = validateProfilePhoto(file);
                      setPhotoError(err);
                      if (err) return;

                      setFieldValue("profilePhotoFile", file);
                      setFieldValue("profilePhotoMeta", null);
                      setPhotoPreviewUrl(URL.createObjectURL(file));
                    }}
                    onRemove={() => {
                      setFieldValue("profilePhotoFile", null);
                      setFieldValue("profilePhotoMeta", null);
                      setPhotoPreviewUrl("");
                    }}
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <SelectField
                    name="postAppliedFor"
                    label="Post Applied For"
                    required
                    disabled={isReadOnly}
                  >
                    <option value="">Select Post</option>
                    {POSTS.map((post) => (
                      <option key={post} value={post}>
                        {post}
                      </option>
                    ))}
                  </SelectField>

                  {values.postAppliedFor === "Other" ? (
                    <TextField
                      name="otherPostAppliedFor"
                      label="Mention Post"
                      placeholder="Enter post name"
                      required
                      disabled={isReadOnly}
                    />
                  ) : (
                    <TextField
                      name="fullName"
                      label="Full Name"
                      placeholder="Applicant full name"
                      required
                      disabled={isReadOnly}
                    />
                  )}

                  {values.postAppliedFor === "Other" ? (
                    <TextField
                      name="fullName"
                      label="Full Name"
                      placeholder="Applicant full name"
                      required
                      disabled={isReadOnly}
                    />
                  ) : null}

                  <TextField
                    name="fathersName"
                    label="Father's / Husband's Name"
                    placeholder="Enter name"
                    required
                    disabled={isReadOnly}
                  />

                  <TextField
                    name="mothersName"
                    label="Mother's Name"
                    placeholder="Enter mother's name"
                    disabled={isReadOnly}
                  />

                  <TextField
                    name="dateOfBirth"
                    label="Date of Birth"
                    type="date"
                    required
                    disabled={isReadOnly}
                    max={todayIso()}
                  />

                  <SelectField
                    name="gender"
                    label="Gender"
                    required
                    disabled={isReadOnly}
                  >
                    <option value="">Select Gender</option>
                    {GENDER_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </SelectField>

                  <SelectField
                    name="category"
                    label="Category"
                    required
                    disabled={isReadOnly}
                  >
                    <option value="">Select Category</option>
                    {CATEGORY_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </SelectField>

                  <TextField
                    name="nationality"
                    label="Nationality"
                    placeholder="Indian"
                    required
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              <div className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-700 text-white">
                    <FaUser />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Contact Details
                    </h3>
                    <p className="text-sm text-slate-500">
                      Primary details are copied from signup
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    required
                    disabled={isReadOnly}
                  />

                  <TextField
                    name="phoneNumber"
                    label="Mobile Number"
                    required
                    disabled={isReadOnly}
                    maxLength={10}
                  />

                  <TextField
                    name="alternateNumber"
                    label="Alternate Mobile Number"
                    placeholder="Optional"
                    disabled={isReadOnly}
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Address Details
                    </h3>
                    <p className="text-sm text-slate-500">
                      Present and permanent address
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <TextField
                      name="presentAddress"
                      label="Present Address"
                      placeholder="House no., street, locality"
                      required
                      disabled={isReadOnly}
                      as="textarea"
                    />
                  </div>

                  <SelectField
                    name="presentState"
                    label="Present State"
                    required
                    disabled={isReadOnly}
                  >
                    <option value="">Select State</option>
                    {stateOptions.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </SelectField>

                  <SelectField
                    name="presentDistrict"
                    label="Present District"
                    required
                    disabled={isReadOnly}
                  >
                    <option value="">Select District</option>
                    {presentDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </SelectField>

                  <TextField
                    name="presentPincode"
                    label="Present Pincode"
                    required
                    disabled={isReadOnly}
                    maxLength={6}
                  />

                  <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <Field
                      type="checkbox"
                      name="permanentAddressSameAsPresent"
                      disabled={isReadOnly}
                      className="mt-1 h-4 w-4 rounded border-slate-300"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Permanent address is same as present address
                    </span>
                  </label>

                  {!values.permanentAddressSameAsPresent ? (
                    <>
                      <div className="md:col-span-2">
                        <TextField
                          name="permanentAddress"
                          label="Permanent Address"
                          placeholder="House no., street, locality"
                          required
                          disabled={isReadOnly}
                          as="textarea"
                        />
                      </div>

                      <SelectField
                        name="permanentState"
                        label="Permanent State"
                        required
                        disabled={isReadOnly}
                      >
                        <option value="">Select State</option>
                        {stateOptions.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </SelectField>

                      <SelectField
                        name="permanentDistrict"
                        label="Permanent District"
                        required
                        disabled={isReadOnly}
                      >
                        <option value="">Select District</option>
                        {permanentDistricts.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </SelectField>

                      <TextField
                        name="permanentPincode"
                        label="Permanent Pincode"
                        required
                        disabled={isReadOnly}
                        maxLength={6}
                      />
                    </>
                  ) : null}
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
          );
        }}
      </Formik>
    </div>
  );
}