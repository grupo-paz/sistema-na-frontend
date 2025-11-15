import { Navigate } from 'react-router-dom';
import { Home } from '../pages/home/home'; 

export default function RootRedirect() {
  const hostname = window.location.hostname;
  
  if (hostname.includes('admin')) { 
    return <Navigate to="/login" replace />;
  }
  
  return <Home />;
}