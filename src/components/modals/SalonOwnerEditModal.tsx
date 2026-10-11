import React, { useState } from 'react';
import { 
  X, Building2, MapPin, Phone, Clock, Image as ImageIcon, 
  Plus, Trash2, CheckCircle2, AlertCircle, Save, Scissors, 
  Sparkles, ExternalLink, ShieldCheck
} from 'lucide-react';
import { Salon, SalonPriceItem, Stylist, HanoiDistrict, CategoryType } from '../../types';

interface SalonOwnerEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  salon: Salon;
  onSaveSalon: (updatedSalon: Salon) => void;
}

const DISTRICT_LIST: HanoiDistrict[] = [
  'Hoàn Kiếm',
  'Cầu Giấy',
  'Đống Đa',
  'Ba Đình',
  'Tây Hồ',
  'Hai Bà Trưng',
  'Thanh Xuân',
  'Tất cả Hà Nội'
];

export const SalonOwnerEditModal: React.FC<SalonOwnerEditModalProps> = ({
  isOpen,
  onClose,
  salon,
  onSaveSalon
}) => {
  // General Info
  const [name, setName] = useState(salon.name);
  const [address, setAddress] = useState(salon.address);
  const [district, setDistrict] = useState<HanoiDistrict>(salon.district);
  const [phone, setPhone] = useState(salon.phone);
  const [openHours, setOpenHours] = useState(salon.openHours);
  const [description, setDescription] = useState(salon.description);
  const [avatar, setAvatar] = useState(salon.avatar);
  const [coverImage, setCoverImage] = useState(salon.coverImage);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'info' | 'pricing' | 'stylists'>('info');

  // Price Items list
  const [priceItems, setPriceItems] = useState<SalonPriceItem[]>(salon.priceItems || []);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('45 phút');
  const [newServiceCat, setNewServiceCat] = useState<CategoryType>('hair_female');

  // Stylists list
  const [stylists, setStylists] = useState<Stylist[]>(salon.stylists || []);
  const [newStylistName, setNewStylistName] = useState('');
  const [newStylistTitle, setNewStylistTitle] = useState('Senior Stylist');
  const [newStylistExp, setNewStylistExp] = useState(3);
  const [newStylistAvatar, setNewStylistAvatar] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  // Add new service
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice) return;
    const newItem: SalonPriceItem = {
      name: newServiceName,
      price: newServicePrice,
      duration: newServiceDuration,
      category: newServiceCat
    };
    setPriceItems([...priceItems, newItem]);
    setNewServiceName('');
    setNewServicePrice('');
  };

  const handleRemoveService = (index: number) => {
    setPriceItems(priceItems.filter((_, idx) => idx !== index));
  };

  // Add new stylist
  const handleAddStylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStylistName) return;
    const newStylist: Stylist = {
      id: `st-${Date.now()}`,
      name: newStylistName,
      title: `${newStylistTitle} · ${newStylistExp} năm kinh nghiệm`,
      experienceYears: Number(newStylistExp),
      salonId: salon.id,
      salonName: name,
      avatar: newStylistAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      rating: 5.0,
      reviewsCount: 1,
      specialties: ['Cắt tạo form', 'Tạo kiểu xu hướng'],
      bio: 'Thợ lành nghề nhiều năm kinh nghiệm tại salon.'
    };
    setStylists([...stylists, newStylist]);
    setNewStylistName('');
    setNewStylistAvatar('');
  };

  const handleRemoveStylist = (id: string) => {
    setStylists(stylists.filter(s => s.id !== id));
  };

  // Submit complete update
  const handleSave = () => {
    const updated: Salon = {
      ...salon,
      name,
      address,
      district,
      phone,
      openHours,
      description,
      avatar,
      coverImage,
      priceItems,
      stylists
    };
    onSaveSalon(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E4576E]">
                Cổng Quản Trị Salon Pro
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-[#E4576E] border border-rose-200">
                Đã Duyệt Pro Tích Xanh
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              Khởi Tạo & Chỉnh Sửa Trang Khách Hàng
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 px-6 shrink-0 bg-slate-50/50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'info'
                ? 'border-[#E4576E] text-[#E4576E]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Thông tin cơ sở & Ảnh bìa
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'pricing'
                ? 'border-[#E4576E] text-[#E4576E]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Bảng giá dịch vụ ({priceItems.length})
          </button>
          <button
            onClick={() => setActiveTab('stylists')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'stylists'
                ? 'border-[#E4576E] text-[#E4576E]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Đội ngũ thợ & Stylist ({stylists.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đã lưu toàn bộ thông tin salon và cập nhật lên hệ thống thành công!</span>
            </div>
          )}

          {/* TAB 1: INFO */}
          {activeTab === 'info' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên Salon</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#E4576E]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số Hotline đặt lịch</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#E4576E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#E4576E]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quận (Hà Nội)</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value as HanoiDistrict)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    {DISTRICT_LIST.map((dist) => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Giờ mở cửa đón khách</label>
                <input
                  type="text"
                  value={openHours}
                  onChange={(e) => setOpenHours(e.target.value)}
                  placeholder="VD: 09:00 - 21:00 (Hàng ngày)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#E4576E]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả / Slogan giới thiệu Salon</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#E4576E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ảnh đại diện (Avatar URL)</label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <img src={avatar} alt="Preview" className="w-10 h-10 rounded-lg object-cover border" />
                    <span className="text-[10px] text-slate-400">Xem trước Avatar</span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ảnh bìa Header (Cover Image URL)</label>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <img src={coverImage} alt="Cover" className="w-16 h-10 rounded-lg object-cover border" />
                    <span className="text-[10px] text-slate-400">Xem trước Ảnh bìa</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRICING */}
          {activeTab === 'pricing' && (
            <div className="space-y-5 text-xs">
              {/* Add Service Form */}
              <form onSubmit={handleAddService} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#E4576E]" />
                  <span>Thêm dịch vụ vào Menu Bảng Giá</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    placeholder="Tên dịch vụ (VD: Uốn sóng bung)"
                    className="sm:col-span-2 px-3 py-2 bg-white rounded-lg border border-slate-200"
                  />
                  <input
                    type="text"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                    placeholder="Giá (VD: 650.000đ)"
                    className="px-3 py-2 bg-white rounded-lg border border-slate-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={newServiceDuration}
                    onChange={(e) => setNewServiceDuration(e.target.value)}
                    placeholder="Thời lượng (VD: 90 phút)"
                    className="px-3 py-2 bg-white rounded-lg border border-slate-200"
                  />
                  <select
                    value={newServiceCat}
                    onChange={(e) => setNewServiceCat(e.target.value as CategoryType)}
                    className="px-3 py-2 bg-white rounded-lg border border-slate-200"
                  >
                    <option value="hair_female">Tóc Nữ</option>
                    <option value="hair_male">Tóc Nam</option>
                    <option value="nail">Nail & Mi</option>
                    <option value="makeup">Makeup</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#E4576E] text-white font-bold rounded-lg hover:bg-[#d84860] transition-colors"
                >
                  + Thêm Vào Bảng Giá
                </button>
              </form>

              {/* Existing List */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-700">Danh sách dịch vụ hiện tại:</h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                  {priceItems.map((item, idx) => (
                    <div key={idx} className="p-3 bg-white flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {item.duration} · {item.category === 'hair_female' ? 'Tóc Nữ' : item.category === 'hair_male' ? 'Tóc Nam' : 'Nail/Makeup'}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#E4576E]">{item.price}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveService(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STYLISTS */}
          {activeTab === 'stylists' && (
            <div className="space-y-5 text-xs">
              {/* Add Stylist Form */}
              <form onSubmit={handleAddStylist} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#E4576E]" />
                  <span>Thêm Thợ / Stylist vào Salon</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    value={newStylistName}
                    onChange={(e) => setNewStylistName(e.target.value)}
                    placeholder="Tên thợ (VD: Hoàng Quân)"
                    className="sm:col-span-2 px-3 py-2 bg-white rounded-lg border border-slate-200"
                  />
                  <input
                    type="number"
                    value={newStylistExp}
                    onChange={(e) => setNewStylistExp(Number(e.target.value))}
                    placeholder="Số năm kinh nghiệm"
                    className="px-3 py-2 bg-white rounded-lg border border-slate-200"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={newStylistTitle}
                    onChange={(e) => setNewStylistTitle(e.target.value)}
                    placeholder="Chức danh (VD: Master Stylist / Thợ chính)"
                    className="px-3 py-2 bg-white rounded-lg border border-slate-200"
                  />
                  <input
                    type="text"
                    value={newStylistAvatar}
                    onChange={(e) => setNewStylistAvatar(e.target.value)}
                    placeholder="Link ảnh Avatar thợ (tùy chọn)"
                    className="px-3 py-2 bg-white rounded-lg border border-slate-200"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#E4576E] text-white font-bold rounded-lg hover:bg-[#d84860] transition-colors"
                >
                  + Thêm Stylist
                </button>
              </form>

              {/* Existing Stylists */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-700">Đội ngũ thợ hiện tại:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stylists.map((st) => (
                    <div key={st.id} className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img src={st.avatar} alt={st.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <div className="font-bold text-slate-900">{st.name}</div>
                          <div className="text-[10px] text-slate-400">{st.title}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveStylist(st.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Hủy Bỏ
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 text-xs font-bold text-white bg-[#E4576E] hover:bg-[#d84860] rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Lưu & Cập Nhật Lên Trang Khách Hàng</span>
          </button>
        </div>
      </div>
    </div>
  );
};
