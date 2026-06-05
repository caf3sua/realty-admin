import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import type { Customer } from '../../data/mockData';
import { Search, Plus, Eye, Edit, Trash2, AlertTriangle, Filter, UserCheck } from 'lucide-react';

export const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  const classifications = ['Tiềm năng', 'Đầu tư', 'VIP', 'Khác'];
  const sources = ['Facebook', 'Website', 'Hotline', 'Giới thiệu', 'Khác'];

  const fetchCustomers = () => {
    setLoading(true);
    api.getCustomers({
      search: searchQuery || undefined,
      classification: selectedClass || undefined,
      source: selectedSource || undefined
    })
      .then(data => {
        setCustomers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, [selectedClass, selectedSource]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleDeleteClick = (cust: Customer) => {
    setDeleteTarget(cust);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteCustomer(deleteTarget.id);
      setCustomers(customers.filter(c => c.id !== deleteTarget.id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading && customers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng theo tên, SĐT, mã, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all"
            />
          </div>

          {/* Classification Filter */}
          <div className="w-full md:w-48 shrink-0">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-600 transition-all cursor-pointer"
            >
              <option value="">-- Tất cả phân loại --</option>
              {classifications.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Source Filter */}
          <div className="w-full md:w-48 shrink-0">
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-600 transition-all cursor-pointer"
            >
              <option value="">-- Tất cả nguồn nhập --</option>
              {sources.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Submit Search & Reset Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold cursor-pointer shrink-0"
            >
              Tìm kiếm
            </button>
            <Link
              to="/crm/customers/new"
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold shadow-sm transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>THÊM KHÁCH HÀNG</span>
            </Link>
          </div>
        </form>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider">
                <th className="px-5 py-3">Mã KH</th>
                <th className="px-5 py-3">Họ Tên</th>
                <th className="px-5 py-3">Số Điện Thoại</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phân Loại</th>
                <th className="px-5 py-3">Nguồn Nhập</th>
                <th className="px-5 py-3">Ngày Tạo</th>
                <th className="px-5 py-3 text-center w-28">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {customers.length > 0 ? (
                customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Customer Code */}
                    <td className="px-5 py-3.5 font-semibold text-indigo-600">
                      {cust.code}
                    </td>

                    {/* Name */}
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      <Link to={`/crm/customers/${cust.id}`} className="hover:text-indigo-600 transition-colors">
                        {cust.name}
                      </Link>
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-3.5 text-slate-600 font-medium">
                      {cust.phone}
                    </td>

                    {/* Email */}
                    <td className="px-5 py-3.5 text-slate-500">
                      {cust.email || <span className="text-slate-350 italic">Không có</span>}
                    </td>

                    {/* Classification */}
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        cust.classification === 'VIP'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : cust.classification === 'Đầu tư'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : cust.classification === 'Tiềm năng'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {cust.classification}
                      </span>
                    </td>

                    {/* Source */}
                    <td className="px-5 py-3.5 text-slate-500 font-medium">
                      {cust.source}
                    </td>

                    {/* Created Date */}
                    <td className="px-5 py-3.5 text-slate-400">
                      {cust.createdAt ? new Date(cust.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '—'}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          to={`/crm/customers/${cust.id}`}
                          className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/crm/customers/${cust.id}/edit`}
                          className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(cust)}
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
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400 font-medium italic">
                    {loading ? 'Đang tải dữ liệu...' : 'Không tìm thấy khách hàng nào phù hợp.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
                <h4 className="font-bold text-slate-800 text-sm uppercase">Xác nhận xóa khách hàng?</h4>
                <p className="text-slate-500 leading-normal">
                  Bạn có chắc chắn muốn xóa khách hàng <strong className="text-slate-800">{deleteTarget.name}</strong> ({deleteTarget.code})? Thao tác này sẽ xóa vĩnh viễn dữ liệu và không thể hoàn tác.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-2 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-650 font-bold uppercase transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-750 text-white rounded font-bold uppercase transition-colors cursor-pointer"
              >
                Xóa khách hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
