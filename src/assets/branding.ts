/**
 * toidep.net - Official Brand System V2.0 (Dựng trên lưới)
 * "NƠI BẠN ĐƯỢC LẤY NÉT"
 */

export const BRAND_COLORS = {
  // 03 · MÀU CHÍNH THỨC V2.0
  pink: '#E4576E', // Hồng Góc Đẹp (RGB 228, 87, 110) - Chỉ cho dấu mũ / dấu sắc và điểm nhấn
  charcoal: '#1F1A1C', // Than (RGB 31, 26, 28) - Chữ, icon, nền tối
  paper: '#F6F5F1', // Giấy (RGB 246, 245, 241) - Nền sáng thay cho trắng tinh
  white: '#FFFFFF',
  
  // Tương phản chuẩn
  contrastPinkWhite: '3.6:1',
  contrastPinkCharcoal: '4.8:1',
};

export const BRAND_TAGLINE = 'NƠI BẠN ĐƯỢC LẤY NÉT';
export const BRAND_SUBTITLE = 'Mạng xã hội ảnh làm đẹp, có địa chỉ';
export const BRAND_DOMAIN = 'toidep.net';

export interface KeyvisualItem {
  id: 'hero' | 'toc' | 'mong' | 'moi' | 'story' | 'splash';
  name: string;
  headline: string;
  tagline: string;
  theme: 'charcoal' | 'pink' | 'paper';
  aspect: string;
  description: string;
  salonDistrict: string;
  salonName: string;
  priceFrom: string;
}

export const OFFICIAL_KEYVISUALS: KeyvisualItem[] = [
  {
    id: 'hero',
    name: 'KV Master Hero (1920x1080)',
    headline: 'tôiđẹp',
    tagline: 'NƠI BẠN ĐƯỢC LẤY NÉT',
    theme: 'charcoal',
    aspect: '16:9',
    description: 'Keyvisual chủ đạo toàn sàn: Khung ngắm máy ảnh tập trung vào bạn, góc trên phải màu hồng góc đẹp.',
    salonDistrict: 'Toàn Hà Nội',
    salonName: 'toidep.net Platform',
    priceFrom: 'Từ 180.000đ'
  },
  {
    id: 'toc',
    name: 'KV Tóc Đẹp (1080x1350)',
    headline: 'tóc đẹp',
    tagline: 'NƠI BẠN ĐƯỢC LẤY NÉT',
    theme: 'charcoal',
    aspect: '4:5',
    description: 'Nền Than #1F1A1C · Dấu sắc màu hồng góc đẹp #E4576E · Layer, sóng lơi, uốn lơi, fade nam tính.',
    salonDistrict: 'Hoàn Kiếm, Hà Nội',
    salonName: 'Aurora Hair Atelier',
    priceFrom: 'Từ 250.000đ'
  },
  {
    id: 'mong',
    name: 'KV Móng Đẹp (1080x1350)',
    headline: 'móng đẹp',
    tagline: 'NƠI BẠN ĐƯỢC LẤY NÉT',
    theme: 'pink',
    aspect: '4:5',
    description: 'Nền Hồng Góc Đẹp #E4576E · Chữ trắng, dấu sắc màu than #1F1A1C · Thạch syrup, nhũ ngọc trai.',
    salonDistrict: 'Hai Bà Trưng, Hà Nội',
    salonName: 'Luna & Co Nail Studio',
    priceFrom: 'Từ 220.000đ'
  },
  {
    id: 'moi',
    name: 'KV Môi Đẹp (1080x1350)',
    headline: 'môi đẹp',
    tagline: 'NƠI BẠN ĐƯỢC LẤY NÉT',
    theme: 'paper',
    aspect: '4:5',
    description: 'Nền Giấy #F6F5F1 · Chữ than #1F1A1C, dấu mũ màu hồng #E4576E · Soft glam, makeup tiệc, môi hồng đất.',
    salonDistrict: 'Ba Đình, Hà Nội',
    salonName: 'Belle Atelier Makeup',
    priceFrom: 'Từ 450.000đ'
  },
  {
    id: 'story',
    name: 'KV Story Dọc (1080x1920)',
    headline: 'tôi / đẹp',
    tagline: 'NƠI BẠN ĐƯỢC LẤY NÉT',
    theme: 'charcoal',
    aspect: '9:16',
    description: 'Story mobile 9:16 với nút CTA: "Đăng ảnh đẹp đầu tiên của bạn".',
    salonDistrict: 'Mobile Experience',
    salonName: 'toidep.net Mobile',
    priceFrom: 'Miễn phí'
  },
  {
    id: 'splash',
    name: 'KV App Splash (1170x2532)',
    headline: '[ o ] tôiđẹp',
    tagline: 'NƠI BẠN ĐƯỢC LẤY NÉT',
    theme: 'charcoal',
    aspect: '9:19.5',
    description: 'Khung ngắm lấy nét tâm chữ o, biểu tượng chính thức của ứng dụng di động.',
    salonDistrict: 'iOS & Android Splash',
    salonName: 'toidep App',
    priceFrom: 'v2.0'
  }
];

