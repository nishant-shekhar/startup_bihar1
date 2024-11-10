import React, { useState } from 'react';
import Textbox from './Textbox'; // Assuming it's a custom input component
import Upload from './Upload'; // Assuming it's a custom file input component
import { useFormik } from 'formik';

const validate = (values) => {
    const errors = {};

    if (!values.TotalAmount) {
        errors.TotalAmount = 'Required';
    }
    if (!values.InvestorName) {
        errors.InvestorName = 'Required';
    }
    if (!values.AmountRequired) {
        errors.AmountRequired = 'Required';
    }
    if (!values.AccountStatement) {
        errors.AccountStatement = 'Required';
    }
    if (!values.Undertaking) {
        errors.Undertaking = 'Required';
    }
    if (!values.EquityDilution) {
        errors.EquityDilution = 'Required';
    }
    if (!values.FundUtilization) {
        errors.FundUtilization = 'Required';
    }
    if (!values.BoardResolution) {
        errors.BoardResolution = 'Required';
    }

    return errors;
};

const Matchingloan = () => {
    const [submitted, setSubmitted] = useState(false);

    // File change handler
    const onFileChange = (e, field) => {
        formik.setFieldValue(field, e.target.files[0]); // Assign the file
    };

    const formik = useFormik({
        initialValues: {
            TotalAmount: '',
            InvestorName: '',
            AmountRequired: '',
            AccountStatement: '',
            Undertaking: '',
            EquityDilution: '',
            FundUtilization: '',
            BoardResolution: '',
        },
        validate,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
            setSubmitted(true);
        },
    });

    return (
        <div className="h-screen overflow-y-auto flex flex-col items-center">
             {submitted && (
                        <div className="mt-4 font-bold text-black-600">
                            Form submitted successfully!
                        </div>
                    )}
            <form onSubmit={formik.handleSubmit} className="flex w-full max-w-5xl mt-10 space-x-10">
                <div className="w-1/2 p-8 rounded-lg">
                    <h3 className="font-semibold text-xl mb-6">Application Form for Matching Loan</h3>
                    
                    <div className="mb-6">
                        <Textbox
                            label="Total Amount of fund raised"
                            name="TotalAmount"
                            onChange={formik.handleChange}
                            value={formik.values.TotalAmount}
                        />
                        {formik.errors.TotalAmount && <div className="text-red-600">{formik.errors.TotalAmount}</div>}
                    </div>

                    <div className="mb-6">
                        <Textbox
                            label="Name of recognized angel investors"
                            name="InvestorName"
                            onChange={formik.handleChange}
                            value={formik.values.InvestorName}
                        />
                        {formik.errors.InvestorName && <div className="text-red-600">{formik.errors.InvestorName}</div>}
                    </div>

                    <div className="mb-6">
                        <Upload
                            label="Amount required under Matching Grants"
                            name="AmountRequired"
                            onChange={(e) => onFileChange(e, 'AmountRequired')} // Using onFileChange for file input
                        />
                        {formik.errors.AmountRequired && <div className="text-red-600">{formik.errors.AmountRequired}</div>}
                    </div>

                    <div className="mb-6">
                        <Upload
                            label="Account Statement"
                            name="AccountStatement"
                            onChange={(e) => onFileChange(e, 'AccountStatement')} // Using onFileChange for file input
                        />
                        {formik.errors.AccountStatement && <div className="text-red-600">{formik.errors.AccountStatement}</div>}
                    </div>
                </div>

                <div className="w-1/2 p-8 rounded-lg">
                    <div className="mb-6">
                        <Upload
                            label="Undertaking from investor"
                            name="Undertaking"
                            onChange={(e) => onFileChange(e, 'Undertaking')} // Using onFileChange for file input
                        />
                        {formik.errors.Undertaking && <div className="text-red-600">{formik.errors.Undertaking}</div>}
                    </div>

                    <div className="mb-6">
                        <Upload
                            label="Equity Dilution proof"
                            name="EquityDilution"
                            onChange={(e) => onFileChange(e, 'EquityDilution')} // Using onFileChange for file input
                        />
                        {formik.errors.EquityDilution && <div className="text-red-600">{formik.errors.EquityDilution}</div>}
                    </div>

                    <div className="mb-6">
                        <Upload
                            label="Fund Utilization plan"
                            name="FundUtilization"
                            onChange={(e) => onFileChange(e, 'FundUtilization')} // Using onFileChange for file input
                        />
                        {formik.errors.FundUtilization && <div className="text-red-600">{formik.errors.FundUtilization}</div>}
                    </div>

                    <div className="mb-6">
                        <Upload
                            label="Board Resolution"
                            name="BoardResolution"
                            onChange={(e) => onFileChange(e, 'BoardResolution')} // Using onFileChange for file input
                        />
                        {formik.errors.BoardResolution && <div className="text-red-600">{formik.errors.BoardResolution}</div>}
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

export default Matchingloan;
