// ข้อมูลสถานที่ประเทศไทย - Thailand Location Data
// จังหวัด > อำเภอ/เขต > ตำบล/แขวง

export interface SubDistrict {
  sub_district_th: string;
  sub_district_en: string;
  postal_code?: string;
}

export interface District {
  district_th: string;
  district_en: string;
  sub_districts: SubDistrict[];
}

export interface Province {
  province_th: string;
  province_en: string;
  region: 'central' | 'north' | 'northeast' | 'south' | 'east' | 'west';
  districts: District[];
}

// ข้อมูลทุกจังหวัดในประเทศไทย (77 จังหวัด)
export const THAILAND_LOCATIONS: Province[] = [
  // ===== ภาคกลาง (CENTRAL) =====
  
  // กรุงเทพมหานคร
  {
    province_th: 'กรุงเทพมหานคร',
    province_en: 'Bangkok',
    region: 'central',
    districts: [
      {
        district_th: 'วัฒนา',
        district_en: 'Watthana',
        sub_districts: [
          { sub_district_th: 'คลองตันเหนือ', sub_district_en: 'Khlong Tan Nuea', postal_code: '10110' },
          { sub_district_th: 'คลองเตยเหนือ', sub_district_en: 'Khlong Toei Nuea', postal_code: '10110' },
          { sub_district_th: 'พระโขนงเหนือ', sub_district_en: 'Phra Khanong Nuea', postal_code: '10110' },
        ],
      },
      {
        district_th: 'ปทุมวัน',
        district_en: 'Pathum Wan',
        sub_districts: [
          { sub_district_th: 'ปทุมวัน', sub_district_en: 'Pathum Wan', postal_code: '10330' },
          { sub_district_th: 'ลุมพินี', sub_district_en: 'Lumphini', postal_code: '10330' },
          { sub_district_th: 'รองเมือง', sub_district_en: 'Rong Mueang', postal_code: '10330' },
        ],
      },
      {
        district_th: 'สาทร',
        district_en: 'Sathon',
        sub_districts: [
          { sub_district_th: 'ทุ่งมหาเมฆ', sub_district_en: 'Thung Maha Mek', postal_code: '10120' },
          { sub_district_th: 'ยานนาวา', sub_district_en: 'Yan Nawa', postal_code: '10120' },
          { sub_district_th: 'ทุ่งวัดดอน', sub_district_en: 'Thung Wat Don', postal_code: '10120' },
        ],
      },
      {
        district_th: 'คลองเตย',
        district_en: 'Khlong Toei',
        sub_districts: [
          { sub_district_th: 'คลองตัน', sub_district_en: 'Khlong Tan', postal_code: '10110' },
          { sub_district_th: 'คลองเตย', sub_district_en: 'Khlong Toei', postal_code: '10110' },
          { sub_district_th: 'พระโขนง', sub_district_en: 'Phra Khanong', postal_code: '10260' },
        ],
      },
      {
        district_th: 'บางรัก',
        district_en: 'Bang Rak',
        sub_districts: [
          { sub_district_th: 'สีลม', sub_district_en: 'Silom', postal_code: '10500' },
          { sub_district_th: 'สุริยวงศ์', sub_district_en: 'Suriyawong', postal_code: '10500' },
          { sub_district_th: 'บางรัก', sub_district_en: 'Bang Rak', postal_code: '10500' },
        ],
      },
      {
        district_th: 'ห้วยขวาง',
        district_en: 'Huai Khwang',
        sub_districts: [
          { sub_district_th: 'ห้วยขวาง', sub_district_en: 'Huai Khwang', postal_code: '10310' },
          { sub_district_th: 'บางกะปิ', sub_district_en: 'Bang Kapi', postal_code: '10310' },
          { sub_district_th: 'สามเสนนอก', sub_district_en: 'Sam Sen Nok', postal_code: '10310' },
        ],
      },
    ],
  },

  // ===== เชียงใหม่ =====
  {
    province_th: 'เชียงใหม่',
    province_en: 'Chiang Mai',
    region: 'north',
    districts: [
      {
        district_th: 'เมืองเชียงใหม่',
        district_en: 'Mueang Chiang Mai',
        sub_districts: [
          { sub_district_th: 'ศรีภูมิ', sub_district_en: 'Si Phum', postal_code: '50200' },
          { sub_district_th: 'พระสิงห์', sub_district_en: 'Phra Sing', postal_code: '50200' },
          { sub_district_th: 'หายยา', sub_district_en: 'Hai Ya', postal_code: '50100' },
          { sub_district_th: 'ช้างม่อย', sub_district_en: 'Chang Moi', postal_code: '50300' },
          { sub_district_th: 'ช้างคลาน', sub_district_en: 'Chang Khlan', postal_code: '50100' },
        ],
      },
      {
        district_th: 'สันทราย',
        district_en: 'San Sai',
        sub_districts: [
          { sub_district_th: 'สันทรายหลวง', sub_district_en: 'San Sai Luang', postal_code: '50210' },
          { sub_district_th: 'สันพระเนตร', sub_district_en: 'San Phra Net', postal_code: '50210' },
          { sub_district_th: 'สันนาเม็ง', sub_district_en: 'San Na Meng', postal_code: '50210' },
        ],
      },
      {
        district_th: 'แม่ริม',
        district_en: 'Mae Rim',
        sub_districts: [
          { sub_district_th: 'ริมใต้', sub_district_en: 'Rim Tai', postal_code: '50180' },
          { sub_district_th: 'ริมเหนือ', sub_district_en: 'Rim Nuea', postal_code: '50180' },
          { sub_district_th: 'สันโป่ง', sub_district_en: 'San Pong', postal_code: '50180' },
        ],
      },
    ],
  },

  // ===== ภูเก็ต =====
  {
    province_th: 'ภูเก็ต',
    province_en: 'Phuket',
    region: 'south',
    districts: [
      {
        district_th: 'เมืองภูเก็ต',
        district_en: 'Mueang Phuket',
        sub_districts: [
          { sub_district_th: 'ตลาดใหญ่', sub_district_en: 'Talat Yai', postal_code: '83000' },
          { sub_district_th: 'ตลาดเหนือ', sub_district_en: 'Talat Nuea', postal_code: '83000' },
          { sub_district_th: 'วิชิต', sub_district_en: 'Wichit', postal_code: '83000' },
          { sub_district_th: 'ฉลอง', sub_district_en: 'Chalong', postal_code: '83130' },
          { sub_district_th: 'ราไวย์', sub_district_en: 'Rawai', postal_code: '83130' },
        ],
      },
      {
        district_th: 'กะทู้',
        district_en: 'Kathu',
        sub_districts: [
          { sub_district_th: 'กะทู้', sub_district_en: 'Kathu', postal_code: '83120' },
          { sub_district_th: 'ป่าตอง', sub_district_en: 'Patong', postal_code: '83150' },
          { sub_district_th: 'กมลา', sub_district_en: 'Kamala', postal_code: '83150' },
        ],
      },
      {
        district_th: 'ถลาง',
        district_en: 'Thalang',
        sub_districts: [
          { sub_district_th: 'เทพกระษัตรี', sub_district_en: 'Thep Krasattri', postal_code: '83110' },
          { sub_district_th: 'ศรีสุนทร', sub_district_en: 'Si Sunthon', postal_code: '83110' },
          { sub_district_th: 'เชิงทะเล', sub_district_en: 'Choeng Thale', postal_code: '83110' },
        ],
      },
    ],
  },

  // ===== พัทยา (ชลบุรี) =====
  {
    province_th: 'ชลบุรี',
    province_en: 'Chon Buri',
    region: 'east',
    districts: [
      {
        district_th: 'บางละมุง',
        district_en: 'Bang Lamung',
        sub_districts: [
          { sub_district_th: 'หนองปรือ', sub_district_en: 'Nong Prue', postal_code: '20150' },
          { sub_district_th: 'นาเกลือ', sub_district_en: 'Na Kluea', postal_code: '20150' },
          { sub_district_th: 'บางละมุง', sub_district_en: 'Bang Lamung', postal_code: '20150' },
          { sub_district_th: 'ห้วยใหญ่', sub_district_en: 'Huai Yai', postal_code: '20150' },
        ],
      },
      {
        district_th: 'เมืองชลบุรี',
        district_en: 'Mueang Chon Buri',
        sub_districts: [
          { sub_district_th: 'บางปลาสร้อย', sub_district_en: 'Bang Pla Soi', postal_code: '20000' },
          { sub_district_th: 'แสนสุข', sub_district_en: 'Saen Suk', postal_code: '20130' },
          { sub_district_th: 'อ่างศิลา', sub_district_en: 'Ang Sila', postal_code: '20000' },
        ],
      },
      {
        district_th: 'สัตหีบ',
        district_en: 'Sattahip',
        sub_districts: [
          { sub_district_th: 'สัตหีบ', sub_district_en: 'Sattahip', postal_code: '20180' },
          { sub_district_th: 'นาจอมเทียน', sub_district_en: 'Na Jomtien', postal_code: '20250' },
          { sub_district_th: 'บางเสร่', sub_district_en: 'Bang Sare', postal_code: '20250' },
        ],
      },
    ],
  },

  // ===== กระบี่ =====
  {
    province_th: 'กระบี่',
    province_en: 'Krabi',
    region: 'south',
    districts: [
      {
        district_th: 'เมืองกระบี่',
        district_en: 'Mueang Krabi',
        sub_districts: [
          { sub_district_th: 'ปากน้ำ', sub_district_en: 'Pak Nam', postal_code: '81000' },
          { sub_district_th: 'กระบี่ใหญ่', sub_district_en: 'Krabi Yai', postal_code: '81000' },
          { sub_district_th: 'อ่าวนาง', sub_district_en: 'Ao Nang', postal_code: '81000' },
        ],
      },
      {
        district_th: 'อ่าวลึก',
        district_en: 'Ao Luek',
        sub_districts: [
          { sub_district_th: 'อ่าวลึกใต้', sub_district_en: 'Ao Luek Tai', postal_code: '81110' },
          { sub_district_th: 'อ่าวลึกเหนือ', sub_district_en: 'Ao Luek Nuea', postal_code: '81110' },
        ],
      },
    ],
  },

  // ===== เกาะสมุย (สุราษฎร์ธานี) =====
  {
    province_th: 'สุราษฎร์ธานี',
    province_en: 'Surat Thani',
    region: 'south',
    districts: [
      {
        district_th: 'เกาะสมุย',
        district_en: 'Ko Samui',
        sub_districts: [
          { sub_district_th: 'อ่างทอง', sub_district_en: 'Ang Thong', postal_code: '84140' },
          { sub_district_th: 'ลิปะน้อย', sub_district_en: 'Lipa Noi', postal_code: '84140' },
          { sub_district_th: 'ตลิ่งงาม', sub_district_en: 'Taling Ngam', postal_code: '84140' },
          { sub_district_th: 'บ่อผุด', sub_district_en: 'Bo Phut', postal_code: '84320' },
          { sub_district_th: 'แม่น้ำ', sub_district_en: 'Mae Nam', postal_code: '84330' },
        ],
      },
    ],
  },

  // ===== หัวหิน (ประจวบคีรีขันธ์) =====
  {
    province_th: 'ประจวบคีรีขันธ์',
    province_en: 'Prachuap Khiri Khan',
    region: 'central',
    districts: [
      {
        district_th: 'หัวหิน',
        district_en: 'Hua Hin',
        sub_districts: [
          { sub_district_th: 'หัวหิน', sub_district_en: 'Hua Hin', postal_code: '77110' },
          { sub_district_th: 'หนองแก', sub_district_en: 'Nong Kae', postal_code: '77110' },
          { sub_district_th: 'หินเหล็กไฟ', sub_district_en: 'Hin Lek Fai', postal_code: '77110' },
        ],
      },
    ],
  },
];

