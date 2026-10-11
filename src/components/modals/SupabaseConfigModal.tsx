import React, { useState, useEffect } from 'react';
import { 
  X, Database, Check, ShieldCheck, Key, Server, RefreshCw, 
  Terminal, Copy, CheckCheck, AlertCircle, ExternalLink, Code 
} from 'lucide-react';
import { 
  SUPABASE_PUBLISHABLE_KEY, 
  SUPABASE_SECRET_KEY,
  DEFAULT_SUPABASE_URL, 
  SUPABASE_PROJECT_REF,
  GOOSE_MCP_COMMAND,
  SUPABASE_SQL_MIGRATION,
  resetSupabaseClient,
  testSupabaseConnection,
  SupabaseHealthStatus
} from '../../lib/supabase';

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
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<SupabaseHealthStatus | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'sql' | 'mcp'>('status');

  useEffect(() => {
    if (isOpen) {
      runHealthCheck();
    }
  }, [isOpen]);

  const runHealthCheck = async () => {
    setIsTesting(true);
    try {
      const res = await testSupabaseConnection(supabaseUrl, publishableKey);
      setHealthStatus(res);
    } catch {
      // Ignored
    } finally {
      setIsTesting(false);
    }
  };

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    resetSupabaseClient(supabaseUrl.trim(), publishableKey.trim());
    setSavedSuccess(true);
    runHealthCheck();
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Kết Nối Supabase Database</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {SUPABASE_PROJECT_REF}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Lưu trữ và đồng bộ hóa sản phẩm, bài đăng & lịch đặt hẹn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-200 bg-slate-100/60 px-6 text-xs font-bold text-slate-600 gap-4 shrink-0">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'status' 
                ? 'border-emerald-600 text-emerald-800' 
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Trạng Thái & API Keys
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'sql' 
                ? 'border-emerald-600 text-emerald-800' 
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            SQL Migration Schema
          </button>
          <button
            onClick={() => setActiveTab('mcp')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'mcp' 
                ? 'border-emerald-600 text-emerald-800' 
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Goose MCP Client
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {activeTab === 'status' && (
            <div className="space-y-4">
              {/* Real-time Health Check Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Trạng thái kết nối máy chủ Supabase:</span>
                  </div>
                  <button
                    onClick={runHealthCheck}
                    disabled={isTesting}
                    className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? 'Đang kiểm tra...' : 'Kiểm tra ngay'}</span>
                  </button>
                </div>

                {healthStatus ? (
                  <div className={`p-3 rounded-xl text-xs font-medium border ${
                    healthStatus.connected && healthStatus.postsTableReady
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : healthStatus.connected
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}>
                    <div className="flex items-start gap-2">
                      {healthStatus.connected && healthStatus.postsTableReady ? (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1">
                        <div>{healthStatus.message}</div>
                        <div className="font-mono text-[10px] opacity-75">
                          Độ trễ: {healthStatus.latencyMs}ms · Cập nhật: {healthStatus.lastChecked}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 font-mono">Đang thăm dò trạng thái kết nối...</div>
                )}
              </div>

              {/* Form config */}
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-slate-500" /> Supabase Project URL
                  </label>
                  <input
                    type="url"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 focus:bg-white text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-slate-500" /> Supabase Publishable Key
                  </label>
                  <input
                    type="text"
                    value={publishableKey}
                    onChange={(e) => setPublishableKey(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 focus:bg-white text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Supabase Secret / Service Role Key
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold font-mono">Đã nạp sẵn để vượt RLS</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      readOnly
                      value={SUPABASE_SECRET_KEY}
                      className="w-full px-3.5 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-700 pr-20"
                    />
                    <button
                      type="button"
                      onClick={() => copyText(SUPABASE_SECRET_KEY, 'secret')}
                      className="absolute right-2 top-1.5 px-2 py-1 text-[10px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg flex items-center gap-1"
                    >
                      {copiedKey === 'secret' ? <CheckCheck className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'secret' ? 'Đã chép' : 'Sao chép'}</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Hệ thống tự động sử dụng khóa này khi ghi dữ liệu sản phẩm mới vào bảng public.posts để đảm bảo không bị chặn bởi Row-Level Security.
                  </p>
                </div>

                {savedSuccess && (
                  <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-emerald-700" />
                    Đã lưu cấu hình kết nối Supabase thành công!
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Lưu Cấu Hình & Thử Lại
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  Hướng dẫn tạo bảng posts trên Supabase nếu sản phẩm chưa lưu:
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-700 pl-1 leading-relaxed">
                  <li>Truy cập Supabase Dashboard của dự án: <code className="font-mono font-bold text-slate-900">https://supabase.com/dashboard/project/iglrrhlfvazivudrfued</code></li>
                  <li>Nhấp vào mục <strong>SQL Editor</strong> ở thanh menu bên trái.</li>
                  <li>Dán toàn bộ đoạn mã SQL bên dưới và nhấn <strong>Run</strong> (Chạy).</li>
                  <li>Quay lại toidep.net và bấm "Đăng Lookbook" để lưu sản phẩm mới trực tiếp vào database!</li>
                </ol>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between px-3.5 py-2 bg-slate-800 text-slate-300 rounded-t-xl text-xs font-mono">
                  <span>toidep_schema_migration.sql</span>
                  <button
                    onClick={() => copyText(SUPABASE_SQL_MIGRATION, 'sql')}
                    className="px-2.5 py-1 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center gap-1 transition-colors"
                  >
                    {copiedKey === 'sql' ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'sql' ? 'Đã sao chép' : 'Sao chép toàn bộ SQL'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-slate-900 text-emerald-400 text-[11px] font-mono rounded-b-xl overflow-x-auto max-h-60 leading-relaxed">
                  {SUPABASE_SQL_MIGRATION}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'mcp' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-slate-700" />
                  Kết nối Goose MCP Client với Supabase Extension:
                </div>
                <p className="text-slate-600">
                  Sử dụng lệnh sau trong terminal hoặc thêm vào cấu hình <code className="font-mono text-slate-900">~/.config/goose/config.yaml</code>:
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  1. Lệnh Khởi Động Goose Session (One-Click Terminal):
                </div>
                <div className="relative">
                  <pre className="p-3 bg-slate-900 text-sky-400 text-[11px] font-mono rounded-xl overflow-x-auto pr-24 leading-relaxed">
                    {GOOSE_MCP_COMMAND}
                  </pre>
                  <button
                    onClick={() => copyText(GOOSE_MCP_COMMAND, 'mcp-cmd')}
                    className="absolute right-2 top-2 px-2 py-1 text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center gap-1 transition-colors"
                  >
                    {copiedKey === 'mcp-cmd' ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'mcp-cmd' ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  2. Cấu hình YAML cho Goose:
                </div>
                <div className="relative">
                  <pre className="p-3 bg-slate-900 text-slate-300 text-[10px] font-mono rounded-xl overflow-x-auto pr-24 leading-relaxed">
                    {`extensions:
  supabase:
    description: 'Connect your Supabase projects to AI assistants.'
    enabled: true
    name: Supabase
    type: streamable_http
    uri: 'https://mcp.supabase.com/mcp?project_ref=iglrrhlfvazivudrfued&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching'`}
                  </pre>
                  <button
                    onClick={() => copyText(GOOSE_MCP_COMMAND, 'mcp-yaml')}
                    className="absolute right-2 top-2 px-2 py-1 text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center gap-1 transition-colors"
                  >
                    {copiedKey === 'mcp-yaml' ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'mcp-yaml' ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Supabase Ref: <code className="font-mono text-slate-800 font-bold">{SUPABASE_PROJECT_REF}</code></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
