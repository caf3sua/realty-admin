import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import type { Newsletter } from '../../data/mockData';
import { Mail, Trash2, AlertTriangle, ToggleLeft, ToggleRight, CheckCircle2, XCircle } from 'lucide-react';

export const NewsletterList: React.FC = () => {
  const [emails, setEmails] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>(''); // '', 'true', 'false'
  const [deleteTarget, setDeleteTarget] = useState<Newsletter | null>(null);

  const fetchEmails = () => {
    setLoading(true);
    const activeParam = activeFilter === '' ? undefined : activeFilter === 'true';
    api.getNewsletters(activeParam)
      .then(data => {
        setEmails(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEmails();
  }, [activeFilter]);

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const updated = await api.toggleNewsletterActive(id, !currentActive);
      setEmails(emails.map(e => e.id === id ? { ...e, active: updated.active } : e));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClick = (nsl: Newsletter) => {
    setDeleteTarget(nsl);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteNewsletter(deleteTarget.id);
      setEmails(emails.filter(e => e.id !== deleteTarget.id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading && emails.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-xs max-w-4xl mx-auto">
      {/* Action and Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-indigo-650 shrink-0" />
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Danh sách đăng ký nhận tin</h3>
            <p className="text-[10px] text-slate-455 font-medium mt-0.5">Quản lý danh sách email subscribe nhận thông tin dự án mới</p>
          </div>
        </div>

        {/* Filter select */}
        <div className="w-full sm:w-48 shrink-0">
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-655 transition-all cursor-pointer font-medium"
          >
            <option value="">-- Tất cả trạng thái --</option>
            <option value="true">Đang hoạt động</option>
            <option value="false">Đã hủy đăng ký</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="px-5 py-3">Địa chỉ Email</th>
                <th className="px-5 py-3">Ngày đăng ký</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3 text-center w-28">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-755">
              {emails.length > 0 ? (
                emails.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Email */}
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      <a href={`mailto:${item.email}`} className="hover:text-indigo-650 hover:underline">
                        {item.email}
                      </a>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-3.5 text-slate-455 font-semibold">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '—'}
                    </td>

                    {/* Active Status Badge & Switch */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {item.active ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase text-[9px]">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Hoạt động</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 font-bold uppercase text-[9px]">
                            <XCircle className="w-2.5 h-2.5" />
                            <span>Đã hủy</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-2.5">
                        {/* Toggle active state */}
                        <button
                          onClick={() => handleToggleActive(item.id, item.active)}
                          className={`p-1 rounded transition-colors cursor-pointer ${
                            item.active
                              ? 'text-indigo-650 hover:bg-indigo-50'
                              : 'text-slate-400 hover:bg-slate-100'
                          }`}
                          title={item.active ? "Tắt hoạt động (Hủy đăng ký)" : "Bật hoạt động (Đăng ký lại)"}
                        >
                          {item.active ? (
                            <ToggleRight className="w-6 h-6" />
                          ) : (
                            <ToggleLeft className="w-6 h-6" />
                          )}
                        </button>

                        {/* Delete permanently */}
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-red-650 transition-colors cursor-pointer"
                          title="Xóa vĩnh viễn"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-slate-400 font-medium italic">
                    {loading ? 'Đang tải dữ liệu...' : 'Không tìm thấy email subscribe nào.'}
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
                <h4 className="font-bold text-slate-800 text-sm uppercase">Xác nhận xóa đăng ký?</h4>
                <p className="text-slate-500 leading-normal">
                  Bạn có chắc chắn muốn xóa email <strong className="text-slate-800">{deleteTarget.email}</strong> khỏi danh sách? Thao tác này sẽ xóa vĩnh viễn dữ liệu và không thể hoàn tác.
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
                className="px-3.5 py-2 bg-red-600 hover:bg-red-750 text-white rounded font-bold uppercase transition-colors cursor-pointer"
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
