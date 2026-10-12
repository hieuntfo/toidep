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
    proPlanActive: true,
    isVip: true,
    vipTier: 'vip_diamond',
    vipBadgeText: 'VIP Kim Cương ⭐ toidep.net',
    servicesProvided: ['hair_female']
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
    proPlanActive: true,
    isVip: true,
    vipTier: 'vip_gold',
    vipBadgeText: 'VIP Vàng ⭐ Đối Tác Uy Tín',
    servicesProvided: ['hair_male']
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
    proPlanActive: true,
    isVip: true,
    vipTier: 'vip_diamond',
    vipBadgeText: 'VIP Kim Cương ⭐ toidep.net',
    servicesProvided: ['nail']
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
    proPlanActive: true,
    isVip: false,
    vipTier: 'pro',
    vipBadgeText: 'Salon Pro',
    servicesProvided: ['hair_female']
  },
  {
    id: 'salon-5',
    slug: 'rose-de-paris-makeup-bridal',
    name: 'Rose de Paris Bridal & Makeup Studio',
    isVerified: true,
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    address: '68 Kim Mã, Ba Đình, Hà Nội',
    district: 'Ba Đình',
    phone: '0915 888 666',
    openHours: '08:00 - 20:30',
    rating: 4.97,
    reviewsCount: 182,
    description: 'Chuyên trang điểm cô dâu tone trong trẻo Hàn Quốc, makeup dự tiệc và kỷ yếu tôn đường nét tự nhiên. Mỹ phẩm chính hãng cao cấp.',
    priceItems: [
      { name: 'Makeup Dự Tiệc Nâng Cao + Làm Tóc Sang Trọng', price: '450.000đ', duration: '60 phút', category: 'makeup' },
      { name: 'Makeup Cô Dâu Ngày Cưới Tone Tự Nhiên & Dặm Phấn', price: '1.200.000đ - 2.500.000đ', duration: '90 phút', category: 'makeup' },
      { name: 'Makeup Chụp Ảnh Lookbook / Kỷ Yếu', price: '350.000đ', duration: '45 phút', category: 'makeup' }
    ],
    stylists: [
      {
        id: 'stylist-6',
        name: 'Hải Yến (Rose Makeup)',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        title: 'Senior MUA · 9 năm kinh nghiệm',
        experienceYears: 9,
        salonId: 'salon-5',
        salonName: 'Rose de Paris Bridal & Makeup Studio',
        rating: 4.98,
        reviewsCount: 145,
        specialties: ['Makeup sương mai Hàn Quốc', 'Kẻ mắt tự nhiên', 'Tạo khối thon gọn'],
        bio: 'Đạt giải Cọ Vàng Makeup Artist 2024. Chuyên nền mỏng mịn căng bóng bền màu cả ngày.'
      }
    ],
    latitude: 21.0320,
    longitude: 105.8285,
    distanceKm: 2.3,
    proPlanActive: true,
    isVip: true,
    vipTier: 'vip_diamond',
    vipBadgeText: 'VIP Kim Cương ⭐ toidep.net',
    servicesProvided: ['makeup']
  },
  {
    id: 'salon-6',
    slug: 'an-yen-duong-sinh-spa',
    name: 'An Yên Dưỡng Sinh & Spa Thảo Dược',
    isVerified: true,
    avatar: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    address: '112 Chùa Bộc, Đống Đa, Hà Nội',
    district: 'Đống Đa',
    phone: '0963 222 111',
    openHours: '09:00 - 22:00',
    rating: 4.93,
    reviewsCount: 204,
    description: 'Gội đầu dưỡng sinh Trung Hoa cổ truyền, đả thông kinh lạc vai gáy với nước lá thảo mộc đun sôi tại chỗ và xông ngải cứu thư giãn sâu.',
    priceItems: [
      { name: 'Combo Gội Đầu Dưỡng Sinh Thảo Dược 60 phút', price: '199.000đ', duration: '60 phút', category: 'spa_skincare' },
      { name: 'Liệu trình Trị Liệu Cổ Vai Gáy Chuyên Sâu + Đắp Bùn Cứu', price: '350.000đ', duration: '75 phút', category: 'spa_skincare' },
      { name: 'Chăm sóc da mặt chuẩn Y Khoa cấp ẩm tầng sâu', price: '280.000đ', duration: '60 phút', category: 'spa_skincare' }
    ],
    stylists: [
      {
        id: 'stylist-7',
        name: 'Trang Thu',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        title: 'Chuyên viên Dưỡng Sinh · 5 năm kinh nghiệm',
        experienceYears: 5,
        salonId: 'salon-6',
        salonName: 'An Yên Dưỡng Sinh & Spa Thảo Dược',
        rating: 4.94,
        reviewsCount: 168,
        specialties: ['Bấm huyệt đầu vai gáy', 'Gội đầu dưỡng sinh', 'Thải độc da'],
        bio: 'Đôi tay mềm mại, lực bấm chuẩn huyệt đạo giúp giải tỏa căng thẳng triệt để sau giờ làm việc.'
      }
    ],
    latitude: 21.0090,
    longitude: 105.8280,
    distanceKm: 2.9,
    proPlanActive: true,
    isVip: true,
    vipTier: 'vip_gold',
    vipBadgeText: 'VIP Vàng ⭐ Đối Tác Uy Tín',
    servicesProvided: ['spa_skincare']
  },
  {
    id: 'salon-7',
    slug: 'maison-westlake-hair-day-spa',
    name: 'Maison Westlake Hair & Day Spa',
    isVerified: true,
    avatar: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    address: '28 Quảng An, Tây Hồ, Hà Nội',
    district: 'Tây Hồ',
    phone: '0903 456 789',
    openHours: '09:00 - 21:00',
    rating: 4.96,
    reviewsCount: 175,
    description: 'Không gian làm đẹp cao cấp view Hồ Tây lộng gió. Kết hợp dịch vụ tóc chuẩn salon Paris và spa thư giãn cho khách hàng và người nước ngoài.',
    priceItems: [
      { name: 'Cắt tóc tạo kiểu chuyên gia Stylist Pháp & Sấy kiểu', price: '450.000đ', duration: '60 phút', category: 'hair_female' },
      { name: 'Nhuộm Balayage Ombre Chuẩn Tone Tây Cao Cấp', price: '1.500.000đ - 2.800.000đ', duration: '180 phút', category: 'hair_female' },
      { name: 'Liệu trình Phục Hồi Tóc & Da Đầu Thải Độc Organics', price: '650.000đ', duration: '75 phút', category: 'spa_skincare' }
    ],
    stylists: [
      {
        id: 'stylist-8',
        name: 'Alexandre Vũ',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        title: 'Creative Art Director · 12 năm kinh nghiệm',
        experienceYears: 12,
        salonId: 'salon-7',
        salonName: 'Maison Westlake Hair & Day Spa',
        rating: 4.99,
        reviewsCount: 132,
        specialties: ['Balayage & Babylights', 'Tóc ngắn cá tính', 'Chăm sóc da đầu'],
        bio: 'Từng làm việc tại Paris và Tokyo Fashion Week. Tỉ mỉ và cầu toàn trong từng chi tiết tạo mẫu.'
      }
    ],
    latitude: 21.0610,
    longitude: 105.8270,
    distanceKm: 4.1,
    proPlanActive: true,
    isVip: true,
    vipTier: 'vip_diamond',
    vipBadgeText: 'VIP Kim Cương ⭐ toidep.net',
    servicesProvided: ['hair_female', 'spa_skincare']
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

// Initial Users System
import { UserProfile, Article } from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@toidep.net',
    fullName: 'Ban Quản Trị toidep.net',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    phone: '0900 888 999',
    role: 'admin',
    proStatus: 'none',
    registeredAt: '01/01/2026',
    authProvider: 'email',
    bio: 'Quản trị viên toàn hệ thống nền tảng toidep.net'
  },
  {
    id: 'usr-pro-1',
    email: 'aurora.salon@gmail.com',
    fullName: 'Hoàng Minh (Aurora Hair)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    phone: '0912 345 678',
    role: 'salon_pro',
    proStatus: 'approved',
    salonId: 'salon-1',
    registeredAt: '15/02/2026',
    authProvider: 'google',
    bio: 'Chủ sáng lập Aurora Hair Atelier Hà Nội. Master Stylist đào tạo tại Seoul.',
    address: '42 Tràng Thi, Hoàn Kiếm, Hà Nội'
  },
  {
    id: 'usr-pro-pending',
    email: 'hairsoul.hanoi@gmail.com',
    fullName: 'Vũ Tuấn Kiệt (Hair Soul Studio)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    phone: '0977 112 334',
    role: 'salon_pro',
    proStatus: 'pending',
    salonId: '',
    registeredAt: '09/10/2026',
    authProvider: 'email',
    bio: 'Đã nộp hồ sơ nâng cấp Salon Pro 8 ghế tại 120 Cầu Giấy. Chờ Admin phê duyệt.',
    address: '120 Cầu Giấy, Hà Nội'
  },
  {
    id: 'usr-customer-1',
    email: 'phuongthao.beauty@gmail.com',
    fullName: 'Phương Thảo',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    phone: '0912 345 678',
    role: 'customer',
    proStatus: 'none',
    registeredAt: '20/03/2026',
    authProvider: 'google',
    bio: 'Hà Nội · Đam mê các kiểu tóc layer tự nhiên & nail thạch syrup nhẹ nhàng'
  },
  {
    id: 'usr-customer-2',
    email: 'lequangminh.creative@gmail.com',
    fullName: 'Lê Quang Minh',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    phone: '0963 888 777',
    role: 'customer',
    proStatus: 'none',
    registeredAt: '05/04/2026',
    authProvider: 'facebook',
    bio: 'Graphic Designer · Ưa thích kiểu tóc Textured Crop hiện đại'
  }
];

