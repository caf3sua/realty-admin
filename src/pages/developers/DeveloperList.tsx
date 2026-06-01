import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MockDatabase } from '../../data/mockData';
import type { Developer } from '../../data/mockData';
import { Search, Plus, Eye, Edit, Trash2, AlertTriangle } from 'lucide-react';

export const DeveloperList: React.FC = () => {
  const [developers, setDevelopers] = useState<Developer[]>(() => MockDatabase.getDevelopers());
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Developer | null>(null);

  const handleDeleteClick = (dev: Developer) => {
    setDeleteTarget(dev);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const updated = developers.filter(d => d.id !== deleteTarget.id);
    MockDatabase.saveDevelopers(updated);
    setDevelopers(updated);
    setDeleteTarget(null);
  };

  const filteredDevelopers = developers.filter(dev => 
    dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dev.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm chủ đầu tư theo tên hoặc slogan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all"
          />
        </div>

        {/* Add Button */}
        <Link 
          to="/developers/new"
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>THÊM CHỦ ĐẦU TƯ</span>
        </Link>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider">
                <th className="px-5 py-3">Logo & Tên</th>
                <th className="px-5 py-3">Slogan / Tiêu đề</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3 text-center w-28">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredDevelopers.length > 0 ? (
                filteredDevelopers.map((dev) => (
                  <tr key={dev.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Logo & Name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img 
                          src={dev.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=40&h=40&q=80'} 
                          alt={dev.name} 
                          className="w-8 h-8 rounded bg-slate-50 object-cover border border-slate-200 shrink-0"
                        />
                        <div className="font-bold text-slate-800 hover:text-indigo-600">
                          <Link to={`/developers/${dev.id}`}>{dev.name}</Link>
                        </div>
                      </div>
                    </td>

                    {/* Slogan */}
                    <td className="px-5 py-3.5 text-slate-500 max-w-xs truncate">
                      {dev.title}
                    </td>

                    {/* Slug */}
                    <td className="px-5 py-3.5 text-slate-400 font-semibold">
                      {dev.slug}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        <Link 
                          to={`/developers/${dev.id}`}
                          className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link 
                          to={`/developers/${dev.id}/edit`}
                          className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(dev)}
                          className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-red-600 transition-colors"
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
                  <td colSpan={4} className="px-5 py-12 text-center text-slate-400 font-medium italic">
                    Không tìm thấy chủ đầu tư nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={() => setDeleteTarget(null)} />
          
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md p-5 overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150 text-xs">
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-sm uppercase">Xác nhận xóa chủ đầu tư?</h4>
                <p className="text-slate-500 leading-normal">
                  Bạn có chắc chắn muốn xóa chủ đầu tư <strong className="text-slate-850">{deleteTarget.name}</strong>? Thao tác này sẽ xóa vĩnh viễn thông tin và không thể hoàn tác.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button 
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-2 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-600 font-bold uppercase transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold uppercase transition-colors"
              >
                Xóa bản ghi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
