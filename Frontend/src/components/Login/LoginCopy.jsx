import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; // Import toast for notifications
import loginvid from '../../assets/loginvid.mp4'; // Video import

const LoginCopy = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true); // Set loading to true when login starts

    if (!id || !password) {
      setErrorMessage('Please enter both ID and Password');
      toast.error('Please enter both ID and Password');
      setIsLoading(false); // Reset loading state
      return;
    }

    try {
      const loginUrl = isAdminLogin ? 'http://51.20.148.118:3007/api/adminlogin' : 'http://51.20.148.118:3007/api/userlogin';

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: !isAdminLogin ? id : undefined,
          admin_id: isAdminLogin ? id : undefined,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Login successful!');
        localStorage.setItem('token', `Bearer ${data.token}`);

        if (!isAdminLogin) {
          localStorage.setItem('registration_no', data.registration_no);
          localStorage.setItem('user_id', data.user_id);

        }else if(isAdminLogin){
          localStorage.setItem('admin_id', data.admin_id);
          localStorage.setItem('admin_name', data.name);
          localStorage.setItem('admin_designation', data.designation);
          localStorage.setItem('admin_role', data.role);

        }
       
        // Redirect based on login type
        navigate(isAdminLogin ? '/AdminProfile' : '/StartupProfile');
      } else {
        setErrorMessage(data.error || 'Login failed');
        toast.error(data.error || 'Login failed');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false); // Reset loading state when request completes
    }
  };

  const toggleLoginMode = () => {
    setIsAdminLogin(!isAdminLogin);
    setErrorMessage('');
    setId('');
    setPassword('');
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 px-6 py-12 lg:px-8">
      <div className="relative z-10 bg-white p-6 rounded-lg shadow-md login-container w-full max-w-xs mx-auto">
        <div className="sm:mx-auto sm:w-full sm:max-w-xs">
          <img
            className="mx-auto h-10 w-auto"
            src="https://startup.bihar.gov.in/static/media/new_logo.efdd49a20c5fb7fe0b73.png"
            alt="Startup Bihar"
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <fieldset className="mt-6">
          <legend className="sr-only">Login Type</legend>
          <div className="flex justify-center gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="login-type"
                className="hidden"
                checked={!isAdminLogin}
                onChange={() => setIsAdminLogin(false)}
              />
              <span className={`px-4 py-2 rounded-full ${!isAdminLogin ? 'border-2 border-blue-500' : 'border'}`}>Startup</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="login-type"
                className="hidden"
                checked={isAdminLogin}
                onChange={() => setIsAdminLogin(true)}
              />
              <span className={`px-4 py-2 rounded-full ${isAdminLogin ? 'border-2 border-blue-500' : 'border'}`}>Admin</span>
            </label>
          </div>
        </fieldset>

        {errorMessage && <p className="mt-2 text-red-600 text-center">{errorMessage}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-900">
              {isAdminLogin ? 'Admin ID' : 'User ID'}
            </label>
            <input
              id="userId"
              name="userId"
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>

      <video autoPlay loop muted className="absolute inset-0 object-cover w-full h-full blur-sm">
        <source src={loginvid} type="video/mp4" />
      </video>
    </div>
  );
};

export default LoginCopy;
