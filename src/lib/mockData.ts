import { Salon, Post, Review, LogoDetail, CategoryType, HanoiDistrict } from '../types';

export const INITIAL_SALONS: Salon[] = [
  {
    id: 'salon-1',
    slug: 'aurora-hair-studio',
    name: 'Aurora Hair Atelier',
    isVerified: true,
    avatar: '/src/assets/images/salon_interior_hanoi_1791614575750.jpg',
    coverImage: '/src/assets/images/salon_interior_hanoi_1791614575750.jpg',
    address: '42 Tràng Thi, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    phone: '0912 345 678',
    openHours: '09:00 - 21:00 (Hàng ngày)',
    rating: 4.9,
    reviewsCount: 148,
    description: 'Chuyên tạo mẫu tóc Layer tự nhiên, uốn sóng lơi chuẩn Hàn và phục hồi Keratin hữu cơ. Không gian tối giản phong cách Bắc Âu giữa lòng phố cổ Hà Nội.',
    priceItems: [
      { name: 'Cắt tóc tạo kiểu Layer Nữ + Sấy phồng', price: '250.000đ', duration: '45 phút', category: 'hair_female' },
      { name: 'Uốn sóng lơi Hippie / Sóng bung Hàn Quốc', price: '750.000đ - 1.200.000đ', duration: '120 phút', category: 'hair_female' },
      { name: 'Nhuộm Nâu Lạnh / Trà Sữa không tẩy', price: '650.000đ - 950.000đ', duration: '90 phút', category: 'hair_female' },
      { name: 'Phục hồi Olaplex 3 bước chuyên sâu', price: '450.000đ', duration: '60 phút', category: 'hair_female' }
    ],
    stylists: [
      {
        id: 'stylist-1',
        name: 'Hoàng Minh (Minh Layer)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        title: 'Master Stylist · 8 năm kinh nghiệm',
        experienceYears: 8,
        salonId: 'salon-1',
        salonName: 'Aurora Hair Atelier',
        rating: 4.95,
        reviewsCount: 86,
        specialties: ['Layer Nữ sóng bung', 'Curtain Bangs', 'Uốn lơi Hàn Quốc'],
        bio: 'Từng tu nghiệp tại học viện Juno Hair Seoul. Chuyên tạo form tóc thanh thoát ôm trọn khuôn mặt.'
      },
      {
        id: 'stylist-2',
        name: 'Thu Trang (Trang Bob)',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
        title: 'Senior Stylist · 5 năm kinh nghiệm',
        experienceYears: 5,
        salonId: 'salon-1',
        salonName: 'Aurora Hair Atelier',
        rating: 4.88,
        reviewsCount: 62,
        specialties: ['Tóc ngắn Bob Nhật', 'Balayage highlight', 'Phục hồi tóc nát'],
        bio: 'Đam mê những đường kéo chuẩn xác và màu nhuộm tone ấm tôn da châu Á.'
      }
    ],
    latitude: 21.0268,
    longitude: 105.8492,
    distanceKm: 0.8,
    proPlanActive: true
  },
  {
    id: 'salon-2',
    slug: 'the-hanoi-barber-club',
    name: 'The Hanoi Barber Club',
    isVerified: true,
    avatar: '/src/assets/images/hair_crop_man_1791614553705.jpg',
    coverImage: '/src/assets/images/hair_crop_man_1791614553705.jpg',
    address: '18 Hàng Mành, Hoàn Kiếm, Hà Nội',
    district: 'Hoàn Kiếm',
    phone: '0988 765 432',
    openHours: '09:30 - 20:30',
    rating: 4.92,
    reviewsCount: 215,
    description: 'Tiệm cắt tóc nam cổ điển kết hợp xu hướng Textured Crop, Side Part, Ivy League hiện đại. Cạo mặt khăn nóng truyền thống.',
    priceItems: [
      { name: 'Combo Cắt tóc + Gội massage + Cạo mặt khăn nóng', price: '180.000đ', duration: '40 phút', category: 'hair_male' },
      { name: 'Uốn Texture Hàn Quốc / Uốn phồng chân tóc Side Part', price: '380.000đ', duration: '75 phút', category: 'hair_male' },
      { name: 'Tẩy + Nhuộm xám khói / Nâu khói nam', price: '450.000đ - 700.000đ', duration: '90 phút', category: 'hair_male' },
      { name: 'Ép side tóc mai vào nếp (Down Perm)', price: '150.000đ', duration: '30 phút', category: 'hair_male' }
    ],
    stylists: [
      {
        id: 'stylist-3',
        name: 'Trần Vũ (Vũ Barber)',
        avatar: '/src/assets/images/hair_crop_man_1791614553705.jpg',
        title: 'Lead Barber · 7 năm kinh nghiệm',
        experienceYears: 7,
        salonId: 'salon-2',
        salonName: 'The Hanoi Barber Club',
        rating: 4.96,
        reviewsCount: 130,
        specialties: ['Textured Crop', 'Low Fade / Mid Fade', 'Uốn Down Perm'],
        bio: 'Kỹ thuật fade sắc nét từng milimet. Đảm bảo form tóc giữ nếp dễ sấy tại nhà.'
      }
    ],
    latitude: 21.0335,
    longitude: 105.8488,
    distanceKm: 1.1,
    proPlanActive: true
  },
  {
    id: 'salon-3',
    slug: 'luna-nail-art-boutique',
    name: 'Luna & Co Nail Studio',
    isVerified: true,
    avatar: '/src/assets/images/nail_art_jelly_1791614565032.jpg',
    coverImage: '/src/assets/images/nail_art_jelly_1791614565032.jpg',
    address: '86 Mai Hắc Đế, Hai Bà Trưng, Hà Nội',
    district: 'Hai Bà Trưng',
    phone: '0904 112 233',
    openHours: '09:00 - 20:00',
    rating: 4.88,
    reviewsCount: 97,
    description: 'Chuyên móng thạch Syrup Hàn Quốc, đính xà cừ ngọc trai tinh tế và vẽ cọ tỉ mỉ. Sử dụng sơn hữu cơ an toàn cho móng thật.',
    priceItems: [
      { name: 'Sơn gel thạch Syrup Ombre + Dưỡng móng tế bào gốc', price: '220.000đ', duration: '50 phút', category: 'nail' },
      { name: 'Bộ móng thiết kế cao cấp (Đính đá, charm ngọc trai, ẩn xà cừ)', price: '380.000đ - 650.000đ', duration: '80 phút', category: 'nail' },
      { name: 'Nối móng úp dẻo Hàn Quốc không hại phom', price: '180.000đ', duration: '40 phút', category: 'nail' },
      { name: 'Chăm sóc móng Nga (Combi Manicure không đau)', price: '120.000đ', duration: '30 phút', category: 'nail' }
    ],
    stylists: [
      {
        id: 'stylist-4',
        name: 'Ngọc Lan (Lan Nail)',
        avatar: '/src/assets/images/nail_art_jelly_1791614565032.jpg',
        title: 'Master Nail Artist · 6 năm kinh nghiệm',
        experienceYears: 6,
        salonId: 'salon-3',
        salonName: 'Luna & Co Nail Studio',
        rating: 4.9,
        reviewsCount: 78,
        specialties: ['Nail thạch Hàn Quốc', 'Vẽ vân đá cẩm thạch', 'Móng cô dâu'],
        bio: 'Tỉ mỉ từng lớp sơn mỏng mọng nước, bền trên 4 tuần không bong tróc.'
      }
    ],
    latitude: 21.0125,
    longitude: 105.8510,
    distanceKm: 1.8,
    proPlanActive: true
  },
  {
    id: 'salon-4',
    slug: 'k-concept-hair-cau-giay',
    name: 'K-Concept Hair Lab',
    isVerified: true,
    avatar: '/src/assets/images/salon_interior_hanoi_1791614575750.jpg',
    coverImage: '/src/assets/images/salon_interior_hanoi_1791614575750.jpg',
    address: '158 Cầu Giấy, Cầu Giấy, Hà Nội',
    district: 'Cầu Giấy',
    phone: '0977 445 566',
    openHours: '08:30 - 21:30',
    rating: 4.85,
    reviewsCount: 164,
    description: 'Điểm đến làm tóc quen thuộc của sinh viên và giới trẻ Cầu Giấy. Chuyên màu nhuộm không tẩy, tóc layer tầng lỡ tôn góc nghiêng.',
    priceItems: [
      { name: 'Cắt Layer nữ sấy cụp tự nhiên', price: '180.000đ', duration: '40 phút', category: 'hair_female' },
      { name: 'Nhuộm Nâu Trà Đen / Hạt Dẻ không rát da đầu', price: '450.000đ - 650.000đ', duration: '90 phút', category: 'hair_female' },
      { name: 'Uốn phồng chân tóc không nhiệt', price: '250.000đ', duration: '45 phút', category: 'hair_female' }
    ],
    stylists: [
      {
        id: 'stylist-5',
        name: 'Quân Lee',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        title: 'Stylist · 4 năm kinh nghiệm',
        experienceYears: 4,
        salonId: 'salon-4',
        salonName: 'K-Concept Hair Lab',
        rating: 4.86,
        reviewsCount: 95,
        specialties: ['Layer lỡ', 'Màu nhuộm học sinh - sinh viên'],
        bio: 'Tư vấn nhiệt tình, phù hợp với phong cách học tập và công sở thường ngày.'
      }
    ],
    latitude: 21.0348,
    longitude: 105.7952,
    distanceKm: 4.2,
    proPlanActive: false
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    title: 'Tóc Layer Nữ Sóng Lơi Tự Nhiên & Mái Bay Hàn Quốc',
    caption: 'Mẫu tóc Layer tầng dài kết hợp uốn sóng lơi nhẹ nhàng giúp khuôn mặt thanh thoát hơn. Cực kỳ dễ sấy khô tại nhà chỉ với kẹp càng cua! Form tóc giữ nếp từ 5-7 tháng.',
    images: ['/src/assets/images/hair_layer_woman_1791614539000.jpg'],
    category: 'hair_female',
    styleName: 'Layer Sóng Lơi + Mái Bay',
    tags: ['layerhuynhduong', 'tocnu', 'uonsongloi', 'toclayerhanoi', 'maibay'],
    salonId: 'salon-1',
    salonName: 'Aurora Hair Atelier',
    salonDistrict: 'Hoàn Kiếm',
    salonAddress: '42 Tràng Thi, Hoàn Kiếm, Hà Nội',
    stylistId: 'stylist-1',
    stylistName: 'Hoàng Minh (Minh Layer)',
    priceEstimate: '850.000đ - 1.150.000đ',
    priceFrom: 850000,
    likesCount: 342,
    savesCount: 189,
    createdAt: 'Hôm nay · 10:15',
    authorName: 'Aurora Hair Atelier',
    authorAvatar: '/src/assets/images/salon_interior_hanoi_1791614575750.jpg',
    authorType: 'salon',
    isVerifiedSalon: true,
    commentsCount: 28
  },
  {
    id: 'post-2',
    title: 'Textured Crop Nam Taper Fade Sắc Nét',
    caption: 'Kiểu tóc Textured Crop với phần mái tỉa so le tạo chiều sâu, hai bên mai taper fade mượt mà. Phù hợp các bạn nam thích phong cách gọn gàng, nam tính và năng động.',
    images: ['/src/assets/images/hair_crop_man_1791614553705.jpg'],
    category: 'hair_male',
    styleName: 'Textured Crop + Taper Fade',
    tags: ['tocnamdep', 'texturedcrop', 'barberhanoi', 'taperfade', 'hairstylenam'],
    salonId: 'salon-2',
    salonName: 'The Hanoi Barber Club',
    salonDistrict: 'Hoàn Kiếm',
    salonAddress: '18 Hàng Mành, Hoàn Kiếm, Hà Nội',
    stylistId: 'stylist-3',
    stylistName: 'Trần Vũ (Vũ Barber)',
    priceEstimate: '180.000đ - 350.000đ',
    priceFrom: 180000,
    likesCount: 420,
    savesCount: 245,
    createdAt: 'Hôm qua · 16:30',
    authorName: 'The Hanoi Barber Club',
    authorAvatar: '/src/assets/images/hair_crop_man_1791614553705.jpg',
    authorType: 'salon',
    isVerifiedSalon: true,
    commentsCount: 34
  },
  {
    id: 'post-3',
    title: 'Mẫu Nail Thạch Syrup Blush Hồng Đào Nhũ Ngọc Trai',
    caption: 'Tone thạch syrup trong veo tựa cánh hoa đào mùa xuân, đính vảy nhũ ngọc trai và xà cừ chìm mỏng. Tôn da tay trắng ngần, thanh lịch đi làm hay đi tiệc cưới đều đẹp xuất sắc.',
    images: ['/src/assets/images/nail_art_jelly_1791614565032.jpg'],
    category: 'nail',
    styleName: 'Nail Thạch Syrup + Nhũ Ngọc Trai',
    tags: ['nailart', 'nailthach', 'syrupnails', 'nailhanoi', 'mongdep'],
    salonId: 'salon-3',
    salonName: 'Luna & Co Nail Studio',
    salonDistrict: 'Hai Bà Trưng',
    salonAddress: '86 Mai Hắc Đế, Hai Bà Trưng, Hà Nội',
    stylistId: 'stylist-4',
    stylistName: 'Ngọc Lan (Lan Nail)',
    priceEstimate: '320.000đ - 450.000đ',
    priceFrom: 320000,
    likesCount: 512,
    savesCount: 310,
    createdAt: '2 ngày trước',
    authorName: 'Luna & Co Nail Studio',
    authorAvatar: '/src/assets/images/nail_art_jelly_1791614565032.jpg',
    authorType: 'salon',
    isVerifiedSalon: true,
    commentsCount: 41
  },
  {
    id: 'post-4',
    title: 'Không Gian & Trải Nghiệm Thư Giãn Tại Studio Tràng Thi',
    caption: 'Một buổi chiều chăm sóc tóc nhẹ nhàng cùng tách trà hoa cúc và giai điệu lo-fi êm dịu. Mỗi chiếc ghế tại Aurora đều có khoảng cách riêng tư để bạn tận hưởng trọn vẹn diện mạo mới.',
    images: ['/src/assets/images/salon_interior_hanoi_1791614575750.jpg'],
    category: 'hair_female',
    styleName: 'Trải Nghiệm Dịch Vụ Salon',
    tags: ['khonggiansalon', 'hanoisalon', 'aurorahair', 'chillhanoi'],
    salonId: 'salon-1',
    salonName: 'Aurora Hair Atelier',
    salonDistrict: 'Hoàn Kiếm',
    salonAddress: '42 Tràng Thi, Hoàn Kiếm, Hà Nội',
    priceEstimate: '250.000đ - 1.200.000đ',
    priceFrom: 250000,
    likesCount: 215,
    savesCount: 98,
    createdAt: '3 ngày trước',
    authorName: 'Aurora Hair Atelier',
    authorAvatar: '/src/assets/images/salon_interior_hanoi_1791614575750.jpg',
    authorType: 'salon',
    isVerifiedSalon: true,
    commentsCount: 12
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    salonId: 'salon-1',
    customerName: 'Nguyễn Phương Thảo',
    customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    content: 'Cầm ảnh trên toidep.net đến bảo anh Minh làm y hệt, công nhận tay nghề chuẩn dã man! Tóc sóng lơi mềm mượt không bị xơ, salon thơm mùi tinh dầu gỗ.',
    styleDone: 'Layer Sóng Lơi + Mái Bay',
    stylistName: 'Hoàng Minh (Minh Layer)',
    date: '08/10/2026',
    isVerifiedStay: true
  },
  {
    id: 'rev-2',
    salonId: 'salon-2',
    customerName: 'Lê Tuấn Anh',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    content: 'Đặt lịch qua nút Làm kiểu này cực nhanh, đến đúng giờ được vào cắt ngay không phải đợi. Vũ fade rất khéo, cạo mặt khăn nóng phê lòi.',
    styleDone: 'Textured Crop + Taper Fade',
    stylistName: 'Trần Vũ (Vũ Barber)',
    date: '07/10/2026',
    isVerifiedStay: true
  },
  {
    id: 'rev-3',
    salonId: 'salon-3',
    customerName: 'Đặng Mai Chi',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    content: 'Màu thạch syrup lên tay siêu xinh, lớp bóng mọng nước đúng như ảnh lookbook. Chị Lan làm kỹ từng phom móng.',
    styleDone: 'Nail Thạch Syrup + Nhũ Ngọc Trai',
    stylistName: 'Ngọc Lan (Lan Nail)',
    date: '05/10/2026',
    isVerifiedStay: true
  }
];

