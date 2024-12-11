import React from "react";
import { Formik, Field, Form } from "formik";
import axios from "axios";

const UpdateSocialMediaURL = ({ startup }) => {
  const handleUpdate = async (field, value) => {
    const urlMap = {
      twitter: "http://localhost:3007/api/userlogin/update-twitter",
      facebook: "http://localhost:3007/api/userlogin/update-facebook",
      instagram: "http://localhost:3007/api/userlogin/update-instagram",
      linkedin: "http://localhost:3007/api/userlogin/update-linkedin",
      website: "http://localhost:3007/api/userlogin/update-website",
    };

    try {
      await axios.put(
        urlMap[field],
        { [field]: value },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      alert(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      alert(`Failed update ${field}`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      <div className="bg-white bg-opacity-75 backdrop-filter backdrop-blur-lg border border-white border-opacity-30 rounded-lg shadow-xl w-96 p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Update Social Media Links</h2>
        <Formik
          initialValues={{
            twitter: "",
            facebook: startup.facebook,
            instagram: "",
            linkedin: "",
            website: "",
          }}
          onSubmit={async (values) => {
           
            for (const [field, value] of Object.entries(values)) {
              if (value) {
                await handleUpdate(field, value);
              }
            }
          }}
        >
          {() => (
            <Form>
           
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Twitter URL</label>
                <Field
                  type="url"
                  name="twitter"
                  placeholder="Enter Twitter URL"
                  className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

             
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Facebook URL</label>
                <Field
                  type="url"
                  name="facebook"
                  placeholder="Enter Facebook URL"
                  className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

      
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Instagram URL</label>
                <Field
                  type="url"
                  name="instagram"
                  placeholder="Enter Instagram URL"
                  className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">LinkedIn URL</label>
                <Field
                  type="url"
                  name="linkedin"
                  placeholder="Enter LinkedIn URL"
                  className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

 
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Website URL</label>
                <Field
                  type="url"
                  name="website"
                  placeholder="Enter Website URL"
                  className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-[#3B82F6] text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
                >
                  Update Links
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateSocialMediaURL;
