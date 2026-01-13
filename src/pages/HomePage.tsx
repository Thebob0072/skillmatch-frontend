import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Epic Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-purple-950 to-black -z-10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-pink/30 via-transparent to-transparent animate-pulse pointer-events-none -z-10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-neon-purple/20 via-transparent to-transparent animate-pulse pointer-events-none -z-10" style={{animationDelay: '1s'}}></div>
      
      {/* Hero Section - Responsive */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fade-in">
          {/* VIP Badge - Responsive */}
          <div className="inline-block mb-4 sm:mb-6 lg:mb-8 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-gold via-yellow-300 to-neon-gold rounded-full blur-md sm:blur-lg lg:blur-xl opacity-75 animate-glow-gold"></div>
            <div className="relative px-4 sm:px-6 lg:px-10 py-2 sm:py-3 lg:py-4 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 rounded-full border-2 sm:border-3 lg:border-4 border-neon-gold shadow-[0_0_20px_rgba(255,215,0,1)] sm:shadow-[0_0_40px_rgba(255,215,0,1)] lg:shadow-[0_0_60px_rgba(255,215,0,1)] transform hover:scale-110 transition-all duration-300">
              <p className="text-black font-black text-xs sm:text-sm lg:text-lg tracking-[0.2em] sm:tracking-[0.3em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] flex items-center gap-1 sm:gap-2 lg:gap-3">
                <span className="text-base sm:text-lg lg:text-2xl animate-spin" style={{animationDuration: '3s'}}>⭐</span>
                <span>{t('home.badge')}</span>
                <span className="text-base sm:text-lg lg:text-2xl animate-spin" style={{animationDuration: '3s', animationDirection: 'reverse'}}>⭐</span>
              </p>
            </div>
          </div>

          {/* Kiss Icon - Responsive */}
          <div className="mb-6 sm:mb-8 lg:mb-10 flex items-center justify-center gap-2 sm:gap-4 relative">
            <div className="absolute inset-0 bg-neon-pink/30 blur-[40px] sm:blur-[60px] lg:blur-[100px] animate-pulse"></div>
            <div className="relative text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] xl:text-[12rem] animate-float drop-shadow-[0_0_40px_rgba(255,16,240,1)] sm:drop-shadow-[0_0_60px_rgba(255,16,240,1)] lg:drop-shadow-[0_0_100px_rgba(255,16,240,1)] filter brightness-125 hover:scale-125 transition-transform duration-500 cursor-pointer">
              💋
            </div>
          </div>

          {/* Title - Responsive */}
          <h1 className="relative text-3xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-black mb-2 sm:mb-3 lg:mb-4 animate-neon-pulse">
            <span style={{
              background: 'linear-gradient(to right, #ff10f0, #9d00ff, #ffd700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(255,16,240,1)) drop-shadow(0 0 60px rgba(157,0,255,0.8)) brightness(1.3)',
              display: 'inline-block'
            }}>
              Thai Variety
            </span>
          </h1>

          {/* Entertainment Text - Responsive */}
          <div className="relative mb-4 sm:mb-6 lg:mb-8">
            <div className="absolute inset-0 blur-lg sm:blur-xl lg:blur-2xl">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-7xl font-black text-neon-gold opacity-50">
                ENTERTAINMENT
              </h2>
            </div>
            <h2 className="relative text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-7xl font-black text-neon-gold tracking-[0.2em] sm:tracking-[0.3em] animate-shimmer" style={{textShadow: '0 0 20px rgba(255,215,0,1), 0 0 40px rgba(255,215,0,0.8), 0 0 60px rgba(255,215,0,0.6), 0 3px 10px rgba(0,0,0,0.8)'}}>
              ENTERTAINMENT
            </h2>
          </div>
          
          {/* Subtitle - Responsive */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-3xl text-gray-200 font-light mb-6 sm:mb-10 lg:mb-16 max-w-4xl mx-auto leading-relaxed px-4" style={{textShadow: '0 2px 20px rgba(0,0,0,0.9), 0 0 40px rgba(255,16,240,0.3)'}}>
            {t('home_hero_subtitle')}
          </p>

          {/* CTA Buttons - Responsive */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 lg:gap-8 mt-6 sm:mt-10 lg:mt-16 animate-slide-up px-4">
            <Link
              to="/browse"
              className="group relative w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neon-pink via-pink-600 to-neon-purple rounded-lg sm:rounded-xl lg:rounded-[2rem] blur-md sm:blur-lg lg:blur-2xl opacity-75 group-hover:opacity-100 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-neon-pink via-pink-500 to-neon-purple text-white font-black text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl px-6 sm:px-8 lg:px-14 py-3 sm:py-4 lg:py-7 rounded-lg sm:rounded-xl lg:rounded-[2rem] transform hover:scale-105 hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 shadow-[0_0_20px_rgba(255,16,240,1)] sm:shadow-[0_0_40px_rgba(255,16,240,1)] lg:shadow-[0_0_60px_rgba(255,16,240,1)] hover:shadow-[0_0_100px_rgba(255,16,240,1)] border-2 sm:border-3 lg:border-4 border-neon-pink/80 hover:border-neon-pink overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <span className="relative z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,1)] flex items-center justify-center gap-2">
                  <span className="text-xl sm:text-2xl lg:text-3xl">💎</span>
                  <span>{t('home.exploreProviders')}</span>
                </span>
              </div>
            </Link>
            
            <Link
              to="/promotions"
              className="group relative w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-purple-600 to-neon-blue rounded-lg sm:rounded-xl lg:rounded-[2rem] blur-md sm:blur-lg lg:blur-2xl opacity-75 group-hover:opacity-100 animate-pulse" style={{animationDelay: '0.25s'}}></div>
              <div className="relative bg-gradient-to-r from-neon-purple via-purple-500 to-neon-blue text-white font-black text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl px-6 sm:px-8 lg:px-14 py-3 sm:py-4 lg:py-7 rounded-lg sm:rounded-xl lg:rounded-[2rem] transform hover:scale-105 hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 shadow-[0_0_20px_rgba(157,0,255,1)] sm:shadow-[0_0_40px_rgba(157,0,255,1)] lg:shadow-[0_0_60px_rgba(157,0,255,1)] hover:shadow-[0_0_100px_rgba(157,0,255,1)] border-2 sm:border-3 lg:border-4 border-neon-purple/80 hover:border-neon-purple overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <span className="relative z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,1)] flex items-center justify-center gap-2">
                  <span className="text-xl sm:text-2xl lg:text-3xl">🎁</span>
                  <span>{t('home.viewPromotions', 'View Promotions')}</span>
                </span>
              </div>
            </Link>
            
            <Link
              to="/register"
              className="group relative w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neon-gold via-yellow-400 to-neon-red rounded-lg sm:rounded-xl lg:rounded-[2rem] blur-md sm:blur-lg lg:blur-2xl opacity-75 group-hover:opacity-100 animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="relative bg-gradient-to-r from-neon-gold via-yellow-400 to-neon-red text-white font-black text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl px-6 sm:px-8 lg:px-14 py-3 sm:py-4 lg:py-7 rounded-lg sm:rounded-xl lg:rounded-[2rem] transform hover:scale-105 hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 shadow-[0_0_20px_rgba(255,215,0,1)] sm:shadow-[0_0_40px_rgba(255,215,0,1)] lg:shadow-[0_0_60px_rgba(255,215,0,1)] hover:shadow-[0_0_100px_rgba(255,215,0,1)] border-2 sm:border-3 lg:border-4 border-neon-gold/80 hover:border-neon-gold overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <span className="relative z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,1)] flex items-center justify-center gap-2">
                  <span className="text-xl sm:text-2xl lg:text-3xl">⭐</span>
                  <span>{t('home.becomeProvider')}</span>
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Feature Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-12 sm:mt-16 lg:mt-20 px-4">
          {/* Card 1 */}
          <div className="group relative sm:col-span-2 lg:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-pink via-pink-600 to-neon-purple rounded-lg sm:rounded-xl lg:rounded-[2rem] blur-md sm:blur-lg lg:blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-black/90 via-pink-950/50 to-black/90 backdrop-blur-2xl p-4 sm:p-6 lg:p-10 rounded-lg sm:rounded-xl lg:rounded-[2rem] border-2 sm:border-3 lg:border-4 border-neon-pink/60 shadow-[0_0_20px_rgba(255,16,240,0.5)] sm:shadow-[0_0_40px_rgba(255,16,240,0.5)] hover:shadow-[0_0_80px_rgba(255,16,240,1)] hover:scale-105 hover:-translate-y-2 hover:border-neon-pink transform transition-all duration-700 animate-slide-up overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-4xl sm:text-5xl lg:text-8xl mb-3 sm:mb-4 lg:mb-8 text-center animate-float drop-shadow-[0_0_30px_rgba(255,16,240,1)] transform group-hover:scale-125 transition-transform duration-500">💎</div>
                <h3 className="text-lg sm:text-xl lg:text-3xl xl:text-4xl font-black mb-2 sm:mb-3 lg:mb-6 text-center" style={{textShadow: '0 0 20px rgba(255,16,240,0.8)'}}>
                  <span className="bg-gradient-to-r from-neon-pink via-pink-400 to-neon-purple bg-clip-text text-transparent">
                    {t('home.cards.premium.title')}
                  </span>
                </h3>
                <p className="text-gray-200 text-center text-xs sm:text-sm lg:text-lg xl:text-xl leading-relaxed" style={{textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>
                  {t('home.cards.premium.description')}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple via-purple-600 to-neon-blue rounded-lg sm:rounded-xl lg:rounded-[2rem] blur-md sm:blur-lg lg:blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-black/90 via-purple-950/50 to-black/90 backdrop-blur-2xl p-4 sm:p-6 lg:p-10 rounded-lg sm:rounded-xl lg:rounded-[2rem] border-2 sm:border-3 lg:border-4 border-neon-purple/60 shadow-[0_0_20px_rgba(157,0,255,0.5)] sm:shadow-[0_0_40px_rgba(157,0,255,0.5)] hover:shadow-[0_0_80px_rgba(157,0,255,1)] hover:scale-105 hover:-translate-y-2 hover:border-neon-purple transform transition-all duration-700 animate-slide-up overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-4xl sm:text-5xl lg:text-8xl mb-3 sm:mb-4 lg:mb-8 text-center animate-float drop-shadow-[0_0_30px_rgba(157,0,255,1)] transform group-hover:scale-125 transition-transform duration-500">🎯</div>
                <h3 className="text-lg sm:text-xl lg:text-3xl xl:text-4xl font-black mb-2 sm:mb-3 lg:mb-6 text-center" style={{textShadow: '0 0 20px rgba(157,0,255,0.8)'}}>
                  <span className="bg-gradient-to-r from-neon-purple via-purple-400 to-neon-blue bg-clip-text text-transparent">
                    {t('home.cards.booking.title')}
                  </span>
                </h3>
                <p className="text-gray-200 text-center text-xs sm:text-sm lg:text-lg xl:text-xl leading-relaxed mb-2 sm:mb-3 lg:mb-4" style={{textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>
                  {t('home.cards.booking.description')}
                </p>
                <p className="text-neon-purple text-center font-bold text-[10px] sm:text-xs lg:text-base flex items-center justify-center gap-2" style={{textShadow: '0 0 20px rgba(157,0,255,0.8)'}}>
                  <span className="text-sm sm:text-base lg:text-xl">✨</span> {t('home.cards.booking.available')}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative sm:col-span-2 lg:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-gold via-yellow-500 to-neon-red rounded-lg sm:rounded-xl lg:rounded-[2rem] blur-md sm:blur-lg lg:blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-black/90 via-yellow-950/50 to-black/90 backdrop-blur-2xl p-4 sm:p-6 lg:p-10 rounded-lg sm:rounded-xl lg:rounded-[2rem] border-2 sm:border-3 lg:border-4 border-neon-gold/60 shadow-[0_0_20px_rgba(255,215,0,0.5)] sm:shadow-[0_0_40px_rgba(255,215,0,0.5)] hover:shadow-[0_0_80px_rgba(255,215,0,1)] hover:scale-105 hover:-translate-y-2 hover:border-neon-gold transform transition-all duration-700 animate-slide-up overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-4xl sm:text-5xl lg:text-8xl mb-3 sm:mb-4 lg:mb-8 text-center animate-float drop-shadow-[0_0_30px_rgba(255,215,0,1)] transform group-hover:scale-125 transition-transform duration-500">⭐</div>
                <h3 className="text-lg sm:text-xl lg:text-3xl xl:text-4xl font-black mb-2 sm:mb-3 lg:mb-6 text-center" style={{textShadow: '0 0 20px rgba(255,215,0,0.8)'}}>
                  <span className="bg-gradient-to-r from-neon-gold via-yellow-400 to-neon-red bg-clip-text text-transparent">
                    {t('home.cards.reviews.title')}
                  </span>
                </h3>
                <p className="text-gray-200 text-center text-xs sm:text-sm lg:text-lg xl:text-xl leading-relaxed mb-2 sm:mb-3 lg:mb-4" style={{textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>
                  {t('home.cards.reviews.description')}
                </p>
                <p className="text-neon-gold text-center font-bold text-[10px] sm:text-xs lg:text-base flex items-center justify-center gap-2" style={{textShadow: '0 0 20px rgba(255,215,0,0.8)'}}>
                  <span className="text-sm sm:text-base lg:text-xl">⭐</span> {t('home.cards.reviews.clients')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section - Responsive */}
        <div className="mt-12 sm:mt-16 lg:mt-32 mb-8 sm:mb-12 lg:mb-20 text-center relative px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/10 to-transparent blur-xl sm:blur-2xl"></div>
          <h2 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-black mb-3 sm:mb-4 lg:mb-6 animate-neon-pulse" style={{textShadow: '0 0 30px rgba(255,16,240,1), 0 0 50px rgba(157,0,255,0.8)'}}>
            <span className="bg-gradient-to-r from-neon-pink via-neon-purple to-neon-gold bg-clip-text text-transparent">
              {t('home.stats.title')}
            </span>
          </h2>
          <p className="relative text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg xl:text-2xl mb-6 sm:mb-10 lg:mb-16 max-w-3xl mx-auto" style={{textShadow: '0 2px 20px rgba(0,0,0,0.9)'}}>
            {t('home.stats.subtitle')}
          </p>
        </div>

        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8 px-8 sm:px-10 lg:px-4 max-w-7xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-pink to-neon-purple rounded-lg sm:rounded-xl lg:rounded-3xl blur-md sm:blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative text-center p-4 sm:p-5 lg:p-10 bg-gradient-to-br from-black/90 via-pink-950/40 to-black/90 backdrop-blur-2xl rounded-lg sm:rounded-xl lg:rounded-3xl border-2 sm:border-3 lg:border-4 border-neon-pink/60 shadow-[0_0_15px_rgba(255,16,240,0.4)] sm:shadow-[0_0_30px_rgba(255,16,240,0.4)] hover:shadow-[0_0_60px_rgba(255,16,240,1)] hover:scale-105 hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-2 sm:mb-3 lg:mb-4" style={{textShadow: '0 0 30px rgba(255,16,240,1)'}}>
                  <span className="bg-gradient-to-r from-neon-pink via-pink-400 to-neon-purple bg-clip-text text-transparent">1000+</span>
                </div>
                <div className="text-gray-200 font-bold text-xs sm:text-sm lg:text-base xl:text-lg mb-1 sm:mb-2" style={{textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>{t('home.stats.activeProviders')}</div>
                <div className="text-gray-400 text-[10px] sm:text-xs lg:text-sm leading-relaxed">{t('home.stats.verifiedProfessionals')}</div>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple to-neon-blue rounded-lg sm:rounded-xl lg:rounded-3xl blur-md sm:blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative text-center p-4 sm:p-5 lg:p-10 bg-gradient-to-br from-black/90 via-purple-950/40 to-black/90 backdrop-blur-2xl rounded-lg sm:rounded-xl lg:rounded-3xl border-2 sm:border-3 lg:border-4 border-neon-purple/60 shadow-[0_0_15px_rgba(157,0,255,0.4)] sm:shadow-[0_0_30px_rgba(157,0,255,0.4)] hover:shadow-[0_0_60px_rgba(157,0,255,1)] hover:scale-105 hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-2 sm:mb-3 lg:mb-4" style={{textShadow: '0 0 30px rgba(157,0,255,1)'}}>
                  <span className="bg-gradient-to-r from-neon-purple via-purple-400 to-neon-blue bg-clip-text text-transparent">5000+</span>
                </div>
                <div className="text-gray-200 font-bold text-xs sm:text-sm lg:text-base xl:text-lg mb-1 sm:mb-2" style={{textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>{t('home.stats.happyClients')}</div>
                <div className="text-gray-400 text-[10px] sm:text-xs lg:text-sm leading-relaxed">{t('home.stats.fiveStarExperiences')}</div>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-gold to-neon-red rounded-lg sm:rounded-xl lg:rounded-3xl blur-md sm:blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative text-center p-4 sm:p-5 lg:p-10 bg-gradient-to-br from-black/90 via-yellow-950/40 to-black/90 backdrop-blur-2xl rounded-lg sm:rounded-xl lg:rounded-3xl border-2 sm:border-3 lg:border-4 border-neon-gold/60 shadow-[0_0_15px_rgba(255,215,0,0.4)] sm:shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:shadow-[0_0_60px_rgba(255,215,0,1)] hover:scale-105 hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-2 sm:mb-3 lg:mb-4" style={{textShadow: '0 0 30px rgba(255,215,0,1)'}}>
                  <span className="bg-gradient-to-r from-neon-gold via-yellow-400 to-neon-red bg-clip-text text-transparent">24/7</span>
                </div>
                <div className="text-gray-200 font-bold text-xs sm:text-sm lg:text-base xl:text-lg mb-1 sm:mb-2" style={{textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>Support</div>
                <div className="text-gray-400 text-[10px] sm:text-xs lg:text-sm leading-relaxed">{t('home.stats.alwaysAvailable')}</div>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg sm:rounded-xl lg:rounded-3xl blur-md sm:blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative text-center p-4 sm:p-5 lg:p-10 bg-gradient-to-br from-black/90 via-blue-950/40 to-black/90 backdrop-blur-2xl rounded-lg sm:rounded-xl lg:rounded-3xl border-2 sm:border-3 lg:border-4 border-neon-blue/60 shadow-[0_0_15px_rgba(0,212,255,0.4)] sm:shadow-[0_0_30px_rgba(0,212,255,0.4)] hover:shadow-[0_0_60px_rgba(0,212,255,1)] hover:scale-105 hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-2 sm:mb-3 lg:mb-4" style={{textShadow: '0 0 30px rgba(0,212,255,1)'}}>
                  <span className="bg-gradient-to-r from-neon-blue via-cyan-400 to-neon-purple bg-clip-text text-transparent">100%</span>
                </div>
                <div className="text-gray-200 font-bold text-xs sm:text-sm lg:text-base xl:text-lg mb-1 sm:mb-2" style={{textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>{t('home.stats.verified')}</div>
                <div className="text-gray-400 text-[10px] sm:text-xs lg:text-sm leading-relaxed">{t('home.stats.allVerified')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { HomePage };
export default HomePage;
