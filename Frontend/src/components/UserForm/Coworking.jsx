import React, { useState } from 'react';
import Textbox from './Textbox';
import { useFormik } from 'formik';

const Coworking = () => {
    const validate = (values) => {
        const errors = {};
        if (!values.SelectCoworkingCenter) {
            errors.SelectCoworkingCenter = 'Required';
        }
        if (!values.SelectSeatNo) {
            errors.SelectSeatNo = 'Required';
        }
        if (!values.Status) {
            errors.Status = 'Required';
        }
        return errors;
    };
    const [submitted, setSubmitted] = useState(false);
    const formik = useFormik({
        initialValues: {
            SelectCoworkingCenter: '',
            SelectSeatNo: '',
            Status: '',
        },
        validate,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
            setSubmitted(true)
        },
    });

    return (
        <div className="isolate bg-white px-6 py-24 sm:py-3 lg:px-8 min-h-screen flex flex-col items-center">
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
                        <div className="mt-4  font-bold text-black-600">
                            Form submitted successfully!
                        </div>
                    )}
            <div className="flex w-full max-w-5xl mt-10 space-x-10">
                <form onSubmit={formik.handleSubmit} className="w-1/2 p-8 rounded-lg">
                    <h3 className="font-semibold text-xl mb-6">Apply for co-working Space</h3>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Co-working Center</label>
                        <select
                            name="SelectCoworkingCenter" // Adjust name to avoid spaces
  className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                            onChange={formik.handleChange}
                            value={formik.values.SelectCoworkingCenter}
                        >
                            <option value="">Select a center</option>
                            <option value="Partner1">Partner1</option>
                            <option value="Partner2">Partner2</option>
                            <option value="Sector3">Sector3</option>
                            <option value="Sector4">Sector4</option>
                        </select>
                        {formik.errors.SelectCoworkingCenter && <div className="text-red-600">{formik.errors.SelectCoworkingCenter}</div>}
                    </div>

                    <div className="mb-6">
                        <Textbox
                            label="Select Seat No."
                            name="SelectSeatNo"
                            onChange={formik.handleChange}
                            value={formik.values.SelectSeatNo}
                        />
                        {formik.errors.SelectSeatNo && <div className="text-red-600">{formik.errors.SelectSeatNo}</div>}
                    </div>
                </form>
                <form onSubmit={formik.handleSubmit}  className="w-1/2  p-8  mt-12 rounded-lg">
                    <div className="mb-6">
                        <Textbox
                            label="Status"
                            name="Status"
                            onChange={formik.handleChange}
                            value={formik.values.Status}
                        />
                        {formik.errors.Status && <div className="text-red-600">{formik.errors.Status}</div>}
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

                   
                </form>
                
                 
            </div>
            
        </div>
        
    );
};

export default Coworking;
