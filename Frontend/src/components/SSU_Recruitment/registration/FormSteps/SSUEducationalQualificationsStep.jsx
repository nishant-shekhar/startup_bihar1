import React, { useMemo } from "react";
import { FieldArray, Form, Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBook,
  FaBriefcase,
  FaCertificate,
  FaGraduationCap,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

const CURRENT_YEAR = new Date().getFullYear();

const emptyMandatoryQualification = {
  institution: "",
  boardUniversity: "",
  specialisation: "",
  yearOfPassing: "",
  percentage: "",
  status: "Completed",
};

const emptyGraduation = {
  degree: "",
  institution: "",
  boardUniversity: "",
  specialisation: "",
  yearOfPassing: "",
  percentage: "",
  status: "Completed",
};

const emptyPostGraduation = {
  degree: "",
  institution: "",
  boardUniversity: "",
  specialisation: "",
  yearOfPassing: "",
  percentage: "",
  status: "Completed",
};

const emptyOtherQualification = {
  qualificationName: "",
  institution: "",
  boardUniversity: "",
  specialisation: "",
  yearOfPassing: "",
  percentage: "",
  status: "Completed",
};

const emptyCertification = {
  certName: "",
  issuingOrg: "",
  year: "",
  duration: "",
};

const GRADUATION_OPTIONS = [
  "B.Tech / BE",
  "B.Tech / B.E in CS / IT",
  "Bachelors",
  "Bachelors in Business Management",
  "Bachelors in Graphic Design / Visual Communication / Fine Arts / Media Studies / Animation / Digital Design",
  "Graduation",
  "LLB",
  "Other Graduation",
];

const POST_GRADUATION_OPTIONS = [
  "Masters",
  "Masters in Business Management",
  "Masters in Business Management Finance",
  "PG Diploma in Business Management",
  "PG Diploma in Business Management Finance",
  "Mass Communication",
  "Master's in Advertising / Public Relations / Related Field",
  "MCA",
  "CA",
  "Masters in Law",
  "PhD",
  "Other Post Graduation",
];

const STATUS_OPTIONS = ["Completed", "Pursuing"];

const inputClass =
  "block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:shadow-[0_0_0_4px_rgba(148,163,184,0.12)] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

const labelClass = "mb-2 block text-sm font-semibold text-slate-800";

const yearValidation = Yup.number()
  .typeError("Enter valid year")
  .min(1950, "Invalid year")
  .max(CURRENT_YEAR + 5, "Invalid year")
  .required("Year is required");

const mandatoryQualificationSchema = Yup.object().shape({
  institution: Yup.string().trim().required("Institution is required"),
  boardUniversity: Yup.string().trim().required("Board / University is required"),
  specialisation: Yup.string().trim(),
  yearOfPassing: yearValidation,
  percentage: Yup.string().trim().required("% / CGPA is required"),
  status: Yup.string().required("Status is required"),
});

const graduationSchema = Yup.object().shape({
  degree: Yup.string().trim().required("Graduation degree is required"),
  institution: Yup.string().trim().required("Institution is required"),
  boardUniversity: Yup.string().trim().required("University is required"),
  specialisation: Yup.string().trim().required("Specialisation is required"),
  yearOfPassing: yearValidation,
  percentage: Yup.string().trim().required("% / CGPA is required"),
  status: Yup.string().required("Status is required"),
});

const optionalQualificationSchema = Yup.object().shape({
  degree: Yup.string().trim(),
  qualificationName: Yup.string().trim(),
  institution: Yup.string().trim(),
  boardUniversity: Yup.string().trim(),
  specialisation: Yup.string().trim(),
  yearOfPassing: Yup.string().trim(),
  percentage: Yup.string().trim(),
  status: Yup.string().trim(),
});

const buildInitialValues = (initialValues) => {
  const legacyEducation = initialValues?.education || [];

  const legacy10th =
    initialValues?.tenth ||
    legacyEducation.find((item) => item.level === "10th") ||
    null;

  const legacy12th =
    initialValues?.twelfth ||
    legacyEducation.find((item) => item.level === "12th") ||
    null;

  const legacyGraduations =
    initialValues?.graduations ||
    legacyEducation.filter((item) => item.level === "Graduation");

  const legacyPostGraduations =
    initialValues?.postGraduations ||
    legacyEducation.filter((item) => item.level === "Post Graduation");

  const legacyOthers =
    initialValues?.others ||
    legacyEducation.filter((item) => item.level === "Other");

  return {
    tenth: legacy10th
      ? {
          institution: legacy10th.institution || "",
          boardUniversity: legacy10th.boardUniversity || "",
          specialisation: legacy10th.specialisation || "",
          yearOfPassing: legacy10th.yearOfPassing || "",
          percentage: legacy10th.percentage || "",
          status: legacy10th.status || "Completed",
        }
      : { ...emptyMandatoryQualification },

    twelfth: legacy12th
      ? {
          institution: legacy12th.institution || "",
          boardUniversity: legacy12th.boardUniversity || "",
          specialisation: legacy12th.specialisation || "",
          yearOfPassing: legacy12th.yearOfPassing || "",
          percentage: legacy12th.percentage || "",
          status: legacy12th.status || "Completed",
        }
      : { ...emptyMandatoryQualification },

    graduations:
      legacyGraduations?.length > 0
        ? legacyGraduations.map((item) => ({
            degree: item.degree || "",
            institution: item.institution || "",
            boardUniversity: item.boardUniversity || "",
            specialisation: item.specialisation || "",
            yearOfPassing: item.yearOfPassing || "",
            percentage: item.percentage || "",
            status: item.status || "Completed",
          }))
        : [{ ...emptyGraduation }],

    postGraduations:
      legacyPostGraduations?.length > 0
        ? legacyPostGraduations.map((item) => ({
            degree: item.degree || "",
            institution: item.institution || "",
            boardUniversity: item.boardUniversity || "",
            specialisation: item.specialisation || "",
            yearOfPassing: item.yearOfPassing || "",
            percentage: item.percentage || "",
            status: item.status || "Completed",
          }))
        : [],

    others:
      legacyOthers?.length > 0
        ? legacyOthers.map((item) => ({
            qualificationName: item.qualificationName || item.degree || "",
            institution: item.institution || "",
            boardUniversity: item.boardUniversity || "",
            specialisation: item.specialisation || "",
            yearOfPassing: item.yearOfPassing || "",
            percentage: item.percentage || "",
            status: item.status || "Completed",
          }))
        : [],

    certifications:
      initialValues?.certifications?.length > 0
        ? initialValues.certifications
        : [{ ...emptyCertification }],

    qualificationDeclaration: initialValues?.qualificationDeclaration || false,
  };
};

const validationSchema = Yup.object().shape({
  tenth: mandatoryQualificationSchema,
  twelfth: mandatoryQualificationSchema,

  graduations: Yup.array()
    .of(graduationSchema)
    .min(1, "At least one graduation qualification is required"),

  postGraduations: Yup.array().of(optionalQualificationSchema),
  others: Yup.array().of(optionalQualificationSchema),

  certifications: Yup.array().of(
    Yup.object().shape({
      certName: Yup.string().trim(),
      issuingOrg: Yup.string().trim(),
      year: Yup.string().trim(),
      duration: Yup.string().trim(),
    })
  ),

  qualificationDeclaration: Yup.boolean().oneOf(
    [true],
    "Please confirm that you meet the required qualification for the selected post."
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

function RequiredQualificationBox({ selectedPost }) {
  if (!selectedPost) {
    return (
      <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
        Select post in Personal Details first to view required qualification.
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
            Required Qualification for {selectedPost.postName}
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
          {selectedPost.qualification}
        </div>
      </div>
    </div>
  );
}

function MandatoryQualificationBlock({
  title,
  subtitle,
  baseName,
  disabled,
}) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4">
      <div className="mb-4">
        <div className="text-lg font-bold text-slate-900">{title}</div>
        <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          name={`${baseName}.institution`}
          label="School / Institution"
          placeholder="Enter school/institution name"
          disabled={disabled}
        />

        <TextField
          name={`${baseName}.boardUniversity`}
          label="Board"
          placeholder="CBSE / ICSE / BSEB / Other"
          disabled={disabled}
        />

        <TextField
          name={`${baseName}.specialisation`}
          label="Subject / Stream"
          placeholder="Example: Science, Commerce, Arts"
          disabled={disabled}
        />

        <TextField
          name={`${baseName}.yearOfPassing`}
          label="Year of Passing"
          type="number"
          placeholder="YYYY"
          disabled={disabled}
        />

        <TextField
          name={`${baseName}.percentage`}
          label="% / CGPA"
          placeholder="Enter percentage or CGPA"
          disabled={disabled}
        />

        <SelectField
          name={`${baseName}.status`}
          label="Status"
          disabled={disabled}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </SelectField>
      </div>
    </div>
  );
}

function GraduationBlock({ index, remove, totalCount, disabled }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="font-semibold text-slate-900">
            Graduation {index + 1}
          </div>
          <div className="text-xs text-slate-500">
            At least one graduation qualification is mandatory.
          </div>
        </div>

        {!disabled && totalCount > 1 ? (
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
          name={`graduations.${index}.degree`}
          label="Graduation Degree"
          disabled={disabled}
        >
          <option value="">Select Graduation</option>
          {GRADUATION_OPTIONS.map((degree) => (
            <option key={degree} value={degree}>
              {degree}
            </option>
          ))}
        </SelectField>

        <TextField
          name={`graduations.${index}.specialisation`}
          label="Specialisation / Subject"
          placeholder="Example: CS, IT, Finance, Law"
          disabled={disabled}
        />

        <TextField
          name={`graduations.${index}.institution`}
          label="College / Institution"
          placeholder="Enter institution name"
          disabled={disabled}
        />

        <TextField
          name={`graduations.${index}.boardUniversity`}
          label="University"
          placeholder="Enter university"
          disabled={disabled}
        />

        <TextField
          name={`graduations.${index}.yearOfPassing`}
          label="Year of Passing"
          type="number"
          placeholder="YYYY"
          disabled={disabled}
        />

        <TextField
          name={`graduations.${index}.percentage`}
          label="% / CGPA"
          placeholder="Enter percentage or CGPA"
          disabled={disabled}
        />

        <SelectField
          name={`graduations.${index}.status`}
          label="Status"
          disabled={disabled}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </SelectField>
      </div>
    </div>
  );
}

function OptionalQualificationBlock({
  type,
  index,
  remove,
  disabled,
}) {
  const baseName =
    type === "postGraduations"
      ? `postGraduations.${index}`
      : `others.${index}`;

  const title =
    type === "postGraduations"
      ? `Post Graduation / Professional Qualification ${index + 1}`
      : `Other Qualification ${index + 1}`;

  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="font-semibold text-slate-900">{title}</div>

        {!disabled ? (
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
        {type === "postGraduations" ? (
          <SelectField
            name={`${baseName}.degree`}
            label="Post Graduation / Professional Qualification"
            disabled={disabled}
          >
            <option value="">Select Qualification</option>
            {POST_GRADUATION_OPTIONS.map((degree) => (
              <option key={degree} value={degree}>
                {degree}
              </option>
            ))}
          </SelectField>
        ) : (
          <TextField
            name={`${baseName}.qualificationName`}
            label="Qualification Name"
            placeholder="Enter qualification name"
            disabled={disabled}
          />
        )}

        <TextField
          name={`${baseName}.specialisation`}
          label="Specialisation / Subject"
          placeholder="Enter specialisation"
          disabled={disabled}
        />

        <TextField
          name={`${baseName}.institution`}
          label="Institution / College"
          placeholder="Enter institution name"
          disabled={disabled}
        />

        <TextField
          name={`${baseName}.boardUniversity`}
          label="Board / University"
          placeholder="Enter board/university"
          disabled={disabled}
        />

        <TextField
          name={`${baseName}.yearOfPassing`}
          label="Year of Passing"
          type="number"
          placeholder="YYYY"
          disabled={disabled}
        />

        <TextField
          name={`${baseName}.percentage`}
          label="% / CGPA"
          placeholder="Enter percentage or CGPA"
          disabled={disabled}
        />

        <SelectField name={`${baseName}.status`} label="Status" disabled={disabled}>
          <option value="">Select Status</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </SelectField>
      </div>
    </div>
  );
}

const hasOptionalQualificationData = (item = {}) => {
  return Object.values(item || {}).some((value) => String(value || "").trim());
};

export default function SSUEducationalQualificationsStep({
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

    const tenth = {
      level: "10th",
      degree: "10th / Matriculation",
      institution: String(values.tenth.institution || "").trim(),
      boardUniversity: String(values.tenth.boardUniversity || "").trim(),
      specialisation: String(values.tenth.specialisation || "").trim(),
      yearOfPassing: String(values.tenth.yearOfPassing || "").trim(),
      percentage: String(values.tenth.percentage || "").trim(),
      status: values.tenth.status || "Completed",
    };

    const twelfth = {
      level: "12th",
      degree: "12th / Intermediate",
      institution: String(values.twelfth.institution || "").trim(),
      boardUniversity: String(values.twelfth.boardUniversity || "").trim(),
      specialisation: String(values.twelfth.specialisation || "").trim(),
      yearOfPassing: String(values.twelfth.yearOfPassing || "").trim(),
      percentage: String(values.twelfth.percentage || "").trim(),
      status: values.twelfth.status || "Completed",
    };

    const graduations = values.graduations.map((item) => ({
      level: "Graduation",
      degree: String(item.degree || "").trim(),
      institution: String(item.institution || "").trim(),
      boardUniversity: String(item.boardUniversity || "").trim(),
      specialisation: String(item.specialisation || "").trim(),
      yearOfPassing: String(item.yearOfPassing || "").trim(),
      percentage: String(item.percentage || "").trim(),
      status: item.status || "Completed",
    }));

    const postGraduations = values.postGraduations
      .filter(hasOptionalQualificationData)
      .map((item) => ({
        level: "Post Graduation",
        degree: String(item.degree || "").trim(),
        institution: String(item.institution || "").trim(),
        boardUniversity: String(item.boardUniversity || "").trim(),
        specialisation: String(item.specialisation || "").trim(),
        yearOfPassing: String(item.yearOfPassing || "").trim(),
        percentage: String(item.percentage || "").trim(),
        status: item.status || "Completed",
      }));

    const others = values.others
      .filter(hasOptionalQualificationData)
      .map((item) => ({
        level: "Other",
        degree: String(item.qualificationName || "").trim(),
        qualificationName: String(item.qualificationName || "").trim(),
        institution: String(item.institution || "").trim(),
        boardUniversity: String(item.boardUniversity || "").trim(),
        specialisation: String(item.specialisation || "").trim(),
        yearOfPassing: String(item.yearOfPassing || "").trim(),
        percentage: String(item.percentage || "").trim(),
        status: item.status || "Completed",
      }));

    const cleaned = {
      selectedPostEligibilitySnapshot: selectedPost || null,

      tenth,
      twelfth,
      graduations,
      postGraduations,
      others,

      education: [tenth, twelfth, ...graduations, ...postGraduations, ...others],

      certifications: values.certifications
        .filter(
          (item) =>
            item.certName || item.issuingOrg || item.year || item.duration
        )
        .map((item) => ({
          certName: String(item.certName || "").trim(),
          issuingOrg: String(item.issuingOrg || "").trim(),
          year: String(item.year || "").trim(),
          duration: String(item.duration || "").trim(),
        })),

      qualificationDeclaration: values.qualificationDeclaration === true,
      requiredQualificationText: selectedPost?.qualification || "",
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
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <FaGraduationCap />
            Step 3
          </div>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Educational Qualifications
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
            Fill 10th, 12th and Graduation mandatorily. Post Graduation,
            professional qualifications and other qualifications are optional.
            Multiple Graduation and Post Graduation records can be added.
          </p>
        </div>
      </div>

      <RequiredQualificationBox selectedPost={selectedPost} />

      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, isSubmitting, status }) => (
          <Form className="mt-6 space-y-6">
            <div className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <FaBook />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Mandatory Academic Qualifications
                  </h3>
                  <p className="text-sm text-slate-500">
                    10th, 12th and at least one Graduation are required.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <MandatoryQualificationBlock
                  title="10th / Matriculation"
                  subtitle="Mandatory"
                  baseName="tenth"
                  disabled={isReadOnly}
                />

                <MandatoryQualificationBlock
                  title="12th / Intermediate"
                  subtitle="Mandatory"
                  baseName="twelfth"
                  disabled={isReadOnly}
                />
              </div>
            </div>

            <FieldArray name="graduations">
              {({ push, remove }) => (
                <div className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
                  <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-700 text-white">
                        <FaGraduationCap />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          Graduation
                        </h3>
                        <p className="text-sm text-slate-500">
                          At least one graduation entry is mandatory. Multiple
                          graduation records can be added.
                        </p>
                      </div>
                    </div>

                    {!isReadOnly ? (
                      <button
                        type="button"
                        onClick={() => push({ ...emptyGraduation })}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <FaPlus />
                        Add Graduation
                      </button>
                    ) : null}
                  </div>

                  <div className="space-y-5">
                    {values.graduations.map((item, index) => (
                      <GraduationBlock
                        key={index}
                        index={index}
                        remove={remove}
                        totalCount={values.graduations.length}
                        disabled={isReadOnly}
                      />
                    ))}
                  </div>
                </div>
              )}
            </FieldArray>

            <FieldArray name="postGraduations">
              {({ push, remove }) => (
                <div className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
                  <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                        <FaCertificate />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          Post Graduation / Professional Qualification
                        </h3>
                        <p className="text-sm text-slate-500">
                          Optional. Add one or more if applicable.
                        </p>
                      </div>
                    </div>

                    {!isReadOnly ? (
                      <button
                        type="button"
                        onClick={() => push({ ...emptyPostGraduation })}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <FaPlus />
                        Add Post Graduation
                      </button>
                    ) : null}
                  </div>

                  {values.postGraduations.length > 0 ? (
                    <div className="space-y-5">
                      {values.postGraduations.map((item, index) => (
                        <OptionalQualificationBlock
                          key={index}
                          type="postGraduations"
                          index={index}
                          remove={remove}
                          disabled={isReadOnly}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                      No post graduation qualification added.
                    </div>
                  )}
                </div>
              )}
            </FieldArray>

            <FieldArray name="others">
              {({ push, remove }) => (
                <div className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
                  <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Other Qualifications
                      </h3>
                      <p className="text-sm text-slate-500">
                        Optional. Add additional relevant qualifications if any.
                      </p>
                    </div>

                    {!isReadOnly ? (
                      <button
                        type="button"
                        onClick={() => push({ ...emptyOtherQualification })}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <FaPlus />
                        Add Other Qualification
                      </button>
                    ) : null}
                  </div>

                  {values.others.length > 0 ? (
                    <div className="space-y-5">
                      {values.others.map((item, index) => (
                        <OptionalQualificationBlock
                          key={index}
                          type="others"
                          index={index}
                          remove={remove}
                          disabled={isReadOnly}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                      No other qualification added.
                    </div>
                  )}
                </div>
              )}
            </FieldArray>

            <FieldArray name="certifications">
              {({ push, remove }) => (
                <div className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
                  <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Certifications
                      </h3>
                      <p className="text-sm text-slate-500">
                        Optional training or certification details.
                      </p>
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

            <label className="flex items-start gap-3 rounded-[28px] border border-indigo-100 bg-indigo-50/80 px-5 py-4">
              <Field
                type="checkbox"
                name="qualificationDeclaration"
                disabled={isReadOnly}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />

              <span className="text-sm leading-relaxed text-indigo-950">
                I confirm that I meet the required educational qualification for
                the selected post as per the ToR. I understand that proof of
                qualification will be verified by the department.
              </span>
            </label>
            <ErrorText name="qualificationDeclaration" />

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