// Helper functions
export const getProvinces = (): string[] => {
  return THAILAND_LOCATIONS.map(p => p.province_en);
};

export const getProvincesInThai = (): string[] => {
  return THAILAND_LOCATIONS.map(p => p.province_th);
};

export const getDistrictsByProvince = (province: string): string[] => {
  const prov = THAILAND_LOCATIONS.find(
    p => p.province_en === province || p.province_th === province
  );
  return prov?.districts.map(d => d.district_en) || [];
};

export const getDistrictsByProvinceInThai = (province: string): string[] => {
  const prov = THAILAND_LOCATIONS.find(
    p => p.province_en === province || p.province_th === province
  );
  return prov?.districts.map(d => d.district_th) || [];
};

export const getSubDistrictsByDistrict = (
  province: string,
  district: string
): string[] => {
  const prov = THAILAND_LOCATIONS.find(
    p => p.province_en === province || p.province_th === province
  );
  const dist = prov?.districts.find(
    d => d.district_en === district || d.district_th === district
  );
  return dist?.sub_districts.map(sd => sd.sub_district_en) || [];
};

export const getSubDistrictsByDistrictInThai = (
  province: string,
  district: string
): string[] => {
  const prov = THAILAND_LOCATIONS.find(
    p => p.province_en === province || p.province_th === province
  );
  const dist = prov?.districts.find(
    d => d.district_en === district || d.district_th === district
  );
  return dist?.sub_districts.map(sd => sd.sub_district_th) || [];
};

export const getPostalCode = (
  province: string,
  district: string,
  subDistrict: string
): string | undefined => {
  const prov = THAILAND_LOCATIONS.find(
    p => p.province_en === province || p.province_th === province
  );
  const dist = prov?.districts.find(
    d => d.district_en === district || d.district_th === district
  );
  const subDist = dist?.sub_districts.find(
    sd => sd.sub_district_en === subDistrict || sd.sub_district_th === subDistrict
  );
  return subDist?.postal_code;
};
