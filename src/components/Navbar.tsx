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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-black/60 backdrop-blur-xl px-3 sm:px-4 py-2.5 sm:py-3 md:py-4 fixed w-full z-[999] border-b border-neon-pink/30 shadow-2xl">
      <div className="container mx-auto flex justify-between items-center relative">
        {/* Logo - Compact for mobile */}
        <Link 
          to="/" 
          className="flex items-center gap-1.5 sm:gap-2 md:gap-3 group flex-shrink-0"
        >
          <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl transform group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(255,16,240,0.8)]">
            💋
          </div>
          <div className="flex flex-col">
            <span 
              className="text-xs sm:text-base md:text-lg lg:text-xl font-black leading-tight animate-neon-pulse"
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
            <span className="hidden sm:block text-[10px] sm:text-xs lg:text-sm font-bold text-neon-gold tracking-wider sm:tracking-widest">
              ENTERTAINMENT
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
          <LanguageSwitcher />

          <Link 
            to="/browse" 
            className="text-gray-300 hover:text-neon-pink text-sm lg:text-base font-semibold transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,16,240,0.6)]"
          >
            {t('nav_browse') || 'Browse'}
          </Link>

          <Link 
            to="/promotions" 
            className="text-gray-300 hover:text-neon-gold text-sm lg:text-base font-semibold transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.6)] flex items-center gap-1"
          >
            <span className="text-base">🎁</span>
            {t('nav_promotions', 'Promotions')}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(prev => !prev)}
                  className="w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold border-2 border-neon-purple hover:border-neon-pink cursor-pointer focus:outline-none overflow-hidden transition-all hover:scale-110 hover:shadow-[0_0_20px_rgba(157,0,255,0.6)]"
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

                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-[998]"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <ProfileDropdown closeDropdown={() => setIsDropdownOpen(false)} />
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 lg:space-x-4">
              <Link
                to="/login"
                className="px-5 lg:px-6 py-2 sm:py-2.5 rounded-full text-sm lg:text-base font-bold bg-gradient-to-r from-neon-purple to-neon-blue text-white border-2 border-neon-purple/50 hover:border-neon-purple hover:shadow-lg hover:shadow-neon-purple/50 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
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

        {/* Mobile Menu - Compact */}
        <div className="flex md:hidden items-center space-x-2">
          <LanguageSwitcher />
          
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(prev => !prev)}
                className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold border-2 border-neon-purple hover:border-neon-pink cursor-pointer focus:outline-none overflow-hidden transition-all"
              >
                {user?.profile_picture_url ? (
                  <img 
                    src={user.profile_picture_url} 
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm">{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
                )}
              </button>

              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-[998]"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <ProfileDropdown closeDropdown={() => setIsDropdownOpen(false)} />
                </>
              )}
            </div>
          ) : (
            <>
              {/* Hamburger Menu Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                className="p-3 text-white hover:text-neon-pink transition-colors focus:outline-none active:scale-95 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Toggle menu"
                type="button"
              >
                <svg className="w-7 h-7 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && !isAuthenticated && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-0 pb-4 border-t border-neon-pink/20 pt-4 space-y-4 bg-black/95 backdrop-blur-lg rounded-b-xl px-4 shadow-2xl z-[1000]">
          <Link
            to="/browse"
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(false);
            }}
            className="block text-center text-gray-300 hover:text-neon-pink active:text-neon-pink text-sm font-semibold py-3 min-h-[44px] transition-all duration-300 touch-manipulation active:scale-95 hover:bg-neon-pink/10 rounded-lg"
          >
            {t('nav_browse') || 'Browse'}
          </Link>
          <Link
            to="/promotions"
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(false);
            }}
            className="block text-center text-gray-300 hover:text-neon-gold active:text-neon-gold text-sm font-semibold py-3 min-h-[44px] transition-all duration-300 touch-manipulation active:scale-95 hover:bg-neon-gold/10 rounded-lg flex items-center justify-center gap-2"
          >
            <span className="text-base">🎁</span>
            {t('nav_promotions', 'Promotions')}
          </Link>
          <Link
            to="/login"
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(false);
            }}
            className="block mx-auto w-full max-w-[250px] px-5 py-3 min-h-[48px] rounded-full text-sm font-bold bg-gradient-to-r from-neon-purple to-neon-blue text-white border-2 border-neon-purple/50 hover:border-neon-purple active:border-neon-purple text-center transition-all duration-300 touch-manipulation active:scale-95 shadow-lg flex items-center justify-center"
          >
            {t('login_button') || 'Login'}
          </Link>
          <Link
            to="/register"
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(false);
            }}
            className="block mx-auto w-full max-w-[250px] px-5 py-3 min-h-[48px] rounded-full text-sm font-bold bg-gradient-to-r from-neon-pink to-neon-gold text-white border-2 border-neon-pink/50 hover:border-neon-pink active:border-neon-pink text-center transition-all duration-300 touch-manipulation active:scale-95 shadow-lg animate-glow-pink flex items-center justify-center"
          >
            {t('register_button') || 'Register'}
          </Link>
        </div>
      )}
    </nav>
  );
}
