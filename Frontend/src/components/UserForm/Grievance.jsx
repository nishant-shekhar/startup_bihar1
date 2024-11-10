import React from 'react';
import { useFormik } from 'formik';
import Upload from'./Upload';


const validate = values => {
    const errors = {};

    if (!values.griev) {
        errors.griev = 'Required';
    }
    return errors;
};
const Grievance = () => {

  const formik = useFormik({
    initialValues: {
      griev: '',
      certificate: null,
      keepTrackable: false,
    },
    validate,
    onSubmit: (values) => {
      console.log('Form data:', values);
    },
  });

  const handleFileChange = (e) => {
    formik.setFieldValue('certificate', e.target.files[0]);
  };

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-3 lg:px-8 min-h-screen flex flex-col items-center">
    <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
      <div
        className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
        style={{
          clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
        }}
      ></div>
    </div>

      <h2 className="text-center  text-xl  font-semibold mb-4">Grievance Form</h2>

      <form onSubmit={formik.handleSubmit} className="w-full max-w-md  p-6 rounded-lg">
        <div className="mb-4">
          <label className="block mb-2" htmlFor="griev">Enter your Grievance:</label>
          <textarea
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
            id="griev"
            name="griev"
            onChange={formik.handleChange}
            value={formik.values.griev}
            required
          />
           {formik.errors.griev && (
                <div className="text-red-600">{formik.errors.griev}</div>
            )}
        </div>

        <div className="mb-6">
          <label className="block mb-2" htmlFor="certificate">Upload Certificate (Optional):</label>
          <Upload
            type="file"
            id="certificate"
            name="certificate"
            onChange={handleFileChange}
            className="block w-full text-gray-900"
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="keepTrackable"
              onChange={formik.handleChange}
              checked={formik.values.keepTrackable}
              className="mr-2"
            />
            Keep Trackable
          </label>
        </div>
        <div className="flex justify-center">
        <button
          type="submit"
          className=" w-1/2 items-centere bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Submit
        </button>
        </div>
      </form>
    </div>
  );
};

export default Grievance;