export interface KeyvisualPillar {
  id: 'toc' | 'mong' | 'moi';
  title: string;
  tagline: string;
  subtitle: string;
  badge: string;
  image: string;
  styleName: string;
  salonName: string;
  salonDistrict: string;
  priceFrom: string;
  description: string;
}

export const KEYVISUAL_PILLARS: KeyvisualPillar[] = [
  {
    id: 'toc',
    title: 'Tóc Đẹp Có Địa Chỉ',
    tagline: 'Mỗi đường kéo là một tuyên ngôn phong cách',
    subtitle: 'Layer bay bổng, uốn sóng lơi Hàn Quốc, Textured Crop nam tính',
    badge: 'Pillar 01 · Tóc Đẹp',
    image: '/src/assets/images/hair_layer_woman_1791614539000.jpg',
    styleName: 'Layer Sóng Lơi + Mái Bay',
    salonName: 'Aurora Hair Atelier',
    salonDistrict: 'Hoàn Kiếm, Hà Nội',
    priceFrom: '250.000đ',
    description: 'Brief mẫu cho salon: Giữ nguyên form sóng bung tự nhiên, ôm trọn gương mặt thanh tú, sấy khô nhẹ tại nhà vẫn vào nếp.'
  },
  {
    id: 'mong',
    title: 'Móng Đẹp Có Địa Chỉ',
    tagline: 'Nghệ thuật thu nhỏ trên đầu ngón tay',
    subtitle: 'Thạch syrup trong veo, nhũ ngọc trai, đính xà cừ & vẽ cọ tỉ mỉ',
    badge: 'Pillar 02 · Móng Đẹp',
    image: '/src/assets/images/nail_art_jelly_1791614565032.jpg',
    styleName: 'Nail Thạch Syrup + Nhũ Ngọc Trai',
    salonName: 'Luna & Co Nail Studio',
    salonDistrict: 'Hai Bà Trưng, Hà Nội',
    priceFrom: '220.000đ',
    description: 'Chăm sóc móng chuẩn Nga, lớp sơn gel thạch mọng nước bóng gương giữ độ bền trên 4 tuần không hại móng thật.'
  },
  {
    id: 'moi',
    title: 'Môi & Makeup Đẹp Có Địa Chỉ',
    tagline: 'Sắc thái tôn vinh thần thái tự nhiên',
    subtitle: 'Phun môi collagen hoa hồng, soft glam đi tiệc, makeup cô dâu',
    badge: 'Pillar 03 · Môi Đẹp',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    styleName: 'Soft Glam Makeup & Môi Hồng Đất',
    salonName: 'Belle Atelier Makeup',
    salonDistrict: 'Ba Đình, Hà Nội',
    priceFrom: '450.000đ',
    description: 'Lớp nền trong suốt glass-skin và màu môi hồng đất tiệp màu son signature toidep.net, rạng rỡ suốt 12 giờ.'
  }
];

export const BRAND_GRID_SPECS = {
  gridBase: '1m = chiều cao x ÷ 12. Nét dấu = 2m. Mọi đường ngang và khoảng chữ là bội số của m.',
  levels: [
    { level: '18m', label: 'Đỉnh dấu mũ (Hồng #E4576E)' },
    { level: '17m', label: 'Chữ cao (đ)' },
    { level: '15m', label: 'Đỉnh t = thanh i = gạch đ' },
    { level: '13m', label: 'Chân thanh / chân dấu mũ' },
    { level: '12m', label: 'Chiều cao x (thân chữ)' },
    { level: '0', label: 'Đường chân chữ (Baseline)' },
    { level: '-1m', label: 'Đỉnh dấu nặng' },
    { level: '-3m', label: 'Chân dấu nặng (nét gạch ngang rộng 6m = 1/2 chiều cao x)' },
    { level: '-5m', label: 'Chân chữ p' }
  ],
  dontRules: [
    'Không gõ lại bằng font có sẵn (chữ đã được chuyển nét và chỉnh tỉ mỉ theo lưới)',
    'Không đặt icon cạnh chữ (Logo chữ đứng độc lập)',
    'Không đổi màu dấu mũ sang màu khác',
    'Không kéo giãn, làm méo tỷ lệ chữ'
  ]
};
