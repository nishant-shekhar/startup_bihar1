import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaGlobe } from 'react-icons/fa';

const Startupdetails = ({ founderimage, companyname, year }) => {
  const [foundername, setFounderName] = useState('');
  const [company_name, setCompanyName] = useState('');
  const [moto, setMoto] = useState('Transforming the industry in the startup space');
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
  const [founderImageUrl, setFounderImageUrl] = useState(founderimage);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3007/api/userlogin/startup-details?user_id=${localStorage.getItem('user_id')}`
        );

        const { startup } = response.data;
        setFounderName(startup.founder_name);
        setCompanyName(startup.company_name);
        setMoto(startup.moto || 'Transforming the industry in the startup space');
        setLinks({
          twitter: startup.twitter || '',
          facebook: startup.facebook || '',
          instagram: startup.instagram || '',
          linkedin: startup.linkedin || '',
          website: startup.website || '',
        });
        setFounderImageUrl(startup.logo || founderimage);
      } catch (error) {
        console.error('Failed to fetch startup details:', error);
      }
    };

    fetchDetails();
  }, [founderimage]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('logo', file);

      try {
        setShowDialog(true);
        setDialogMessage("Uploading logo...");

        const response = await axios.put('http://localhost:3007/api/userlogin/update-logo', formData, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`, // No 'Bearer' prefix as requested
            'Content-Type': 'multipart/form-data',
          },
        });

        setDialogMessage("Logo updated successfully");
        setFounderImageUrl(URL.createObjectURL(file)); // Update preview with selected file

      } catch (error) {
        console.error('Failed to upload logo:', error);
        setDialogMessage("Failed to update logo");
      } finally {
        setTimeout(() => setShowDialog(false), 2000);
      }
    }
  };

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpdate = async (field, value) => {
    const urlMap = {
      moto: 'http://localhost:3007/api/userlogin/update-moto',
      twitter: 'http://localhost:3007/api/userlogin/update-twitter',
      facebook: 'http://localhost:3007/api/userlogin/update-facebook',
      instagram: 'http://localhost:3007/api/userlogin/update-instagram',
      linkedin: 'http://localhost:3007/api/userlogin/update-linkedin',
      website: 'http://localhost:3007/api/userlogin/update-website',
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
      <div className="mb-4 p-4 max-w-full md:max-w-3xl mx-auto">
             <div className="flex flex-col items-center w-full space-y-4">

                <div className="flex flex-col items-center">
                    <img
                    alt="Founder"
                    src={founderImageUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAWlBMVEXv8fNod4f19vhkdIRcbX52g5KPmqX29/iYoq3l6OuCj5vd4eTr7fBfcIFaa33M0dbBx82SnKe7wchtfIt8iZejq7TU2N2Ik6CwuL/Gy9Gqsrqbpa/P1NmhqrNz0egRAAADBklEQVR4nO3c63KqMBRAYUiwwUvEete27/+ax1tVAqhwEtnprO+XM62Oyw2CGTFJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJe6Mb5vqL7jjsws/wgln/dddzBZZjocuxj2HaiWNg1JL/oO3GVBA9PUzvvdF80q7AgPQ/zot1DlOnThyFBIIYWvFtrMK3mFdj30aWzFFWZjr+/qE4mFXh+YwrehsDMK34bCzmIoVEad1nC6PbD8QpXMNwOdDvKi2xMUX2jm2h7/onU2WHcZo/RCld8WN3TWZR1CeKH6LK1tTGftE2UXqpmzPGXbLwnKLkzcT8X6s/UQRReqWWX9LWs9RNGF5qOysmFb74miC9XCDUzt6k8VJtXC9jsihW9Tu5Uuq/vhvlKokuGjc1bRhWZVLdw5MWq8mU6zfNL4wKILk/W0spW6dyvOZ61p4wKd7EIzcoZot+UQVVxeA62bEmUXJuPyIV8PnDsVtxXtpikKL1S7++1U6/IZzV1g8xSFFx4i9HWMdjksNZQCGxOlFyZq8jW1VmubpZV90PngUZ8ovvDYuNt//Wy/1ZPAhsQICo+rUMa4T70msP7tJorCun8vKofKhilGWlg7wfopxlnYMMHaKUZZ2DjBuinGWPgwsDLFCAufBLqJ8RU+DXQ21OgKXwgsTzG2wpcCj1O8nsJGVvjgMNE0xbgKX5zgeYqXxKgKX57geYrnDTWmwhYTvJtiRIUtA3/fbuIpbB14mWI0hR0Cz1OMpbBT4CkxiaOwY+BpQ42isNVhwk283hJc2HmC5Va5hf8xwTgK/UxQcKGvQLGF3gKlFvoLFFroMVBmoc9AkYWeDhNyC1Xh9aJLeYV+Jyiw0Os+KLHQe6C0Qv+BwgoDBMoqDBEoqtCECJRUOPz2e5gQV2jnYa7qllOYBvr5CEGFgVBIIYXPmJ/ghZueZ+hexOWd+w3q9ycuwg5R2377DsapDflbX7rTFah+TbajQSij/aT/wNNF26FUvoELAAAAAAAAAAAAAAAAAAAAAAAAAAAA4G/4B9L3P1vg3y4/AAAAAElFTkSuQmCC'}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-400 cursor-pointer transition-transform duration-300 hover:scale-105"
                    onClick={openFileSelector}
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
                      <h1 className="text-xl md:text-2xl font-bold">{company_name || 'Loading...'}</h1>
                      <p className="text-sm md:text-base">{foundername || 'Elon Musk'}, Founder</p>
                      <div className="flex justify-center space-x-2 text-xs md:text-sm mt-1">
                        <span>• Startup</span>
                        <span>• Since {year || 'Year'}</span>
                      </div>
                   </div>
                  </div>

 
                    <div className="mt-4 text-center">
                     {isEditingMoto ? (
                        <input
                          type="text"
                          value={moto}
                          onChange={(e) => {
                            if (e.target.value.length <= 80) {
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
                        </div>


     

      <div className="mt-6 flex space-x-4 justify-center">
        {Object.entries(links).map(([platform, link]) => (
          <div key={platform} className="relative group">
            {platform === 'twitter' && <FaTwitter className="text-xl cursor-pointer hover:text-blue-500" />}
            {platform === 'facebook' && <FaFacebook className="text-xl cursor-pointer hover:text-blue-700" />}
            {platform === 'instagram' && <FaInstagram className="text-xl cursor-pointer hover:text-pink-500" />}
            {platform === 'linkedin' && <FaLinkedin className="text-xl cursor-pointer hover:text-blue-600" />}
            {platform === 'website' && <FaGlobe className="text-xl cursor-pointer hover:text-green-600" />}

            {/* <input
              type="text"
              value={link}
              onChange={(e) => handleChange(platform, e.target.value)}
              onBlur={() => handleUpdate(platform, link)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleUpdate(platform, link);
                }
              }}
              placeholder={link || `Add ${platform.charAt(0).toUpperCase() + platform.slice(1)} Link`}
              className="absolute top-10 left-0 w-48 p-2 bg-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-black"
            /> */}
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
  companyname: PropTypes.string,
  year: PropTypes.string,
};

export default Startupdetails;
