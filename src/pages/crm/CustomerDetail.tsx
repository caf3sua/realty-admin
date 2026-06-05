import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import type { Customer } from '../../data/mockData';
import { ArrowLeft, Edit, Trash2, Calendar, Phone, Mail, MapPin, Tag, Compass, FileText, AlertTriangle } from 'lucide-react';

export const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      api.getCustomer(id)
        .then(data => {
          setCustomer(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError('Không thể tải thông tin khách hàng. Bản ghi có thể không tồn tại.');
          setLoading(false);
        });
    }
  }, [id]);

  const handleDelete = async () => {
    if (!customer) return;
    try {
      await api.deleteCustomer(customer.id);
      navigate('/crm/customers');
    } catch (err) {
      console.error(err);
      setError('Không thể xóa khách hàng này.');
    } finally {
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-750 p-4 rounded-xl max-w-lg mx-auto text-center space-y-3 text-xs">
        <p className="font-bold">{error || 'Không tìm thấy khách hàng'}</p>
        <Link to="/crm/customers" className="inline-block px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded font-bold uppercase transition-colors">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 text-xs">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/crm/customers"
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400">Chi tiết khách hàng</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-bold">{customer.code}</span>
            </div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight mt-0.5">{customer.name}</h2>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/crm/customers/${customer.id}/edit`}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded text-slate-650 font-bold transition-all cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>SỬA THÔNG TIN</span>
          </Link>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 hover:bg-red-100 text-red-650 rounded font-bold transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>XÓA BẢN GHI</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column: Customer Profile Details */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4 md:col-span-1">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 text-[10px]">
            Thông tin liên hệ
          </h3>

          <div className="space-y-3.5">
            {/* Phone */}
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-slate-400 block text-[10px]">Số điện thoại</span>
                <a href={`tel:${customer.phone}`} className="font-bold text-slate-800 hover:underline">
                  {customer.phone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-slate-400 block text-[10px]">Email</span>
                {customer.email ? (
                  <a href={`mailto:${customer.email}`} className="font-medium text-slate-800 hover:underline">
                    {customer.email}
                  </a>
                ) : (
                  <span className="text-slate-350 italic">Không có</span>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-slate-400 block text-[10px]">Địa chỉ</span>
                <span className="text-slate-700 font-medium leading-normal">
                  {customer.address || <span className="text-slate-350 italic">Không có</span>}
                </span>
              </div>
            </div>

            {/* Classification */}
            <div className="flex items-start gap-3">
              <Tag className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-slate-400 block text-[10px]">Phân loại</span>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  customer.classification === 'VIP'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : customer.classification === 'Đầu tư'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : customer.classification === 'Tiềm năng'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-655 border border-slate-200'
                }`}>
                  {customer.classification}
                </span>
              </div>
            </div>

            {/* Source */}
            <div className="flex items-start gap-3">
              <Compass className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-slate-400 block text-[10px]">Nguồn khách hàng</span>
                <span className="text-slate-700 font-semibold">{customer.source}</span>
              </div>
            </div>

            {/* Created At */}
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-slate-400 block text-[10px]">Ngày tạo</span>
                <span className="text-slate-700 font-medium">
                  {customer.createdAt ? new Date(customer.createdAt).toLocaleString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Needs & Notes */}
        <div className="space-y-4 md:col-span-2">
          {/* Needs Card */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2 text-[10px]">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Nhu cầu bất động sản</span>
            </h3>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-slate-700 font-medium leading-relaxed min-h-[100px] whitespace-pre-wrap">
              {customer.needs || <span className="text-slate-400 italic font-normal">Chưa ghi nhận thông tin nhu cầu mua/bán...</span>}
            </div>
          </div>

          {/* Notes Card */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2 text-[10px]">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Ghi chú (Noted)</span>
            </h3>
            <div className="p-4 bg-amber-50/30 border border-amber-100/50 rounded-lg text-slate-700 font-medium leading-relaxed min-h-[100px] whitespace-pre-wrap">
              {customer.note || <span className="text-slate-400 italic font-normal">Chưa có ghi chú đặc biệt nào...</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={() => setDeleteModalOpen(false)} />
          
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md p-5 overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150 text-xs">
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-sm uppercase">Xác nhận xóa vĩnh viễn?</h4>
                <p className="text-slate-500 leading-normal">
                  Bạn có chắc chắn muốn xóa khách hàng <strong className="text-slate-800">{customer.name}</strong>? Thao tác này sẽ xóa vĩnh viễn dữ liệu và không thể hoàn tác.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-3.5 py-2 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-655 font-bold uppercase transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDelete}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-750 text-white rounded font-bold uppercase transition-colors cursor-pointer"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
