import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
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

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (startup) {
      setMoto(startup.moto || 'Update Your Startup Moto Here');
      setLinks({
        twitter: startup.twitter || '',
        facebook: startup.facebook || '',
        instagram: startup.instagram || '',
        linkedin: startup.linkedin || '',
        website: startup.website || '',
      });
      setFounderImageUrl(startup.logo || "https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FPink%20Marble%20Background%20Reminder%20Instagram%20Post%20(1).png?alt=media&token=dd704bc5-5cc1-48f4-a80a-a8ec12fa9512");
    }
  }, [startup]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if file size exceeds 1 MB (1 MB = 1,048,576 bytes)
      if (file.size > 1048576) {
        setShowDialog(true);
        setDialogMessage('File size exceeds the 1 MB limit');
        setTimeout(() => setShowDialog(false), 2000);
        return; // Stop processing if file is too large
      }

      const formData = new FormData();
      formData.append('logo', file);

      try {
        setShowDialog(true);
        setDialogMessage('Uploading logo...');

        const response = await axios.put('https://startupbihar.in/api/userlogin/update-logo', formData, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        setDialogMessage('Logo updated successfully');
        // Update the image source using URL.createObjectURL for immediate preview
        setFounderImageUrl(URL.createObjectURL(file));
      } catch (error) {
        console.error('Failed to upload logo:', error);
        setDialogMessage('Failed to update logo');
      } finally {
        setTimeout(() => setShowDialog(false), 2000);
      }
    }
  };


  const handleUpdate = async (field, value) => {
    const urlMap = {
      moto: 'https://startupbihar.in/api/userlogin/update-moto',
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
          <img
            alt="Founder"
            src={founderImageUrl}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-400 cursor-pointer transition-transform duration-300 hover:scale-105"
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
          <p onClick={() => setIsEditingMoto(true)} className="cursor-pointer text-lg italic">
            {moto || 'Click to add moto'}
          </p>
        )}
      </div>

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
