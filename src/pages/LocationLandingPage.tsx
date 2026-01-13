import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Star, Shield, Clock, Heart, Search } from 'lucide-react';
import { SEO } from '../components';

interface LocationData {
  name: string;
  nameTh: string;
  nameZh: string;
  description: string;
  descriptionTh: string;
  descriptionZh: string;
  image: string;
  popularAreas: string[];
  popularAreasTh: string[];
  popularAreasZh: string[];
  features: string[];
  featuresTh: string[];
  featuresZh: string[];
  stats: {
    providers: number;
    categories: number;
    avgRating: number;
  };
}

const locations: Record<string, LocationData> = {
  bangkok: {
    name: 'Bangkok',
    nameTh: 'กรุงเทพ',
    nameZh: '曼谷',
    description: 'Discover premium entertainment services in Bangkok, Thailand\'s vibrant capital. Book verified escorts and adult entertainment with confidence.',
    descriptionTh: 'ค้นพบบริการความบันเทิงพรีเมียมในกรุงเทพ เมืองหลวงที่มีชีวิตชีวาของไทย จองเอสคอร์ตและความบันเทิงผู้ใหญ่ที่ผ่านการตรวจสอบอย่างมั่นใจ',
    descriptionZh: '在泰国充满活力的首都曼谷发现高级娱乐服务。自信预订经过验证的陪伴和成人娱乐服务。',
    image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=1200&h=630&fit=crop',
    popularAreas: ['Sukhumvit', 'Silom', 'Thong Lo', 'Asok', 'Nana', 'Ratchada', 'Ekkamai', 'Phrom Phong'],
    popularAreasTh: ['สุขุมวิท', 'สีลม', 'ทองหล่อ', 'อโศก', 'นานา', 'รัชดา', 'เอกมัย', 'พร้อมพงษ์'],
    popularAreasZh: ['素坤逸', '是隆', '通罗', '阿索克', '那那', '拉差达', '艾卡迈', '彭蓬'],
    features: ['24/7 Availability', 'Hotel/Condo Service', 'Verified Profiles', 'Multilingual Support', 'Secure Payments', 'Discreet Service'],
    featuresTh: ['บริการ 24/7', 'บริการโรงแรม/คอนโด', 'โปรไฟล์ตรวจสอบแล้ว', 'รองรับหลายภาษา', 'ชำระเงินปลอดภัย', 'บริการเป็นความลับ'],
    featuresZh: ['24/7 服务', '酒店/公寓服务', '验证档案', '多语言支持', '安全支付', '隐私服务'],
    stats: {
      providers: 850,
      categories: 6,
      avgRating: 4.8,
    },
  },
  phuket: {
    name: 'Phuket',
    nameTh: 'ภูเก็ต',
    nameZh: '普吉岛',
    description: 'Experience premium entertainment services in Phuket, Thailand\'s paradise island. Verified escorts, beach companions, and adult services.',
    descriptionTh: 'สัมผัสบริการความบันเทิงพรีเมียมในภูเก็ต เกาะสวรรค์ของไทย เอสคอร์ตที่ผ่านการตรวจสอบ เพื่อนร่วมชายหาด และบริการผู้ใหญ่',
    descriptionZh: '在泰国天堂岛普吉岛体验高级娱乐服务。经过验证的陪伴、海滩伴侣和成人服务。',
    image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1200&h=630&fit=crop',
    popularAreas: ['Patong', 'Kata', 'Karon', 'Bangla Road', 'Kamala', 'Bang Tao', 'Rawai', 'Nai Harn'],
    popularAreasTh: ['ป่าตอง', 'กะตะ', 'กะรน', 'ถนนบางลา', 'กมลา', 'บางเทา', 'ราไวย์', 'ในหาน'],
    popularAreasZh: ['巴东', '卡塔', '卡伦', '邦古拉路', '卡马拉', '邦涛', '拉威', '奈汉'],
    features: ['Beach Services', 'Resort Visits', 'Yacht Companions', 'Party Services', 'Island Tours', 'Beachfront Service'],
    featuresTh: ['บริการชายหาด', 'เยี่ยมรีสอร์ท', 'เพื่อนร่วมเรือยอชท์', 'บริการปาร์ตี้', 'ทัวร์เกาะ', 'บริการริมชายหาด'],
    featuresZh: ['海滩服务', '度假村访问', '游艇伴侣', '派对服务', '岛屿旅游', '海滨服务'],
    stats: {
      providers: 420,
      categories: 6,
      avgRating: 4.7,
    },
  },
  pattaya: {
    name: 'Pattaya',
    nameTh: 'พัทยา',
    nameZh: '芭提雅',
    description: 'Book premium entertainment services in Pattaya, Thailand\'s entertainment capital. Verified escorts, nightlife companions, and adult services.',
    descriptionTh: 'จองบริการความบันเทิงพรีเมียมในพัทยา เมืองหลวงความบันเทิงของไทย เอสคอร์ตที่ผ่านการตรวจสอบ เพื่อนร่วมไนท์ไลฟ์ และบริการผู้ใหญ่',
    descriptionZh: '在泰国娱乐之都芭提雅预订高级娱乐服务。经过验证的陪伴、夜生活伴侣和成人服务。',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&h=630&fit=crop',
    popularAreas: ['Walking Street', 'Beach Road', 'Central Pattaya', 'Jomtien', 'Naklua', 'Pratumnak', 'Soi Buakhao', 'LK Metro'],
    popularAreasTh: ['ถนนคนเดิน', 'ถนนชายหาด', 'พัทยากลาง', 'จอมเทียน', 'นาเกลือ', 'ประตูมนาก', 'ซอยบัวขาว', 'แอลเค เมโทร'],
    popularAreasZh: ['步行街', '海滩路', '芭提雅中心', '宗甸', '那格卢', '普拉塔那', '布阿考巷', 'LK Metro'],
    features: ['Nightlife Companions', 'Hotel Service', 'Party Girls', 'Beach Activities', 'Bar Attendants', 'Entertainment Shows'],
    featuresTh: ['เพื่อนร่วมไนท์ไลฟ์', 'บริการโรงแรม', 'สาวปาร์ตี้', 'กิจกรรมชายหาด', 'เด็กเสิร์ฟบาร์', 'โชว์ความบันเทิง'],
    featuresZh: ['夜生活伴侣', '酒店服务', '派对女孩', '海滩活动', '酒吧服务员', '娱乐表演'],
    stats: {
      providers: 680,
      categories: 6,
      avgRating: 4.6,
    },
  },
  chiangmai: {
    name: 'Chiang Mai',
    nameTh: 'เชียงใหม่',
    nameZh: '清迈',
    description: 'Discover premium entertainment services in Chiang Mai, Northern Thailand\'s cultural hub. Verified escorts, cultural companions, and adult services.',
    descriptionTh: 'ค้นพบบริการความบันเทิงพรีเมียมในเชียงใหม่ ศูนย์กลางวัฒนธรรมภาคเหนือของไทย เอสคอร์ตที่ผ่านการตรวจสอบ เพื่อนร่วมทางวัฒนธรรม และบริการผู้ใหญ่',
    descriptionZh: '在泰国北部文化中心清迈发现高级娱乐服务。经过验证的陪伴、文化伴侣和成人服务。',
    image: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=1200&h=630&fit=crop',
    popularAreas: ['Old City', 'Nimman', 'Night Bazaar', 'Riverside', 'Chang Puak', 'Santitham', 'Hang Dong', 'Mae Rim'],
    popularAreasTh: ['เมืองเก่า', 'นิมมาน', 'ไนท์บาซาร์', 'ริเวอร์ไซด์', 'ช้างเผือก', 'สันติธรรม', 'หางดง', 'แม่ริม'],
    popularAreasZh: ['古城', '尼曼', '夜市', '河滨', '昌普', '桑提塔姆', '杭东', '湄林'],
    features: ['Cultural Tours', 'Mountain Retreats', 'Spa Companions', 'Temple Tours', 'Market Guides', 'Nature Activities'],
    featuresTh: ['ทัวร์วัฒนธรรม', 'รีทรีทภูเขา', 'เพื่อนร่วมสปา', 'ทัวร์วัด', 'ไกด์ตลาด', 'กิจกรรมธรรมชาติ'],
    featuresZh: ['文化旅游', '山地度假', '水疗伴侣', '寺庙游', '市场导游', '自然活动'],
    stats: {
      providers: 320,
      categories: 6,
      avgRating: 4.9,
    },
  },
};

