import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaGlobe } from "react-icons/fa";
import ShowcaseCard from "../../PublicProfile/ShowcaseCard";
import HomeSection from "../HomeSection";
import SecondTranche from "../../../UserForm/SecondTranche";

const SecondTranchePartialReject = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const fileInputRef = useRef(null);

  const openFileSelector = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };


  const [statusPopup, setStatusPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [buttonVisible, setButtonVisible] = useState(true);
  const [subtitle, setSubtitle] = useState("");
  const [isSuccess, setIsSuccess] = useState(""); // Add success state


  const validationSchema = Yup.object({
      currentStage: Yup.string().required("Current Stage is required"),
      technicalKnowledge: Yup.string().required(
          "Technical Knowledge is required",
      ),
      raisedFunds: Yup.string().required("Raised Funds is required"),
      employment: Yup.string().required("Employment is required"),
      auditedBalanceSheet: Yup.mixed().required(
          "Audited Balance Sheet is required",
      ),
      gstReturn: Yup.mixed().required("GST Return is required"),
      projectReport: Yup.mixed().required("Project Report is required"),
  });
  // Formik setup for handling form submission
  const formik = useFormik({
      initialValues: {
          currentStage: "",
          technicalKnowledge: "",
          raisedFunds: "",
          employment: "",
          auditedBalanceSheet: null,
          gstReturn: null,
          projectReport: null,
      },
      validationSchema,
      validateOnChange: false, // Disable validation on change
      validateOnBlur: false,   // Disable validation on blur
      onSubmit: async (values) => {
          setTitle("Submitting Post Seed Fund Form");
          setSubtitle("Please wait while we submit your form");
          setButtonVisible(false);
          setStatusPopup(true);

          const formData = new FormData();

          for (const key in values) {
              formData.append(
                  key,
                  values[key] instanceof File ? values[key] : values[key],
              );
          }

          try {
              const response = await axios.post(
                  "https://startup-bihar1.onrender.com/api/post-seed",
                  formData,
                  {
                      headers: {
                          "Content-Type": "multipart/form-data",
                          Authorization: `${localStorage.getItem("token")}`,
                      },
                  },
              );
              formik.resetForm();



              setTitle("Submission Successful");
              setSubtitle(response.data.message);
              setButtonVisible(true);
              setSuccessMessage(response.data.message);
              setErrorMessage("");
              setIsSuccess("success"); // Set success state

              // Reset form fields after submission
          } catch (error) {
              setTitle("Submission Failed");
              setSubtitle(
                  error.response?.data?.error || "An error occurred during submission"
              );
              setButtonVisible(true);
              setErrorMessage(
                  error.response?.data?.error || "An error occurred during submission"
              );
              setSuccessMessage("");
              setIsSuccess("failed"); // Set success state

          }
      },
  });

  return (
    <div>
        <HomeSection/>
      					<div className="fixed inset-0 flex items-center justify-center  z-40">
                          <div className="absolute inset-0 bg-black opacity-10"></div>
						<div className="relative bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg border border-white border-opacity-30 w-5/12 p-8 rounded-lg shadow-lg">
							
							<h2 className="text-2xl font-bold mb-4">Correct the Form</h2>
                            <Form className=" rounded-lg  w-full p-6">
                                {/* File Upload: Project Report */}
				<div className="mb-6">
					<label
						htmlFor="projectReport"
						className="block text-sm font-medium text-gray-700"
					>
						Upload Project Report:
					</label>
					<input
						id="projectReport"
						name="projectReport"
						type="file"
						onChange={(event) =>
							formik.setFieldValue(
								"projectReport",
								event.currentTarget.files[0],
							)
						}
					/>
					{formik.errors.projectReport && (
						<div className="text-red-600">{formik.errors.projectReport}</div>
					)}
				</div>
</Form>


</div>
    </div>
    </div>

  );
};

export default SecondTranchePartialReject;
