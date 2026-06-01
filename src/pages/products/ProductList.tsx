import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MockDatabase } from '../../data/mockData';
import type { Product, Project } from '../../data/mockData';
import { Search, Plus, Eye, Edit, Trash2, AlertTriangle, Filter } from 'lucide-react';

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => MockDatabase.getProducts());
  const [projects] = useState<Project[]>(() => MockDatabase.getProjects());
  
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const handleDeleteClick = (prod: Product) => {
    setDeleteTarget(prod);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const updated = products.filter(p => p.id !== deleteTarget.id);
    MockDatabase.saveProducts(updated);
    setProducts(updated);
    setDeleteTarget(null);
  };

  const filteredProducts = products.filter(prod => {
    const matchesSearch = prod.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (prod.developer && prod.developer.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesProject = projectFilter === 'all' || prod.projectSlug === projectFilter;
    const matchesType = typeFilter === 'all' || prod.productType === typeFilter;
    const matchesStatus = statusFilter === 'all' || prod.status === statusFilter;
    
    return matchesSearch && matchesProject && matchesType && matchesStatus;
  });

  const getProjectName = (slug: string) => {
    if (slug === 'ngoai-du-an') return 'Ngoài dự án';
    const found = projects.find(p => p.slug === slug);
    return found ? found.name : slug;
  };

  return (
    <div className="space-y-4">
      {/* Action Header & Filters */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm text-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm theo tên, địa chỉ, chủ đầu tư..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Project Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded text-[11px] text-slate-550">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={projectFilter} 
              onChange={(e) => setProjectFilter(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer text-slate-700 font-bold"
            >
              <option value="all">Tất cả dự án</option>
              <option value="ngoai-du-an">Ngoài dự án</option>
              {projects.map(p => (
                <option key={p.id} value={p.slug}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded text-[11px] text-slate-555">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer text-slate-700 font-bold"
            >
              <option value="all">Tất cả loại hình</option>
              <option value="villa">Biệt thự</option>
              <option value="townhouse">Liền kề / Shophouse</option>
              <option value="apartment">Căn hộ chung cư</option>
              <option value="residential">Nhà thổ cư</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded text-[11px] text-slate-555">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer text-slate-700 font-bold"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Còn hàng">Còn hàng</option>
              <option value="Đang bán">Đang bán</option>
              <option value="Đã cọc">Đã cọc</option>
              <option value="Đã bán">Đã bán</option>
            </select>
          </div>

          {/* Add Button */}
          <Link 
            to="/products/new"
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold uppercase shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Đăng tin BĐS</span>
          </Link>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider">
                <th className="px-5 py-3">Hình ảnh & Tiêu đề</th>
                <th className="px-5 py-3">Dự án</th>
                <th className="px-5 py-3">Loại hình</th>
                <th className="px-5 py-3">Giá & Diện tích</th>
                <th className="px-5 py-3 text-center">Trạng thái</th>
                <th className="px-5 py-3 text-center w-28">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Image & Title */}
                    <td className="px-5 py-3.5 max-w-sm">
                      <div className="flex items-center gap-3">
                        <img 
                          src={prod.images[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=60&h=40&q=80'} 
                          alt={prod.title} 
                          className="w-10 h-10 rounded bg-slate-50 object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-800 hover:text-indigo-600 truncate">
                            <Link to={`/products/${prod.id}`}>{prod.title}</Link>
                          </div>
                          <span className="text-[10px] text-slate-500 truncate block mt-0.5">{prod.location}</span>
                        </div>
                      </div>
                    </td>

                    {/* Project */}
                    <td className="px-5 py-3.5 text-slate-750 font-bold text-[11px]">
                      {getProjectName(prod.projectSlug)}
                    </td>

                    {/* Product Type */}
                    <td className="px-5 py-3.5 text-slate-500">
                      <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[9px] font-bold text-slate-600">
                        {prod.productTypeName}
                      </span>
                    </td>

                    {/* Price & Area */}
                    <td className="px-5 py-3.5 text-[10px] space-y-0.5">
                      <div className="font-bold text-indigo-600">{prod.price} tỷ</div>
                      <div className="text-slate-500">{prod.area} m² ({prod.bedrooms} PN / {prod.bathrooms} WC)</div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-bold border ${
                        prod.status === 'Còn hàng' || prod.status === 'Đang bán'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                          : prod.status === 'Đã cọc'
                          ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                          : 'bg-rose-50 text-rose-700 border-rose-200/60'
                      }`}>
                        {prod.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        <Link 
                          to={`/products/${prod.id}`}
                          className="p-1.5 rounded text-slate-450 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link 
                          to={`/products/${prod.id}/edit`}
                          className="p-1.5 rounded text-slate-450 hover:bg-slate-100 hover:text-indigo-650 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(prod)}
                          className="p-1.5 rounded text-slate-450 hover:bg-slate-100 hover:text-red-650 transition-colors"
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
                    Không tìm thấy sản phẩm bất động sản nào phù hợp.
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
                <h4 className="font-bold text-slate-850 text-sm uppercase">Xác nhận xóa sản phẩm?</h4>
                <p className="text-slate-500 leading-normal">
                  Bạn có chắc chắn muốn xóa tin đăng sản phẩm <strong className="text-slate-850">{deleteTarget.title}</strong>? Thao tác này sẽ xóa vĩnh viễn tin đăng này và không thể phục hồi.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button 
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-2 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-655 font-bold uppercase transition-colors"
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
