import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: localStorage.getItem('language') || 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },

    backend: {
        loadPath: '/locales/{{lng}}/translation.json?v=20251230v1',
      requestOptions: {
        cache: 'no-store',
      },
    },

    ns: ['translation'],
    defaultNS: 'translation',
  });

// Save language preference when it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
  document.documentElement.lang = lng;
});

export default i18n;
