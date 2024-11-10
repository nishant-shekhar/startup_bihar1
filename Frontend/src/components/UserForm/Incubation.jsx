import React ,{useState} from 'react'
import { useFormik } from 'formik';
import axios from 'axios';
import Upload from './Upload';

const Incubation = () => {
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const formik = useFormik({
        initialValues: {
            incubationCenter: '',
            status:'',
        },
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
              const response = await axios.post('http://localhost:3000/api/incubation', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `${localStorage.getItem('token')}`, // Assuming you store the token in localStorage
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
    
    <div className="isolate bg-white px-6 py-24 sm:py-3 lg:px-8 h-screen flex flex-col items-center">
    <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
      <div
        className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
        style={{
          clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
        }}
      ></div>
    </div>
    <h2 className="text-center text-xl font-semibold mt-10  ">Apply for Incubation</h2>
         
        
         <div className="flex justify-center max-w-5xl mx-auto " >
         
             
             <form onSubmit={formik.handleSubmit} className="w-1/2 p-8 rounded-lg">
             <div className="mb-6">
             <label className="block text-sm font-medium text-gray-700 mb-2">Incubation Center</label>
             <select
                         name="incubationCenter"
                         className="block w-full pb-3 rounded-md border-0 p-1.5  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                         onChange={formik.handleChange}
                         value={formik.values.incubationCenter}
                     >
                         <option value="">Select</option>
                         <option value="Inc1">Inc1</option>
                         <option value="Inc2">Inc2</option>
                         <option value="Inc3">Inc3</option>
                         <option value="Inc4">Inc4</option>
                     </select>
                    
                     {formik.errors.incubationCenter && <div className="text-red-600">{formik.errors.incubationCenter}</div>}
            </div>
            <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enter fee paid for consultancy/documentation/fee paid for work of preparation, reprography of artwork, industrial design, etc. (If Any)</label>
                        <input
                            type = "text"
                            
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                            
                            name="status"
                            onChange={formik.handleChange}
                            value={formik.values.status}
                        />
                        {formik.errors.status && <div className="text-red-600">{formik.errors.status}</div>}
            </div>
            <button type="submit" className=" text-white bg-indigo-600  rounded py-2 px-4">Submit</button>
  

    
                            
                    {successMessage && <div className="text-green-500 mt-4">{successMessage}</div>}
                    {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}     </form>            
    </div>
    </div>
  )
}

export default Incubation;