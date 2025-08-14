import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import StatusDialog from '../UserForm/StatusDialog';

const AddNotificationCard = ({ onClose, onAdd }) => {
  const [dialogStatus, setDialogStatus] = useState({
    isVisible: false,
    title: "",
    subtitle: "",
    buttonVisible: false,
    status: "",
  });
  const [contentType, setContentType] = useState("");

  const handleAddNotification = async (values) => {
    try {
      setDialogStatus({
        isVisible: true,
        title: "Adding Notification",
        subtitle: "Wait while we add your notification!",
        buttonVisible: false,
        status: "checking",
      });

      await axios.post(
        "http://localhost:3007/api/notifications",
        values,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        },
      );

      setDialogStatus({
        isVisible: true,
        title: "Notification Added",
        subtitle: "Notification added successfully",
        buttonVisible: true,
        status: "success",
      });
    } catch (error) {
      console.error("Error adding notification:", error);
      setDialogStatus({
        isVisible: true,
        title: "Notification Addition Failed",
        subtitle: "Error adding notification",
        buttonVisible: true,
        status: "failed",
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20">
      <div className="bg-white bg-opacity-75 backdrop-filter backdrop-blur-lg border border-white border-opacity-30 rounded-lg shadow-xl w-96 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-[#3B82F6] hover:text-blue-600"
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Add Notification
        </h2>
        <Formik
          initialValues={{
            title: "",
            pdf: null,
            link: "",
            date: "",
          }}
          onSubmit={async (values, { resetForm }) => {
            await handleAddNotification(values);
            resetForm();
            onAdd();
          }}
        >
          {({ setFieldValue }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title</label>
                <Field
                  type="text"
                  name="title"
                  placeholder="Enter Title"
                  className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Add Content</label>
                <select
                  name="contentType"
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Content Type</option>
                  <option value="pdf">Upload PDF</option>
                  <option value="link">Add Link</option>
                </select>
              </div>

              {contentType === "pdf" && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Upload PDF</label>
                  <input
                    type="file"
                    name="pdf"
                    onChange={(event) => {
                      setFieldValue("pdf", event.currentTarget.files[0]);
                    }}
                    className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {contentType === "link" && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Add Link</label>
                  <Field
                    type="text"
                    name="link"
                    placeholder="Enter Link"
                    className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Date of Notification</label>
                <Field
                  type="date"
                  name="date"
                  className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-[#3B82F6] text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
                >
                  Add Notification
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className="z-60">
        <StatusDialog
          isVisible={dialogStatus.isVisible}
          title={dialogStatus.title}
          subtitle={dialogStatus.subtitle}
          buttonVisible={dialogStatus.buttonVisible}
          onClose={() => {
            setDialogStatus({ ...dialogStatus, isVisible: false });
            onClose();
          }}
          status={dialogStatus.status}
        />
      </div>
    </div>
  );
};

export default AddNotificationCard;