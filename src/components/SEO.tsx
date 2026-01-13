import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  canonicalUrl?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = 'https://thaivariety.app/og-image.png',
  url = 'https://thaivariety.app',
  type = 'website',
  author = 'Thai Variety Entertainment',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noIndex = false,
  canonicalUrl,
}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  // Default values based on language
  const defaultTitles = {
    en: 'Thai Variety Entertainment - Premium Adult Services in Thailand',
    th: 'Thai Variety Entertainment - บริการความบันเทิงพรีเมียมในประเทศไทย',
    zh: 'Thai Variety Entertainment - 泰国高级娱乐服务',
  };

  const defaultDescriptions = {
    en: 'Book verified premium entertainment services in Thailand. Bangkok, Phuket, Pattaya, Chiang Mai. Professional escorts & adult entertainment. Safe, secure, discreet.',
    th: 'จองบริการความบันเทิงพรีเมียมที่ผ่านการตรวจสอบในประเทศไทย กรุงเทพ ภูเก็ต พัทยา เชียงใหม่ บริการเอสคอร์ตมืออาชีพ ปลอดภัย เป็นส่วนตัว',
    zh: '预订泰国经过验证的高级娱乐服务。曼谷、普吉岛、芭提雅、清迈。专业护送和成人娱乐。安全、可靠、隐私。',
  };

  const defaultKeywords = [
    'escort Thailand',
    'Bangkok escort',
    'Phuket escort',
    'Pattaya entertainment',
    'adult services Thailand',
    'companion booking',
    'premium entertainment',
    'Thai escort service',
    'entertainment booking platform',
    'verified providers',
    'safe booking',
    'adult entertainment Bangkok',
    'escort services Phuket',
    'companion Thailand',
    'premium escort',
    'luxury entertainment',
    'Thai variety',
    'entertainment service',
    'booking platform Thailand',
    'หาคู่หา',
    'บริการคู่หา',
    'จองบริการ',
    'ความบันเทิงผู้ใหญ่',
    'บริการความบันเทิง',
    'กรุงเทพ',
    'ภูเก็ต',
    'พัทยา',
    'เชียงใหม่',
    '泰国陪伴服务',
    '曼谷娱乐',
    '普吉岛',
    '芭提雅',
    '成人娱乐',
    '预订平台',
  ];

  const finalTitle = title || defaultTitles[currentLang as keyof typeof defaultTitles] || defaultTitles.en;
  const finalDescription = description || defaultDescriptions[currentLang as keyof typeof defaultDescriptions] || defaultDescriptions.en;
  const finalKeywords = keywords || [...defaultKeywords, ...tags].join(', ');

  // Structured Data (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Thai Variety Entertainment',
    alternateName: ['Thai Variety', 'ไทยวาไรตี้'],
    url: 'https://thaivariety.app',
    logo: 'https://thaivariety.app/og-image.png',
    description: finalDescription,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TH',
      addressRegion: 'Bangkok',
      addressLocality: 'Bangkok',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Thai', 'Chinese'],
    },
    sameAs: [
      'https://twitter.com/thaivariety',
      'https://facebook.com/thaivariety',
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://thaivariety.app/browse?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Thai Variety Entertainment',
    url: 'https://thaivariety.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://thaivariety.app/browse?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: ['en', 'th', 'zh'],
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={currentLang} />
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content={author} />
      
      {/* Robots */}
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Thai Variety Entertainment" />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content={currentLang === 'th' ? 'th_TH' : currentLang === 'zh' ? 'zh_CN' : 'en_US'} />
      
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      {section && <meta property="article:section" content={section} />}
      {tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@thaivariety" />
      <meta name="twitter:creator" content="@thaivariety" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:url" content={url} />
      
      {/* Language Alternates */}
      <link rel="alternate" hrefLang="en" href={`https://thaivariety.app/en${url.replace('https://thaivariety.app', '')}`} />
      <link rel="alternate" hrefLang="th" href={`https://thaivariety.app${url.replace('https://thaivariety.app', '')}`} />
      <link rel="alternate" hrefLang="zh" href={`https://thaivariety.app/zh${url.replace('https://thaivariety.app', '')}`} />
      <link rel="alternate" hrefLang="x-default" href={url} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#ff10f0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="TH" />
      <meta name="geo.placename" content="Thailand" />
      <meta name="geo.position" content="13.7563;100.5018" />
      <meta name="ICBM" content="13.7563, 100.5018" />
    </Helmet>
  );
};

export default SEO;
