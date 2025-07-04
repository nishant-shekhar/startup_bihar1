import React, { useState, useEffect } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";

const PostSeedPartialReject = ({ isVisible, comment,onClose }) => {
  const [initialValues, setInitialValues] = useState({
    auditedBalanceSheet: null,
    gstReturn: null,
    projectReport: null,
    file1: null,
    file2: null,
    file3: null,
    file4: null,
   
  });
  const [requiredFiles, setRequiredFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define a mapping for file keys to labels
const fileLabels = {
  file1: "Upload Startup Certificate",
  file2: "Bank Statement/ Salary Slip highlighting the payment to employees:",
  file3: "Proof related to the technical knowledge/ necessary skills:",
  file4: "Upload fund Utilization certificate:",
  auditedBalanceSheet: "Upload Audited Balance Sheet:",
  gstReturn: "Upload GST Return:",
  projectReport: "Upload Project Report:",
};

  useEffect(() => {
    const fetchDocumentStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://startupbihar.in/api/post-seed/v3",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        const document = response.data;
        console.log(response.data)

        // Populate initialValues with existing document fields
        const newInitialValues = {
          auditedBalanceSheet: document.auditedBalanceSheet || null,
          gstReturn: document.gstReturn || null,
          projectReport: document.projectReport || null,
          file1: document.file1 || null,
          file2: document.file2 || null,
          file3: document.file3 || null,
          file4: document.file4 || null,
        };

        // Determine required fields
        const required = [];
        if (document.auditedBalanceSheet == null) required.push("auditedBalanceSheet");
        if (document.gstReturn == null) required.push("gstReturn");
        if (document.projectReport == null) required.push("projectReport");
        if (document.file1 == null) required.push("file1");
      // Only require file2 if employment is "Yes"
if (document.employment === true && document.file2 == null) required.push("file2");
// Only require file3 if technicalKnowledge is "Yes"
if (document.technicalKnowledge === true && document.file3 == null) required.push("file3");
// Only require file4 if raisedFunds is "Yes"
if (document.raisedFunds === true && document.file4 == null) required.push("file4");
      
        setInitialValues(newInitialValues);
        setRequiredFiles(required);
      } catch (error) {
        console.error("Error fetching document status:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isVisible) fetchDocumentStatus();
  }, [isVisible]);

  // Validation schema based on required files
  const validationSchema = Yup.object(
    requiredFiles.reduce((schema, file) => {
      schema[file] = Yup.mixed()
        .required(`${file.replace(/([A-Z])/g, " $1")} is required.`)
        .test(
          "fileSize",
          "File size is too large. Max size is 4MB.",
          (value) => !value || (value && value.size <= 4 * 1024 * 1024)
        );
      return schema;
    }, {})
  );

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-5/12">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">Upload Required Documents</h2>
            <p className="text-base">Reason for rejection:</p>
            <p className="text-sm text-red-500 mb-4">{comment}</p>

            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={onClose}
            >
              &times;
            </button>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                const formData = new FormData();

                // Append only the uploaded files
                Object.entries(values).forEach(([key, file]) => {
                  if (file && file instanceof File) {
                    formData.append(key, file);
                  }
                });

                try {
                  const response = await axios.post(
                    "https://startupbihar.in/api/post-seed/update-files",
                    formData,
                    {
                      headers: {
                        Authorization: localStorage.getItem("token"),
                      },
                    }
                  );
                  console.log("Documents uploaded successfully:", response.data);
                  onClose();
                } catch (error) {
                  console.error("Error uploading documents:", error);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ setFieldValue, isSubmitting }) => (
                <Form className="space-y-6">
                  {Object.keys(initialValues).map((fileKey) => (
                    // Render input field only if the initial value is `null`
                    initialValues[fileKey] === null && (
                      <div className="mb-6" key={fileKey}>
                        <label
                          htmlFor={fileKey}
                          className="block text-sm font-medium text-gray-700"
                        >
        {fileLabels[fileKey] || `Upload ${fileKey.replace(/([A-Z])/g, " $1").trim()}:`}
        </label>
                        <input
                          id={fileKey}
                          name={fileKey}
                          type="file"
                          onChange={(event) =>
                            setFieldValue(fileKey, event.currentTarget.files[0])
                          }
                          className="mt-1 block w-full border-gray-300 rounded-md"
                        />
                        <ErrorMessage
                          name={fileKey}
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>
                    )
                  ))}

                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={onClose}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </>
        )}
      </div>
    </div>
  );
};

export default PostSeedPartialReject;
