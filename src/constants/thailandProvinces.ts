// ข้อมูลจังหวัดทั้ง 77 จังหวัดของประเทศไทย
// Thailand 77 Provinces Complete List

export interface ThaiProvince {
  province_th: string;
  province_en: string;
  region: 'central' | 'north' | 'northeast' | 'south' | 'east' | 'west';
}

export const THAILAND_PROVINCES: ThaiProvince[] = [
  // ===== ภาคกลาง (CENTRAL REGION) - 26 จังหวัด =====
  { province_th: 'กรุงเทพมหานคร', province_en: 'Bangkok', region: 'central' },
  { province_th: 'นนทบุรี', province_en: 'Nonthaburi', region: 'central' },
  { province_th: 'ปทุมธานี', province_en: 'Pathum Thani', region: 'central' },
  { province_th: 'สมุทรปราการ', province_en: 'Samut Prakan', region: 'central' },
  { province_th: 'สมุทรสาคร', province_en: 'Samut Sakhon', region: 'central' },
  { province_th: 'นครปฐม', province_en: 'Nakhon Pathom', region: 'central' },
  { province_th: 'พระนครศรีอยุธยา', province_en: 'Phra Nakhon Si Ayutthaya', region: 'central' },
  { province_th: 'อ่างทอง', province_en: 'Ang Thong', region: 'central' },
  { province_th: 'ลพบุรี', province_en: 'Lop Buri', region: 'central' },
  { province_th: 'สิงห์บุรี', province_en: 'Sing Buri', region: 'central' },
  { province_th: 'ชัยนาท', province_en: 'Chai Nat', region: 'central' },
  { province_th: 'สระบุรี', province_en: 'Saraburi', region: 'central' },
  { province_th: 'นครนายก', province_en: 'Nakhon Nayok', region: 'central' },
  { province_th: 'ฉะเชิงเทรา', province_en: 'Chachoengsao', region: 'central' },
  { province_th: 'ปราจีนบุรี', province_en: 'Prachin Buri', region: 'central' },
  { province_th: 'สุพรรณบุรี', province_en: 'Suphan Buri', region: 'central' },
  { province_th: 'กาญจนบุรี', province_en: 'Kanchanaburi', region: 'central' },
  { province_th: 'ราชบุรี', province_en: 'Ratchaburi', region: 'central' },
  { province_th: 'เพชรบุรี', province_en: 'Phetchaburi', region: 'central' },
  { province_th: 'ประจวบคีรีขันธ์', province_en: 'Prachuap Khiri Khan', region: 'central' },
  { province_th: 'สมุทรสงคร าม', province_en: 'Samut Songkhram', region: 'central' },
  { province_th: 'นครสวรรค์', province_en: 'Nakhon Sawan', region: 'central' },
  { province_th: 'อุทัยธานี', province_en: 'Uthai Thani', region: 'central' },
  { province_th: 'กำแพงเพชร', province_en: 'Kamphaeng Phet', region: 'central' },
  { province_th: 'พิษณุโลก', province_en: 'Phitsanulok', region: 'central' },
  { province_th: 'พิจิตร', province_en: 'Phichit', region: 'central' },

  // ===== ภาคเหนือ (NORTHERN REGION) - 17 จังหวัด =====
  { province_th: 'เชียงใหม่', province_en: 'Chiang Mai', region: 'north' },
  { province_th: 'เชียงราย', province_en: 'Chiang Rai', region: 'north' },
  { province_th: 'ลำพูน', province_en: 'Lamphun', region: 'north' },
  { province_th: 'ลำปาง', province_en: 'Lampang', region: 'north' },
  { province_th: 'แพร่', province_en: 'Phrae', region: 'north' },
  { province_th: 'น่าน', province_en: 'Nan', region: 'north' },
  { province_th: 'พะเยา', province_en: 'Phayao', region: 'north' },
  { province_th: 'แม่ฮ่องสอน', province_en: 'Mae Hong Son', region: 'north' },
  { province_th: 'เพชรบูรณ์', province_en: 'Phetchabun', region: 'north' },
  { province_th: 'สุโขทัย', province_en: 'Sukhothai', region: 'north' },
  { province_th: 'ตาก', province_en: 'Tak', region: 'north' },
  { province_th: 'อุตรดิตถ์', province_en: 'Uttaradit', region: 'north' },
  { province_th: 'พิจิตร', province_en: 'Phichit', region: 'north' },
  { province_th: 'เชียงฮาย', province_en: 'Chiang Hai', region: 'north' },
  { province_th: 'พิษณุโลก', province_en: 'Phitsanulok', region: 'north' },
  { province_th: 'กำแพงเพชร', province_en: 'Kamphaeng Phet', region: 'north' },
  { province_th: 'นครสวรรค์', province_en: 'Nakhon Sawan', region: 'north' },

  // ===== ภาคตะวันออกเฉียงเหนือ (NORTHEASTERN REGION) - 20 จังหวัด =====
  { province_th: 'นครราชสีมา', province_en: 'Nakhon Ratchasima', region: 'northeast' },
  { province_th: 'บุรีรัมย์', province_en: 'Buri Ram', region: 'northeast' },
  { province_th: 'สุรินทร์', province_en: 'Surin', region: 'northeast' },
  { province_th: 'ศรีสะเกษ', province_en: 'Si Sa Ket', region: 'northeast' },
  { province_th: 'อุบลราชธานี', province_en: 'Ubon Ratchathani', region: 'northeast' },
  { province_th: 'ยโสธร', province_en: 'Yasothon', region: 'northeast' },
  { province_th: 'ชัยภูมิ', province_en: 'Chaiyaphum', region: 'northeast' },
  { province_th: 'อำนาจเจริญ', province_en: 'Amnat Charoen', region: 'northeast' },
  { province_th: 'หนองบัวลำภู', province_en: 'Nong Bua Lam Phu', region: 'northeast' },
  { province_th: 'ขอนแก่น', province_en: 'Khon Kaen', region: 'northeast' },
  { province_th: 'อุดรธานี', province_en: 'Udon Thani', region: 'northeast' },
  { province_th: 'เลย', province_en: 'Loei', region: 'northeast' },
  { province_th: 'หนองคาย', province_en: 'Nong Khai', region: 'northeast' },
  { province_th: 'มหาสารคาม', province_en: 'Maha Sarakham', region: 'northeast' },
  { province_th: 'ร้อยเอ็ด', province_en: 'Roi Et', region: 'northeast' },
  { province_th: 'กาฬสินธุ์', province_en: 'Kalasin', region: 'northeast' },
  { province_th: 'สกลนคร', province_en: 'Sakon Nakhon', region: 'northeast' },
  { province_th: 'นครพนม', province_en: 'Nakhon Phanom', region: 'northeast' },
  { province_th: 'มุกดาหาร', province_en: 'Mukdahan', region: 'northeast' },
  { province_th: 'บึงกาฬ', province_en: 'Bueng Kan', region: 'northeast' },

  // ===== ภาคใต้ (SOUTHERN REGION) - 14 จังหวัด =====
  { province_th: 'ภูเก็ต', province_en: 'Phuket', region: 'south' },
  { province_th: 'สุราษฎร์ธานี', province_en: 'Surat Thani', region: 'south' },
  { province_th: 'กระบี่', province_en: 'Krabi', region: 'south' },
  { province_th: 'พังงา', province_en: 'Phang Nga', region: 'south' },
  { province_th: 'ระนอง', province_en: 'Ranong', region: 'south' },
  { province_th: 'ชุมพร', province_en: 'Chumphon', region: 'south' },
  { province_th: 'นครศรีธรรมราช', province_en: 'Nakhon Si Thammarat', region: 'south' },
  { province_th: 'สงขลา', province_en: 'Songkhla', region: 'south' },
  { province_th: 'พัทลุง', province_en: 'Phatthalung', region: 'south' },
  { province_th: 'ตรัง', province_en: 'Trang', region: 'south' },
  { province_th: 'สตูล', province_en: 'Satun', region: 'south' },
  { province_th: 'ปัตตานี', province_en: 'Pattani', region: 'south' },
  { province_th: 'ยะลา', province_en: 'Yala', region: 'south' },
  { province_th: 'นราธิวาส', province_en: 'Narathiwat', region: 'south' },

  // ===== ภาคตะวันออก (EASTERN REGION) - 7 จังหวัด =====
  { province_th: 'ชลบุรี', province_en: 'Chon Buri', region: 'east' },
  { province_th: 'ระยอง', province_en: 'Rayong', region: 'east' },
  { province_th: 'จันทบุรี', province_en: 'Chanthaburi', region: 'east' },
  { province_th: 'ตราด', province_en: 'Trat', region: 'east' },
  { province_th: 'ฉะเชิงเทรา', province_en: 'Chachoengsao', region: 'east' },
  { province_th: 'ปราจีนบุรี', province_en: 'Prachin Buri', region: 'east' },
  { province_th: 'สระแก้ว', province_en: 'Sa Kaeo', region: 'east' },
];

// Helper functions
export const getAllProvinces = (): string[] => {
  return THAILAND_PROVINCES.map(p => p.province_en);
};

export const getAllProvincesInThai = (): string[] => {
  return THAILAND_PROVINCES.map(p => p.province_th);
};

export const getProvincesByRegion = (region: string): ThaiProvince[] => {
  return THAILAND_PROVINCES.filter(p => p.region === region);
};

export const findProvince = (search: string): ThaiProvince | undefined => {
  return THAILAND_PROVINCES.find(
    p => p.province_en === search || p.province_th === search
  );
};
