import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

// Icon components
const UserIcon = () => <span>👤</span>;
const VerifyIcon = () => <span>✅</span>;
const TierIcon = () => <span>💎</span>;
const LogoutIcon = () => <span>🚪</span>;
const AdminIcon = () => <span>👑</span>;
const GodIcon = () => <span>⚡</span>;
const PhotoIcon = () => <span>📸</span>;
const BookingIcon = () => <span>📅</span>;
const WalletIcon = () => <span>💰</span>;

interface ProfileDropdownProps {
  closeDropdown: () => void;
}

export function ProfileDropdown({ closeDropdown }: ProfileDropdownProps) {
  const { t } = useTranslation();
  const { logout, isAdmin, isGod, user } = useAuth();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    closeDropdown();
    setTimeout(() => navigate(path), 0);
  };

  const handleLogout = (e: React.MouseEvent) => {
    closeDropdown();
    logout();
    navigate('/');
  };

  return (
    <div
      className="absolute top-14 right-0 w-72 bg-gray-900 border-2 border-neon-pink/40 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-5 duration-200"
      style={{
        zIndex: 1000,
        backgroundColor: 'rgba(10, 10, 10, 0.98)',
        backdropFilter: 'blur(20px)',
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
          <button
            onClick={() => handleNavigate('/god/dashboard')}
            className="w-full flex items-center px-4 py-3 hover:bg-gray-700 transition-colors touch-manipulation active:scale-95 text-left"
            style={{
              background: 'linear-gradient(to right, rgba(255,215,0,0.2), rgba(255,237,78,0.2))',
              color: '#ffd700',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            <GodIcon />
            <span className="ml-3">{t('god_mode') || 'GOD MODE'}</span>
          </button>
        )}

        {isAdmin && (
          <>
            <button
              onClick={() => handleNavigate('/admin/dashboard')}
              className="w-full flex items-center px-4 py-3 text-yellow-400 hover:bg-gray-700 transition-colors touch-manipulation active:scale-95 cursor-pointer text-left"
            >
              <AdminIcon />
              <span className="ml-3">{t('admin_panel') || 'Admin Panel'}</span>
            </button>
            <button
              onClick={() => handleNavigate('/admin/promotions')}
              className="w-full flex items-center px-4 py-3 text-purple-400 hover:bg-gray-700 transition-colors touch-manipulation active:scale-95 cursor-pointer text-left"
            >
              <span>🎁</span>
              <span className="ml-3">{t('admin.promotionManager.menuTitle') || 'Promotion Manager'}</span>
            </button>
          </>
        )}

        <button
          onClick={() => handleNavigate('/dashboard')}
          className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 transition-colors touch-manipulation active:scale-95 cursor-pointer text-left"
        >
          <UserIcon />
          <span className="ml-3">{t('profile_menu_dashboard') || 'Dashboard'}</span>
        </button>
        
        <button
          onClick={() => handleNavigate('/profile/edit')}
          className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 transition-colors touch-manipulation active:scale-95 cursor-pointer text-left"
        >
          <UserIcon />
          <span className="ml-3">{t('profile_menu_edit') || 'Edit Profile'}</span>
        </button>

        <button
          onClick={() => handleNavigate('/bookings/my')}
          className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 transition-colors touch-manipulation active:scale-95 cursor-pointer text-left"
        >
          <BookingIcon />
          <span className="ml-3">{t('my_bookings') || 'My Bookings'}</span>
        </button>

        {/* Wallet - Available for Everyone */}
        <button
          onClick={() => handleNavigate('/financial')}
          className="w-full flex items-center px-4 py-3 text-green-400 hover:bg-gray-700 transition-colors touch-manipulation active:scale-95 cursor-pointer text-left"
          style={{
            background: 'linear-gradient(to right, rgba(16,185,129,0.1), rgba(5,150,105,0.1))',
          }}
        >
          <WalletIcon />
          <span className="ml-3 font-semibold">{t('wallet.my_wallet') || 'My Wallet'}</span>
          <span className="ml-auto text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">💎</span>
        </button>

        {/* Provider-specific menu */}
        {user?.role === 'provider' && (
          <button
            onClick={() => handleNavigate('/provider/bookings')}
            className="w-full flex items-center px-4 py-3 text-pink-400 hover:bg-gray-700 transition-colors touch-manipulation active:scale-95 cursor-pointer text-left"
          >
            <BookingIcon />
            <span className="ml-3">{t('provider_bookings') || 'Manage Bookings'}</span>
          </button>
        )}

        {/* Verification flow and photo management */}
        <button
          onClick={() => handleNavigate('/manage-photos')}
          className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 transition-colors touch-manipulation active:scale-95 cursor-pointer text-left"
        >
          <PhotoIcon />
          <span className="ml-3">{t('profile_menu_photos') || 'Manage Photos'}</span>
        </button>

        <button
          onClick={() => handleNavigate('/verification')}
          className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 transition-colors touch-manipulation active:scale-95 cursor-pointer text-left"
        >
          <VerifyIcon />
          <span className="ml-3">{t('profile_menu_verify') || 'Verification'}</span>
        </button>
        
        <button
          onClick={() => handleNavigate('/pricing')}
          className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 transition-colors touch-manipulation active:scale-95 cursor-pointer text-left"
        >
          <TierIcon />
          <span className="ml-3">{t('profile_menu_pricing') || 'Manage Subscription'}</span>
        </button>

        <button
          onClick={handleLogout}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleLogout(e as React.TouchEvent<HTMLButtonElement>);
          }}
          type="button"
          className="w-full flex items-center px-5 py-4 text-red-400 font-bold text-base hover:bg-red-900/30 active:bg-red-500/40 transition-all touch-manipulation border-t-2 border-red-500/30 mt-2 cursor-pointer"
          style={{
            WebkitTapHighlightColor: 'rgba(239, 68, 68, 0.3)',
            userSelect: 'none',
          }}
        >
          <LogoutIcon />
          <span className="ml-3">🚪 {t('logout_button') || 'ออกจากระบบ'}</span>
        </button>
      </nav>
    </div>
  );
}
