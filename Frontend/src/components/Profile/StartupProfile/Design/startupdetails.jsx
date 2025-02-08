import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage'; // your helper function
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaGlobe } from 'react-icons/fa';

const Startupdetails = ({ startup }) => {
  const [moto, setMoto] = useState('Update your moto here');
  const [links, setLinks] = useState({
    twitter: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    website: '',
  });
  const [isEditingMoto, setIsEditingMoto] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [founderImageUrl, setFounderImageUrl] = useState("https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FPink%20Marble%20Background%20Reminder%20Instagram%20Post%20(1).png?alt=media&token=dd704bc5-5cc1-48f4-a80a-a8ec12fa9512");

  // --- New state variables for cropping ---
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (startup) {
      setMoto(
        startup.moto && startup.moto.trim().length > 0
          ? startup.moto
          : 'Update Your Startup Moto Here'
      );
      setLinks({
        twitter: startup.twitter || '',
        facebook: startup.facebook || '',
        instagram: startup.instagram || '',
        linkedin: startup.linkedin || '',
        website: startup.website || '',
      });
      setFounderImageUrl(
        startup.logo ||
          "https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FPink%20Marble%20Background%20Reminder%20Instagram%20Post%20(1).png?alt=media&token=dd704bc5-5cc1-48f4-a80a-a8ec12fa9512"
      );
    }
  }, [startup]);

  // Modified file change handler: now set the file for cropping instead of immediately uploading
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if file size exceeds 1 MB (1,048,576 bytes)
      if (file.size > 1048576) {
        setShowDialog(true);
        setDialogMessage('File size exceeds the 1 MB limit');
        setTimeout(() => setShowDialog(false), 2000);
        return;
      }
      // Set selected file URL for cropping and show cropper modal
      setSelectedFile(URL.createObjectURL(file));
      setShowCropper(true);
    }
  };

  // Handler to save the crop result
  const handleCropSave = async () => {
    try {
      const croppedImageUrl = await getCroppedImg(selectedFile, croppedAreaPixels);
      setFounderImageUrl(croppedImageUrl);
      setShowCropper(false);
      
      // Optionally, upload the cropped image to your server:
      const blob = await fetch(croppedImageUrl).then(r => r.blob());
      const formData = new FormData();
      formData.append('logo', blob, 'cropped.jpg');

      setShowDialog(true);
      setDialogMessage('Uploading cropped logo...');
      await axios.put('http://localhost:3007/api/userlogin/update-logo', formData, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setDialogMessage('Logo updated successfully');
      setTimeout(() => setShowDialog(false), 2000);
    } catch (error) {
      console.error('Error cropping image:', error);
      setDialogMessage('Failed to update logo');
      setTimeout(() => setShowDialog(false), 2000);
    }
  };

  const handleUpdate = async (field, value) => {
    const urlMap = {
      moto: 'http://localhost:3007/api/userlogin/update-moto',
    };

    setShowDialog(true);
    setDialogMessage(`Updating ${field}...`);

    try {
      await axios.put(
        urlMap[field],
        { [field]: value },
        {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        }
      );
      setDialogMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      setDialogMessage(`Failed to update ${field}`);
    } finally {
      setTimeout(() => setShowDialog(false), 2000);
    }
  };

  const handleChange = (field, value) => {
    if (field === 'moto') {
      setMoto(value);
    } else {
      setLinks({ ...links, [field]: value });
    }
  };

  return (
    <div className="mb-4 p-4 max-w-full md:max-w-3xl mx-auto">
      <div className="flex flex-col items-center w-full space-y-4">
        <div className="flex flex-col items-center">
          {/* Display the (possibly cropped) logo with circular styling and shadow */}
          <img
            alt="Founder"
            src={founderImageUrl}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-400 shadow-md cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold">{startup.company_name || 'Loading...'}</h1>
          <p className="text-sm md:text-base">{startup.founder_name || 'Founder'}, Founder</p>
          <div className="flex justify-center space-x-2 text-xs md:text-sm mt-1">
            <span>• Startup</span>
            <span>• Since {startup.startup_since || 'Year'}</span>
          </div>
        </div>
      </div>

      {/* Cropper Modal */}
      {showCropper && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="relative w-80 h-80 bg-white p-4">
          <Cropper
  image={selectedFile}
  crop={crop}
  zoom={zoom}
  aspect={1}              // square crop dimensions
  cropShape="round"       // this makes the crop overlay circular
  onCropChange={setCrop}
  onZoomChange={setZoom}
  onCropComplete={(croppedArea, croppedAreaPixels) =>
    setCroppedAreaPixels(croppedAreaPixels)
  }
/>
          </div>
          {/* Zoom slider */}
          <div className="w-80 my-4">
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowCropper(false)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleCropSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Save Crop
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 flex space-x-4 justify-center">
        {Object.entries(links).map(([platform, link]) => (
          <div key={platform} className="relative group">
            <a href={link} target="_blank" rel="noopener noreferrer">
              {platform === 'twitter' && <FaTwitter className="text-xl cursor-pointer hover:text-blue-500" />}
              {platform === 'facebook' && <FaFacebook className="text-xl cursor-pointer hover:text-blue-700" />}
              {platform === 'instagram' && <FaInstagram className="text-xl cursor-pointer hover:text-pink-500" />}
              {platform === 'linkedin' && <FaLinkedin className="text-xl cursor-pointer hover:text-blue-600" />}
              {platform === 'website' && <FaGlobe className="text-xl cursor-pointer hover:text-green-600" />}
            </a>
            {/* Tooltip */}
            {link && (
              <span className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {link}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        {isEditingMoto ? (
          <input
            type="text"
            value={moto}
            onChange={(e) => {
              if (e.target.value.length <= 50) {
                handleChange('moto', e.target.value);
              }
            }}
            onBlur={() => {
              handleUpdate('moto', moto);
              setIsEditingMoto(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUpdate('moto', moto);
                setIsEditingMoto(false);
              }
            }}
            className="border p-2 rounded w-full md:w-auto text-black"
          />
        ) : (
          <p onClick={() => setIsEditingMoto(true)} className="cursor-pointer text-base italic">
            {moto || 'Click to add moto'}
          </p>
        )}
      </div>

      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white p-6 rounded shadow-lg max-w-xs text-center">
            <p className="text-black font-semibold text-lg">{dialogMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

Startupdetails.propTypes = {
  founderimage: PropTypes.string,
  startup: PropTypes.object.isRequired,
};

export default Startupdetails;
