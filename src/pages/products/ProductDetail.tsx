import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MockDatabase } from '../../data/mockData';
import { ArrowLeft, Edit, Building2, MapPin, Layers, Key, Navigation, Bed, Bath, Maximize2 } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const products = MockDatabase.getProducts();
  const product = products.find(p => p.id === id);
  const projects = MockDatabase.getProjects();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-4 text-xs">
        <h3 className="text-sm font-bold text-slate-800">KHÔNG TÌM THẤY SẢN PHẨM</h3>
        <p className="text-slate-500">Sản phẩm này không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
        <button onClick={() => navigate('/products')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold uppercase cursor-pointer">
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const getProjectName = (slug: string) => {
    if (slug === 'ngoai-du-an') return 'Ngoài dự án';
    const found = projects.find(p => p.slug === slug);
    return found ? found.name : slug;
  };

  const getProjectLink = (slug: string) => {
    if (slug === 'ngoai-du-an') return null;
    const found = projects.find(p => p.slug === slug);
    return found ? `/projects/${found.id}` : null;
  };

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'];

  return (
    <div className="space-y-6 text-xs">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/products')}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Danh sách sản phẩm</span>
        </button>
        
        <Link 
          to={`/products/${product.id}/edit`}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-indigo-600 hover:text-indigo-700 hover:border-slate-350 rounded font-bold uppercase transition-colors"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Chỉnh sửa tin đăng</span>
        </Link>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Images & Specs (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Images Section */}
          <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm p-4 space-y-3">
            {/* Active image */}
            <div className="relative h-80 sm:h-96 w-full rounded overflow-hidden bg-slate-50 border border-slate-200">
              <img 
                src={images[activeImageIndex]} 
                alt={product.title} 
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-4 right-4 bg-slate-900/70 backdrop-blur-xs px-3 py-1 rounded text-white text-[10px] font-bold">
                {activeImageIndex + 1} / {images.length}
              </span>
            </div>

            {/* Thumbnail list */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-12 rounded overflow-hidden border transition-all shrink-0 cursor-pointer ${
                      idx === activeImageIndex ? 'border-indigo-600 scale-95 ring-1 ring-indigo-600/35' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Specs */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-5">
            
            {/* Title & Price Row */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-slate-55 text-slate-500 text-[9px] font-bold border border-slate-200 uppercase tracking-wider">
                  {product.productTypeName}
                </span>
                {product.isPremium && (
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[9px] font-bold border border-amber-200/60 uppercase tracking-wider">
                    PREMIUM
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                  product.status === 'Còn hàng' || product.status === 'Đang bán'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                    : product.status === 'Đã cọc'
                    ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                    : 'bg-rose-55 text-rose-700 border-rose-200/60'
                }`}>
                  {product.status}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-800 leading-snug">{product.title}</h2>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1.5">
                <div className="flex items-baseline gap-1 text-slate-500">
                  Giá bán: <span className="text-xl font-bold text-indigo-600">{product.price} Tỷ VNĐ</span>
                </div>
                {product.pricePerSqm && (
                  <div className="flex items-center gap-1 text-slate-400 mt-1">
                    Đơn giá: <span className="text-slate-600 font-bold">{product.pricePerSqm} triệu/m²</span>
                  </div>
                )}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Room Specs Icons */}
            <div className="grid grid-cols-3 gap-4 text-center bg-slate-50/50 rounded border border-slate-200 p-3 text-slate-700">
              <div className="space-y-1">
                <Maximize2 className="w-4 h-4 mx-auto text-slate-450" />
                <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Diện tích</span>
                <span className="font-bold text-slate-800">{product.area} m²</span>
              </div>
              <div className="space-y-1 border-x border-slate-200">
                <Bed className="w-4 h-4 mx-auto text-slate-450" />
                <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Phòng ngủ</span>
                <span className="font-bold text-slate-800">{product.bedrooms} PN</span>
              </div>
              <div className="space-y-1">
                <Bath className="w-4 h-4 mx-auto text-slate-450" />
                <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Phòng tắm</span>
                <span className="font-bold text-slate-800">{product.bathrooms} WC</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Mô tả sản phẩm</h4>
              <p className="text-slate-655 font-medium leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

          </div>

        </div>

        {/* Right Column: Metadata & Details (1/3 width) */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm h-fit space-y-5">
          
          <h4 className="font-bold text-slate-800 uppercase text-xs border-b border-slate-100 pb-2.5">Thông số chi tiết</h4>
          
          <div className="space-y-3.5">
            
            {/* Project relation */}
            <div className="flex justify-between items-start gap-4">
              <span className="text-slate-400 font-bold flex items-center gap-1.5 shrink-0">
                <Layers className="w-3.5 h-3.5" />
                Dự án:
              </span>
              {getProjectLink(product.projectSlug) ? (
                <Link 
                  to={getProjectLink(product.projectSlug)!}
                  className="font-bold text-indigo-600 hover:text-indigo-700 text-right hover:underline"
                >
                  {getProjectName(product.projectSlug)}
                </Link>
              ) : (
                <span className="font-bold text-slate-700 text-right">{getProjectName(product.projectSlug)}</span>
              )}
            </div>

            {/* Developer relation */}
            {product.developer && (
              <div className="flex justify-between items-center gap-4">
                <span className="text-slate-400 font-bold flex items-center gap-1.5 shrink-0">
                  <Building2 className="w-3.5 h-3.5" />
                  Chủ đầu tư:
                </span>
                <span className="font-bold text-slate-700 text-right">{product.developer}</span>
              </div>
            )}

            {/* Location */}
            <div className="flex justify-between items-start gap-4">
              <span className="text-slate-400 font-bold flex items-center gap-1.5 shrink-0">
                <MapPin className="w-3.5 h-3.5" />
                Địa chỉ:
              </span>
              <span className="font-semibold text-slate-600 text-right leading-relaxed">{product.location}</span>
            </div>

            {/* Legal */}
            <div className="flex justify-between items-center gap-4">
              <span className="text-slate-400 font-bold flex items-center gap-1.5 shrink-0">
                <Key className="w-3.5 h-3.5" />
                Pháp lý:
              </span>
              <span className="font-bold text-slate-700 text-right">{product.legal || 'Đang cập nhật'}</span>
            </div>

            {/* Direction */}
            <div className="flex justify-between items-center gap-4">
              <span className="text-slate-400 font-bold flex items-center gap-1.5 shrink-0">
                <Navigation className="w-3.5 h-3.5" />
                Hướng nhà:
              </span>
              <span className="font-bold text-slate-700 text-right">{product.direction || 'Đang cập nhật'}</span>
            </div>
            
          </div>

          <hr className="border-slate-100" />

          {/* System metadata */}
          <div className="space-y-2 text-[10px] text-slate-400">
            <h5 className="font-bold text-slate-500 uppercase tracking-widest text-[9px]">SIÊU DỮ LIỆU</h5>
            <div className="flex justify-between">
              <span>Mã ID:</span>
              <span className="font-semibold text-slate-700">{product.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Đường dẫn:</span>
              <span className="font-semibold text-slate-700 truncate max-w-[120px]" title={product.slug}>{product.slug}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
