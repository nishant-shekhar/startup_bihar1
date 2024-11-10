import React, { useState } from 'react';
import Textbox from './Textbox';
import Datepicker from './Datepicker';
import { useFormik } from 'formik';

const validate = values => {
    const errors = {};

    if (!values.NameofHostInstitute) {
        errors.NameofHostInstitute = 'Required';
    }
    if (!values.NameofProgramme) {
        errors.NameofProgramme = 'Required';
    }
    if (!values.StartDate) {
        errors.StartDate = 'Required';
    }
    if (!values.EndDate) {
        errors.EndDate = 'Required';
    }
    if (!values.Programwebsite) {
        errors.Programwebsite = 'Required';
    }
    if (!values.Foundername) {
        errors.Foundername = 'Required';
    }
    if (!values.Cofoundername) {
        errors.Cofoundername = 'Required';
    }
    if (!values.FeesPaid) {
        errors.FeesPaid = 'Required';
    }
    if (!values.Railfare) {
        errors.Railfare = 'Required';
    }
    if (!values.Totalpersons) {
        errors.Totalpersons = 'Required';
    }
    if (!values.Totalfees) {
        errors.Totalfees = 'Required';
    }
  
    return errors;
};

const Acceleration = () => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const formik = useFormik({
        initialValues: {
            NameofHostInstitute: '',
            NameofProgramme: '',
            StartDate: '',
            EndDate: '',
            Programwebsite: '',
            Foundername: '',
            Cofoundername: '',
            FeesPaid: '',
            Railfare: '',
            Totalpersons: '',
            Totalfees: ''
        },
        validate,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
            setSubmitted(true)
        },
    });

    
    const handleFileChange = (file) => {
        setUploadedFile(file);
    };

    return (
        <div className="h-screen overflow-y-auto  flex flex-col items-center">
              {submitted && (
                        <div className="mt-4 font-bold text-blacl-600">
                            Form submitted successfully!
                        </div>
                    )}
            <div className="flex w-full max-w-5xl mt-10 space-x-10">
                <form onSubmit={formik.handleSubmit} className="w-1/2 p-8 rounded-lg">
                    <h3 className="font-semibold text-xl mb-6">Apply for Acceleration Program</h3>
                    
                    <div className="mb-6">
                        <Textbox
                            label="Name of the Host Institute/Organisation"
                            name="NameofHostInstitute"
                            onChange={formik.handleChange}
                            value={formik.values.NameofHostInstitute}
                        />
                        {formik.errors.NameofHostInstitute && (
                            <div className="text-red-600">{formik.errors.NameofHostInstitute}</div>
                        )}
                    </div>
                    
                    <div className="mb-6">
                        <Textbox
                            label="Name of Programme/ Event"
                            name="NameofProgramme"
                            onChange={formik.handleChange}
                            value={formik.values.NameofProgramme}
                        />
                        {formik.errors.NameofProgramme && (
                            <div className="text-red-600">{formik.errors.NameofProgramme}</div>
                        )}
                    </div>

                    <div className="mb-6">
                        <Datepicker
                            label="Program/Event Start date"
                            name="StartDate"
                            onChange={formik.handleChange}
                            value={formik.values.StartDate}
                        />
                        {formik.errors.StartDate && (
                            <div className="text-red-600">{formik.errors.StartDate}</div>
                        )}
                    </div>

                    <div className="mb-6">
                        <Datepicker
                            label="Program/Event End date"
                            name="EndDate"
                            onChange={formik.handleChange}
                            value={formik.values.EndDate}
                        />
                        {formik.errors.EndDate && (
                            <div className="text-red-600">{formik.errors.EndDate}</div>
                        )}
                    </div>

                    <div className="mb-6">
                        <Textbox
                            label="Website of the program/event (if any)"
                            name="Programwebsite"
                            onChange={formik.handleChange}
                            value={formik.values.Programwebsite}
                        />
                        {formik.errors.Programwebsite && (
                            <div className="text-red-600">{formik.errors.Programwebsite}</div>
                        )}
                    </div>

                    <div className="mb-6">
                        <Textbox
                            label="Name of founder attended the program/event"
                            name="Foundername"
                            onChange={formik.handleChange}
                            value={formik.values.Foundername}
                        />
                        {formik.errors.Foundername && (
                            <div className="text-red-600">{formik.errors.Foundername}</div>
                        )}
                    </div>
                </form>

                <form onSubmit={formik.handleSubmit} className="w-1/2 mt-12 p-8 rounded-lg">
                    <div className="mb-6">
                        <Textbox
                            label="Name of Co-founder attended the program/event"
                            name="Cofoundername"
                            onChange={formik.handleChange}
                            value={formik.values.Cofoundername}
                        />
                        {formik.errors.Cofoundername && (
                            <div className="text-red-600">{formik.errors.Cofoundername}</div>
                        )}
                    </div>

                    <div className="mb-6">
                        <Textbox
                            label="Total Fees paid for the participation per person (INR)"
                            name="FeesPaid"
                            onChange={formik.handleChange}
                            value={formik.values.FeesPaid}
                        />
                        {formik.errors.FeesPaid && (
                            <div className="text-red-600">{formik.errors.FeesPaid}</div>
                        )}
                    </div>

                    <div className="mb-6">
                        <Textbox
                            label="Total rail fare/air tickets and hotel room charges (INR)"
                            name="Railfare"
                            onChange={formik.handleChange}
                            value={formik.values.Railfare}
                        />
                        {formik.errors.Railfare && (
                            <div className="text-red-600">{formik.errors.Railfare}</div>
                        )}
                    </div>

                    <div className="mb-6">
                        <Textbox
                            label="Total Persons"
                            name="Totalpersons"
                            onChange={formik.handleChange}
                            value={formik.values.Totalpersons}
                        />
                        {formik.errors.Totalpersons && (
                            <div className="text-red-600">{formik.errors.Totalpersons}</div>
                        )}
                    </div>

                    <div className="mb-6">
                        <Textbox
                            label="Total Fees"
                            name="Totalfees"
                            onChange={formik.handleChange}
                            value={formik.values.Totalfees}
                        />
                        {formik.errors.Totalfees && (
                            <div className="text-red-600">{formik.errors.Totalfees}</div>
                        )}
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

export default Acceleration;
