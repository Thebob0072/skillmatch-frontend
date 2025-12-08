import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black/90 backdrop-blur-3xl border-t border-neon-pink/20 mt-20">
      {/* Elegant background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/5 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 relative z-10">
        {/* Compact Legal Warning - Responsive with smooth design */}
        <div className="mb-6 sm:mb-8 bg-gradient-to-r from-black/60 via-neon-red/5 to-neon-pink/5 backdrop-blur-xl p-4 sm:p-5 lg:p-6 rounded-2xl shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <span className="text-2xl sm:text-3xl flex-shrink-0">⚠️</span>
              <div className="flex-1">
                <h3 className="text-neon-red font-black text-base sm:text-lg leading-tight">{t('footer_warning_title')}</h3>
                <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5">{t('footer_warning_desc')}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full sm:w-auto justify-start sm:justify-end">
              <span className="px-2 sm:px-3 py-1 bg-neon-gold/10 text-neon-gold text-[10px] sm:text-xs font-bold rounded-full whitespace-nowrap">✓ {t('footer_badge_verified')}</span>
              <span className="px-2 sm:px-3 py-1 bg-neon-purple/10 text-neon-purple text-[10px] sm:text-xs font-bold rounded-full whitespace-nowrap">🔒 {t('footer_badge_secure')}</span>
              <span className="px-2 sm:px-3 py-1 bg-neon-pink/10 text-neon-pink text-[10px] sm:text-xs font-bold rounded-full whitespace-nowrap">⚖️ {t('footer_badge_legal')}</span>
            </div>
          </div>
        </div>

        {/* Streamlined Footer Content - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-2 sm:mb-3 group w-fit">
              <span className="text-2xl sm:text-3xl">💋</span>
              <div className="flex flex-col leading-tight">
                <span className="text-base sm:text-lg font-black" style={{
                  background: 'linear-gradient(to right, #ff10f0, #9d00ff, #ffd700)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Thai Variety
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-neon-gold tracking-wider">ENTERTAINMENT</span>
              </div>
            </Link>
            <p className="text-gray-500 text-[11px] sm:text-xs leading-relaxed max-w-xs">
              {t('footer_tagline') || "Thailand's premier adult entertainment platform"}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-xs sm:text-sm mb-2 sm:mb-3">{t('footer_quick_links') || 'Quick Links'}</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link to="/browse" className="text-gray-400 hover:text-neon-pink transition-colors text-[11px] sm:text-xs block">{t('nav_browse') || 'Browse'}</Link></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-neon-purple transition-colors text-[11px] sm:text-xs block">{t('nav_pricing') || 'Pricing'}</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-neon-gold transition-colors text-[11px] sm:text-xs block">{t('footer_become_provider') || 'Become Companion'}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold text-xs sm:text-sm mb-2 sm:mb-3">{t('footer_support') || 'Support'}</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link to="/safety" className="text-gray-400 hover:text-neon-purple transition-colors text-[11px] sm:text-xs block">{t('footer_safety')}</Link></li>
              <li><Link to="/report" className="text-gray-400 hover:text-neon-red transition-colors text-[11px] sm:text-xs block">{t('footer_report')}</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-neon-blue transition-colors text-[11px] sm:text-xs block">{t('footer_contact') || 'Contact'}</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-neon-gold transition-colors text-[11px] sm:text-xs block">{t('footer_faq') || 'FAQ'}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold text-xs sm:text-sm mb-2 sm:mb-3">{t('footer_legal') || 'Legal'}</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link to="/terms" className="text-gray-400 hover:text-neon-gold transition-colors text-[11px] sm:text-xs block">{t('footer_terms') || 'Terms'}</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-neon-purple transition-colors text-[11px] sm:text-xs block">{t('footer_privacy') || 'Privacy'}</Link></li>
              <li><Link to="/verification" className="text-gray-400 hover:text-neon-blue transition-colors text-[11px] sm:text-xs block">{t('footer_verification')}</Link></li>
              <li><Link to="/cookies" className="text-gray-400 hover:text-neon-gold transition-colors text-[11px] sm:text-xs block">{t('footer_cookies')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Responsive */}
        <div className="border-t border-neon-purple/10 pt-4 sm:pt-5 lg:pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            <p className="text-gray-600 text-[10px] sm:text-xs text-center sm:text-left order-2 sm:order-1">
              © {currentYear} Thai Variety Entertainment • {t('home.footer.rights')} • <span className="text-neon-red font-bold whitespace-nowrap">20+ ONLY</span>
            </p>
            <p className="text-gray-600 text-[10px] sm:text-xs text-center sm:text-right order-1 sm:order-2">
              {t('footer_disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
