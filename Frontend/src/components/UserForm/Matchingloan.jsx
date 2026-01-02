import React, { useMemo, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import Textbox from "./Textbox";
import Upload from "./Upload";
import StatusDialog from "./StatusDialog";

const MAX_TOTAL_BYTES = 20 * 1024 * 1024; // 20 MB
const bytesToMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);

const validate = (values) => {
  const errors = {};

  // Text fields
  if (!values.fundRaised) errors.fundRaised = "Required";
  else if (Number.isNaN(Number(values.fundRaised))) errors.fundRaised = "Must be a number";

  if (!values.investorName) errors.investorName = "Required";

  if (!values.matchingGrantAmount) errors.matchingGrantAmount = "Required";
  else if (Number.isNaN(Number(values.matchingGrantAmount)))
    errors.matchingGrantAmount = "Must be a number";

  // File fields
  if (!values.proofOfInvestment) errors.proofOfInvestment = "Required";
  if (!values.accountStatement) errors.accountStatement = "Required";
  if (!values.investorUndertaking) errors.investorUndertaking = "Required";
  if (!values.equityDilutionProof) errors.equityDilutionProof = "Required";
  if (!values.utilizationPlan) errors.utilizationPlan = "Required";
  if (!values.boardResolution) errors.boardResolution = "Required";

  return errors;
};

