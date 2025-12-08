import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import useOnClickOutside from '../hooks/useOnClickOutside';

// Icon components
const UserIcon = () => <span>👤</span>;
const VerifyIcon = () => <span>✅</span>;
const TierIcon = () => <span>💎</span>;
const LogoutIcon = () => <span>🚪</span>;
const AdminIcon = () => <span>👑</span>;
const GodIcon = () => <span>⚡</span>;
const PhotoIcon = () => <span>📸</span>;

interface ProfileDropdownProps {
  closeDropdown: () => void;
}

export function ProfileDropdown({ closeDropdown }: ProfileDropdownProps) {
  const { t } = useTranslation();
  const { logout, isAdmin, isGod, user } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(dropdownRef, closeDropdown);

  const handleLogout = () => {
    logout();
    navigate('/'); 
    closeDropdown();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute top-14 right-0 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden"
      style={{
        backgroundColor: 'rgba(20, 20, 20, 0.8)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
          {user?.profile_picture_url ? (
            <img 
              src={user.profile_picture_url} 
              alt={user.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl">{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate">{user?.username}</p>
          <p className="text-sm text-gray-400 truncate">{user?.email}</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="py-2">
        {isGod && (
          <Link
            to="/god/dashboard"
            onClick={closeDropdown}
            className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors"
            style={{
              background: 'linear-gradient(to right, rgba(255,215,0,0.2), rgba(255,237,78,0.2))',
              color: '#ffd700',
              fontWeight: 'bold'
            }}
          >
            <GodIcon />
            <span className="ml-3">{t('god_mode') || 'GOD MODE'}</span>
          </Link>
        )}

        {isAdmin && (
          <Link
            to="/admin/dashboard"
            onClick={closeDropdown}
            className="flex items-center px-4 py-2 text-yellow-400 hover:bg-gray-700 transition-colors"
          >
            <AdminIcon />
            <span className="ml-3">{t('admin_panel') || 'Admin Panel'}</span>
          </Link>
        )}

        <Link
          to="/dashboard"
          onClick={closeDropdown}
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors"
        >
          <UserIcon />
          <span className="ml-3">{t('profile_menu_dashboard') || 'Dashboard'}</span>
        </Link>
        
        <Link
          to="/profile/edit"
          onClick={closeDropdown}
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors"
        >
          <UserIcon />
          <span className="ml-3">{t('profile_menu_edit') || 'Edit Profile'}</span>
        </Link>

        {/* Verification flow and photo management */}
        <Link
          to="/manage-photos"
          onClick={closeDropdown}
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors"
        >
          <PhotoIcon />
          <span className="ml-3">{t('profile_menu_photos') || 'Manage Photos'}</span>
        </Link>

        <Link
          to="/verification" 
          onClick={closeDropdown}
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors"
        >
          <VerifyIcon />
          <span className="ml-3">{t('profile_menu_verify') || 'Verification'}</span>
        </Link>
        
        <Link
          to="/pricing" 
          onClick={closeDropdown}
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors"
        >
          <TierIcon />
          <span className="ml-3">{t('profile_menu_pricing') || 'Manage Subscription'}</span>
        </Link>

        <button
          onClick={handleLogout} 
          className="w-full flex items-center px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors"
        >
          <LogoutIcon />
          <span className="ml-3">{t('logout_button') || 'Logout'}</span>
        </button>
      </nav>
    </div>
  );
}
