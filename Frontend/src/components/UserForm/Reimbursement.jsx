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
       
        <div className="min-h-screen flex flex-col items-center overflow-x-hidden">
            	<div className="relative w-full h-[250px]">

				<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" width="1440" height="250" preserveAspectRatio="none" viewBox="0 0 1440 250">
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
					<h1 className="text-3xl font-bold mb-2 relative top-10">Apply for IPR Reimbursement </h1>
					<p className="text-lg max-w-xl relative top-10">
						Share your innovative ideas and secure funding to turn them into reality.
					</p>
				</div>
			</div>

			<div
				className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
				aria-hidden="true"
			/>
             {submitted && (
            <div className="mt-4 font-bold text-black-600">
                Form submitted successfully!
            </div>
        )}
            <div className="flex w-full max-w-5xl mt-10 space-x-10">
                
                <form onSubmit={formik.handleSubmit} className="w-1/2 p-8 rounded-lg">
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

                <form className="w-1/2 p-8 mt-1 rounded-lg" onSubmit={formik.handleSubmit}>
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
                    </div>z 

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
