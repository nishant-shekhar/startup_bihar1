import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg,compressImage } from "./CropedImage.js";

const CropperModal = ({ imageSrc, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);
const handleSkip = async () => {
  const blob = await compressImage(imageSrc);
  onCropComplete(blob);
  onClose();
};
  const handleDone = async () => {
    const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropComplete(blob);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="relative w-full max-w-md bg-white rounded-lg p-4">
        <div className="relative w-full h-64">
         <Cropper
  image={imageSrc}
  crop={crop}
  zoom={zoom}
  aspect={undefined} // Allow freeform cropping
  restrictPosition={false}
  onCropChange={setCrop}
  onZoomChange={setZoom}
  onCropComplete={handleCropComplete}
/>


        </div>
       <div className="flex justify-end mt-4 space-x-2">
  <button onClick={onClose} className="text-sm text-gray-600">Cancel</button>
  <button
    onClick={handleSkip}
    className="text-sm px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
  >
    Continue without Cropping
  </button>
  <button
    onClick={handleDone}
    className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  >
    Crop & Save
  </button>
</div>
      </div>
    </div>
  );
};

export default CropperModal;
