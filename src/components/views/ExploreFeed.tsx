import React, { useState, useMemo } from 'react';
import { 
  Search, Heart, Bookmark, MapPin, 
  Scissors, Tag, ArrowRight, CheckCircle, Sparkles, Star, Flame, SlidersHorizontal 
} from 'lucide-react';
import { Post, Salon, CategoryType, HanoiDistrict } from '../../types';
import { KeyvisualHero } from '../common/KeyvisualHero';
import { KEYVISUAL_PILLARS, KeyvisualPillar } from '../../assets/branding';

interface ExploreFeedProps {
  posts: Post[];
  salons: Salon[];
  onSelectPost: (post: Post) => void;
  onBookNow: (post: Post, salon: Salon) => void;
  onToggleSave: (postId: string) => void;
  savedPostIds: string[];
  likedPostIds: string[];
  onToggleLike: (postId: string) => void;
  onViewSalon: (salonId: string) => void;
}

export const ExploreFeed: React.FC<ExploreFeedProps> = ({
  posts,
  salons,
  onSelectPost,
  onBookNow,
  onToggleSave,
  savedPostIds,
  likedPostIds,
  onToggleLike,
  onViewSalon
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<HanoiDistrict>('Tất cả Hà Nội');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'trending' | 'newest' | 'price-low'>('trending');

  // Category Tabs
  const categories: { id: CategoryType; label: string; count: number }[] = [
    { id: 'all', label: 'Tất cả xu hướng', count: posts.length },
    { id: 'hair_female', label: 'Tóc Nữ & Mái Bay', count: posts.filter(p => p.category === 'hair_female').length },
    { id: 'hair_male', label: 'Tóc Nam & Barber', count: posts.filter(p => p.category === 'hair_male').length },
    { id: 'nail', label: 'Móng & Thạch Syrup', count: posts.filter(p => p.category === 'nail').length },
    { id: 'makeup', label: 'Môi & Makeup Dự Tiệc', count: posts.filter(p => p.category === 'makeup').length }
  ];

  // District options with counts
  const districts: HanoiDistrict[] = [
    'Tất cả Hà Nội',
    'Hoàn Kiếm',
    'Cầu Giấy',
    'Đống Đa',
    'Ba Đình',
    'Tây Hồ',
    'Hai Bà Trưng',
    'Thanh Xuân'
  ];

  // Search normalization helper
  const normalize = (str: string) => 
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');

  // Filtered and sorted posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      if (selectedCategory !== 'all' && post.category !== selectedCategory) return false;
      if (selectedDistrict !== 'Tất cả Hà Nội' && post.salonDistrict !== selectedDistrict) return false;
      if (searchQuery.trim()) {
        const query = normalize(searchQuery);
        const matchTitle = normalize(post.title).includes(query);
        const matchStyle = normalize(post.styleName).includes(query);
        const matchSalon = normalize(post.salonName).includes(query);
        const matchTags = post.tags.some(t => normalize(t).includes(query));
        if (!matchTitle && !matchStyle && !matchSalon && !matchTags) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'trending') return b.likesCount - a.likesCount;
      if (sortBy === 'price-low') return a.priceFrom - b.priceFrom;
      return 0;
    });
  }, [posts, selectedCategory, selectedDistrict, searchQuery, sortBy]);

  // Handle booking from Keyvisual Pillar
  const handleBookFromPillar = (pillar: KeyvisualPillar) => {
    const post = posts.find(p => p.salonName.includes(pillar.salonName) || p.styleName.includes(pillar.styleName)) || posts[0];
    const salon = salons.find(s => s.name.includes(pillar.salonName)) || salons[0];
    onBookNow(post, salon);
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 1. Master Keyvisual Hero Showcase */}
      <KeyvisualHero
        onBookPillar={handleBookFromPillar}
        onExploreDistrict={(district) => setSelectedDistrict(district as HanoiDistrict)}
        onSelectPostById={(id) => {
          const found = posts.find(p => p.id === id);
          if (found) onSelectPost(found);
        }}
      />

      {/* 2. Keyvisual 3 Pillars Showcase Bar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E4576E]">
              Keyvisual Triad · 3 Trụ Cột Làm Đẹp
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Tóc Đẹp · Móng Đẹp · Môi & Makeup Đẹp
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md text-left sm:text-right">
            Mỗi tác phẩm đều được kiểm chứng tay nghề và gắn trực tiếp với thợ thực hiện tại Hà Nội
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {KEYVISUAL_PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              className="group relative bg-white rounded-3xl border border-slate-300/80 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="aspect-[4/5] relative overflow-hidden bg-[#1F1A1C]">
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                {/* Camera Focus Brackets on Card */}
                <div className="absolute inset-3 pointer-events-none">
                  <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-white/70 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#E4576E] rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-white/70 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-white/70 rounded-br-lg" />
                </div>

                {/* Badge top */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 border border-white/10 z-10">
                  <MapPin className="w-3 h-3 text-[#E4576E]" />
                  <span>{pillar.salonDistrict}</span>
                </div>

                {/* Bottom typography banner matching KV Post */}
                <div className="absolute bottom-4 inset-x-4 text-white z-10">
                  <div className="font-sans font-extrabold text-2xl tracking-tight text-white drop-shadow-sm flex items-center gap-2">
                    <span>{pillar.id === 'toc' ? 'tóc đẹp' : pillar.id === 'mong' ? 'móng đẹp' : 'môi đẹp'}</span>
                    <span className="w-2 h-2 rounded-full bg-[#E4576E]" />
                  </div>
                  <div className="text-[10px] font-mono tracking-widest uppercase text-slate-300 mt-0.5">
                    NƠI BẠN ĐƯỢC LẤY NÉT
                  </div>
                  <div className="text-xs font-semibold text-rose-200 truncate mt-1">
                    {pillar.styleName} · {pillar.salonName}
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3 bg-white">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {pillar.description}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">ƯỚC TÍNH TỪ</span>
                    <span className="text-xs font-extrabold text-[#E4576E]">{pillar.priceFrom}</span>
                  </div>

                  <button
                    onClick={() => handleBookFromPillar(pillar)}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#E4576E] hover:bg-[#d84860] rounded-xl transition-all shadow-2xs flex items-center gap-1.5 group-hover:shadow-md"
                  >
                    <span>Làm kiểu này</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Filter, Search & District Bar */}
      <section className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo kiểu tóc, mẫu móng, tên salon (vd: Layer, Hàng Mành, Mai Hắc Đế)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white text-slate-900 rounded-xl border border-slate-200 shadow-2xs focus:outline-hidden focus:border-[#E4576E] focus:ring-1 focus:ring-[#E4576E] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs text-slate-500 self-end md:self-auto">
            <span>Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="trending">Quan tâm nhiều nhất</option>
              <option value="price-low">Giá từ thấp đến cao</option>
              <option value="newest">Mới đăng gần đây</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#1E1E24] text-white shadow-xs font-bold'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{cat.label}</span>
              <span className="ml-1.5 opacity-60 text-[10px]">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* District Selector Line */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs text-slate-600">
          <span className="text-slate-400 font-medium flex items-center gap-1 shrink-0 mr-1">
            <MapPin className="w-3.5 h-3.5 text-[#E4576E]" /> Khu vực Hà Nội:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {districts.map((dst) => (
              <button
                key={dst}
                onClick={() => setSelectedDistrict(dst)}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                  selectedDistrict === dst
                    ? 'bg-rose-50 text-[#E4576E] font-bold border border-rose-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {dst}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Lookbook Masonry Cards Grid (Tỷ lệ 4:5) */}
      <section>
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 space-y-3">
            <p className="text-sm text-slate-500">Không tìm thấy tác phẩm nào phù hợp với bộ lọc tìm kiếm.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedDistrict('Tất cả Hà Nội'); setSearchQuery(''); }}
              className="text-xs font-bold text-[#E4576E] hover:underline"
            >
              Xóa toàn bộ bộ lọc & hiển thị tất cả
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredPosts.map((post) => {
              const salon = salons.find(s => s.id === post.salonId) || salons[0];
              const isSaved = savedPostIds.includes(post.id);
              const isLiked = likedPostIds.includes(post.id);

              return (
                <div
                  key={post.id}
                  className="group relative bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* 4:5 Media Viewport */}
                  <div 
                    onClick={() => onSelectPost(post)}
                    className="relative aspect-[4/5] overflow-hidden bg-slate-900 cursor-pointer"
                  >
                    <img
                      src={post.images[0]}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />

                    {/* Scrim Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />

                    {/* Top: District Badge & Save Button */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1 border border-white/10">
                        <MapPin className="w-3 h-3 text-[#E4576E]" />
                        {post.salonDistrict}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(post.id);
                        }}
                        className={`p-2 rounded-full backdrop-blur-md transition-all ${
                          isSaved 
                            ? 'bg-[#E4576E] text-white shadow-xs' 
                            : 'bg-black/40 text-white hover:bg-black/60'
                        }`}
                        title="Lưu vào Bộ sưu tập"
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    {/* Bottom Info over Image */}
                    <div className="absolute bottom-3 inset-x-3 text-white z-10">
                      <div className="text-[11px] font-medium text-rose-200 flex items-center gap-1">
                        <Scissors className="w-3 h-3 text-[#E4576E]" />
                        {post.styleName}
                      </div>
                      <div className="font-extrabold text-white text-sm truncate mt-0.5 drop-shadow-xs">
                        {post.title}
                      </div>
                    </div>
                  </div>

                  {/* Card Content & Action Area */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    {/* Salon and Price Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div 
                        onClick={() => onViewSalon(salon.id)}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-900 truncate">
                          <span>{salon.name}</span>
                          {salon.isVerified && (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50 shrink-0" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {post.stylistName ? `${post.stylistName}` : salon.address}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 block">Ước tính từ</span>
                        <span className="text-xs font-extrabold text-[#E4576E]">
                          {post.priceEstimate.split('-')[0].trim()}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Card Actions */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onToggleLike(post.id)}
                        className={`flex items-center gap-1 text-xs font-semibold transition-colors ${
                          isLiked ? 'text-[#E4576E]' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#E4576E]' : ''}`} />
                        <span>{post.likesCount + (isLiked ? 1 : 0)}</span>
                      </button>

                      <button
                        onClick={() => onBookNow(post, salon)}
                        className="px-3.5 py-1.5 text-xs font-bold text-[#E4576E] bg-rose-50 hover:bg-[#E4576E] hover:text-white rounded-xl transition-all flex items-center gap-1"
                      >
                        <span>Làm kiểu này</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
