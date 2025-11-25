import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-pink-600">
                SkillMatch
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="text-gray-700">
                  Welcome, {user?.username}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-pink-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to SkillMatch
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with skilled providers for your needs
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Find Providers</h3>
              <p className="text-gray-600">Browse through verified service providers</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Book Services</h3>
              <p className="text-gray-600">Easy and secure booking system</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">Review & Rate</h3>
              <p className="text-gray-600">Share your experience with others</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
