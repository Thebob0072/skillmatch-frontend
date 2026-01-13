import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'EN', flag: '🇬🇧', name: 'English' },
    { code: 'th', label: 'ไทย', flag: '🇹🇭', name: 'ไทย' },
    { code: 'zh', label: '中文', flag: '🇨🇳', name: '中文' },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="flex items-center gap-0.5 sm:gap-1 bg-black/40 backdrop-blur-md rounded-full p-0.5 sm:p-1 border border-neon-pink/30 shadow-lg">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 whitespace-nowrap ${
            i18n.language === lang.code
              ? 'bg-gradient-to-r from-neon-pink to-neon-purple text-white shadow-lg shadow-neon-pink/50 scale-105 sm:scale-110'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
          aria-label={`Switch to ${lang.name}`}
        >
          <span className="mr-1 sm:mr-1.5 text-sm sm:text-base">{lang.flag}</span>
          <span className="hidden sm:inline">{lang.label}</span>
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