// Initial Curated Longform Editorial Articles
export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    slug: 'xu-huong-toc-layer-song-loi-ha-noi-2026',
    title: 'Bản Tuyên Ngôn Của Sự Tự Nhiên: Vì Sao Tóc Layer Sóng Lơi Trở Thành Biểu Tượng Của Phụ Nữ Hà Nội 2026?',
    subtitle: 'Không còn những lọn xoăn đóng khuôn nặng nề, layer sóng lơi kết hợp mái bay (Curtain Bangs) tạo nên độ bồng bềnh sống động theo từng nhịp bước chân giữa tiết thu Hà Nội.',
    category: 'hair_trends',
    categoryLabel: 'Xu Hướng Tóc',
    coverImage: '/src/assets/images/hair_layer_woman_1791614539000.jpg',
    readTime: '6 phút đọc',
    author: {
      name: 'Diệu Linh',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      title: 'Senior Beauty Editor · toidep.net'
    },
    publishedAt: '10/10/2026',
    status: 'published',
    isFeatured: true,
    viewsCount: 3840,
    likesCount: 512,
    relatedSalonId: 'salon-1',
    relatedSalonName: 'Aurora Hair Atelier',
    relatedPostId: 'post-1',
    tags: ['Layer Nữ', 'Sóng Lơi', 'Curtain Bangs', 'Aurora Hair', 'Xu Hướng 2026'],
    sections: [
      {
        id: 'sec-1',
        type: 'paragraph',
        content: 'Những năm gần đây, quan niệm về cái đẹp của phụ nữ hiện đại tại các đô thị lớn như Hà Nội và Sài Gòn đã trải qua một sự chuyển dịch tinh tế nhưng sâu sắc: từ việc phô trương sự cầu kỳ sang tìm kiếm sự tối giản tinh tế (Effortless Chic). Thay vì những lọn xoăn tít dập khuôn hay mái tóc thẳng đơ xơ cứng, tóc layer sóng lơi nổi lên như câu trả lời hoàn mỹ nhất cho mong muốn sở hữu một diện mạo thanh thoát, bay bổng.'
      },
      {
        id: 'sec-2',
        type: 'pullquote',
        content: 'Vẻ đẹp đỉnh cao nhất trong tạo mẫu tóc hiện đại là khi bạn bước ra khỏi salon, mái tóc trông tự nhiên và nhẹ bẫng như thể bạn vốn dĩ sinh ra đã có một dòng suối tóc mềm mại như thế.',
        caption: 'Master Stylist Hoàng Minh · Aurora Hair Atelier'
      },
      {
        id: 'sec-3',
        type: 'image_break',
        imageUrl: '/src/assets/images/hair_layer_woman_1791614539000.jpg',
        caption: 'Từng lớp layer được tỉa so le chuẩn xác 45 độ, ôm trọn xương hàm và tôn lên gò má thon gọn.',
        credit: 'Lookbook độc quyền bởi Aurora Hair Atelier · Thực hiện tại Tràng Thi, Hà Nội'
      },
      {
        id: 'sec-4',
        type: 'heading',
        heading: 'Kỹ Thuật Phân Lớp Không Trọng Lực (Zero-Gravity Layers)'
      },
      {
        id: 'sec-5',
        type: 'paragraph',
        content: 'Bí quyết thành công của kiểu tóc này nằm ở kỹ thuật phân tầng. Thợ cắt không tỉa mỏng ngọn tóc một cách ngẫu hứng mà tính toán dựa trên mật độ tóc và cấu trúc hộp sọ của từng người. Lớp ngắn nhất bắt đầu từ ngang cằm, tạo điểm nhấn cho nụ cười, trong khi các lớp dài hơn chạy dọc xuống vai tạo độ phồng tự nhiên mà không cần dùng đến gel hay xịt gôm cứng.'
      },
      {
        id: 'sec-6',
        type: 'vertical_video',
        videoTitle: 'Hậu Trường Biến Hóa Layer Sóng Lơi Tại Aurora Hair',
        videoDuration: '00:45',
        videoPoster: '/src/assets/images/hair_layer_woman_1791614539000.jpg',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-smiling-with-her-hair-blowing-in-the-wind-41584-large.mp4',
        caption: 'Thước phim dọc 9:16: Trực tiếp khoảnh khắc Master Stylist sấy tạo phom sóng lơi bằng tay tại salon.',
        tipAuthor: 'Master Stylist Hoàng Minh'
      },
      {
        id: 'sec-7',
        type: 'heading',
        heading: 'Chăm Sóc & Sấy Tạo Kiểu Tại Nhà: Quy Tắc 3 Phút'
      },
      {
        id: 'sec-8',
        type: 'stylist_tip',
        content: 'Sau khi gội đầu, dùng khăn bông sợi siêu mịn thấm khô 70% nước. Dùng máy sấy ở chế độ gió ấm, chia tóc làm hai nhánh và cuộn tròn theo hướng ra ngoài khuôn mặt. Thao tác sấy tay này chỉ mất 3 phút vào mỗi buổi sáng nhưng giữ được phom sóng bồng bềnh đến tận ngày hôm sau mà không cần quấn lô qua đêm.'
      },
      {
        id: 'sec-9',
        type: 'service_cta',
        heading: 'Muốn trải nghiệm kiểu tóc này?',
        content: 'Đặt lịch ngay tại Aurora Hair Atelier (42 Tràng Thi, Hoàn Kiếm) để được Master Stylist tư vấn tỉa layer theo khuôn mặt.',
        credit: 'Giá tham khảo: 850.000đ - 1.150.000đ'
      }
    ]
  },
  {
    id: 'art-2',
    slug: 'nghe-thuat-fade-textured-crop-nam-gioi',
    title: 'Textured Crop & Low Fade: Cuộc Cách Mạng Phong Cách Của Quý Ông Đô Thị',
    subtitle: 'Độ tương phản sắc bén giữa những đường fade mượt mà và phần đỉnh đầu cắt tỉa texture tự nhiên — kiểu tóc thống trị mọi barber shop cao cấp Hà Nội.',
    category: 'hair_trends',
    categoryLabel: 'Phong Cách Nam',
    coverImage: '/src/assets/images/hair_crop_man_1791614553705.jpg',
    readTime: '4 phút đọc',
    author: {
      name: 'Trần Vũ',
      avatar: '/src/assets/images/hair_crop_man_1791614553705.jpg',
      title: 'Lead Barber · The Hanoi Barber Club'
    },
    publishedAt: '08/10/2026',
    status: 'published',
    isFeatured: false,
    viewsCount: 2190,
    likesCount: 340,
    relatedSalonId: 'salon-2',
    relatedSalonName: 'The Hanoi Barber Club',
    relatedPostId: 'post-2',
    tags: ['Textured Crop', 'Low Fade', 'Barber Hà Nội', 'Tóc Nam Đẹp'],
    sections: [
      {
        id: 'sec-b1',
        type: 'paragraph',
        content: 'Thời kỳ của những kiểu tóc chải chuốt bóng lộn xịt keo cứng đơ đã dần nhường chỗ cho sự năng động và cá tính. Textured Crop là kiểu tóc cắt ngắn hai bên mai và gáy bằng kỹ thuật fade tỉ mỉ, trong khi phần đỉnh đầu được tỉa nhấp so le để tạo thành từng mảng tóc đan xen tự nhiên.'
      },
      {
        id: 'sec-b2',
        type: 'pullquote',
        content: 'Đường fade chuẩn là khi chuyển tiếp từ da đầu đến độ dày tóc mượt như một dải gradient, không một vết gờ sắc cạnh.',
        caption: 'Lead Barber Vũ Trần · 18 Hàng Mành, Hoàn Kiếm'
      },
      {
        id: 'sec-b3',
        type: 'image_break',
        imageUrl: '/src/assets/images/hair_crop_man_1791614553705.jpg',
        caption: 'Góc nghiêng 45 độ làm nổi bật phần viền chân tóc sắc nét và đỉnh đầu có độ phồng thoáng khí.',
        credit: 'The Hanoi Barber Club · Hà Nội'
      },
      {
        id: 'sec-b4',
        type: 'vertical_video',
        videoTitle: 'Kỹ Thuật Đẩy Tông Đơ Low Fade & Cắt Cây Kéo Điêu Luyện',
        videoDuration: '00:38',
        videoPoster: '/src/assets/images/hair_crop_man_1791614553705.jpg',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-barber-styling-a-young-mans-hair-in-a-salon-43750-large.mp4',
        caption: 'Video dọc 9:16 ghi lại khoảnh khắc cạo viền khăn nóng và sáp tạo nếp mờ matte clay.'
      },
      {
        id: 'sec-b5',
        type: 'stylist_tip',
        content: 'Chỉ cần một hạt đậu sáp Matte Clay xoa đều lòng bàn tay và xoa rối từ chân tóc lên đỉnh đầu. Tránh dùng gel bóng kẻo mất đi vẻ phong trần tự nhiên.'
      }
    ]
  },
  {
    id: 'art-3',
    slug: 'bi-mat-mong-thach-syrup-kieu-han',
    title: 'Hiệu Ứng Thạch Nước Trong Veo: Xu Hướng Nail Syrup Hàn Đang Mê Hoặc Giới Trẻ',
    subtitle: 'Không sơn dày cộm, nail thạch syrup đem lại chiều sâu đa tầng như phủ một lớp sương mai lên đầu ngón tay.',
    category: 'makeup_nail',
    categoryLabel: 'Nail & Nghệ Thuật',
    coverImage: '/src/assets/images/nail_art_jelly_1791614565032.jpg',
    readTime: '5 phút đọc',
    author: {
      name: 'Ngọc Lan',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      title: 'Nail Artist · Luna & Co Studio'
    },
    publishedAt: '05/10/2026',
    status: 'published',
    isFeatured: false,
    viewsCount: 1720,
    likesCount: 288,
    relatedSalonId: 'salon-3',
    relatedSalonName: 'Luna & Co Nail Studio',
    relatedPostId: 'post-3',
    tags: ['Nail Thạch Syrup', 'Ombre Nail', 'Luna Studio', 'Nail Hàn Quốc'],
    sections: [
      {
        id: 'sec-n1',
        type: 'paragraph',
        content: 'Sơn móng thạch Syrup (Jelly Nails) ra đời từ xứ sở kim chi và nhanh chóng tạo nên cơn sốt. Điểm độc đáo nằm ở độ trong mờ (translucent) cho phép ánh sáng xuyên qua từng lớp sơn, giúp đôi bàn tay trông thanh mảnh và trắng sáng hơn gấp bội.'
      },
      {
        id: 'sec-n2',
        type: 'image_break',
        imageUrl: '/src/assets/images/nail_art_jelly_1791614565032.jpg',
        caption: 'Hiệu ứng gradient ombre thạch đào kết hợp viền nhũ ngọc trai siêu mịn.',
        credit: 'Luna & Co Studio · 86 Mai Hắc Đế'
      },
      {
        id: 'sec-n3',
        type: 'stylist_tip',
        content: 'Nên chọn phom móng Oval hoặc Hạnh nhân ngắn để giữ trọn vẹn nét nhẹ nhàng thanh khiết.'
      }
    ]
  },
  {
    id: 'art-4',
    slug: 'phong-van-doc-quyen-hair-master-seoul',
    title: '[Bản Nháp CMS] Phỏng Vấn Master Stylist Park Jin-woo: Tương Lai Công Nghệ Uốn Hữu Cơ Không Mùi',
    subtitle: 'Những cải tiến đột phá trong công nghệ uốn lạnh phân tử hữu cơ giúp phục hồi cấu trúc tủy tóc ngay trong quá trình xử lý hóa chất.',
    category: 'interviews',
    categoryLabel: 'Phỏng Vấn & Góc Nhìn',
    coverImage: '/src/assets/images/salon_interior_hanoi_1791614575750.jpg',
    readTime: '7 phút đọc',
    author: {
      name: 'Ban Biên Tập toidep.net',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      title: 'Tòa Soạn toidep.net'
    },
    publishedAt: '11/10/2026',
    status: 'draft', // Admin can toggle and publish!
    isFeatured: false,
    viewsCount: 45,
    likesCount: 8,
    tags: ['Công Nghệ Uốn', 'Phỏng Vấn', 'Bản Nháp CMS'],
    sections: [
      {
        id: 'sec-d1',
        type: 'paragraph',
        content: 'Đây là bài viết đang ở chế độ Bản Nháp trong hệ thống quản trị CMS. Quản trị viên có thể chỉnh sửa nội dung, kiểm tra ảnh trình diễn và bấm "Xuất bản công khai" để bài xuất hiện trên trang Tạp chí Độc giả.'
      }
    ]
  }
];
