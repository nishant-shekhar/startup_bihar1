import React, { useState, useEffect } from 'react';
import axios from 'axios';



const FormStatus = ({ url }) => {
  const [statusMessage, setStatusMessage] = useState("Checking form status...");

  const checkDocumentStatus = async (url) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setStatusMessage("No token found. Please log in again.");
      return;
    }

    try {
      console.log("Making request to:", url);
      const response = await axios.get(url, {
        headers: { Authorization: token },
      });

      console.log("Response received:", response.data);

      const { document } = response.data;

      // Set the message based on the document status
      const statusMessages = {
        created: "Document Status: Initiated - Your document is under review.",
        Updated: "Document Status: Initiated - Your document is under review.",
        accepted: "Document Status: Accepted - Your document has been approved.",
        rejected: "Document Status: Rejected - Your document has been rejected.",
      };

      setStatusMessage(statusMessages[document.documentStatus] || "Document status is unknown.");
      
    } catch (error) {
      console.error('Error fetching document status:', error);
      setStatusMessage("Failed to retrieve document status.");
    }
  };

  useEffect(() => {
    if (url) {
      checkDocumentStatus(url);
    }
  }, [url]);

  return (
    <div className="isolate bg-white px-6 py-24 h-screen flex flex-col items-center justify-center">
      <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        ></div>
      </div>
      <h3 className="font-semibold text-xl mb-6 text-center">Form Status</h3>
      <p className="text-lg text-center">{statusMessage}</p>
    </div>
  );
};

export default FormStatus;
