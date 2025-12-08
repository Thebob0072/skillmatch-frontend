import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { ProfileDropdown } from './ProfileDropdown';

export function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-black/60 backdrop-blur-xl px-4 py-3 sm:py-4 fixed w-full z-50 border-b border-neon-pink/30 shadow-2xl">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 sm:gap-3 group flex-shrink-0"
        >
          <div className="text-3xl sm:text-4xl transform group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(255,16,240,0.8)]">
            💋
          </div>
          <div className="flex flex-col">
            <span 
              className="text-lg sm:text-xl lg:text-2xl font-black leading-tight animate-neon-pulse"
              style={{
                background: 'linear-gradient(to right, #ff10f0, #9d00ff, #ffd700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'brightness(1.3)',
                display: 'inline-block'
              }}
            >
              Thai Variety
            </span>
            <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-neon-gold tracking-wider sm:tracking-widest">
              ENTERTAINMENT
            </span>
          </div>
        </Link>

        {/* Right Side Menu */}
        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
          
          <LanguageSwitcher />

          <Link 
            to="/browse" 
            className="hidden sm:inline-block text-gray-300 hover:text-neon-pink text-sm lg:text-base font-semibold transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,16,240,0.6)]"
          >
            {t('nav_browse') || 'Browse'}
          </Link>

          {/* Conditional UI: Logged In vs. Logged Out */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="relative">
                {/* Profile Icon Button */}
                <button
                  onClick={() => setIsDropdownOpen(prev => !prev)}
                  className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold border-2 border-neon-purple hover:border-neon-pink cursor-pointer focus:outline-none overflow-hidden transition-all hover:scale-110 hover:shadow-[0_0_20px_rgba(157,0,255,0.6)]"
                >
                  {user?.profile_picture_url ? (
                    <img 
                      src={user.profile_picture_url} 
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg">{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
                  )}
                </button>

                {/* The Dropdown Popup */}
                {isDropdownOpen && (
                  <ProfileDropdown closeDropdown={() => setIsDropdownOpen(false)} />
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              <Link
                to="/login"
                className="px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 rounded-full text-sm lg:text-base font-bold bg-gradient-to-r from-neon-purple to-neon-blue text-white border border-neon-purple/50 sm:border-2 hover:border-neon-purple hover:shadow-lg hover:shadow-neon-purple/50 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
              >
                {t('login_button') || 'Login'}
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 rounded-full font-bold bg-gradient-to-r from-neon-pink to-neon-gold text-white border-2 border-neon-pink/50 hover:border-neon-pink hover:shadow-lg hover:shadow-neon-pink/50 transition-all duration-300 transform hover:scale-105 animate-glow-pink"
              >
                {t('register_button') || 'Register'}
              </Link>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}
