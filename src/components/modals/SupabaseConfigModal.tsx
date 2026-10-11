import React, { useState } from 'react';
import { X, Database, Check, ShieldCheck, Key, Server, RefreshCw } from 'lucide-react';
import { SUPABASE_PUBLISHABLE_KEY, DEFAULT_SUPABASE_URL, resetSupabaseClient } from '../../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose
}) => {
  const [supabaseUrl, setSupabaseUrl] = useState(
    localStorage.getItem('toidep_supabase_url') || DEFAULT_SUPABASE_URL
  );
  const [publishableKey, setPublishableKey] = useState(
    localStorage.getItem('toidep_supabase_key') || SUPABASE_PUBLISHABLE_KEY
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    resetSupabaseClient(supabaseUrl.trim(), publishableKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Cấu Hình Supabase Database
              </h3>
              <p className="text-xs text-slate-500">
                Đồng bộ dữ liệu Lookbook, Salon & Lịch đặt
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Publishable Key hợp lệ:</strong> Khóa Supabase cung cấp trong yêu cầu (
              <code className="text-emerald-700 font-mono text-[11px]">sb_publishable_vcGevXUxfiJbk4vjc9BuSw_fw6zeCps</code>
              ) đã được tích hợp sẵn. Hệ thống tự động đồng bộ hai chiều với bộ nhớ trình duyệt.
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-slate-500" /> Supabase Project URL
            </label>
            <input
              type="url"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 focus:bg-white text-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-500" /> Supabase Publishable Key
            </label>
            <textarea
              rows={2}
              value={publishableKey}
              onChange={(e) => setPublishableKey(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 focus:bg-white text-slate-900 font-mono"
            />
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-700" />
              Đã lưu cấu hình kết nối Supabase thành công!
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Lưu & Đồng Bộ Dữ Liệu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
