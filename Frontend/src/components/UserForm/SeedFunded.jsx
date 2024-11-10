import React, { useState } from 'react';
import Textbox from './Textbox';
import Upload from './Upload';
import Datepicker from './Datepicker';
import { useFormik } from 'formik';

const validate = values => {
    const errors = {};

    if (!values.CompanyName) {
        errors.CompanyName = 'Required';
    }
    if (!values.RegistrationNumber) {
        errors.RegistrationNumber = 'Required';
    }
    if (!values.DateofIncorporation) {
        errors.DateofIncorporation = 'Required';
    }
    if (!values.BusinessEntityType) {
        errors.BusinessEntityType = 'Required';
    }
    if (!values.CompanyCertificate) {
        errors.CompanyCertificate = 'Required';
    }
    if (!values.ROCDistrict) {
        errors.ROCDistrict = 'Required';
    }
    if (!values.CompanyAddress) {
        errors.CompanyAddress = 'Required';
    }
    if (!values.Pincode) {
        errors.Pincode = 'Required';
    }
    if (!values.BankName) {
        errors.BankName = 'Required';
    }
    if (!values.IFSCCode) {
        errors.IFSCCode = 'Required';
    }
    if (!values.CurrentAccountNumber) {
        errors.CurrentAccountNumber = 'Required';
    }
    if (!values.CurrentAccountHolderName) {
        errors.CurrentAccountHolderName = 'Required';
    }
    if (!values.BranchName) {
        errors.BranchName = 'Required';
    }
    if (!values.BranchAddress) {
        errors.BranchAddress = 'Required';
    }

    return errors;
};

