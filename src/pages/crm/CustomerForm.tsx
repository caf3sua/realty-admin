import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';

export const CustomerForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [classification, setClassification] = useState('Tiềm năng');
  const [source, setSource] = useState('Website');
  const [address, setAddress] = useState('');
  const [needs, setNeeds] = useState('');
  const [note, setNote] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const classifications = ['Tiềm năng', 'Đầu tư', 'VIP', 'Khác'];
  const sources = ['Facebook', 'Website', 'Hotline', 'Giới thiệu', 'Khác'];

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      api.getCustomer(id)
        .then(data => {
          setName(data.name || '');
          setCode(data.code || '');
          setPhone(data.phone || '');
          setEmail(data.email || '');
          setClassification(data.classification || 'Tiềm năng');
          setSource(data.source || 'Website');
          setAddress(data.address || '');
          setNeeds(data.needs || '');
          setNote(data.note || '');
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError('Không thể tải thông tin khách hàng');
          setLoading(false);
        });
    } else {
      // Auto generate code for new customer by default
      handleAutoGenerateCode();
    }
  }, [id, isEdit]);

  const handleAutoGenerateCode = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    setCode(`KH-${yyyy}${mm}${dd}-${random}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError('Họ tên không được để trống');
    if (!code.trim()) return setError('Mã khách hàng không được để trống');
    if (!phone.trim()) return setError('Số điện thoại không được để trống');

    setError(null);
    setLoading(true);

    const customerData = {
      name: name.trim(),
      code: code.trim(),
      phone: phone.trim(),
      email: email.trim() ? email.trim() : undefined,
      classification,
      source,
      address: address.trim() ? address.trim() : undefined,
      needs: needs.trim() ? needs.trim() : undefined,
      note: note.trim() ? note.trim() : undefined,
    };

    try {
      if (isEdit && id) {
        await api.updateCustomer(id, customerData);
      } else {
        await api.createCustomer(customerData);
      }
      navigate('/crm/customers');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Đã có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4 text-xs">
      {/* Navigation and Title */}
      <div className="flex items-center gap-3">
        <Link
          to="/crm/customers"
          className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CRM MODULE</span>
          <h2 className="text-base font-bold text-slate-900 leading-tight">
            {isEdit ? 'Chỉnh sửa thông tin khách hàng' : 'Thêm mới khách hàng'}
          </h2>
        </div>
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
        {/* Error alert */}
        {error && (
          <div className="m-5 p-3.5 bg-red-50 border border-red-200 text-red-650 rounded font-medium">
            {error}
          </div>
        )}

        <div className="p-5 md:p-6 space-y-6">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5 text-[10px]">
            Thông tin cá nhân & Liên hệ
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Họ và tên <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Ví dụ: Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all"
                required
              />
            </div>

            {/* Customer Code */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex justify-between">
                <span>Mã khách hàng <span className="text-red-500">*</span></span>
                {!isEdit && (
                  <button
                    type="button"
                    onClick={handleAutoGenerateCode}
                    className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-0.5 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Tự động tạo</span>
                  </button>
                )}
              </label>
              <input
                type="text"
                placeholder="Ví dụ: KH-0001"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all font-semibold"
                required
                disabled={isEdit} // Disable editing the code once created for database consistency
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Số điện thoại <span className="text-red-500">*</span></label>
              <input
                type="tel"
                placeholder="Ví dụ: 0987654321"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all"
                required
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Địa chỉ Email</label>
              <input
                type="email"
                placeholder="Ví dụ: nguyenvana@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all"
              />
            </div>
          </div>

          <h3 className="font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2.5 pt-4 text-[10px]">
            Phân loại & Chi tiết nhu cầu
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Classification */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Phân loại khách hàng <span className="text-red-500">*</span></label>
              <select
                value={classification}
                onChange={(e) => setClassification(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all cursor-pointer"
              >
                {classifications.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Source */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Nguồn nhập khách hàng <span className="text-red-500">*</span></label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all cursor-pointer"
              >
                {sources.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div className="space-y-1 md:col-span-2">
              <label className="font-bold text-slate-700">Địa chỉ liên hệ</label>
              <input
                type="text"
                placeholder="Nhập địa chỉ nhà riêng hoặc văn phòng..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all"
              />
            </div>

            {/* Needs */}
            <div className="space-y-1 md:col-span-2">
              <label className="font-bold text-slate-700">Nhu cầu của khách hàng</label>
              <textarea
                rows={3}
                placeholder="Mô tả nhu cầu mua/bán bất động sản, diện tích, vị trí mong muốn, tài chính,..."
                value={needs}
                onChange={(e) => setNeeds(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all resize-y"
              />
            </div>

            {/* Note */}
            <div className="space-y-1 md:col-span-2">
              <label className="font-bold text-slate-700">Ghi chú (noted)</label>
              <textarea
                rows={3}
                placeholder="Ghi chú thêm về khách hàng (lịch sử liên hệ, thời gian rảnh, sở thích, tính cách...)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all resize-y"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
          <Link
            to="/crm/customers"
            className="px-4 py-2 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-600 font-bold uppercase transition-colors"
          >
            Hủy bỏ
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded font-bold uppercase shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>LƯU THÔNG TIN</span>
          </button>
        </div>
      </form>
    </div>
  );
};