export const LocationLandingPage: React.FC = () => {
  const { location } = useParams<{ location: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const locationData = location ? locations[location.toLowerCase()] : null;

  if (!locationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Location Not Found</h1>
          <button
            onClick={() => navigate('/browse')}
            className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Browse All Providers
          </button>
        </div>
      </div>
    );
  }

  const displayName = currentLang === 'th' ? locationData.nameTh : currentLang === 'zh' ? locationData.nameZh : locationData.name;
  const displayDescription = currentLang === 'th' ? locationData.descriptionTh : currentLang === 'zh' ? locationData.descriptionZh : locationData.description;
  const displayAreas = currentLang === 'th' ? locationData.popularAreasTh : currentLang === 'zh' ? locationData.popularAreasZh : locationData.popularAreas;
  const displayFeatures = currentLang === 'th' ? locationData.featuresTh : currentLang === 'zh' ? locationData.featuresZh : locationData.features;

  const seoTitle = `${displayName} Entertainment Services | Thai Variety - Book Premium Escorts & Adult Services`;
  const seoDescription = displayDescription;
  const seoKeywords = `${displayName} escort, ${displayName} entertainment, adult services ${displayName}, companion ${displayName}, premium escort ${displayName}, ${displayAreas.slice(0, 4).join(', ')}, Thai variety ${displayName}`;

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        image={locationData.image}
        url={`https://thaivariety.app/location/${location}`}
        type="website"
        section="Entertainment"
        tags={[displayName, 'escort', 'entertainment', 'Thailand', ...displayAreas.slice(0, 3)]}
        canonicalUrl={`https://thaivariety.app/location/${location}`}
      />

      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600">
        {/* Hero Section */}
        <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
          <img
            src={locationData.image}
            alt={`${displayName} Entertainment Services`}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
          
          <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
            <MapPin className="w-16 h-16 mb-4 text-pink-300" />
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">
              {displayName}
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mb-8 drop-shadow">
              {displayDescription}
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <span className="font-bold text-2xl">{locationData.stats.providers}+</span>
                <span className="ml-2 text-pink-200">{t('providers')}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <Star className="inline w-5 h-5 text-yellow-300 fill-yellow-300 mb-1" />
                <span className="ml-2 font-bold text-2xl">{locationData.stats.avgRating}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <span className="font-bold text-2xl">{locationData.stats.categories}</span>
                <span className="ml-2 text-pink-200">{t('categories')}</span>
              </div>
            </div>
            <button
              onClick={() => navigate(`/browse?location=${location}`)}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-bold text-lg hover:scale-105 transform transition shadow-2xl"
            >
              <Search className="inline w-5 h-5 mr-2 mb-1" />
              {t('browse_providers')}
            </button>
          </div>
        </div>

        {/* Popular Areas */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            {t('popular_areas')} {t('in')} {displayName}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayAreas.map((area, index) => (
              <button
                key={index}
                onClick={() => navigate(`/browse?location=${location}&area=${area}`)}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 py-4 rounded-xl font-semibold transition transform hover:scale-105"
              >
                <MapPin className="inline w-4 h-4 mr-2 mb-1 text-pink-300" />
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/10 backdrop-blur-sm py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              {t('why_choose')} {displayName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayFeatures.map((feature, index) => {
                const icons = [Shield, Clock, Heart, Star, MapPin, Search];
                const Icon = icons[index % icons.length];
                return (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition"
                  >
                    <Icon className="w-12 h-12 text-pink-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">{feature}</h3>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t('ready_to_book')}
          </h2>
          <p className="text-xl text-pink-200 mb-8 max-w-2xl mx-auto">
            {t('browse_verified_providers')} {displayName}
          </p>
          <button
            onClick={() => navigate(`/browse?location=${location}`)}
            className="px-10 py-5 bg-white text-purple-600 rounded-full font-bold text-xl hover:scale-105 transform transition shadow-2xl"
          >
            {t('browse_now')}
          </button>
        </div>
      </div>
    </>
  );
};

export default LocationLandingPage;