export const LOGO_DIRECTIONS: LogoDetail[] = [
  {
    id: 'A',
    name: 'A · Dấu chấm đẹp',
    concept: 'Wordmark chữ thường với dấu nặng cách điệu',
    meaning: '"toidep" viết thường, dấu nặng dưới chữ e thành chấm màu nhấn hồng đất (#E4576E) — đọc ra ngay chữ "đẹp", tôn vinh ngôn ngữ tiếng Việt.',
    strength: 'Đơn giản, hiện đại, dễ nhớ, người Việt nhận diện ngay; chấm hồng dùng lại được làm điểm nhấn nhận diện toàn bộ UI.',
    weakness: 'Dạng wordmark ngang không đủ cô đọng khi thu nhỏ xuống icon app 32px.',
    suitableRole: 'Logo chữ chính thức (Primary Wordmark cho Header, Website banner, Giấy tờ, Marketing)'
  },
  {
    id: 'C',
    name: 'C · Khung ảnh có địa chỉ',
    concept: 'Khung bài đăng 4:5 bo góc mềm chứa ghim vị trí (Pin)',
    meaning: 'Nói chuẩn xác định vị "ảnh đẹp có địa chỉ" — mỗi bức ảnh lookbook gắn liền với salon và thợ cụ thể.',
    strength: 'Khác biệt sản phẩm cao; trung tính giới (phù hợp cả khách nữ và khách nam cắt tóc); cực rõ ràng ở kích thước nhỏ.',
    weakness: 'Cần bo góc mềm và màu hồng đất ấm để tránh cảm giác công cụ khô cứng.',
    suitableRole: 'Icon App chính thức / Favicon 16-32px / Avatar nhận diện (ĐỀ XUẤT KẾT HỢP CÙNG A)'
  },
  {
    id: 'B',
    name: 'B · Vương miện chữ ô',
    concept: 'Dấu mũ của "tôi" cách điệu thành vương miện nhỏ',
    meaning: 'Thông điệp "Tôi là nữ hoàng" - tự tin tỏa sáng với diện mạo mới.',
    strength: 'Cảm xúc kiêu hãnh, nữ tính, rất hợp tệp khách hàng nữ trẻ.',
    weakness: 'Vương miện là biểu tượng quá phổ biến trong ngành spa/thẩm mỹ; khó khác biệt và ít phù hợp khách nam cắt tóc.',
    suitableRole: 'Ý tưởng phụ (Campaign dành riêng cho phái đẹp)'
  },
  {
    id: 'D',
    name: 'D · Lọn tóc chữ t',
    concept: 'Nét ngang chữ t uốn lượn như lọn tóc gợn sóng',
    meaning: 'Mềm mại, chuyển động uyển chuyển, tôn vinh nghệ thuật tạo kiểu tóc.',
    strength: 'Hình ảnh mềm mại, thẩm mỹ cao, phù hợp chuyển động micro-animation.',
    weakness: 'Buộc chặt với ngành tóc — khi mở rộng sang nail, makeup hay thời trang sẽ bị hẹp nhận diện.',
    suitableRole: 'Ý tưởng chuyên biệt salon tóc'
  },
  {
    id: 'E',
    name: 'E · Gương cầm tay',
    concept: 'Gương soi viền mạ vàng chứa chữ đ bên trong',
    meaning: '"Soi thấy mình đẹp" - khoảnh khắc ngắm nhìn mình trong gương salon sau khi hoàn thiện dịch vụ.',
    strength: 'Hình dáng thân thuộc, chữ đ mang dấu ấn tiếng Việt đặc trưng.',
    weakness: 'Gương cầm tay là hình ảnh rất quen thuộc của các tiệm spa/nail truyền thống, dễ bị trùng lặp.',
    suitableRole: 'Ý tưởng phụ'
  }
];
