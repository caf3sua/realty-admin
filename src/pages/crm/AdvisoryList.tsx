import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import type { Advisory } from '../../data/mockData';
import { Search, Eye, Trash2, AlertTriangle, ExternalLink, Calendar, Phone } from 'lucide-react';

export const AdvisoryList: React.FC = () => {
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Advisory | null>(null);
  const [selectedAdvisory, setSelectedAdvisory] = useState<Advisory | null>(null);

  const statuses = ['Mới', 'Đã liên hệ', 'Đang xử lý', 'Đóng'];

  const fetchAdvisories = () => {
    setLoading(true);
    api.getAdvisories({
      search: searchQuery || undefined,
      status: statusFilter || undefined
    })
      .then(data => {
        setAdvisories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAdvisories();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAdvisories();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const updated = await api.updateAdvisoryStatus(id, newStatus);
      setAdvisories(advisories.map(a => a.id === id ? { ...a, status: updated.status } : a));
      if (selectedAdvisory && selectedAdvisory.id === id) {
        setSelectedAdvisory({ ...selectedAdvisory, status: updated.status });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClick = (adv: Advisory) => {
    setDeleteTarget(adv);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteAdvisory(deleteTarget.id);
      setAdvisories(advisories.filter(a => a.id !== deleteTarget.id));
      if (selectedAdvisory && selectedAdvisory.id === deleteTarget.id) {
        setSelectedAdvisory(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading && advisories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-xs">
      {/* Search & Filter Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khách, SĐT, thông tin tư vấn, tên BĐS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-48 shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-655 transition-all cursor-pointer"
            >
              <option value="">-- Tất cả trạng thái --</option>
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold cursor-pointer shrink-0"
          >
            Tìm kiếm
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Advisories List Table - Left 2 Columns */}
        <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="px-5 py-3">Khách hàng</th>
                  <th className="px-5 py-3">BĐS Quan Tâm</th>
                  <th className="px-5 py-3">Trạng thái</th>
                  <th className="px-5 py-3">Ngày gửi</th>
                  <th className="px-5 py-3 text-center w-24">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-750">
                {advisories.length > 0 ? (
                  advisories.map((adv) => (
                    <tr 
                      key={adv.id} 
                      className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedAdvisory?.id === adv.id ? 'bg-indigo-50/30' : ''}`}
                      onClick={() => setSelectedAdvisory(adv)}
                    >
                      {/* Customer Info */}
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{adv.name}</div>
                        <div className="text-slate-500 font-medium mt-0.5">{adv.phone}</div>
                      </td>

                      {/* Property Interested */}
                      <td className="px-5 py-3.5 max-w-xs">
                        {adv.productSlug ? (
                          <div className="space-y-0.5">
                            <div className="font-semibold text-slate-800 line-clamp-1">{adv.productName}</div>
                            <Link 
                              to={`/products/${adv.productSlug}`}
                              onClick={(e) => e.stopPropagation()} // Prevent selecting row when clicking link
                              className="inline-flex items-center gap-0.5 text-indigo-650 hover:text-indigo-850 hover:underline font-bold text-[10px]"
                            >
                              <span>Xem sản phẩm</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Yêu cầu tư vấn chung</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={adv.status}
                          onChange={(e) => handleStatusChange(adv.id, e.target.value)}
                          className={`px-2 py-1 bg-white border border-slate-200 rounded font-bold text-[10px] uppercase cursor-pointer ${
                            adv.status === 'Mới'
                              ? 'text-indigo-600 bg-indigo-50 border-indigo-200'
                              : adv.status === 'Đã liên hệ'
                              ? 'text-amber-600 bg-amber-50 border-amber-200'
                              : adv.status === 'Đang xử lý'
                              ? 'text-sky-600 bg-sky-50 border-sky-200'
                              : 'text-slate-600 bg-slate-50 border-slate-200'
                          }`}
                        >
                          {statuses.map(st => (
                            <option key={st} value={st} className="text-slate-750 bg-white font-medium">{st}</option>
                          ))}
                        </select>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5 text-slate-400 font-semibold">
                        {adv.createdAt ? new Date(adv.createdAt).toLocaleDateString('vi-VN', {
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '—'}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedAdvisory(adv)}
                            className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(adv)}
                            className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-red-650 transition-colors cursor-pointer"
                            title="Xóa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-400 font-medium italic">
                      Không tìm thấy yêu cầu tư vấn nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Advisory Detail - Right 1 Column */}
        <div className="lg:col-span-1">
          {selectedAdvisory ? (
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4 sticky top-20 animate-in slide-in-from-right-10 duration-200">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                <div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    selectedAdvisory.status === 'Mới'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : selectedAdvisory.status === 'Đã liên hệ'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : selectedAdvisory.status === 'Đang xử lý'
                      ? 'bg-sky-50 text-sky-700 border border-sky-200'
                      : 'bg-slate-100 text-slate-655 border border-slate-200'
                  }`}>
                    {selectedAdvisory.status}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-2">{selectedAdvisory.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedAdvisory(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold px-1 py-0.5 rounded hover:bg-slate-100"
                >
                  Đóng
                </button>
              </div>

              {/* Contact info info */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`tel:${selectedAdvisory.phone}`} className="font-bold text-indigo-650 hover:underline">
                    {selectedAdvisory.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500 font-medium">
                    {selectedAdvisory.createdAt ? new Date(selectedAdvisory.createdAt).toLocaleString('vi-VN') : '—'}
                  </span>
                </div>
              </div>

              {/* Real Estate Property details */}
              {selectedAdvisory.productSlug && (
                <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-3 space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Sản phẩm quan tâm</span>
                  <div className="font-bold text-slate-800 leading-snug">{selectedAdvisory.productName}</div>
                  <Link 
                    to={`/products/${selectedAdvisory.productSlug}`}
                    className="inline-flex items-center gap-0.5 text-indigo-600 font-bold hover:underline text-[10px] mt-1"
                  >
                    <span>Xem trang quản trị BĐS</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {/* Content requested */}
              <div className="space-y-1.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Nội dung yêu cầu tư vấn</span>
                <div className="p-3 bg-amber-50/20 border border-amber-100/50 rounded-lg text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                  {selectedAdvisory.details}
                </div>
              </div>

              {/* Quick Status Action */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Cập nhật nhanh trạng thái</label>
                <div className="flex gap-2">
                  {statuses.map(st => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedAdvisory.id, st)}
                      className={`flex-1 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer text-center ${
                        selectedAdvisory.status === st
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-455 font-medium italic sticky top-20 min-h-[250px] flex flex-col justify-center items-center">
              <span>Chọn một yêu cầu tư vấn trong danh sách để xem chi tiết thông tin và xử lý.</span>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={() => setDeleteTarget(null)} />
          
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md p-5 overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150 text-xs">
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-sm uppercase">Xác nhận xóa yêu cầu tư vấn?</h4>
                <p className="text-slate-500 leading-normal">
                  Bạn có chắc chắn muốn xóa yêu cầu tư vấn của khách hàng <strong className="text-slate-800">{deleteTarget.name}</strong>? Thao tác này sẽ xóa vĩnh viễn và không thể khôi phục.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-2 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-655 font-bold uppercase cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-750 text-white rounded font-bold uppercase cursor-pointer"
              >
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
