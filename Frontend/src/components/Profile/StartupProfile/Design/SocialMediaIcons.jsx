import React, { useState } from 'react';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaGlobe } from 'react-icons/fa';

const SocialMediaIcons = () => {
  const [links, setLinks] = useState({
    twitter: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    website: '', // Added website to the list
  });

  const handleChange = (platform, value) => {
    setLinks({ ...links, [platform]: value });
  };

  return (
    <div className="mt-6 flex space-x-4 justify-center">
      {Object.entries(links).map(([platform, link]) => (
        <div key={platform} className="relative group">
          {/* Icon */}
          {platform === 'twitter' && <FaTwitter className="text-xl cursor-pointer hover:text-blue-500" />}
          {platform === 'facebook' && <FaFacebook className="text-xl cursor-pointer hover:text-blue-700" />}
          {platform === 'instagram' && <FaInstagram className="text-xl cursor-pointer hover:text-pink-500" />}
          {platform === 'linkedin' && <FaLinkedin className="text-xl cursor-pointer hover:text-blue-600" />}
          {platform === 'website' && <FaGlobe className="text-xl cursor-pointer hover:text-green-600" />} {/* Added web icon */}

          {/* Input Box */}
          <input
            type="text"
            value={link}
            onChange={(e) => handleChange(platform, e.target.value)}
            placeholder={`Add ${platform.charAt(0).toUpperCase() + platform.slice(1)} Link`}
            className="absolute top-10 left-0 w-48 p-2 bg-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      ))}
    </div>
  );
};

export default SocialMediaIcons;
