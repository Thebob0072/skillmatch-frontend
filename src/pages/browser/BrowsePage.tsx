import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as browseService from '../../services/browseService';
import type { Provider } from '../../types';
import { useAuth } from '../../context/AuthContext';
import AdminProviderInfo from '../../components/admin/AdminProviderInfo';
import { 
  getAllProvinces,
  getAllProvincesInThai,
  getDistrictsByProvince,
  getDistrictsByProvinceInThai
} from '../../constants/locations';
import {
  translateCategory,
  translateProvince,
  translateTier,
  formatPrice,
  formatDistance,
  getCategoryIcon,
} from '../../utils/translationHelpers';

export function BrowsePage() {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Location Filters
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  
  // Other Filters
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<'Incall' | 'Outcall' | 'Both' | ''>('');
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'reviews'>('rating');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProviders();
  }, [selectedCategory, selectedProvince, minRating, selectedTier, sortBy]);

  const loadProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // เรียก Backend API จริง
      const data = await browseService.searchProviders({
        query: searchTerm || undefined,
        category_id: selectedCategory || undefined,
        province: selectedProvince || undefined,
        district: selectedDistrict || undefined,
        service_type: (selectedServiceType as 'Incall' | 'Outcall' | 'Both') || undefined,
        min_rating: minRating || undefined,
        tier_id: selectedTier || undefined,
        sort_by: sortBy,
        sort_order: 'desc',
        limit: 50,
      });
      
      setProviders(data.data || []);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to load providers');
      }
      setError(t('common.error'));
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadProviders();
  };

  // Handle province change - update available districts
  useEffect(() => {
    if (selectedProvince) {
      const districts = getDistrictsByProvince(selectedProvince);
      setAvailableDistricts(districts);
      setSelectedDistrict(''); // Reset district
    } else {
      setAvailableDistricts([]);
    }
  }, [selectedProvince]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedProvince('');
    setSelectedDistrict('');
    setSelectedServiceType('');
    setMinRating(0);
    setSelectedTier(null);
    setSortBy('rating');
    setAvailableDistricts([]);
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-12">
      <div className="text-center mb-6 sm:mb-12">
        <h1 className="text-3xl sm:text-6xl md:text-7xl font-black mb-2 sm:mb-4">
          <span style={{
            background: 'linear-gradient(to right, #ff10f0, #9d00ff, #ffd700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'brightness(1.3) drop-shadow(0 0 40px rgba(255,16,240,0.8))',
            display: 'inline-block'
          }}>
            {t('browse_title') || 'Browse Premium Companions'}
          </span>
        </h1>
        <p className="text-gray-300 text-sm sm:text-xl" style={{textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>
          {t('browse_subtitle') || 'Verified elite companions for unforgettable experiences'}
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="max-w-6xl mx-auto mb-4 sm:mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder={t('search_placeholder') || '🔍 Search companions by name, location, or specialty...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full px-4 py-3 sm:px-8 sm:py-5 pr-24 sm:pr-32 bg-black/50 backdrop-blur-xl text-white text-sm sm:text-lg rounded-full border-2 border-neon-purple/30 focus:border-neon-purple focus:outline-none focus:shadow-[0_0_40px_rgba(157,0,255,0.4)] transition-all duration-300 placeholder-gray-500"
          />
          <button
            onClick={handleSearch}
            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-neon-purple to-neon-pink px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-full text-white text-xs sm:text-base font-bold active:scale-95 sm:hover:scale-105 transition-all"
          >
            🔍 Search
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto mb-4 sm:mb-8">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="mb-3 sm:mb-4 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 backdrop-blur-xl border-2 border-neon-purple/30 rounded-lg sm:rounded-xl text-white text-sm sm:text-base font-bold active:scale-95 sm:hover:scale-105 transition-all flex items-center gap-2"
        >
          <span>🎛️</span>
          {showFilters ? t('common.hide_filters') : t('common.show_filters')}
          <span className="text-[10px] sm:text-xs bg-neon-gold/30 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
            {[selectedCategory, selectedProvince, minRating > 0, selectedTier].filter(Boolean).length}
          </span>
        </button>

        {showFilters && (
          <div className="bg-black/50 backdrop-blur-2xl border border-neon-purple/30 sm:border-2 rounded-xl sm:rounded-2xl p-3 sm:p-6 space-y-3 sm:space-y-4">
            {/* Location Filters - Always Visible */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Province Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-300 mb-1.5 sm:mb-2">📍 {t('location.province')}</label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-black/50 border-2 border-neon-purple/30 rounded-lg sm:rounded-xl text-sm sm:text-base text-white focus:outline-none focus:border-neon-purple"
                >
                  <option value="">{t('browse.filters.all_locations')}</option>
                  {(i18n.language === 'th' ? getAllProvincesInThai() : getAllProvinces()).map((province, index) => {
                    const value = getAllProvinces()[index];
                    return <option key={value} value={value}>{province}</option>;
                  })}
                </select>
              </div>

              {/* District Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-300 mb-1.5 sm:mb-2">🏙️ {t('location.district')}</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedProvince || availableDistricts.length === 0}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-black/50 border-2 border-neon-purple/30 rounded-lg sm:rounded-xl text-sm sm:text-base text-white focus:outline-none focus:border-neon-purple disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{t('location.all_districts')}</option>
                  {(i18n.language === 'th' && selectedProvince
                    ? getDistrictsByProvinceInThai(selectedProvince)
                    : availableDistricts
                  ).map((district, index) => {
                    const value = availableDistricts[index] || district;
                    return <option key={value} value={value}>{district}</option>;
                  })}
                </select>
              </div>

              {/* Note: Sub-district removed for now - will add later with complete data */}
            </div>

            {/* Other Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

              {/* Service Type Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-300 mb-1.5 sm:mb-2">🏠 {t('service_type.label')}</label>
                <select
                  value={selectedServiceType}
                  onChange={(e) => setSelectedServiceType(e.target.value as 'Incall' | 'Outcall' | 'Both' | '')}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-black/50 border-2 border-neon-purple/30 rounded-lg sm:rounded-xl text-sm sm:text-base text-white focus:outline-none focus:border-neon-purple"
                >
                  <option value="">{t('service_type.all')}</option>
                  <option value="Incall">{t('service_type.incall')}</option>
                  <option value="Outcall">{t('service_type.outcall')}</option>
                  <option value="Both">{t('service_type.both')}</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-300 mb-1.5 sm:mb-2">⭐ {t('browse.filters.min_rating')}</label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-black/50 border-2 border-neon-purple/30 rounded-lg sm:rounded-xl text-sm sm:text-base text-white focus:outline-none focus:border-neon-purple"
                >
                  <option value="0">{t('browse.filters.all_ratings')}</option>
                  <option value="3">{t('browse.filters.rating_3plus')}</option>
                  <option value="4">{t('browse.filters.rating_4plus')}</option>
                  <option value="4.5">{t('browse.filters.rating_45plus')}</option>
                </select>
              </div>

              {/* Tier Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-300 mb-1.5 sm:mb-2">💎 {t('browse.filters.tier')}</label>
                <select
                  value={selectedTier || ''}
                  onChange={(e) => setSelectedTier(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-black/50 border-2 border-neon-purple/30 rounded-lg sm:rounded-xl text-sm sm:text-base text-white focus:outline-none focus:border-neon-purple"
                >
                  <option value="">{t('browse.filters.all_tiers')}</option>
                  <option value="1">{t('tier.general')}</option>
                  <option value="2">{t('tier.silver')}</option>
                  <option value="3">{t('tier.diamond')}</option>
                  <option value="4">{t('tier.premium')}</option>
                  <option value="5">{t('tier.god')}</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-300 mb-1.5 sm:mb-2">🔢 {t('browse.filters.sort_by')}</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'rating' | 'reviews' | 'distance')}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-black/50 border-2 border-neon-purple/30 rounded-lg sm:rounded-xl text-sm sm:text-base text-white focus:outline-none focus:border-neon-purple"
                >
                  <option value="rating">{t('browse.filters.highest_rating')}</option>
                  <option value="reviews">{t('browse.filters.most_reviews')}</option>
                  <option value="distance">{t('browse.filters.nearest')}</option>
                </select>
              </div>
            </div>

            {/* Category Pills */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-300 mb-1.5 sm:mb-2">🎭 {t('browse.filters.category')}</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                    selectedCategory === null
                      ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white'
                      : 'bg-black/30 text-gray-400 hover:bg-black/50'
                  }`}
                >
                  {t('browse.filters.all_categories')}
                </button>
                {[
                  { id: 1, nameKey: 'categories.companion', icon: '💋' },
                  { id: 2, nameKey: 'categories.massage', icon: '💆' },
                  { id: 3, nameKey: 'categories.entertainment', icon: '🎭' },
                  { id: 4, nameKey: 'categories.dinner_date', icon: '🍽️' },
                  { id: 5, nameKey: 'categories.tour_guide', icon: '🗺️' },
                  { id: 6, nameKey: 'categories.model', icon: '📸' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white'
                        : 'bg-black/30 text-gray-400 hover:bg-black/50'
                    }`}
                  >
                    {cat.icon} {t(cat.nameKey)}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-1.5 sm:px-6 sm:py-2 bg-red-500/20 border border-red-500/30 text-red-400 text-xs sm:text-base rounded-lg sm:rounded-xl font-bold hover:bg-red-500/30 active:scale-95 transition-all"
              >
                🗑️ {t('browse.filters.clear_all')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-6xl mx-auto mb-6">
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-6 py-4 rounded-xl">
            <p className="font-bold">❌ {error}</p>
            <button 
              onClick={() => { setError(null); loadProviders(); }}
              className="mt-2 text-sm underline hover:text-red-200"
            >
              {t('common.try_again')}
            </button>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="max-w-6xl mx-auto mb-6">
        <p className="text-gray-400">
          {loading ? t('common.loading') : t('browse.results_count', { count: providers.length })}
        </p>
      </div>

      {/* Companions Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          // Loading skeleton
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-black/50 backdrop-blur-2xl rounded-3xl p-6 border-2 border-neon-pink/30 animate-pulse">
              <div className="w-full h-64 bg-gray-700/50 rounded-2xl mb-4"></div>
              <div className="h-6 bg-gray-700/50 rounded mb-2"></div>
              <div className="h-4 bg-gray-700/50 rounded w-2/3"></div>
            </div>
          ))
        ) : providers.length === 0 ? (
          /* No results */
          <div className="col-span-full text-center py-20">
            <div className="text-8xl mb-4">🔍</div>
            <h3 className="text-3xl font-bold text-white mb-2">{t('browse.no_results')}</h3>
            <p className="text-gray-400 mb-6">{t('browse.no_results_subtitle')}</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold rounded-xl hover:scale-105 transition-all"
            >
              {t('browse.filters.clear_all')}
            </button>
          </div>
        ) : (
          providers.map((provider) => (
            <div key={provider.user_id} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/30 to-neon-purple/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-black/50 backdrop-blur-2xl rounded-3xl p-6 border-2 border-neon-pink/30 hover:border-neon-pink shadow-[0_0_40px_rgba(255,16,240,0.2)] hover:shadow-[0_0_60px_rgba(255,16,240,0.5)] transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-pink/10 rounded-full blur-3xl"></div>
                
                <div className="relative w-full h-64 bg-gradient-to-br from-neon-pink/20 via-neon-purple/20 to-neon-gold/20 rounded-2xl mb-4 flex items-center justify-center text-7xl backdrop-blur-sm overflow-hidden">
                  {provider.profile_picture_url ? (
                    <img 
                      src={provider.profile_picture_url} 
                      alt={provider.username}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="text-8xl drop-shadow-[0_0_30px_rgba(255,16,240,0.8)]">💋</div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-white truncate">{provider.username}</h3>
                    {provider.tier_name && (
                      <span className={`px-3 py-1 text-xs font-black rounded-full ${
                        provider.tier_name === 'GOD' ? 'bg-gradient-to-r from-neon-gold to-yellow-400 text-black' :
                        provider.tier_name === 'Premium' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
                        provider.tier_name === 'Diamond' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' :
                        'bg-gray-500/30 text-gray-300'
                      }`}>
                        {translateTier(provider.tier_name, t)}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-300 truncate">{provider.bio || 'Elite companion • Verified ✓'}</p>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, idx) => (
                        <span key={idx} className={`${
                          idx < Math.floor(provider.average_rating || 0) ? 'text-neon-gold' : 'text-gray-600'
                        } text-lg`}>⭐</span>
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm">
                      {provider.average_rating?.toFixed(1) || '0.0'} ({provider.total_reviews || 0} reviews)
                    </span>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {provider.location_province && (
                      <span className="px-3 py-1 bg-neon-purple/20 text-neon-purple text-xs font-bold rounded-full border border-neon-purple/30">
                        📍 {translateProvince(provider.location_province, t)}
                      </span>
                    )}
                    {provider.distance_km !== null && (
                      <span className="px-3 py-1 bg-neon-blue/20 text-neon-blue text-xs font-bold rounded-full border border-neon-blue/30">
                        📏 {formatDistance(provider.distance_km)}
                      </span>
                    )}
                    {provider.categories && provider.categories.length > 0 && (
                      <span className="px-3 py-1 bg-neon-pink/20 text-neon-pink text-xs font-bold rounded-full border border-neon-pink/30">
                        {getCategoryIcon(provider.categories[0].category_name)} {translateCategory(provider.categories[0].category_name, t)}
                      </span>
                    )}
                  </div>

                  {/* Admin/GOD Only - Provider Queue Info */}
                  <AdminProviderInfo providerId={provider.user_id} compact />

                  <div className="pt-4 border-t border-neon-purple/20">
                    <div className="relative group/btn">
                      <div className="absolute inset-0 bg-gradient-to-r from-neon-pink to-neon-purple rounded-xl blur-md opacity-75 group-hover/btn:opacity-100 transition-opacity"></div>
                      <a
                        href={`/provider/${provider.user_id}`}
                        className="relative block w-full bg-gradient-to-r from-neon-pink via-pink-500 to-neon-purple text-white font-black py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,16,240,0.4)] text-center"
                      >
                        💎 {t('common.view_profile')}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Privacy Notice */}
      <div className="mt-16 max-w-4xl mx-auto bg-black/30 backdrop-blur-xl p-6 rounded-2xl border border-neon-purple/30">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🔒</div>
          <div>
            <h3 className="text-neon-purple font-black text-lg mb-2">{t('browse.privacy.title')}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('browse.privacy.description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
