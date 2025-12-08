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
    <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-full p-1 border border-neon-pink/30 shadow-lg">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
            i18n.language === lang.code
              ? 'bg-gradient-to-r from-neon-pink to-neon-purple text-white shadow-lg shadow-neon-pink/50 scale-110'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="mr-1.5 text-base">{lang.flag}</span>
          {lang.label}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
