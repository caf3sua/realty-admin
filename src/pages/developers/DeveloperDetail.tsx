import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import type { Developer, Project } from '../../data/mockData';
import { ArrowLeft, Edit, Layers, Globe } from 'lucide-react';

export const DeveloperDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      try {
        const [dev, projs] = await Promise.all([
          api.getDeveloper(slug),
          api.getProjects()
        ]);
        setDeveloper(dev);
        setProjects(projs.filter(p => p.developer.toLowerCase() === dev.name.toLowerCase()));
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

  if (!developer) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-4 text-xs">
        <h3 className="text-sm font-bold text-slate-800">KHÔNG TÌM THẤY CHỦ ĐẦU TƯ</h3>
        <p className="text-slate-500">Chủ đầu tư này không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
        <button onClick={() => navigate('/developers')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold uppercase cursor-pointer">
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-xs">
      {/* Back & Edit Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/developers')}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Danh sách chủ đầu tư</span>
        </button>
        
        <Link 
          to={`/developers/${developer.slug}/edit`}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-555 text-indigo-600 hover:text-indigo-750 rounded font-bold uppercase transition-colors"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Chỉnh sửa thông tin</span>
        </Link>
      </div>

      {/* Main Info Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 lg:p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <img 
            src={developer.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=150&h=150&q=80'} 
            alt={developer.name} 
            className="w-20 h-20 sm:w-24 sm:h-24 rounded bg-slate-50 object-cover border border-slate-200 shadow-sm shrink-0"
          />
          <div className="space-y-2.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200/80 uppercase tracking-widest">
                DEVELOPER RECORD
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-none">{developer.name}</h3>
            <p className="text-slate-550 italic">"{developer.title}"</p>
            
            <div className="flex flex-wrap gap-4 text-[10px] text-slate-400 font-semibold">
              <span>ID: <span className="text-slate-700">{developer.id}</span></span>
              <span>SLUG: <span className="text-slate-700">{developer.slug}</span></span>
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Biography/Description */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-400 uppercase tracking-wide text-[10px]">Mô tả chi tiết</h4>
          <p className="text-slate-700 leading-relaxed max-w-4xl whitespace-pre-line">
            {developer.description}
          </p>
        </div>

        {developer.linkText && (
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] text-indigo-600 font-bold bg-slate-50 px-3 py-1.5 rounded border border-slate-200/60">
              <Globe className="w-3.5 h-3.5" />
              {developer.linkText}
            </span>
          </div>
        )}
      </div>

      {/* Projects List Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <h4 className="font-bold text-slate-800 uppercase text-xs">Các dự án trực thuộc ({projects.length})</h4>
          </div>
          <Link 
            to={`/projects/new?developer=${encodeURIComponent(developer.name)}`}
            className="text-[10px] font-bold text-indigo-650 hover:text-indigo-700 uppercase"
          >
            + THÊM DỰ ÁN MỚI
          </Link>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((proj) => (
              <Link 
                key={proj.id} 
                to={`/projects/${proj.slug}`}
                className="border border-slate-200 hover:border-slate-350 rounded p-3.5 flex gap-3 transition-all group bg-slate-50/30 hover:bg-slate-50"
              >
                <img 
                  src={proj.image} 
                  alt={proj.name} 
                  className="w-14 h-10 rounded object-cover shrink-0 border border-slate-200"
                />
                <div className="min-w-0">
                  <h5 className="font-bold text-slate-800 group-hover:text-indigo-650 truncate transition-colors">{proj.name}</h5>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{proj.location}</p>
                  <span className={`inline-block mt-2 px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                    proj.status === 'Đang mở bán' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                      : proj.status === 'Sắp mở bán'
                      ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {proj.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 font-medium italic pt-2">Chưa có dự án nào được đăng ký dưới tên chủ đầu tư này.</p>
        )}
      </div>
    </div>
  );
};
