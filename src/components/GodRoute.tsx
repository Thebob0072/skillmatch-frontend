import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface GodRouteProps {
  children?: React.ReactNode;
}

const GodRoute: React.FC<GodRouteProps> = ({ children }) => {
  const { isAuthenticated, isGod, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-950 to-black">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">👑</div>
          <p className="text-white text-xl font-bold">Verifying God Access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isGod) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-red-950 to-black">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">⛔</div>
          <h1 className="text-4xl font-black text-neon-red mb-4">Access Denied</h1>
          <p className="text-white text-xl mb-6">Only God tier users can access this area.</p>
          <a href="/" className="text-neon-purple hover:text-neon-pink underline">
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return <>{children || <Outlet />}</>;
};

export default GodRoute;