const Matchingloan = ({ onFormSubmitSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogStatus, setDialogStatus] = useState({
    isVisible: false,
    title: "",
    subtitle: "",
    buttonVisible: false,
    status: "",
    actionButton: "Ok",
  });

  const formik = useFormik({
    initialValues: {
      fundRaised: "",
      investorName: "",
      matchingGrantAmount: "",

      proofOfInvestment: null,
      accountStatement: null,
      investorUndertaking: null,
      equityDilutionProof: null,
      utilizationPlan: null,
      boardResolution: null,
    },
    validate,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);

      try {
        // combined size check
        const totalBytes =
          (values.proofOfInvestment?.size || 0) +
          (values.accountStatement?.size || 0) +
          (values.investorUndertaking?.size || 0) +
          (values.equityDilutionProof?.size || 0) +
          (values.utilizationPlan?.size || 0) +
          (values.boardResolution?.size || 0);

        if (totalBytes > MAX_TOTAL_BYTES) {
          setDialogStatus({
            isVisible: true,
            title: "Total file size too large",
            subtitle: `Selected files total ${bytesToMB(totalBytes)} MB. Maximum allowed is 20 MB.`,
            buttonVisible: true,
            status: "failed",
            actionButton: "Ok",
          });
          setIsSubmitting(false);
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          setDialogStatus({
            isVisible: true,
            title: "Login required",
            subtitle: "Token not found. Please login again.",
            buttonVisible: true,
            status: "failed",
            actionButton: "Ok",
          });
          setIsSubmitting(false);
          return;
        }

        const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

        const fd = new FormData();
        fd.append("fundRaised", values.fundRaised);
        fd.append("investorName", values.investorName);
        fd.append("matchingGrantAmount", values.matchingGrantAmount);

        fd.append("proofOfInvestment", values.proofOfInvestment);
        fd.append("accountStatement", values.accountStatement);
        fd.append("investorUndertaking", values.investorUndertaking);
        fd.append("equityDilutionProof", values.equityDilutionProof);
        fd.append("utilizationPlan", values.utilizationPlan);
        fd.append("boardResolution", values.boardResolution);

        await axios.post("https://startupbihar.in/api/matchingLoan", fd, {
          headers: {
            Authorization: authHeader,
            // DON'T set Content-Type manually for FormData in axios
          },
        });

        setDialogStatus({
          isVisible: true,
          title: "Form submitted successfully!",
          subtitle: "Your Matching Loan application has been submitted.",
          buttonVisible: true,
          status: "success",
          actionButton: "Ok Thanks",
        });

        resetForm();
      } catch (error) {
        setDialogStatus({
          isVisible: true,
          title: "Some error occurred",
          subtitle: error?.response?.data?.error || "Upload failed. Please try again.",
          buttonVisible: true,
          status: "failed",
          actionButton: "Retry Later",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleFileChange = (file, fieldName) => {
    formik.setFieldValue(fieldName, file);
  };

  const totalBytes = useMemo(() => {
    const v = formik.values;
    return (
      (v.proofOfInvestment?.size || 0) +
      (v.accountStatement?.size || 0) +
      (v.investorUndertaking?.size || 0) +
      (v.equityDilutionProof?.size || 0) +
      (v.utilizationPlan?.size || 0) +
      (v.boardResolution?.size || 0)
    );
  }, [formik.values]);

  const totalOver = totalBytes > MAX_TOTAL_BYTES;

  const goBacktoHome = () => {
    setDialogStatus({ ...dialogStatus, isVisible: false });
    if (onFormSubmitSuccess) onFormSubmitSuccess();
  };

  return (
    <div className="h-screen overflow-y-auto">
      {/* top poster background */}
      <div className="relative w-full h-[250px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          xmlnsSvgjs="http://svgjs.dev/svgjs"
          width="1440"
          height="250"
          preserveAspectRatio="none"
          viewBox="0 0 1440 250"
        >
          <g mask="url(#SvgjsMask1000)" fill="none">
            <rect width="1440" height="250" x="0" y="0" fill="#0e2a47"></rect>
            <path d="M38 250L288 0L538.5 0L288.5 250z" fill="url(#SvgjsLinearGradient1001)"></path>
            <path d="M244.60000000000002 250L494.6 0L647.6 0L397.6 250z" fill="url(#SvgjsLinearGradient1001)"></path>
            <path d="M490.20000000000005 250L740.2 0L911.2 0L661.2 250z" fill="url(#SvgjsLinearGradient1001)"></path>
            <path d="M728.8000000000001 250L978.8000000000001 0L1289.3000000000002 0L1039.3000000000002 250z" fill="url(#SvgjsLinearGradient1001)"></path>
            <path d="M1406 250L1156 0L982 0L1232 250z" fill="url(#SvgjsLinearGradient1002)"></path>
            <path d="M1199.4 250L949.4000000000001 0L749.9000000000001 0L999.9000000000001 250z" fill="url(#SvgjsLinearGradient1002)"></path>
            <path d="M940.8 250L690.8 0L375.79999999999995 0L625.8 250z" fill="url(#SvgjsLinearGradient1002)"></path>
            <path d="M704.1999999999999 250L454.19999999999993 0L146.69999999999993 0L396.69999999999993 250z" fill="url(#SvgjsLinearGradient1002)"></path>
            <path d="M1205.2767553797382 250L1440 15.276755379738262L1440 250z" fill="url(#SvgjsLinearGradient1001)"></path>
            <path d="M0 250L234.72324462026174 250L 0 15.276755379738262z" fill="url(#SvgjsLinearGradient1002)"></path>
          </g>
          <defs>
            <mask id="SvgjsMask1000">
              <rect width="1440" height="250" fill="#ffffff"></rect>
            </mask>
            <linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="SvgjsLinearGradient1001">
              <stop stopColor="rgba(15, 70, 185, 0.2)" offset="0"></stop>
              <stop stopOpacity="0" stopColor="rgba(15, 70, 185, 0.2)" offset="0.66"></stop>
            </linearGradient>
            <linearGradient x1="100%" y1="100%" x2="0%" y2="0%" id="SvgjsLinearGradient1002">
              <stop stopColor="rgba(15, 70, 185, 0.2)" offset="0"></stop>
              <stop stopOpacity="0" stopColor="rgba(15, 70, 185, 0.2)" offset="0.66"></stop>
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute top-9 left-0 w-full p-6 text-white">
          <h1 className="text-3xl font-bold mb-2 relative top-10">Matching Loan</h1>
          <p className="text-lg max-w-xl relative top-10">
            Submit your Matching Loan application along with required documents.
          </p>
          <p className="text-xs max-w-xl relative top-10">
            Note: Each file max 4 MB and combined max 20 MB.
          </p>
        </div>
      </div>

      {/* Modal overlay while submitting (same style as SeedFund) */}
      {isSubmitting && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="text-lg font-semibold">Uploading form...</p>
          </div>
        </div>
      )}

      {/* Single form like SeedFund */}
      <form onSubmit={formik.handleSubmit}>
        <div className="container mx-auto p-4">
          <div className="gap-4 m-4 grid sm:grid-cols-12">
            {/* LEFT COLUMN */}
            <div className="min-h-[100px] rounded sm:col-span-6">
              <div className="w-full border rounded-md px-5 py-4 bg-white">
                <h1 className="text-black font-bold flex justify-center items-center border-b pb-2">
                  Matching Loan Details
                </h1>

                <div className="mt-4">
                  <Textbox
                    label="Total Amount of fund raised"
                    placeholder="Enter amount"
                    name="fundRaised"
                    onChange={formik.handleChange}
                    value={formik.values.fundRaised}
                  />
                  {formik.touched.fundRaised && formik.errors.fundRaised && (
                    <div className="text-red-600 text-sm">{formik.errors.fundRaised}</div>
                  )}
                </div>

                <div className="mt-4">
                  <Textbox
                    label="Name of recognized angel investors"
                    placeholder="Enter investor name(s)"
                    name="investorName"
                    onChange={formik.handleChange}
                    value={formik.values.investorName}
                  />
                  {formik.touched.investorName && formik.errors.investorName && (
                    <div className="text-red-600 text-sm">{formik.errors.investorName}</div>
                  )}
                </div>

                <div className="mt-4">
                  <Textbox
                    label="Amount required under Matching Grants"
                    placeholder="Enter amount"
                    name="matchingGrantAmount"
                    onChange={formik.handleChange}
                    value={formik.values.matchingGrantAmount}
                  />
                  {formik.touched.matchingGrantAmount && formik.errors.matchingGrantAmount && (
                    <div className="text-red-600 text-sm">{formik.errors.matchingGrantAmount}</div>
                  )}
                </div>

                {/* total size indicator */}
                <div className={`mt-4 text-sm font-medium ${totalOver ? "text-red-600" : "text-gray-700"}`}>
                  Total selected file size: {bytesToMB(totalBytes)} MB / 20.00 MB {totalOver ? "(Too large)" : ""}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="min-h-[100px] sm:col-span-6 flex flex-col space-y-2">
              <div className="flex-1 rounded-md bg-white items-center relative border px-5 py-4">
                <h1 className="text-black font-bold flex justify-center items-center border-b pb-2">
                  Upload Documents
                </h1>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 1 */}
                  <div className="flex items-center justify-center border border-dashed rounded-lg h-40">
                    <div className="text-center py-2 scale-90">
                      <Upload
                        label="Proof of Investment (PDF)"
                        name="proofOfInvestment"
                        onChange={(file) => handleFileChange(file, "proofOfInvestment")}
                      />
                      {formik.errors.proofOfInvestment && (
                        <div className="text-red-600 text-xs mt-1">{formik.errors.proofOfInvestment}</div>
                      )}
                    </div>
                  </div>

                  {/* 2 */}
                  <div className="flex items-center justify-center border border-dashed rounded-lg h-40">
                    <div className="text-center py-2 scale-90">
                      <Upload
                        label="Account Statement (PDF)"
                        name="accountStatement"
                        onChange={(file) => handleFileChange(file, "accountStatement")}
                      />
                      {formik.errors.accountStatement && (
                        <div className="text-red-600 text-xs mt-1">{formik.errors.accountStatement}</div>
                      )}
                    </div>
                  </div>

                  {/* 3 */}
                  <div className="flex items-center justify-center border border-dashed rounded-lg h-40">
                    <div className="text-center py-2 scale-90">
                      <Upload
                        label="Investor Undertaking (PDF)"
                        name="investorUndertaking"
                        onChange={(file) => handleFileChange(file, "investorUndertaking")}
                      />
                      {formik.errors.investorUndertaking && (
                        <div className="text-red-600 text-xs mt-1">{formik.errors.investorUndertaking}</div>
                      )}
                    </div>
                  </div>

                  {/* 4 */}
                  <div className="flex items-center justify-center border border-dashed rounded-lg h-40">
                    <div className="text-center py-2 scale-90">
                      <Upload
                        label="Equity Dilution Proof (PDF)"
                        name="equityDilutionProof"
                        onChange={(file) => handleFileChange(file, "equityDilutionProof")}
                      />
                      {formik.errors.equityDilutionProof && (
                        <div className="text-red-600 text-xs mt-1">{formik.errors.equityDilutionProof}</div>
                      )}
                    </div>
                  </div>

                  {/* 5 */}
                  <div className="flex items-center justify-center border border-dashed rounded-lg h-40">
                    <div className="text-center py-2 scale-90">
                      <Upload
                        label="Utilization Plan (PDF)"
                        name="utilizationPlan"
                        onChange={(file) => handleFileChange(file, "utilizationPlan")}
                      />
                      {formik.errors.utilizationPlan && (
                        <div className="text-red-600 text-xs mt-1">{formik.errors.utilizationPlan}</div>
                      )}
                    </div>
                  </div>

                  {/* 6 */}
                  <div className="flex items-center justify-center border border-dashed rounded-lg h-40">
                    <div className="text-center py-2 scale-90">
                      <Upload
                        label="Board Resolution (PDF)"
                        name="boardResolution"
                        onChange={(file) => handleFileChange(file, "boardResolution")}
                      />
                      {formik.errors.boardResolution && (
                        <div className="text-red-600 text-xs mt-1">{formik.errors.boardResolution}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* buttons row */}
              <div className="mb-6 grid gap-3 sm:grid-cols-12">
                <div className="col-span-6">
                  <button
                    type="button"
                    className="w-full py-2 px-4 border text-black hover:bg-indigo-500 hover:text-white rounded"
                    disabled={isSubmitting}
                    onClick={goBacktoHome}
                  >
                    {isSubmitting ? "Canceling..." : "Cancel Form"}
                  </button>
                </div>
                <div className="col-span-6">
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded disabled:opacity-60"
                    disabled={isSubmitting || totalOver}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Form"}
                  </button>
                </div>

                {totalOver && (
                  <div className="col-span-12 text-sm text-red-600">
                    Total selected files exceed 20 MB. Please remove/replace some files.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>

      <StatusDialog
        isVisible={dialogStatus.isVisible}
        title={dialogStatus.title}
        subtitle={dialogStatus.subtitle}
        buttonVisible={dialogStatus.buttonVisible}
        onClose={() => goBacktoHome()}
        status={dialogStatus.status}
      />
    </div>
  );
};

export default Matchingloan;
