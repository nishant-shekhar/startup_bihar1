import React,{useState} from 'react';
import Textbox from './Textbox';
import Upload from './Upload';
import { useFormik } from 'formik';

const validate = values => {
    const errors = {};

    if (!values.TypeofIPR) {
        errors.TypeofIPR = 'Required';
    }
    if (!values.IPRCertificate) {
        errors.IPRCertificate = 'Required';
    }
    if (!values.Feepaid) {
        errors.Feepaid = 'Required';
    }
    if (!values.Invoicecopy) {
        errors.Invoicecopy = 'Required';
    }
    if (!values.Consultancyfee) {
        errors.Consultancyfee = 'Required';
    }
    if (!values.GSTInvoice) {
        errors.GSTInvoice = 'Required';
    }

    return errors;
};

const Reimbursement = () => {
    const [submitted, setSubmitted] = useState(false);
    const formik = useFormik({
        initialValues: {
            TypeofIPR: '',
            IPRCertificate: '',
            Feepaid: '',
            Invoicecopy: '',
            Consultancyfee: '',
            GSTInvoice: '',
        },
        validate,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
            setSubmitted(true);
        },
    });

    const handleFileChange = (event, fieldName) => {
        const file = event.currentTarget.files[0];
        formik.setFieldValue(fieldName, file);
    };

    return (
       
        <div className="min-h-screen flex flex-col items-center">
             {submitted && (
            <div className="mt-4 font-bold text-black-600">
                Form submitted successfully!
            </div>
        )}
            <div className="flex w-full max-w-5xl mt-10 space-x-10">
                
                <form onSubmit={formik.handleSubmit} className="w-1/2 p-8 rounded-lg">
                    <h3 className="font-semibold text-xl mb-6">Apply for IPR Reimbursement</h3>
                    <div className="mb-6">
                        <Upload
                            label="Upload Copy of invoice/acknowledgement for fee paid for application form, processing charges, and all other certified charges"
                            name="Invoicecopy"
                            onChange={(event) => handleFileChange(event, 'Invoicecopy')}
                        />
                        {formik.errors.Invoicecopy && <div className="text-red-600">{formik.errors.Invoicecopy}</div>}
                    </div>

                    <div className="mb-6">
                        <Textbox
                            label="Enter fee paid for consultancy/documentation/fee paid for work of preparation, reprography of artwork, industrial design, etc. (If Any)"
                            name="Consultancyfee"
                            onChange={formik.handleChange}
                            value={formik.values.Consultancyfee}
                        />
                        {formik.errors.Consultancyfee && <div className="text-red-600">{formik.errors.Consultancyfee}</div>}
                    </div>

                    <div className="mb-6">
                        <Upload
                            label="Upload GST invoice for fee paid for consultancy/documentation/fee paid for work of preparation, reprography of artwork, industrial design, etc. (If Any)"
                            name="GSTInvoice"
                            onChange={(event) => handleFileChange(event, 'GSTInvoice')}
                        />
                        {formik.errors.GSTInvoice && <div className="text-red-600">{formik.errors.GSTInvoice}</div>}
                    </div>
                </form>

                <form className="w-1/2 p-8 mt-11 rounded-lg" onSubmit={formik.handleSubmit}>
                    <div className="mb-6">
                        <Textbox
                            label="Type of IPRs"
                            name="TypeofIPR"
                            onChange={formik.handleChange}
                            value={formik.values.TypeofIPR}
                        />
                        {formik.errors.TypeofIPR && <div className="text-red-600">{formik.errors.TypeofIPR}</div>}
                    </div>
                    <div className="mb-6">
                        <Upload
                            label="Upload IPR Certificate"
                            name="IPRCertificate"
                            onChange={(event) => handleFileChange(event, 'IPRCertificate')}
                        />
                        {formik.errors.IPRCertificate && <div className="text-red-600">{formik.errors.IPRCertificate}</div>}
                    </div>
                    <div className="mb-6">
                        <Textbox
                            label="Enter fee paid for application form, processing charges and all other cost/charges/fees or other certified charges"
                            name="Feepaid"
                            onChange={formik.handleChange}
                            value={formik.values.Feepaid}
                        />
                        {formik.errors.Feepaid && <div className="text-red-600">{formik.errors.Feepaid}</div>}
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

export default Reimbursement;
