import React, { useState } from 'react';
import Textbox from './Textbox';
import { useFormik } from 'formik';
import axios from 'axios';
import StatusDialog from './StatusDialog';

const Coworking = ({onFormSubmitSuccess}) => {
    const validate = (values) => {
        const errors = {};
        if (!values.coworkingCenter) {
            errors.coworkingCenter = 'Required';
        }
        if (!values.seatNo) {
            errors.seatNo = 'Required';
        }
        if (!values.status) {
            errors.status  = 'Required';
        }
        return errors;
    };

      const [submitted, setSubmitted] = useState(false);
      const [statusPopup, setStatusPopup] = useState(false);
      const [title, setTitle] = useState("");
      const [buttonVisible, setButtonVisible] = useState(true);
      const [subtitle, setSubtitle] = useState("");
      const [isSuccess, setIsSuccess] = useState("");
      const [dialogStatus, setDialogStatus] = useState({ isVisible: false, title: "", subtitle: "", buttonVisible: false, status: "" });
    
      const formik = useFormik({
        initialValues: {
            coworkingCenter: '',
            seatNo: '',
            status: '',
        },
        validate, // Validation function
    
        onSubmit: async (values, { resetForm }) => {
            try {
                // Update state before submission
                setTitle("Submitting Coworking Form");
                setSubtitle("Please wait while we submit your form");
                setButtonVisible(true);
                setStatusPopup(true);
                setIsSuccess("tring");
    
                console.log("Submitting data:", values);
                const response = await axios.post(
                    "http://localhost:3007/api/coworking",
                    values,
                    {
                        headers: {
                            Authorization: `${localStorage.getItem("token")}`,
                        },
                    }
                );
                console.log("Server response:", response.data);
    
                // Show success message
                setTitle("Submission Successful");
                setSubtitle("Files uploaded successfully")
                setButtonVisible(true);
                setIsSuccess("success");
                resetForm(); // Reset form after successful submission
            } catch (error) {
                console.error(
                    "Error submitting data:",
                    error.response?.data || error.message
                );
                setIsSuccess("failed");
                setSubtitle("Something went wrong!")

                setTitle("Submission Failed");
            }
        },
    });
    
    const goBacktoHome = () => {
        setDialogStatus({ ...dialogStatus, isVisible: false })
        console.log("navigate to home")
        onFormSubmitSuccess();
      }

    
    return (
        <div className="h-screen overflow-y-auto bg-gray-50 flex flex-col items-center">

<div className="relative w-full h-[250px]">

<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" width="1440" height="250" preserveAspectRatio="" viewBox="0 0 1440 250">
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
    <stop stop-color="rgba(15, 70, 185, 0.2)" offset="0"></stop>
    <stop stop-opacity="0" stop-color="rgba(15, 70, 185, 0.2)" offset="0.66"></stop>
  </linearGradient>
 <linearGradient x1="100%" y1="100%" x2="0%" y2="0%" id="SvgjsLinearGradient1002">
  <stop stop-color="rgba(15, 70, 185, 0.2)" offset="0"></stop>
  <stop stop-opacity="0" stop-color="rgba(15, 70, 185, 0.2)" offset="0.66"></stop>
</linearGradient>
</defs>
</svg>


<div className="absolute top-9 left-0 w-full p-6 text-white">
<h1 className="text-3xl font-bold mb-2 relative top-10">Apply For Co-working Space</h1>
<p className="text-lg max-w-xl relative top-10">
Get Your Co-working space with just a click.
</p>
</div>
</div>


            {submitted && (
                <div className="mt-4 font-bold text-black-600">
                    Form submitted successfully!
                </div>
            )}
            <div className="flex w-full max-w-5xl mt-10 space-x-10 justify-center items-center py-5">
                <form onSubmit={formik.handleSubmit} className="w-1/2 p-8 rounded-lg border border-gray-200 bg-white">
                    <h3 className="font-semibold text-xl mb-6 border-b py-4">Apply for co-working Space</h3>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Co-working Center</label>
                        <select
                            name="coworkingCenter" 
                            className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                            onChange={formik.handleChange}
                            value={formik.values.coworkingCenter}
                        >
                            <option value="">Select a center</option>
                            <option value="bhub-maurya">B-HUB Maurya Lok Complex</option>
                            <option value="bhub-bsf">B-HUB BSFC Building Fraser Road</option>

                        </select>
                        {formik.errors.coworkingCenter && <div className="text-red-600">{formik.errors.coworkingCenter}</div>}
                    </div>

                    <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">Please Select the Number of seats</label>
    <select
        name="seatNo"
        onChange={formik.handleChange}
        value={formik.values.seatNo}
        className="block w-full rounded border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    >
        <option value="">Select the seat Number</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>    
    </select>
    {formik.errors.seatNo && <div className="text-red-600">{formik.errors.seatNo}</div>}
</div>

<div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">
        Select the seat type
    </label>
    <div className="space-y-2">
        <label className="inline-flex items-center">
            <input
                type="radio"
                name="status" 
                value="fixed" 
                onChange={formik.handleChange}
                checked={formik.values.status === "fixed"} 
                className="form-radio text-indigo-600"
            />
            <span className="ml-2">Fixed Seat</span>
        </label>

        <label className="inline-flex items-center px-5">
            <input
                type="radio"
                name="status" 
                value="floating" 
                onChange={formik.handleChange}
                checked={formik.values.status === "floating"} 
                className="form-radio text-indigo-600"
            />
            <span className="ml-2">Floating Seat</span>
        </label>
    </div>

    {formik.errors.status  && (
        <div className="text-red-600 mt-1">{formik.errors.status}</div>
    )}
</div>


                    <div className="mt-6 grid grid-cols-2 justify-end gap-x-6 border-t py-5">
                    <button type="button" className="text-sm font-semibold leading-6 text-gray-900 hover:bg-indigo-700 hover:text-white border py-2 px-3 rounded-md">
                    Cancel
                    </button>
                    <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                    Submit
                    </button>
                    </div>
                </form>

                <StatusDialog
        isVisible={statusPopup}
        title={title}
        subtitle={subtitle}
        buttonVisible={buttonVisible}
        status={isSuccess} // Pass success state
        onClose={() => goBacktoHome()}
      
      />
            </div>
        </div>
    );
};

export default Coworking;
