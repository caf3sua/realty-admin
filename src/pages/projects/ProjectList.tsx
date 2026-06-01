import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MockDatabase } from '../../data/mockData';
import type { Project } from '../../data/mockData';
import { Search, Plus, Eye, Edit, Trash2, AlertTriangle, Filter } from 'lucide-react';

export const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(() => MockDatabase.getProjects());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const handleDeleteClick = (project: Project) => {
    setDeleteTarget(project);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const updated = projects.filter(p => p.id !== deleteTarget.id);
    MockDatabase.saveProjects(updated);
    setProjects(updated);
    setDeleteTarget(null);
  };

  const filteredProjects = projects.filter(proj => {
    const matchesSearch = proj.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          proj.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          proj.developer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || proj.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Action Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm text-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm dự án theo tên, vị trí, chủ đầu tư..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent focus:outline-none text-[11px] font-bold cursor-pointer text-slate-700"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Đang mở bán">Đang mở bán</option>
              <option value="Sắp mở bán">Sắp mở bán</option>
              <option value="Đã bàn giao">Đã bàn giao</option>
            </select>
          </div>

          {/* Add Button */}
          <Link 
            to="/projects/new"
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold uppercase shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Dự Án</span>
          </Link>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider">
                <th className="px-5 py-3">Hình ảnh & Tên</th>
                <th className="px-5 py-3">Chủ đầu tư</th>
                <th className="px-5 py-3">Vị trí</th>
                <th className="px-5 py-3">Quy mô & Khoảng giá</th>
                <th className="px-5 py-3 text-center">Trạng thái</th>
                <th className="px-5 py-3 text-center w-28">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Image & Name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img 
                          src={proj.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=60&h=40&q=80'} 
                          alt={proj.name} 
                          className="w-10 h-7 rounded bg-slate-50 object-cover border border-slate-200 shrink-0"
                        />
                        <div className="font-bold text-slate-800 hover:text-indigo-650">
                          <Link to={`/projects/${proj.id}`}>{proj.name}</Link>
                        </div>
                      </div>
                    </td>

                    {/* Developer */}
                    <td className="px-5 py-3.5 text-slate-700 font-bold">
                      {proj.developer}
                    </td>

                    {/* Location */}
                    <td className="px-5 py-3.5 text-slate-500 max-w-[160px] truncate">
                      {proj.location}
                    </td>

                    {/* Scale & Price Range */}
                    <td className="px-5 py-3.5 space-y-0.5 text-[10px]">
                      <div>Quy mô: <span className="text-slate-800 font-bold">{proj.scale}</span></div>
                      <div className="text-slate-400">Giá: <span className="text-slate-600">{proj.priceRange}</span></div>
                    </td>

                    {/* Status badge */}
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-bold border ${
                        proj.status === 'Đang mở bán' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                          : proj.status === 'Sắp mở bán'
                          ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {proj.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        <Link 
                          to={`/projects/${proj.id}`}
                          className="p-1.5 rounded text-slate-450 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link 
                          to={`/projects/${proj.id}/edit`}
                          className="p-1.5 rounded text-slate-450 hover:bg-slate-100 hover:text-indigo-655 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(proj)}
                          className="p-1.5 rounded text-slate-450 hover:bg-slate-100 hover:text-red-600 transition-colors"
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
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400 font-medium italic">
                    Không tìm thấy dự án nào phù hợp.
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
              <div className="w-9 h-9 rounded bg-red-50 border border-red-100 flex items-center justify-center text-red-650 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-850 text-sm uppercase">Xác nhận xóa dự án?</h4>
                <p className="text-slate-500 leading-normal">
                  Bạn có chắc chắn muốn xóa dự án <strong className="text-slate-850">{deleteTarget.name}</strong>? Thao tác này cũng có thể làm gián đoạn các liên kết sản phẩm và không thể hoàn tác.
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
