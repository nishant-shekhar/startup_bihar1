import React, { useState } from 'react';
import Testbox from './Textbox'; // Assuming it's a custom Testbox component
import Upload from './Upload'; // Assuming it's a custom file Testbox component
import { useFormik } from 'formik';
import axios from 'axios';
const validate = (values) => {
    const errors = {};

    if (!values.currentStage) {
        errors.currentStage = 'Required';
    }
    if (!values.averageTurnover) {
        errors.averageTurnover = 'Required';
    }
    if (!values.currentRevenue) {
        errors.currentRevenue = 'Required';
    }
    if (!values.netProfitLoss) {
        errors.netProfitLoss = 'Required';
    }
    if (!values.raisedFund) {
        errors.raisedFund = 'Required';
    }
    if (!values.workOrder) {
        errors.workOrder = 'Required';
    }
    if (!values.directemploymentGenerated) {
        errors. directemploymentGenerated = 'Required';
    }
    if (!values.indirectemploymentGenerated) {
        errors.indirectemploymentGenerated = 'Required';
    }
    if (!values.maleEmployee) {
        errors.maleEmployee = 'Required';
    }
    if (!values.femaleEmployee) {
        errors.femaleEmployee= 'Required';
    }
    if (!values.partnership) {
        errors.partnership= 'Required';
    }
    if (!values.goals) {
        errors.goals= 'Required';
    }


    return errors;
};

