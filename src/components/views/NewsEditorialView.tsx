import React, { useState } from 'react';
import { 
  Sparkles, Clock, Calendar, Eye, Heart, ArrowRight, 
  BookOpen, Play, Search, Filter, Scissors
} from 'lucide-react';
import { Article, ArticleCategory, Salon, Post } from '../../types';

interface NewsEditorialViewProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  salons: Salon[];
  posts: Post[];
  onOpenAdminCms?: () => void;
}

export const NewsEditorialView: React.FC<NewsEditorialViewProps> = ({
  articles,
  onSelectArticle,
  salons,
  posts,
  onOpenAdminCms
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Only show published articles on public magazine view
  const publishedArticles = articles.filter(a => a.status === 'published');

  // Filtered list
  const filtered = publishedArticles.filter(art => {
    if (selectedCategory !== 'all' && art.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.subtitle.toLowerCase().includes(q) ||
        art.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const featuredArticle = publishedArticles.find(a => a.isFeatured) || publishedArticles[0];
  const listArticles = filtered.filter(a => a.id !== featuredArticle?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Magazine Masthead Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#E4576E]">
              Tạp Chí Thời Trang & Làm Đẹp
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-[#E4576E] border border-rose-200">
              Longform Editorial
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Góc Nhìn Làm Đẹp toidep.net
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Những chuyên đề chuyên sâu về xu hướng tóc, kỹ thuật tạo mẫu, nghệ thuật nail thạch và video dọc hậu trường thực hiện tại các salon hàng đầu Hà Nội.
          </p>
        </div>

        {onOpenAdminCms && (
          <button
            onClick={onOpenAdminCms}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors self-start md:self-auto shrink-0"
          >
            ⚙️ Quản trị tin tức (CMS)
          </button>
        )}
      </div>

      {/* Categories & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'Tất cả bài viết' },
            { id: 'hair_trends', label: 'Xu hướng tóc' },
            { id: 'makeup_nail', label: 'Nail & Makeup' },
            { id: 'hair_care', label: 'Chăm sóc tóc' },
            { id: 'interviews', label: 'Phỏng vấn Stylist' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#1E1E24] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-[#E4576E]"
          />
        </div>
      </div>

      {/* Featured Big Story Spotlight */}
      {featuredArticle && selectedCategory === 'all' && !searchQuery && (
        <div 
          onClick={() => onSelectArticle(featuredArticle)}
          className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-0"
        >
          <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden">
            <img
              src={featuredArticle.coverImage}
              alt={featuredArticle.title}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E4576E] text-white shadow-md">
                Chuyên Đề Nổi Bật Tuần Này
              </span>
            </div>
            {featuredArticle.sections.some(s => s.type === 'vertical_video') && (
              <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                <span>Có video dọc 9:16</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                <span className="text-[#E4576E] font-bold uppercase tracking-wider">{featuredArticle.categoryLabel}</span>
                <span>·</span>
                <span>{featuredArticle.readTime}</span>
                <span>·</span>
                <span>{featuredArticle.publishedAt}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-[#E4576E] transition-colors leading-snug">
                {featuredArticle.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                {featuredArticle.subtitle}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <img
                  src={featuredArticle.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={featuredArticle.author.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-slate-900">{featuredArticle.author.name}</div>
                  <div className="text-[10px] text-slate-400">{featuredArticle.author.title}</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 font-bold text-[#E4576E]">
                <span>Đọc bài viết</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Tất Cả Bài Viết ({filtered.length})
        </h3>

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
            Không tìm thấy bài viết phù hợp.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((art) => (
              <div
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-lg transition-all cursor-pointer flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {art.categoryLabel}
                    </span>
                  </div>
                  {art.sections.some(s => s.type === 'vertical_video') && (
                    <div className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-[#E4576E] text-white shadow-md">
                      <Play className="w-3.5 h-3.5 fill-white" />
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                      <span>{art.readTime}</span>
                      <span>·</span>
                      <span>{art.publishedAt}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#E4576E] transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {art.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="truncate font-medium text-slate-600">{art.author.name}</span>
                    <span className="flex items-center gap-1 shrink-0">
                      <Eye className="w-3.5 h-3.5" />
                      {art.viewsCount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
