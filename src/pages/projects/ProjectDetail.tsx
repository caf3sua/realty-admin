import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import type { Project, Product } from '../../data/mockData';
import { ArrowLeft, Edit, Building2, MapPin, Tag, Box } from 'lucide-react';

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      try {
        const proj = await api.getProject(slug);
        setProject(proj);
        const allProducts = await api.getProducts({ project_slug: proj.slug });
        setProducts(allProducts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-4 text-xs">
        <h3 className="text-sm font-bold text-slate-800">KHÔNG TÌM THẤY DỰ ÁN</h3>
        <p className="text-slate-500">Dự án này không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
        <button onClick={() => navigate('/projects')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold uppercase cursor-pointer">
          Quay lại danh sách
        </button>
      </div>
    );
  }


  return (
    <div className="space-y-6 text-xs">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/projects')}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Danh sách dự án</span>
        </button>
        
        <Link 
          to={`/projects/${project.slug}/edit`}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-555 text-indigo-600 hover:text-indigo-700 hover:border-slate-350 rounded font-bold uppercase transition-colors"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Chỉnh sửa dự án</span>
        </Link>
      </div>

      {/* Banner & General Specs Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
        {/* Banner Image */}
        <div className="relative h-48 lg:h-64 w-full bg-slate-100">
          <img 
            src={project.banner || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&h=400&q=80'} 
            alt={project.name} 
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
          
          {/* Banner Floating Title */}
          <div className="absolute bottom-5 left-5 right-5 text-white space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[8px] font-bold bg-indigo-600 text-white uppercase`}>
                {project.status}
              </span>
              <span className="text-[10px] font-bold opacity-90 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-white" />
                {project.developer}
              </span>
            </div>
            <h3 className="text-xl lg:text-2xl font-bold">{project.name}</h3>
          </div>
        </div>

        {/* Specs Details Grid */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-700 bg-slate-50/50 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white border border-slate-200 text-indigo-650 flex items-center justify-center shrink-0 shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Vị trí</span>
              <span className="font-semibold block truncate max-w-[200px]">{project.location}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 border-y sm:border-y-0 sm:border-x border-slate-200 py-3 sm:py-0 sm:px-4">
            <div className="w-8 h-8 rounded bg-white border border-slate-200 text-indigo-650 flex items-center justify-center shrink-0 shadow-xs">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Quy mô</span>
              <span className="font-semibold block">{project.scale}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-white border border-slate-200 text-indigo-655 flex items-center justify-center shrink-0 shadow-xs">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Khoảng giá bán</span>
              <span className="font-semibold block">{project.priceRange}</span>
            </div>
          </div>
        </div>
      </div>

      {/* About & Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Description */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-5">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Tổng quan dự án</h4>
            <p className="text-slate-655 font-medium leading-relaxed">
              {project.shortDescription}
            </p>
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-2">
            <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Chi tiết dự án</h4>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>
        </div>

        {/* Right Column: Tags & Info */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-5">
          {/* Tags */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Tiện ích & Tags</h4>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[9px] font-bold text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Quick info */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Siêu dữ liệu</h4>
            <div className="space-y-2 text-[10px] text-slate-400">
              <div className="flex justify-between">
                <span>Mã số (ID):</span>
                <span className="font-semibold text-slate-700">{project.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Đường dẫn (Slug):</span>
                <span className="font-semibold text-slate-700">{project.slug}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products under this project */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-slate-400" />
            <h4 className="font-bold text-slate-800 uppercase text-xs">Sản phẩm căn hộ thuộc dự án ({products.length})</h4>
          </div>
          <Link 
            to={`/products/new?project=${encodeURIComponent(project.name)}`}
            className="text-[10px] font-bold text-indigo-650 hover:text-indigo-700 uppercase"
          >
            + ĐĂNG BÁN SẢN PHẨM MỚI
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((prod) => (
              <Link 
                key={prod.id} 
                to={`/products/${prod.slug}`}
                className="border border-slate-200 hover:border-slate-350 rounded p-3 flex gap-3 transition-all group bg-slate-50/30 hover:bg-slate-50"
              >
                <img 
                  src={prod.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=80&h=80&q=80'} 
                  alt={prod.title} 
                  className="w-16 h-16 rounded object-cover shrink-0 border border-slate-200"
                />
                <div className="min-w-0 flex flex-col justify-between flex-1">
                  <div>
                    <h5 className="font-bold text-slate-800 group-hover:text-indigo-650 line-clamp-2 leading-relaxed transition-colors">{prod.title}</h5>
                    <p className="text-[9px] text-slate-500 truncate mt-0.5">{prod.location}</p>
                  </div>
                  <div className="flex items-center justify-between gap-1 mt-2 text-[10px]">
                    <span className="font-bold text-indigo-600">{prod.price} Tỷ</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                      prod.status === 'Còn hàng' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                        : prod.status === 'Đã cọc'
                        ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                        : 'bg-rose-50 text-rose-700 border-rose-200/60'
                    }`}>
                      {prod.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 font-medium italic pt-2">Chưa có sản phẩm căn hộ nào thuộc dự án này được chào bán.</p>
        )}
      </div>
    </div>
  );
};