const handleFileChange = (event, fieldName) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue(fieldName, file);
};
const SeedFunded = () => {
    const [submitted, setSubmitted] = useState(false);
    const formik = useFormik({
        initialValues: {
            CompanyName: '',
            RegistrationNumber: '',
            DateofIncorporation: '',
            BusinessEntityType: '',
            ROCDistrict: '',
            CompanyCertificate: '',
            CompanyAddress: '',
            Pincode: '',
            BankName: '',
            IFSCCode: '',
            CurrentAccountNumber: '',
            CurrentAccountHolderName: '',
            BranchName: '',
            BranchAddress: '',
            Uploadcancelcheque: '',
            PanNumber: '',
            GSTNumber: '',
        },
        validate,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
            setSubmitted(true)      
         },
    });

    const [uploadedFile, setUploadedFile] = useState(null);

    const handleFileChange = (event, fieldName) => {
        const file = event.currentTarget.files[0];
        formik.setFieldValue(fieldName, file);
    };

    return (
        <div className="h-screen overflow-x-auto flex flex-col items-center">
             {submitted && (
            <div className="mt-4 font-bold text-black-600">
                Form submitted successfully!
            </div>
        )}
            <div className="flex w-full max-w-5xl mt-10 space-x-10">
                <form onSubmit={formik.handleSubmit} className="w-1/2 p-8 rounded-lg">
                    <h3 className="font-semibold text-xl mb-6">Application Form for Seed Fund</h3>

                    <div className="mb-6">
                        <Textbox
                            label="Company Name"
                            name="CompanyName"
                            onChange={formik.handleChange}
                            value={formik.values.CompanyName}
                        />
                        {formik.errors.CompanyName && <div className="text-red-600">{formik.errors.CompanyName}</div>}
                    </div>

                    <div className="mb-6">
                        <Textbox
                            label="Registration Number/CIN"
                            name="RegistrationNumber"
                            onChange={formik.handleChange}
                            value={formik.values.RegistrationNumber}
                        />
                        {formik.errors.RegistrationNumber && <div className="text-red-600">{formik.errors.RegistrationNumber}</div>}
                    </div>

                    <div className="mb-6">
                        <Datepicker
                            label="Date of Incorporation"
                            name="DateofIncorporation"
                            onChange={formik.handleChange}
                            value={formik.values.DateofIncorporation}
                        />
                        {formik.errors.DateofIncorporation && <div className="text-red-600">{formik.errors.DateofIncorporation}</div>}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Entity Type</label>
                        <select
                            name="BusinessEntityType"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={formik.handleChange}
                            value={formik.values.BusinessEntityType}
                        >
                            <option value="">Select</option>
                            <option value="Sector1">Sector1</option>
                            <option value="Sector2">Sector2</option>
                            <option value="Sector3">Sector3</option>
                            <option value="Sector4">Sector4</option>
                        </select>
                        {formik.errors.BusinessEntityType && <div className="text-red-600">{formik.errors.BusinessEntityType}</div>}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">ROC District</label>
                        <select
                            name="ROCDistrict"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={formik.handleChange}
                            value={formik.values.ROCDistrict}
                        >
                            <option value="">Select</option>
                            <option value="District1">District1</option>
                            <option value="District2">District2</option>
                            <option value="District3">District3</option>
                            <option value="District4">District4</option>
                        </select>
                        {formik.errors.ROCDistrict && <div className="text-red-600">{formik.errors.ROCDistrict}</div>}
                    </div>

                    <div className="mb-6">
                        <Upload
                            label="Company Certificate"
                            name="CompanyCertificate"
                            onChange={(event) => handleFileChange(event, 'CompanyCertificate')}
                          // Updated to handle file changes
                           
                        />
                        {formik.errors.CompanyCertificate && <div className="text-red-600">{formik.errors.CompanyCertificate}</div>}
                    </div>

                    <div className="mb-6">
                        <Textbox
                            label="Company Address"
                            name="CompanyAddress"
                            onChange={formik.handleChange}
                            value={formik.values.CompanyAddress}
                        />
                        {formik.errors.CompanyAddress && <div className="text-red-600">{formik.errors.CompanyAddress}</div>}
                    </div>

                    <div className="mb-6">
                        <Textbox
                            label="Pincode"
                            name="Pincode"
                            onChange={formik.handleChange}
                            value={formik.values.Pincode}
                        />
                        {formik.errors.Pincode && <div className="text-red-600">{formik.errors.Pincode}</div>}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                        <select
                            name="BankName"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={formik.handleChange}
                            value={formik.values.BankName}
                        >
                            <option value="">Select</option>
                            <option value="Bank1">Bank1</option>
                            <option value="Bank2">Bank2</option>
                            <option value="Bank3">Bank3</option>
                            <option value="Bank4">Bank4</option>
                        </select>
                        {formik.errors.BankName && <div className="text-red-600">{formik.errors.BankName}</div>}
                    </div>
                </form>

                <form  onSubmit={formik.handleSubmit} className="w-1/2 p-8 mt-11 rounded-lg">
                    <div className="mb-6">
                        <Textbox
                            label="IFSC Code"
                            name="IFSCCode"
                            onChange={formik.handleChange}
                            value={formik.values.IFSCCode}
                        />
                        {formik.errors.IFSCCode && <div className="text-red-600">{formik.errors.IFSCCode}</div>}
                    </div>

                    <div className="mb-6">
                        <Textbox
                            label="Branch Name"
                            name="BranchName"
                            onChange={formik.handleChange}
                            value={formik.values.BranchName}
                        />
                        {formik.errors.BranchName && <div className="text-red-600">{formik.errors.BranchName}</div>}
                    </div>

                    <div className="mb-6">
                        <Textbox
                            label="Branch Address"
                            name="BranchAddress"
                            onChange={formik.handleChange}
                            value={formik.values.BranchAddress}
                        />
                        {formik.errors.BranchAddress && <div className="text-red-600">{formik.errors.BranchAddress}</div>}
                    </div>

                    <div className="mb-6">
                        <Textbox
                            label="Current Account Number"
                            name="CurrentAccountNumber"
                            onChange={formik.handleChange}
                            value={formik.values.CurrentAccountNumber}
                        />
                                               {formik.errors.CurrentAccountNumber && <div className="text-red-600">{formik.errors.CurrentAccountNumber}</div>}
                    </div>

                    <div className="mb-6">
                        <Textbox
                            label="Current Account Holder Name"
                            name="CurrentAccountHolderName"
                            onChange={formik.handleChange}
                            value={formik.values.CurrentAccountHolderName}
                        />
                        {formik.errors.CurrentAccountHolderName && <div className="text-red-600">{formik.errors.CurrentAccountHolderName}</div>}
                    </div>

                  

                    <div className="mb-6">
                        <Textbox
                            label="PAN Number"
                            name="PanNumber"
                            onChange={formik.handleChange}
                            value={formik.values.PanNumber}
                        />
                        {formik.errors.PanNumber && <div className="text-red-600">{formik.errors.PanNumber}</div>}
                    </div>

                    <div className="mb-6">
                        <Textbox
                            label="GST Number"
                            name="GSTNumber"
                            onChange={formik.handleChange}
                            value={formik.values.GSTNumber}
                        />
                        {formik.errors.GSTNumber && <div className="text-red-600">{formik.errors.GSTNumber}</div>}
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
                        <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Upload</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SeedFunded;

