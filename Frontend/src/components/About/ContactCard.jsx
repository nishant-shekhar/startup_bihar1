import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

const ContactCard = ({ name, email, phone, image, position, tag }) => {
  return (
    <div className="relative border rounded-3xl p-6 text-center hover:shadow-xl transition-shadow">
      {/* Tag at the top-center */}
      <span className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs font-bold px-2 py-1 rounded-3xl">
        {tag}
      </span>

      {/* Profile Image */}
      <img 
        src={image} 
        alt={name} 
        className="w-24 h-24 rounded-full relative top-8 mx-auto mb-4 object-cover" 
      />

      {/* Name */}
      <h3 className="text-md font-bold mb-2 relative top-6">{name}</h3>

      {/* Position */}
      <p className="text-xs text-gray-500 relative top-4 mb-3">{position}</p>

      {/* Email */}
      <div className="flex items-center justify-center space-x-3 text-xs text-gray-600 mb-3 relative top-4">
        <FontAwesomeIcon icon={faEnvelope} className="text-black" />
        <a 
          href={`mailto:${email}`} 
          className="hover:underline hover:text-red-600"
        >
          {email}
        </a>
      </div>

      {/* Phone */}
      <div className="flex items-center justify-center space-x-3 text-xs text-gray-600 relative top-4 pb-6">
        <FontAwesomeIcon icon={faPhone} className="text-black" />
        <a 
          href={`tel:${phone}`} 
          className="hover:underline hover:text-red-600"
        >
          {phone}
        </a>
      </div>

    </div>
  );
};

export default ContactCard;