const Qpr = () => {
    const [submitted, setSubmitted] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


    // File change handler
    const onFileChange = (file, fieldName) => {
        console.log('File selected:', file);
        formik.setFieldValue(fieldName, file); // Set the file value in Formik
    };

    const formik = useFormik({
        initialValues: {
            currentStage: '',
            averageTurnover: '',
            currentRevenue: '',
            netProfitLoss: '',
            raisedFund: '',
            workOrder: '',
            directemploymentGenerated: '',
            indirectemploymentGenerated: '',
            maleEmployee:'',
            femaleEmployee:'',
            partnership:'',
            goals:''
        },
        validate,
        onSubmit: async (values) => {
            const formData = new FormData();
            for (const key in values) {
              if (values[key] instanceof File) {
                formData.append(key, values[key]);
              } else {
                formData.append(key, values[key]);
              }
            }
      
            try {
                // Create a FormData object to handle file uploads
                const formData = new FormData();
                Object.keys(values).forEach((key) => {
                    formData.append(key, values[key]);
                });
        
                // Get token from localStorage
                const token = localStorage.getItem('token');
        
                // Send form data to the backend using Axios
                const response = await axios.post('http://localhost:3000/api/Qreport', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `${localStorage.getItem('token')}`, // Use backticks to insert token properly
                    },
                });
        
                setSuccessMessage(response.data.message);
        setErrorMessage('');
        formik.resetForm(); // Reset form fields after submission
      } catch (error) {
        setErrorMessage(error.response?.data?.error || 'An error occurred during submission');
        setSuccessMessage('');
      }
    },
  });
   
    

    return (
        <div className="isolate bg-white px-6 py-24 sm:py-3 lg:px-8 h-screen overflow-y-auto flex flex-col items-center">
        <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
            <div
                className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
                style={{
                    clipPath:
                        'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
                }}
            ></div>
        </div>
        
             {submitted && (
                        <div className="mt-4 font-bold text-black-600">
                            Form submitted successfully!
                        </div>
                    )}
                     <h3 className="font-semibold text-xl mb-6">Quaterly Progress Report</h3>
            <form onSubmit={formik.handleSubmit} className="flex w-full max-w-5xl mt-10 space-x-10">
            
                <div className="w-1/2 p-8 rounded-lg">
                    
               
                    <div className="mb-6">
                        
                    <label htmlFor="currentStage" className="block text-sm font-medium text-gray-700 mb-2">
            Current stage of your startup
          </label>
          <select
            id="currentStage"
            name="currentStage"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
            onChange={formik.handleChange}
            value={formik.values.currentStage}
          >
            <option value="">Select Stage</option>
            <option value="Ideation">Ideation</option>
            <option value="Prototype">Prototype</option>
            <option value="Validation">Validation</option>
            <option value="MVP">MVP</option>
            <option value="Scaling">Scaling</option>
          </select>
                        {formik.errors.currentStage && <div className="text-red-600">{formik.errors.currentStage}</div>}
                    </div>

                    <div className="mb-6">
                        <Testbox
                            label="Average turnover (In Lakhs, Since company formation till date) * (Mention '0' if not in revenue stage)
Current revenue (In lakhs, Last Financial Year) * (Mention '0' if not in revenue stage)
"
                            name="averageTurnover"
                            id = "averageTurnover"
                            onChange={formik.handleChange}
                            value={formik.values.averageTurnover}
                        />
                        {formik.errors.averageTurnover && <div className="text-red-600">{formik.errors.averageTurnover}</div>}
                    </div>

                    <div className="mb-6">
                        <Testbox
                            label="Current revenue (In lakhs, Last Financial Year) * (Mention '0' if not in revenue stage)"

                            name= "currentRevenue"
                            id = "currentRevenue"
                            onChange={formik.handleChange}
                            value={formik.values.currentRevenue}
                        />
                        {formik.errors.currentRevenue && <div className="text-red-600">{formik.errors.currentRevenue}</div>}
                    </div>
                    <div className="mb-6">
                        <Testbox
                            label="No. of work orders received "
                            name="workOrder"
                            id = "workOrder"
                            onChange={formik.handleChange}
                            value={formik.values.workOrder}
                           // Using onFileChange for file Testbox
                        />
                        {formik.errors.workOrder && <div className="text-red-600">{formik.errors.workOrder}</div>}
                    </div>

   
        
                    <div className="mb-6">
                    <label htmlFor="netProfitLoss" className="block text-sm font-medium text-gray-700 mb-2">
           Net Profit or Loss?
          </label>
          <select
            id="netProfitLoss"
            name="netProfitLoss"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
            onChange={formik.handleChange}
            value={formik.values.netProfitLoss}
          >
            <option value="">Select option</option>
            <option value="Profit">Profit</option>
            <option value="Loss">Loss</option>
          
          </select>
                        {formik.errors.netProfitLoss && <div className="text-red-600">{formik.errors.netProfitLoss}</div>}
                    </div>

                    <div className="mb-6">
                        <Testbox
                            label="Total Direct Employment generated"
                            name = "directemploymentGenerated"
                            id = "directemploymentGenerated"
                            onChange={formik.handleChange}
                            value={formik.values.directemploymentGenerated}
                            
                        />
                        {formik.errors.directemploymentGenerated && <div className="text-red-600">{formik.errors.directemploymentGenerated}</div>}
                    </div>
                </div>

                <div className="w-1/2 p-8 rounded-lg">
                    <div className="mb-6">
                    <div className="mb-6">
                    <label htmlFor="raisedFund" className="block text-sm font-medium text-gray-700 mb-2">
                    Any other fund raised or Grant received? 
                   </label>
                    <select
                        name= "raisedFund"
                        id =  "raisedFund"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                        onChange={formik.handleChange}
                        value={formik.values.raisedFund}
                    >
                        <option value="">Select </option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    
                    </select>
                        {formik.errors.raisedFund && <div className="text-red-600">{formik.errors.raisedFund}</div>}
                    </div>

           

                 

                   
                    </div>
                    <div className="mb-6">
                        <Testbox
                            label="Total InDirect Employment generated"
                            name = "indirectemploymentGenerated"
                            id = "indirectemploymentGenerated"
                            onChange={formik.handleChange}
                            value={formik.values.indirectemploymentGenerated}
                            
                        />
                        {formik.errors.indirectemploymentGenerated && <div className="text-red-600">{formik.errors.indirectemploymentGenerated}</div>}
                    </div>

                    <div className="mb-6">
                        <Testbox
                            label="Total male employees"
                            name = "maleEmployee"
                            onChange={formik.handleChange}
                            value={formik.values.maleEmployee}
                            
                        />
                        {formik.errors.maleEmployee && <div className="text-red-600">{formik.errors.maleEmployee}</div>}
                    </div>
                    <div className="mb-6">
                        <Testbox
                            label="Total female employees"
                            name = "femaleEmployee"
                            id = "femaleEmployee"
                            onChange={formik.handleChange}
                            value={formik.values.femaleEmployee}
                            
                        />
                        {formik.errors.femaleEmployee && <div className="text-red-600">{formik.errors.femaleEmployee}</div>}
                    </div>
                    <div className="mb-6">
                        <Testbox
                            label="New partnerships or collaborations? (List any new partnerships or collaborations that were formed, with a brief description of their potential impact)"
                            name = "partnership"
                            id = "partnership"
                            onChange={formik.handleChange}
                            value={formik.values.partnership}
                            
                        />
                        {formik.errors.partnership && <div className="text-red-600">{formik.errors.partnership}</div>}
                    </div>
                    <div className="mb-6">
                        <Testbox
                            label="Goals for next Quarter (Outline the primary goals and milestones to be achieved next month)"
                            name = "goals"
                            id = "goals"
                            onChange={formik.handleChange}
                            value={formik.values.goals}
                            
                        />
                        {formik.errors.goals && <div className="text-red-600">{formik.errors.goals}</div>}
                    </div>


                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
                        <button 
                            type="submit" 
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Upload
                        </button>
                    </div>

                   
                </div>
            </form>
            
        </div>
        
    );
};

export default Qpr;
