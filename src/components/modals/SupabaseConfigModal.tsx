import React, { useState, useEffect } from 'react';
import { 
  X, Database, Check, ShieldCheck, Key, Server, RefreshCw, 
  Terminal, Copy, CheckCheck, AlertCircle, ExternalLink, Play, 
  HelpCircle, CheckCircle2, ArrowRight
} from 'lucide-react';
import { 
  SUPABASE_PUBLISHABLE_KEY, 
  SUPABASE_SECRET_KEY,
  DEFAULT_SUPABASE_URL, 
  SUPABASE_PROJECT_REF,
  GOOSE_MCP_COMMAND,
  GOOSE_MCP_YAML,
  SUPABASE_SQL_MIGRATION,
  resetSupabaseClient,
  testSupabaseConnection,
  testWriteProbeToSupabase,
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
  const [isTestingWrite, setIsTestingWrite] = useState(false);
  const [writeTestResult, setWriteTestResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
    latencyMs?: number;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'status' | 'how_to_verify' | 'sql' | 'mcp'>('status');

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
      // Handled in utility
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestWrite = async () => {
    setIsTestingWrite(true);
    setWriteTestResult(null);
    try {
      const result = await testWriteProbeToSupabase(supabaseUrl);
      setWriteTestResult(result);
      // Refresh health check status after write test
      await runHealthCheck();
    } catch (err: any) {
      setWriteTestResult({
        success: false,
        message: `Lỗi: ${err.message || 'Không thể ghi thử'}`
      });
    } finally {
      setIsTestingWrite(false);
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
                <span>Trung Tâm Kết Nối Supabase</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {SUPABASE_PROJECT_REF}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Chẩn đoán kết nối, kiểm tra lưu sản phẩm & hướng dẫn đồng bộ
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
        <div className="flex border-b border-slate-200 bg-slate-100/60 px-6 text-xs font-bold text-slate-600 gap-4 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'status' 
                ? 'border-emerald-600 text-emerald-800' 
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Chẩn Đoán & Kiểm Tra
          </button>
          <button
            onClick={() => setActiveTab('how_to_verify')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'how_to_verify' 
                ? 'border-emerald-600 text-emerald-800' 
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cách Biết Đã Kết Nối?</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'sql' 
                ? 'border-emerald-600 text-emerald-800' 
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Mã SQL Tạo Bảng (Fix Lỗi)
          </button>
          <button
            onClick={() => setActiveTab('mcp')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'mcp' 
                ? 'border-emerald-600 text-emerald-800' 
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Goose MCP & Config
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={runHealthCheck}
                      disabled={isTesting}
                      className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                      <span>{isTesting ? 'Đang kiểm tra...' : 'Ping Live'}</span>
                    </button>
                  </div>
                </div>

                {healthStatus ? (
                  <div className={`p-3.5 rounded-xl text-xs font-medium border space-y-2 ${
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
                        <div className="font-bold">{healthStatus.message}</div>
                        <div className="font-mono text-[10px] opacity-80 flex flex-wrap gap-x-3 gap-y-1">
                          <span>Endpoint: {healthStatus.url}</span>
                          <span>Độ trễ: {healthStatus.latencyMs}ms</span>
                          <span>Lần kiểm tra: {healthStatus.lastChecked}</span>
                        </div>
                      </div>
                    </div>

                    {!healthStatus.postsTableReady && (
                      <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
                        <span>Nguyên nhân: Bảng <code>public.posts</code> chưa có trên Supabase.</span>
                        <button
                          onClick={() => setActiveTab('sql')}
                          className="font-bold underline text-amber-900 hover:text-black flex items-center gap-1"
                        >
                          Xem mã SQL tạo bảng ngay <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 font-mono">Đang thăm dò trạng thái kết nối...</div>
                )}
              </div>

              {/* Empirical Test Write Probe Card */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 text-indigo-600" />
                      Thử Nghiệm Ghi 1 Dữ Liệu Mẫu (Test Write Probe)
                    </h4>
                    <p className="text-[11px] text-indigo-700 mt-0.5">
                      Gửi 1 bài viết thử nghiệm lên Supabase để xác minh quyền ghi và sự tồn tại của database.
                    </p>
                  </div>
                  <button
                    onClick={handleTestWrite}
                    disabled={isTestingWrite}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTestingWrite ? 'animate-spin' : ''}`} />
                    <span>{isTestingWrite ? 'Đang gửi...' : 'Gửi Thử Ngay'}</span>
                  </button>
                </div>

                {writeTestResult && (
                  <div className={`p-3 rounded-xl text-xs font-medium border transition-all ${
                    writeTestResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}>
                    <div className="flex items-start gap-2">
                      {writeTestResult.success ? (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-semibold">{writeTestResult.message}</div>
                        {writeTestResult.success && (
                          <div className="text-[10px] text-emerald-700 mt-1">
                            👉 Bạn có thể vào Supabase Dashboard &gt; Table Editor &gt; posts để thấy ngay bản ghi này!
                          </div>
                        )}
                        {!writeTestResult.success && (
                          <div className="text-[10px] text-amber-800 mt-1">
                            👉 Bấm sang tab "Mã SQL Tạo Bảng", copy đoạn code SQL và chạy trên Supabase để sửa triệt để lỗi này.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Form config */}
              <form onSubmit={handleSave} className="space-y-3.5 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
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
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
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
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center justify-between">
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

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Lưu Cấu Hình & Thử Lại
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'how_to_verify' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  4 Dấu Hiệu Nhận Biết Đã Kết Nối Supabase Thành Công 100%:
                </h4>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Dưới đây là các dấu hiệu trực quan giúp bạn kiểm chứng xem ứng dụng toidep.net đã thực sự kết nối với Database Supabase hay chưa:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] flex items-center justify-center font-mono">1</span>
                    <span>Huy hiệu Supabase trên thanh Header màu Xanh Lá</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                    Ở góc trên bên phải trang web, nút <strong>"Supabase DB"</strong> có chấm xanh hiển thị trạng thái kết nối. Nhấp vào nút này sẽ mở bảng chẩn đoán thời gian thực.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] flex items-center justify-center font-mono">2</span>
                    <span>Nút "Ping Live" trả về phản hồi dưới 100ms</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                    Trong tab "Chẩn Đoán & Kiểm Tra", bấm <strong>"Ping Live"</strong>. Nếu máy chủ phản hồi thông điệp kèm độ trễ (ví dụ: <code>Độ trễ: 35ms</code>), nghĩa là kết nối mạng và API Key hoàn toàn hợp lệ.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] flex items-center justify-center font-mono">3</span>
                    <span>Bấm "Gửi Thử Ngay" (Test Write Probe) thành công</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                    Tính năng thử nghiệm ghi trực tiếp 1 bản ghi vào bảng <code>public.posts</code>. Khi nhận thông báo màu xanh lá <code>Thành công 100%!</code>, bạn đã có toàn quyền đọc và ghi dữ liệu trên Supabase.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] flex items-center justify-center font-mono">4</span>
                    <span>Kiểm tra trực tiếp trong Supabase Dashboard &gt; Table Editor</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                    Đây là cách kiểm chứng trực quan nhất: Bạn mở trang quản trị Supabase tại <a href="https://supabase.com/dashboard/project/iglrrhlfvazivudrfued/editor" target="_blank" rel="noreferrer" className="text-emerald-700 font-bold underline">Table Editor</a>, chọn bảng <strong>posts</strong>. Bạn sẽ tận mắt nhìn thấy các sản phẩm bạn vừa tạo trên toidep.net xuất hiện ngay tại đây!
                  </p>
                </div>
              </div>

              {/* Reason why it wasn't saving previously */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  Vì sao trước đây bạn tạo sản phẩm mới không thấy lưu vào Supabase?
                </div>
                <p className="text-slate-700 leading-relaxed pl-1">
                  Kết nối API đến dự án Supabase của bạn <strong>đã thành công</strong> từ đầu. Tuy nhiên, một dự án Supabase mới tinh chưa có sẵn bảng cơ sở dữ liệu. Khi bạn bấm Đăng sản phẩm, Supabase trả về lỗi <code>PGRST205: Could not find the table 'public.posts'</code>.
                </p>
                <p className="text-slate-700 leading-relaxed pl-1">
                  👉 <strong>Giải pháp triệt để:</strong> Chuyển sang tab <strong>"Mã SQL Tạo Bảng"</strong>, bấm sao chép và chạy mã SQL trong Supabase SQL Editor trong 10 giây. Sau đó mọi sản phẩm mới sẽ được ghi vĩnh viễn vào database!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-amber-950">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  3 Bước Fix Triệt Để: Tạo Bảng posts trên Supabase (Chỉ Mất 15 Giây)
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-800 pl-1 leading-relaxed">
                  <li>
                    Nhấp nút <a 
                      href="https://supabase.com/dashboard/project/iglrrhlfvazivudrfued/sql/new" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="font-bold text-emerald-800 underline inline-flex items-center gap-1"
                    >
                      Mở Supabase SQL Editor <ExternalLink className="w-3 h-3" />
                    </a> (Dự án: <code className="font-mono text-[11px] bg-slate-200/80 px-1 py-0.5 rounded">iglrrhlfvazivudrfued</code>).
                  </li>
                  <li>
                    Bấm nút <strong>"Sao chép toàn bộ SQL"</strong> ở khung bên dưới, sau đó dán (Ctrl+V) vào ô soạn thảo SQL trên Supabase.
                  </li>
                  <li>
                    Bấm nút xanh <strong>"Run"</strong> (hoặc nhấn tổ hợp phím <code>Ctrl + Enter</code>) trên màn hình Supabase.
                  </li>
                  <li>
                    Quay lại toidep.net, bấm <strong>"Thử Nghiệm Ghi"</strong> hoặc vào trang <strong>"Đăng lookbook"</strong> để lưu sản phẩm mới trực tiếp vào database!
                  </li>
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

              <div className="flex items-center justify-between text-xs text-slate-600 px-1">
                <span>Mã SQL đã bao gồm: Bảng <code>posts</code>, <code>salons</code>, <code>bookings</code> và mở quyền công khai RLS.</span>
                <button
                  onClick={() => copyText(SUPABASE_SQL_MIGRATION, 'sql')}
                  className="px-3 py-1.5 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shrink-0 flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao Chép SQL</span>
                </button>
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
                <p className="text-slate-600 text-xs">
                  Chạy lệnh bên dưới trong Goose Terminal để kết nối trực tiếp AI Assistant với dự án Supabase iglrrhlfvazivudrfued:
                </p>
                <div className="relative mt-2">
                  <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                    {GOOSE_MCP_COMMAND}
                  </pre>
                  <button
                    onClick={() => copyText(GOOSE_MCP_COMMAND, 'mcp')}
                    className="absolute right-2 top-2 px-2 py-1 bg-white/20 hover:bg-white/30 text-white rounded-md text-[10px] font-semibold flex items-center gap-1"
                  >
                    {copiedKey === 'mcp' ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'mcp' ? 'Đã sao chép' : 'Sao chép'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Cấu hình ~/.config/goose/config.yaml:</span>
                  <button
                    onClick={() => copyText(GOOSE_MCP_YAML, 'mcp_yaml')}
                    className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md text-[10px] font-semibold flex items-center gap-1"
                  >
                    {copiedKey === 'mcp_yaml' ? <CheckCheck className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'mcp_yaml' ? 'Đã sao chép' : 'Sao chép YAML'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[10px] overflow-x-auto">
                  {GOOSE_MCP_YAML}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
