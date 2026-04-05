import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLanguage } from "../../shared/LanguageContext";
import { FaLock, FaUpload, FaFileAlt, FaExternalLinkAlt } from "react-icons/fa";

const MAX_PITCH_DECK_SIZE = 5 * 1024 * 1024;
const MAX_TEXTAREA_CHARACTERS = 750;

const FILE_SIZE_ERROR =
  "File size is greater than 5 MB. Please upload a file up to 5 MB only.";

export default function BusinessIdeaStep({
  onSubmit,
  onPrevious,
  initialValues,
  isReadOnly = false,
}) {
  const { t } = useLanguage();

  const validationSchema = Yup.object().shape({
    problemStatement: Yup.string()
      .max(
        MAX_TEXTAREA_CHARACTERS,
        `Problem statement cannot exceed ${MAX_TEXTAREA_CHARACTERS} characters`
      )
      .required("Problem statement is required"),

    solution: Yup.string()
      .max(
        MAX_TEXTAREA_CHARACTERS,
        `Solution cannot exceed ${MAX_TEXTAREA_CHARACTERS} characters`
      )
      .required("Solution is required"),

    innovation: Yup.string()
      .max(
        MAX_TEXTAREA_CHARACTERS,
        `Innovation cannot exceed ${MAX_TEXTAREA_CHARACTERS} characters`
      )
      .required("Innovation is required"),

    businessModel: Yup.string()
      .max(
        MAX_TEXTAREA_CHARACTERS,
        `Business model cannot exceed ${MAX_TEXTAREA_CHARACTERS} characters`
      )
      .required("Business model is required"),

    pitchDeck: Yup.mixed()
      .test("pitchDeckRequired", "Pitch deck is required", function (value) {
        const hasNewFile = !!value;
        const hasExistingFile = !!this.parent?.pitchDeckMeta?.downloadURL;
        return hasNewFile || hasExistingFile;
      })
      .test("fileSize", FILE_SIZE_ERROR, (value) => {
        if (!value) return true;
        return value.size <= MAX_PITCH_DECK_SIZE;
      })
      .test("fileType", "Only PDF, PPT, and PPTX files are allowed", (value) => {
        if (!value) return true;
        const allowedTypes = [
          "application/pdf",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ];
        const fileName = value?.name?.toLowerCase() || "";
        return (
          allowedTypes.includes(value.type) ||
          fileName.endsWith(".pdf") ||
          fileName.endsWith(".ppt") ||
          fileName.endsWith(".pptx")
        );
      }),
    pitchDeckMeta: Yup.mixed().nullable(),
  });

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            Step 6 of 6
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Describe your business idea
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Add the core idea, innovation, business model, and upload a pitch deck up to 5 MB.
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
            problemStatement: "",
            solution: "",
            innovation: "",
            businessModel: "",
            pitchDeck: null,
            pitchDeckMeta: null,
          }
        }
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {(formik) => (
          <Form className="space-y-6">
            <div className="rounded-[32px] border border-white/80 bg-white/72 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
              <div className="mb-6 rounded-[24px] border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-emerald-50/60 p-4">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  Business concept
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Clearly explain the problem, your solution, innovation, revenue approach, and pitch presentation.
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <TextAreaField
                  name="problemStatement"
                  label={t("businessIdea.problemStatement")}
                  placeholder={t("businessIdea.problemStatementPlaceholder")}
                  disabled={isReadOnly}
                  maxLength={MAX_TEXTAREA_CHARACTERS}
                />

                <TextAreaField
                  name="solution"
                  label={t("businessIdea.solution")}
                  placeholder={t("businessIdea.solutionPlaceholder")}
                  disabled={isReadOnly}
                  maxLength={MAX_TEXTAREA_CHARACTERS}
                />

                <TextAreaField
                  name="innovation"
                  label={t("businessIdea.innovation")}
                  placeholder={t("businessIdea.innovationPlaceholder")}
                  disabled={isReadOnly}
                  maxLength={MAX_TEXTAREA_CHARACTERS}
                />

                <TextAreaField
                  name="businessModel"
                  label={t("businessIdea.businessModel")}
                  placeholder={t("businessIdea.businessModelPlaceholder")}
                  disabled={isReadOnly}
                  maxLength={MAX_TEXTAREA_CHARACTERS}
                />

                <div className="rounded-[26px] border border-slate-200 bg-slate-50/70 p-4">
                  <label
                    htmlFor="pitchDeck"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    {t("businessIdea.pitchDeck")}
                  </label>

                  <input
                    id="pitchDeck"
                    name="pitchDeck"
                    type="file"
                    accept=".pdf,.ppt,.pptx"
                    disabled={isReadOnly}
                    onChange={async (event) => {
                      if (isReadOnly) return;

                      const file = event.currentTarget.files?.[0] || null;

                      await formik.setFieldTouched("pitchDeck", true, false);

                      if (!file) {
                        await formik.setFieldValue("pitchDeck", null, false);
                        await formik.setFieldError("pitchDeck", undefined);
                        return;
                      }

                      if (file.size > MAX_PITCH_DECK_SIZE) {
                        event.target.value = "";
                        await formik.setFieldValue("pitchDeck", null, false);
                        await formik.setFieldError("pitchDeck", FILE_SIZE_ERROR);
                        return;
                      }

                      await formik.setFieldError("pitchDeck", undefined);
                      await formik.setFieldValue("pitchDeck", file, true);
                    }}
                    className={`block w-full rounded-2xl border px-4 py-3 ${
                      isReadOnly
                        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  />

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm">
                      {!isReadOnly ? <FaUpload /> : <FaLock />}
                      Accepted: PDF, PPT, PPTX
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm">
                      Max size: 5 MB
                    </span>
                  </div>

                  {formik.values.pitchDeck?.name ? (
                    <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                      Selected file:{" "}
                      <span className="font-semibold">{formik.values.pitchDeck.name}</span>
                    </div>
                  ) : null}

                  {formik.values.pitchDeckMeta?.fileName ? (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                          <FaFileAlt className="text-slate-500" />
                          <span className="break-all">{formik.values.pitchDeckMeta.fileName}</span>
                        </div>

                        {formik.values.pitchDeckMeta?.downloadURL ? (
                          <a
                            href={formik.values.pitchDeckMeta.downloadURL}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                          >
                            <FaExternalLinkAlt />
                            Open current file
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {formik.touched.pitchDeck && formik.errors.pitchDeck ? (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      {formik.errors.pitchDeck}
                    </div>
                  ) : null}
                </div>
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
        )}
      </Formik>
    </div>
  );
}

function TextAreaField({
  name,
  label,
  placeholder,
  disabled = false,
  maxLength = 600,
}) {
  return (
    <Field name={name}>
      {({ field, form }) => {
        const currentLength = field.value?.length || 0;

        return (
          <div>
            <label htmlFor={name} className="mb-2 block text-sm font-semibold text-slate-800">
              {label}
            </label>

            <textarea
              {...field}
              id={name}
              rows={4}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
              className={`block w-full rounded-2xl border px-4 py-3 outline-none transition ${
                disabled
                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                  : "border-slate-200 bg-white/85 text-slate-900 focus:border-slate-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(148,163,184,0.10)]"
              }`}
            />

            <div className="mt-1 flex items-center justify-end">
              <span className="text-xs text-slate-400">
                {currentLength}/{maxLength} characters
              </span>
            </div>

            <ErrorMessage
              name={name}
              component="p"
              className="mt-2 text-sm text-red-500"
            />
          </div>
        );
      }}
    </Field>
  );
}