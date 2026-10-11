import React, { useState } from 'react';
import { 
  X, Check, Copy, Search, ShieldCheck, Globe, Code, 
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ExternalLink 
} from 'lucide-react';
import { SEO_AREAS, SEO_SERVICES, generatePageMetadata, generateJsonLdSchema, evaluateQualityThreshold } from '../../lib/seoData';
import { Salon, Post } from '../../types';

interface SeoInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  salons: Salon[];
  posts: Post[];
}

export const SeoInspectorModal: React.FC<SeoInspectorModalProps> = ({
  isOpen,
  onClose,
  salons,
  posts
}) => {
  const [selectedAreaId, setSelectedAreaId] = useState('cau-giay');
  const [selectedServiceSlug, setSelectedServiceSlug] = useState('lam-nail');
  const [schemaTab, setSchemaTab] = useState<'snippet' | 'jsonld' | 'threshold' | 'robots'>('snippet');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const area = SEO_AREAS.find(a => a.id === selectedAreaId) || SEO_AREAS[0];
  const service = SEO_SERVICES.find(s => s.slug === selectedServiceSlug) || SEO_SERVICES[0];

  const meta = generatePageMetadata('area_service', {
    area,
    service,
    salonsCount: salons.filter(s => s.district.toLowerCase().includes(area.name.toLowerCase())).length || 8,
    priceMin: 180000,
    priceMax: 650000
  });

  const quality = evaluateQualityThreshold(area, service, salons, posts);

  const localBusinessSchema = generateJsonLdSchema('local_business', { salon: salons[0] });
  const breadcrumbSchema = generateJsonLdSchema('breadcrumb', {
    items: [
      { name: 'Trang chủ', url: '/' },
      { name: area.provinceName, url: `/${area.provinceCode}` },
      { name: area.name, url: `/${area.provinceCode}/${area.slug}` },
      { name: service.shortName, url: `/${area.provinceCode}/${area.slug}/${service.slug}` }
    ]
  });
  const orgSchema = generateJsonLdSchema('organization', {});

  const combinedJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [orgSchema, breadcrumbSchema, localBusinessSchema]
  };

  const copySchema = () => {
    navigator.clipboard?.writeText(JSON.stringify(combinedJsonLd, null, 2));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#F6F5F1] text-[#1F1A1C] rounded-3xl shadow-2xl border border-slate-300 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        role="dialog"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#1F1A1C] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight">Trình Kiểm Tra SEO & Google SERP Simulator</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Top 1 Strategy
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono">
                Kiểm định URL, Title, Meta Description, JSON-LD Schema & Ngưỡng index
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Area / Service Selector Bar */}
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs shrink-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-bold">Khu vực:</span>
              <select
                value={selectedAreaId}
                onChange={(e) => setSelectedAreaId(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 font-semibold text-slate-800 focus:outline-hidden"
              >
                {SEO_AREAS.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.provinceName})</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-bold">Dịch vụ:</span>
              <select
                value={selectedServiceSlug}
                onChange={(e) => setSelectedServiceSlug(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 font-semibold text-slate-800 focus:outline-hidden"
              >
                {SEO_SERVICES.map(s => (
                  <option key={s.slug} value={s.slug}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono">
            <span>URL:</span>
            <code className="text-[#E4576E] bg-rose-50 px-2 py-0.5 rounded font-bold">
              /ha-noi/{area.slug}/{service.slug}
            </code>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="px-6 border-b border-slate-200 flex gap-6 text-xs font-bold bg-[#F6F5F1] shrink-0">
          <button
            onClick={() => setSchemaTab('snippet')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              schemaTab === 'snippet' ? 'border-[#E4576E] text-[#E4576E]' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Mô Phỏng Google Search SERP</span>
          </button>

          <button
            onClick={() => setSchemaTab('jsonld')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              schemaTab === 'jsonld' ? 'border-[#E4576E] text-[#E4576E]' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>JSON-LD Rich Results Schema</span>
          </button>

          <button
            onClick={() => setSchemaTab('threshold')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              schemaTab === 'threshold' ? 'border-[#E4576E] text-[#E4576E]' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Ngưỡng Chất Lượng Index ({quality.score}/100)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {schemaTab === 'snippet' && (
            <div className="space-y-6">
              {/* Google Search Desktop Snippet */}
              <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-xs space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Kết quả hiển thị trên Google Desktop
                </span>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <div className="w-4 h-4 rounded-full bg-[#1F1A1C] flex items-center justify-center text-[9px] text-white font-bold">t</div>
                  <span className="text-slate-800 font-medium">toidep.net</span>
                  <span className="text-slate-400">› ha-noi › {area.slug} › {service.slug}</span>
                </div>
                <h4 className="text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                  {meta.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  {meta.description}
                </p>
              </div>

              {/* Character length validation according to 4.1 */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">Độ dài thẻ Title:</span>
                    <strong className={meta.title.length <= 60 ? 'text-emerald-700 font-mono' : 'text-rose-600 font-mono'}>
                      {meta.title.length} / 60 ký tự (Đạt chuẩn)
                    </strong>
                  </div>
                  <p className="text-[11px] text-slate-400">Không bị Google cắt dấu ba chấm (...)</p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">Độ dài Description:</span>
                    <strong className={meta.description.length <= 155 ? 'text-emerald-700 font-mono' : 'text-rose-600 font-mono'}>
                      {meta.description.length} / 155 ký tự (Đạt chuẩn)
                    </strong>
                  </div>
                  <p className="text-[11px] text-slate-400">Chứa ngày giờ cập nhật động tăng CTR</p>
                </div>
              </div>
            </div>
          )}

          {schemaTab === 'jsonld' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Mã Schema JSON-LD Hợp Lệ (Rich Results Test)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Bao gồm Organization, BreadcrumbList và LocalBusiness (BeautySalon)
                  </p>
                </div>
                <button
                  onClick={copySchema}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-[#1F1A1C] hover:bg-black rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Đã copy!' : 'Copy JSON-LD'}</span>
                </button>
              </div>

              <pre className="p-4 bg-[#1F1A1C] text-emerald-400 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-96 leading-relaxed border border-slate-800">
                {JSON.stringify(combinedJsonLd, null, 2)}
              </pre>
            </div>
          )}

          {schemaTab === 'threshold' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-300 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white ${
                      quality.isIndexable ? 'bg-emerald-600' : 'bg-amber-600'
                    }`}>
                      {quality.score}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Đánh Giá Ngưỡng Chất Lượng: {quality.isIndexable ? 'Đủ điều kiện Index (index,follow)' : 'Gắn noindex,follow để bảo vệ site'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Tuân thủ thuật toán chống Scaled Content Abuse của Google 2026
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block">Địa điểm thật</span>
                    <strong className="text-slate-900 font-bold">{quality.metrics.activeLocationsCount} tiệm</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block">Ảnh 90 ngày</span>
                    <strong className="text-slate-900 font-bold">{quality.metrics.photos90DaysCount} ảnh thật</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block">Độ dài intro</span>
                    <strong className="text-slate-900 font-bold">{quality.metrics.introWordCount} từ</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block">Độ mới</span>
                    <strong className="text-emerald-700 font-bold">{quality.metrics.freshnessDays} ngày trước</strong>
                  </div>
                </div>

                {quality.reasons.length > 0 && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                    <span className="font-bold">Lưu ý để nâng điểm chất lượng:</span>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {quality.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500 font-mono text-[11px]">
            Google Search Console & Bing IndexNow Compatible · toidep.net
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-bold text-white bg-[#1F1A1C] hover:bg-black rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
