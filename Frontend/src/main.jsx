import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AdminApp from './components/Profile/AdminProfile/AdminApp.jsx'
import LeftBar from './components/Profile/UserProfile/Navbar/LeftBar.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
