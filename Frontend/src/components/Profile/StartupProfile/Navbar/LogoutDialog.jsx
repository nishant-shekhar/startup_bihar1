import React from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';

const LogOutDialogBox = ({
  isVisible,
  title,
  subtitle,
  buttonVisible,
  onClose,
  status,
  actionButton,
  cancelButton,
  onCancel,
}) => {
  if (!isVisible) return null;

  const textColor =
    status === 'success'
      ? 'text-green-600'
      : status === 'failed'
      ? 'text-red-600'
      : 'text-black';
  const buttonColor =
    status === 'success'
      ? 'bg-green-600 hover:bg-green-500'
      : status === 'failed'
      ? 'bg-red-600 hover:bg-red-500'
      : 'bg-black hover:bg-gray-800';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-all">
      <div className="relative w-full h-full max-w-full max-h-full flex justify-center items-center animate__animated animate__fadeIn animate__faster">
        <div className="relative w-full h-auto sm:w-full sm:max-w-lg bg-white text-left shadow-xl transition-all transform rounded-lg overflow-hidden">
          <div className="bg-white px-6 py-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div
                className={`mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10 ${textColor}`}
              >
                <AiOutlineCloudUpload className="text-xl animate__animated animate__fadeIn animate__delay-0.5s" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3
                  className={`text-base font-semibold ${textColor}`}
                  id="modal-title"
                >
                  {title}
                </h3>
                <div className="mt-2">
                  <p className={`text-md ${textColor}`}>{subtitle}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            {buttonVisible && (
              <button
                type="button"
                className={`inline-flex w-full justify-center rounded-md px-6 py-3 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto transform transition-transform duration-300 hover:scale-105 ${buttonColor}`}
                onClick={onClose}
              >
                {actionButton || 'Ok'}
              </button>
            )}
            {cancelButton && (
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md px-6 py-3 text-sm font-semibold text-black border border-gray-300 shadow-sm sm:ml-3 sm:w-auto transform transition-transform duration-300 hover:scale-105 hover:border-gray-500"
                onClick={onCancel}
              >
                {cancelButton || 'Cancel'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogOutDialogBox;
