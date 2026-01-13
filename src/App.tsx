import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './constants/config';
import StatusIndicator from './components/StatusIndicator';

// Layouts & Guards
import AppLayout from './components/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import GodRoute from './components/GodRoute';
import { RequireVerification } from './components/routing/RequireVerification';
import { GuestRoute } from './components/routing/GuestRoute';

// Public Pages
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/register/RegisterPage';
import PricingPage from './pages/pricing/PricingPage';
import ProviderProfilePage from './pages/ProviderProfilePage';
import { TermsOfService } from './pages/TermsOfService';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import SafetyGuidelines from './pages/SafetyGuidelines';
import ReportPage from './pages/ReportPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import CookiePolicy from './pages/CookiePolicy';

// Protected Pages (User + Provider)
import DashboardPage from './pages/dashboard/DashboardPage';
import VerificationPage from './pages/verify/VerificationPage';
import PendingReviewPage from './pages/pandingreview/PendingReviewPage';
import { BrowsePage } from './pages/browser/BrowsePage';
import ManagePhotosPage from './pages/ManagePhotosPage';
import EditProfilePage from './pages/EditProfilePage';
import FinancialPage from './pages/financial/FinancialPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import VerifyUserPage from './pages/admin/VerifyUserPage';
import CreateUserPage from './pages/admin/CreateUserPage';
import AdminFinancialPage from './pages/admin/AdminFinancialPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminPromotionManager from './pages/admin/AdminPromotionManager';

// God Pages
import GodDashboardPage from './pages/god/GodDashboardPage';
import GodUsersPage from './pages/god/GodUsersPage';

// Provider Pages
import ProviderOnboardingPage from './pages/provider/ProviderOnboardingPage';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ServicePackageManager from './pages/provider/ServicePackageManager';
import ProviderPhotoGallery from './pages/provider/ProviderPhotoGallery';
import ProviderBookingsPage from './pages/provider/ProviderBookingsPage';
import ProviderCouponManager from './pages/provider/ProviderCouponManager';

// Booking Pages
import BookingPage from './pages/BookingPage';
import QRPaymentPage from './pages/QRPaymentPage';
import MyBookingsPage from './pages/MyBookingsPage';

// Promotion Pages
import PromotionBrowsePage from './pages/PromotionBrowsePage';

import './App.css';
import HomePage from './pages/HomePage';

function App() {
  return (
    // 1. Router ต้องอยู่ข้างนอกสุด
    <Router> 
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {/* 2. AuthProvider อยู่ข้างใน Router (เพื่อให้ใช้ useNavigate ได้) */}
        <AuthProvider>
          {/* Status Indicator */}
          <StatusIndicator position="bottom-right" />
          
          <Routes>
            {/* 3. AppLayout คือกรอบ (Navbar/Footer) ที่ครอบทุกหน้า */}
            <Route element={<AppLayout />}>
              
              {/* === Public Routes (ทุกคนเห็นได้) === */}
              <Route path="/" element={<HomePage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/promotions" element={<PromotionBrowsePage />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/safety" element={<SafetyGuidelines />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/cookies" element={<CookiePolicy />} />

              {/* === Guest Routes (ต้องไม่ได้ Login - redirect ไป dashboard ถ้า login แล้ว) === */}
              <Route element={<GuestRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* === Protected Routes (ต้อง Login) === */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/verification" element={<VerificationPage />} />
                <Route path="/pending-review" element={<PendingReviewPage />} />
                {/* Browse can view but actions require verification */}
                <Route path="/browse" element={<BrowsePage />} /> 
                <Route path="/manage-photos" element={<RequireVerification><ManagePhotosPage /></RequireVerification>} />
                <Route path="/profile/edit" element={<EditProfilePage />} />
                <Route path="/provider/:userId" element={<ProviderProfilePage />} />
                <Route path="/financial" element={<RequireVerification><FinancialPage /></RequireVerification>} />
                
                {/* === Booking Routes === */}
                <Route path="/booking/:providerId" element={<RequireVerification><BookingPage /></RequireVerification>} />
                <Route path="/payment/qr" element={<RequireVerification><QRPaymentPage /></RequireVerification>} />
                <Route path="/bookings/my" element={<RequireVerification><MyBookingsPage /></RequireVerification>} />
              </Route>

              {/* === Admin Routes (ต้อง Login และ is_admin = true) === */}
              <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/verify/:userId" element={<VerifyUserPage />} />
                <Route path="/admin/create-user" element={<CreateUserPage />} />
                <Route path="/admin/financial" element={<AdminFinancialPage />} />
                <Route path="/admin/promotions" element={<AdminPromotionManager />} />
              </Route>

              {/* === God Routes (ต้อง Login และ tier_name = 'God') === */}
              <Route element={<GodRoute />}>
                <Route path="/god/dashboard" element={<GodDashboardPage />} />
                <Route path="/god/users" element={<GodUsersPage />} />
              </Route>

              {/* === Provider Routes (ต้อง Login + Verification) === */}
              <Route element={<ProtectedRoute />}>
                <Route path="/provider/onboarding" element={<ProviderOnboardingPage />} />
                <Route path="/provider/dashboard" element={<RequireVerification><ProviderDashboard /></RequireVerification>} />
                <Route path="/provider/services" element={<RequireVerification><ServicePackageManager /></RequireVerification>} />
                <Route path="/provider/photos" element={<RequireVerification><ProviderPhotoGallery /></RequireVerification>} />
                <Route path="/provider/bookings" element={<RequireVerification><ProviderBookingsPage /></RequireVerification>} />
                <Route path="/provider/coupons" element={<RequireVerification><ProviderCouponManager /></RequireVerification>} />
              </Route>

            </Route>
            
            {/* 404 Page (อยู่นอก AppLayout) */}
            <Route path="*" element={ 
              <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white text-3xl font-bold">
                404 | Page Not Found
              </div> 
            } />
          </Routes>
        </AuthProvider>
      </GoogleOAuthProvider>
    </Router> 
  );
}

export default App;
