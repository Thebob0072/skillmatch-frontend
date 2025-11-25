import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      {/* Animated background lights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation Bar - Las Vegas Style */}
      <nav className="relative bg-black/40 backdrop-blur-md border-b border-pink-500/30 shadow-lg shadow-pink-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="text-3xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 text-transparent bg-clip-text animate-pulse">
                ✨ SkillMatch ✨
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="text-white font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-pink-600/80 to-purple-600/80 border border-pink-400/50 shadow-lg shadow-pink-500/50">
                  Welcome, {user?.username}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white font-semibold hover:text-pink-400 transition-colors duration-300 px-4 py-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold px-6 py-3 rounded-lg hover:from-pink-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-pink-500/50 border border-pink-400/50"
                  >
                    Register Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Las Vegas Neon Style */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          {/* Main Title with Neon Effect */}
          <h1 className="text-6xl md:text-7xl font-black mb-6 animate-pulse">
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 text-transparent bg-clip-text drop-shadow-2xl">
              Welcome to SkillMatch
            </span>
          </h1>
          
          {/* Neon Border Effect */}
          <div className="inline-block mb-8">
            <p className="text-2xl md:text-3xl text-white font-bold px-8 py-4 rounded-full border-4 border-pink-500 shadow-lg shadow-pink-500/50 bg-black/50 backdrop-blur-sm animate-pulse">
              🎰 Connect with Premium Providers 🎰
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
            <Link
              to="/browse"
              className="group relative bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-xl px-12 py-6 rounded-xl transform hover:scale-110 transition-all duration-300 shadow-2xl shadow-pink-500/50 border-2 border-pink-400"
            >
              <span className="relative z-10">🔍 Browse Providers</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Link>
            
            <Link
              to="/register"
              className="group relative bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black text-xl px-12 py-6 rounded-xl transform hover:scale-110 transition-all duration-300 shadow-2xl shadow-yellow-500/50 border-2 border-yellow-300"
            >
              <span className="relative z-10">⭐ Become a Provider</span>
              <div className="absolute inset-0 bg-white rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>

        {/* Feature Cards - Luxury Casino Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {/* Card 1 */}
          <div className="group relative bg-gradient-to-br from-pink-900/50 to-purple-900/50 backdrop-blur-md p-8 rounded-2xl border-2 border-pink-500/50 shadow-2xl shadow-pink-500/30 hover:shadow-pink-500/60 hover:scale-105 transform transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-4 text-center animate-pulse">💎</div>
              <h3 className="text-2xl font-black text-white mb-3 text-center bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text">
                Premium Providers
              </h3>
              <p className="text-pink-100 text-center font-semibold">
                Browse through verified luxury service providers
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md p-8 rounded-2xl border-2 border-purple-500/50 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/60 hover:scale-105 transform transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-4 text-center animate-pulse" style={{ animationDelay: '0.5s' }}>🎰</div>
              <h3 className="text-2xl font-black text-white mb-3 text-center bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                Easy Booking
              </h3>
              <p className="text-purple-100 text-center font-semibold">
                Secure and instant booking system
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative bg-gradient-to-br from-yellow-900/50 to-orange-900/50 backdrop-blur-md p-8 rounded-2xl border-2 border-yellow-500/50 shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/60 hover:scale-105 transform transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-4 text-center animate-pulse" style={{ animationDelay: '1s' }}>⭐</div>
              <h3 className="text-2xl font-black text-white mb-3 text-center bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text">
                VIP Experience
              </h3>
              <p className="text-yellow-100 text-center font-semibold">
                Rate and review your premium experiences
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section - Casino Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          <div className="text-center p-6 bg-black/50 backdrop-blur-sm rounded-xl border-2 border-pink-500/50 shadow-lg shadow-pink-500/30">
            <div className="text-4xl font-black text-pink-400 mb-2">1000+</div>
            <div className="text-white font-semibold">Providers</div>
          </div>
          <div className="text-center p-6 bg-black/50 backdrop-blur-sm rounded-xl border-2 border-purple-500/50 shadow-lg shadow-purple-500/30">
            <div className="text-4xl font-black text-purple-400 mb-2">5000+</div>
            <div className="text-white font-semibold">Happy Clients</div>
          </div>
          <div className="text-center p-6 bg-black/50 backdrop-blur-sm rounded-xl border-2 border-yellow-500/50 shadow-lg shadow-yellow-500/30">
            <div className="text-4xl font-black text-yellow-400 mb-2">24/7</div>
            <div className="text-white font-semibold">Support</div>
          </div>
          <div className="text-center p-6 bg-black/50 backdrop-blur-sm rounded-xl border-2 border-green-500/50 shadow-lg shadow-green-500/30">
            <div className="text-4xl font-black text-green-400 mb-2">100%</div>
            <div className="text-white font-semibold">Verified</div>
          </div>
        </div>
      </main>

      {/* Footer with Neon Effect */}
      <footer className="relative mt-20 py-8 bg-black/60 backdrop-blur-md border-t border-pink-500/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-pink-300 font-semibold text-lg">
            ✨ SkillMatch - Where Luxury Meets Service ✨
          </p>
          <p className="text-purple-300 mt-2">
            © 2025 SkillMatch. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
