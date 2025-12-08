/**
 * Province Translations (จังหวัดทั้ง 77 จังหวัด)
 * ใช้สำหรับแปลชื่อจังหวัดจากภาษาอังกฤษเป็นภาษาไทย
 */

export const provinceTranslations: Record<string, { th: string; en: string }> = {
  // กรุงเทพและปริมณฑล
  'Bangkok': { th: 'กรุงเทพมหานคร', en: 'Bangkok' },
  'Nonthaburi': { th: 'นนทบุรี', en: 'Nonthaburi' },
  'Pathum Thani': { th: 'ปทุมธานี', en: 'Pathum Thani' },
  'Samut Prakan': { th: 'สมุทรปราการ', en: 'Samut Prakan' },
  'Samut Sakhon': { th: 'สมุทรสาคร', en: 'Samut Sakhon' },
  'Nakhon Pathom': { th: 'นครปฐม', en: 'Nakhon Pathom' },
  
  // ภาคเหนือ (Northern)
  'Chiang Mai': { th: 'เชียงใหม่', en: 'Chiang Mai' },
  'Chiang Rai': { th: 'เชียงราย', en: 'Chiang Rai' },
  'Lamphun': { th: 'ลำพูน', en: 'Lamphun' },
  'Lampang': { th: 'ลำปาง', en: 'Lampang' },
  'Mae Hong Son': { th: 'แม่ฮ่องสอน', en: 'Mae Hong Son' },
  'Nan': { th: 'น่าน', en: 'Nan' },
  'Phayao': { th: 'พะเยา', en: 'Phayao' },
  'Phrae': { th: 'แพร่', en: 'Phrae' },
  'Uttaradit': { th: 'อุตรดิตถ์', en: 'Uttaradit' },
  
  // ภาคตะวันออกเหนือ (Northeastern - Isan)
  'Nakhon Ratchasima': { th: 'นครราชสีมา', en: 'Nakhon Ratchasima' },
  'Khon Kaen': { th: 'ขอนแก่น', en: 'Khon Kaen' },
  'Udon Thani': { th: 'อุดรธานี', en: 'Udon Thani' },
  'Ubon Ratchathani': { th: 'อุบลราชธานี', en: 'Ubon Ratchathani' },
  'Buriram': { th: 'บุรีรัมย์', en: 'Buriram' },
  'Surin': { th: 'สุรินทร์', en: 'Surin' },
  'Roi Et': { th: 'ร้อยเอ็ด', en: 'Roi Et' },
  'Kalasin': { th: 'กาฬสินธุ์', en: 'Kalasin' },
  'Sakon Nakhon': { th: 'สกลนคร', en: 'Sakon Nakhon' },
  'Nakhon Phanom': { th: 'นครพนม', en: 'Nakhon Phanom' },
  'Mukdahan': { th: 'มุกดาหาร', en: 'Mukdahan' },
  'Yasothon': { th: 'ยโสธร', en: 'Yasothon' },
  'Amnat Charoen': { th: 'อำนาจเจริญ', en: 'Amnat Charoen' },
  'Chaiyaphum': { th: 'ชัยภูมิ', en: 'Chaiyaphum' },
  'Maha Sarakham': { th: 'มหาสารคาม', en: 'Maha Sarakham' },
  'Loei': { th: 'เลย', en: 'Loei' },
  'Nong Khai': { th: 'หนองคาย', en: 'Nong Khai' },
  'Nong Bua Lamphu': { th: 'หนองบัวลำภู', en: 'Nong Bua Lamphu' },
  'Bueng Kan': { th: 'บึงกาฬ', en: 'Bueng Kan' },
  'Si Sa Ket': { th: 'ศรีสะเกษ', en: 'Si Sa Ket' },
  
  // ภาคกลาง (Central)
  'Ayutthaya': { th: 'พระนครศรีอยุธยา', en: 'Ayutthaya' },
  'Ang Thong': { th: 'อ่างทอง', en: 'Ang Thong' },
  'Lop Buri': { th: 'ลพบุรี', en: 'Lop Buri' },
  'Sing Buri': { th: 'สิงห์บุรี', en: 'Sing Buri' },
  'Chai Nat': { th: 'ชัยนาท', en: 'Chai Nat' },
  'Saraburi': { th: 'สระบุรี', en: 'Saraburi' },
  'Suphan Buri': { th: 'สุพรรณบุรี', en: 'Suphan Buri' },
  'Kanchanaburi': { th: 'กาญจนบุรี', en: 'Kanchanaburi' },
  'Ratchaburi': { th: 'ราชบุรี', en: 'Ratchaburi' },
  'Phetchaburi': { th: 'เพชรบุรี', en: 'Phetchaburi' },
  'Prachuap Khiri Khan': { th: 'ประจวบคีรีขันธ์', en: 'Prachuap Khiri Khan' },
  'Nakhon Nayok': { th: 'นครนายก', en: 'Nakhon Nayok' },
  'Prachin Buri': { th: 'ปราจีนบุรี', en: 'Prachin Buri' },
  'Sa Kaeo': { th: 'สระแก้ว', en: 'Sa Kaeo' },
  
  // ภาคตะวันออก (Eastern)
  'Chon Buri': { th: 'ชลบุรี', en: 'Chon Buri' },
  'Pattaya': { th: 'พัทยา', en: 'Pattaya' },
  'Rayong': { th: 'ระยอง', en: 'Rayong' },
  'Chanthaburi': { th: 'จันทบุรี', en: 'Chanthaburi' },
  'Trat': { th: 'ตราด', en: 'Trat' },
  
  // ภาคตะวันตก (Western)
  'Tak': { th: 'ตาก', en: 'Tak' },
  'Phitsanulok': { th: 'พิษณุโลก', en: 'Phitsanulok' },
  'Sukhothai': { th: 'สุโขทัย', en: 'Sukhothai' },
  'Kamphaeng Phet': { th: 'กำแพงเพชร', en: 'Kamphaeng Phet' },
  'Phichit': { th: 'พิจิตร', en: 'Phichit' },
  'Nakhon Sawan': { th: 'นครสวรรค์', en: 'Nakhon Sawan' },
  'Uthai Thani': { th: 'อุทัยธานี', en: 'Uthai Thani' },
  'Phetchabun': { th: 'เพชรบูรณ์', en: 'Phetchabun' },
  
  // ภาคใต้ (Southern)
  'Phuket': { th: 'ภูเก็ต', en: 'Phuket' },
  'Krabi': { th: 'กระบี่', en: 'Krabi' },
  'Phang Nga': { th: 'พังงา', en: 'Phang Nga' },
  'Surat Thani': { th: 'สุราษฎร์ธานี', en: 'Surat Thani' },
  'Nakhon Si Thammarat': { th: 'นครศรีธรรมราช', en: 'Nakhon Si Thammarat' },
  'Songkhla': { th: 'สงขลา', en: 'Songkhla' },
  'Pattani': { th: 'ปัตตานี', en: 'Pattani' },
  'Yala': { th: 'ยะลา', en: 'Yala' },
  'Narathiwat': { th: 'นราธิวาส', en: 'Narathiwat' },
  'Ranong': { th: 'ระนอง', en: 'Ranong' },
  'Chumphon': { th: 'ชุมพร', en: 'Chumphon' },
  'Trang': { th: 'ตรัง', en: 'Trang' },
  'Satun': { th: 'สตูล', en: 'Satun' },
  'Phatthalung': { th: 'พัทลุง', en: 'Phatthalung' },
};

/**
 * Get translated province name
 */
export const getProvinceName = (province: string, language: 'th' | 'en' = 'en'): string => {
  const translation = provinceTranslations[province];
  if (!translation) return province;
  return translation[language];
};

/**
 * Get all provinces in specified language
 */
export const getAllProvinces = (language: 'th' | 'en' = 'en'): string[] => {
  return Object.values(provinceTranslations).map(t => t[language]);
};
