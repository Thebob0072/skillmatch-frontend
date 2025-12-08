import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { VerificationBanner } from './common/VerificationBanner';

export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 bg-stars opacity-30 animate-pulse-slow"></div>
      <div className="fixed inset-0 -z-10 bg-grid-pattern opacity-10"></div>
      
      <Navbar />
      {/* Verification Banner - shows if user needs verification */}
      <div className="pt-16">
        <VerificationBanner />
      </div>
      <main className="relative flex-1 container mx-auto px-4 pt-8 pb-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
