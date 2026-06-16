import React, { useState, useEffect } from 'react';
import { Settings, CheckCircle2, XCircle, Plus, Edit2, Trash2, X, AlertTriangle, Image as ImageIcon, Upload } from 'lucide-react';
import { api } from '../../services/api';
import type { Amenity } from '../../data/mockData';

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  'all': 'Tất cả',
  'apartment': 'Căn hộ',
  'villa': 'Biệt thự',
  'townhouse': 'Nhà phố / Liền kề',
  'shophouse': 'Shophouse'
};

export const AmenitiesList: React.FC = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{name: string, product_type: Amenity['product_type'], icon?: string, is_active: boolean}>({
    name: '',
    product_type: 'all',
    icon: '',
    is_active: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Delete states
  const [deleteTarget, setDeleteTarget] = useState<Amenity | null>(null);

  const fetchAmenities = async () => {
    setLoading(true);
    try {
      const data = await api.getAmenities(filterType || undefined);
      setAmenities(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, [filterType]);

  const handleOpenModal = (amenity?: Amenity) => {
    if (amenity) {
      setEditingId(amenity.id);
      setFormData({
        name: amenity.name,
        product_type: amenity.product_type,
        icon: amenity.icon || '',
        is_active: amenity.is_active
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        product_type: 'all',
        icon: '',
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await api.uploadFile(file);
      setFormData({ ...formData, icon: res.url });
    } catch (err) {
      console.error(err);
      alert('Không thể tải ảnh lên');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.updateAmenity(editingId, formData);
      } else {
        await api.createAmenity(formData);
      }
      handleCloseModal();
      fetchAmenities();
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi lưu tiện ích!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (amenity: Amenity) => {
    setDeleteTarget(amenity);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteAmenity(deleteTarget.id);
      setAmenities(amenities.filter(a => a.id !== deleteTarget.id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleToggleActive = async (amenity: Amenity) => {
    try {
      await api.updateAmenity(amenity.id, {
        name: amenity.name,
        product_type: amenity.product_type,
        is_active: !amenity.is_active
      });
      fetchAmenities();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4 text-xs max-w-5xl mx-auto">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-650 shrink-0" />
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Danh sách Tiện ích</h3>
            <p className="text-[10px] text-slate-455 font-medium mt-0.5">Quản lý danh mục các tiện ích dự án</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-655 transition-all cursor-pointer font-medium"
          >
            <option value="">Tất cả loại hình</option>
            {Object.entries(PRODUCT_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded font-bold uppercase transition-colors hover:bg-indigo-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm tiện ích</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="px-5 py-3">Tên Tiện Ích</th>
                <th className="px-5 py-3 text-center w-20">Icon</th>
                <th className="px-5 py-3">Loại hình sản phẩm</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-755">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400 font-medium italic">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : amenities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400 font-medium italic">
                    Không có tiện ích nào.
                  </td>
                </tr>
              ) : (
                amenities.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{item.name}</td>
                    <td className="px-5 py-3.5 text-center">
                      {item.icon ? (
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center mx-auto">
                          <img src={item.icon} alt={item.name} className="w-5 h-5 object-contain" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200/50 text-slate-300 flex items-center justify-center mx-auto">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">
                      {PRODUCT_TYPE_LABELS[item.product_type] || item.product_type}
                    </td>
                    <td className="px-5 py-3.5">
                      <button 
                        onClick={() => handleToggleActive(item)}
                        className="cursor-pointer flex items-center gap-2"
                        title="Click để thay đổi trạng thái"
                      >
                        {item.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase text-[9px]">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Hoạt động</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 font-bold uppercase text-[9px]">
                            <XCircle className="w-2.5 h-2.5" />
                            <span>Bị ẩn</span>
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-1.5 rounded text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-red-650 transition-colors cursor-pointer"
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Cập nhật / Thêm mới */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={handleCloseModal} />
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md p-6 border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900 text-base">
                {editingId ? 'Chỉnh sửa Tiện ích' : 'Thêm Tiện ích mới'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tên tiện ích <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Bể bơi vô cực..."
                  className="w-full px-3 py-2 border border-slate-200 rounded focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/20 text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Áp dụng cho loại hình</label>
                <select
                  value={formData.product_type}
                  onChange={(e) => setFormData({ ...formData, product_type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/20 text-sm outline-none transition-all cursor-pointer"
                >
                  {Object.entries(PRODUCT_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">Phân loại này giúp hiển thị tiện ích tương ứng với từng loại bất động sản.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Biểu tượng (Icon)</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                    {formData.icon ? (
                      <img src={formData.icon} alt="Icon" className="w-8 h-8 object-contain" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      id="icon-upload"
                      className="hidden"
                    />
                    <label
                      htmlFor="icon-upload"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer transition-colors"
                    >
                      {isUploading ? (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>Tải ảnh lên</span>
                    </label>
                    <p className="text-[10px] text-slate-500 mt-1">Hỗ trợ SVG, PNG trong suốt. Kích thước &lt; 1MB (Không bắt buộc).</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-600/20 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Kích hoạt (Hiển thị ra ngoài trang chủ)
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-slate-200 rounded text-slate-600 font-bold uppercase hover:bg-slate-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded font-bold uppercase hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu Tiện Ích'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xóa */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md p-5 overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-sm uppercase">Xác nhận xóa tiện ích?</h4>
                <p className="text-slate-500 leading-normal text-xs">
                  Bạn có chắc chắn muốn xóa tiện ích <strong className="text-slate-800">{deleteTarget.name}</strong>? Thao tác này sẽ xóa vĩnh viễn dữ liệu.
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
