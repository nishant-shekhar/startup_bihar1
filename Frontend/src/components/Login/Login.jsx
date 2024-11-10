import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import loginvid from '../../assets/loginvid.mp4';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false); // Toggle between admin and user login
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = () => {
    // Input validation for empty fields
    if (!id || !password) {
      setErrorMessage('Please enter both ID and Password');
      return;
    }

    if (isAdminLogin) {
      // Admin login
      if (id === 'admin' && password === 'admin') {
        console.log('Admin login successful!');
        navigate('/adminprofile'); // Redirect to Admin Profile page (correct path)
      } else {
        setErrorMessage('Invalid Admin ID or Password');
      }
    } else {
      // User login
      if (id === 'user' && password === 'user') {
        console.log('User login successful!');
        navigate('/userprofile'); // Redirect to User Profile page (correct path)
      } else {
        setErrorMessage('Invalid User ID or Password');
      }
    }
  };

  const toggleLoginMode = () => {
    setIsAdminLogin(!isAdminLogin);
    setErrorMessage('');
    setId('');
    setPassword('');
  };

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        src={loginvid}
      />
      {/* Light Filter */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-95"></div>

      {/* Login Form */}
      <div className="relative z-10 bg-white p-10 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-5 text-center text-black">
          {isAdminLogin ? 'Admin Login' : 'User Login'}
        </h1>

        {/* Input for ID */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Input for Password */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Toggle between Admin and User */}
        <div className="flex justify-between mb-6">
          <a
            href="#"
            onClick={toggleLoginMode}
            className="text-sm text-blue-500"
          >
            {isAdminLogin ? 'User?' : 'Admin?'}
          </a>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        {/* Login button */}
        <button
          onClick={handleLogin}
          className="w-full bg-[#061161] text-white py-2 px-4 rounded-lg hover:bg-[#6f80ff] focus:outline-none"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Login;
