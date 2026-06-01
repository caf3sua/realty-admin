import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MockDatabase } from '../../data/mockData';
import type { Developer } from '../../data/mockData';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';

const convertToSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

const defaultUnsplashLogos = [
  'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=150&h=150&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&h=150&q=80',
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&h=150&q=80',
  'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=150&h=150&q=80'
];

export const DeveloperForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [linkText, setLinkText] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode) {
      const developers = MockDatabase.getDevelopers();
      const dev = developers.find(d => d.id === id);
      if (dev) {
        setName(dev.name);
        setLogo(dev.logo);
        setTitle(dev.title);
        setDescription(dev.description);
        setSlug(dev.slug);
        setLinkText(dev.linkText);
      } else {
        navigate('/developers');
      }
    } else {
      const randomLogo = defaultUnsplashLogos[Math.floor(Math.random() * defaultUnsplashLogos.length)];
      setLogo(randomLogo);
    }
  }, [id, isEditMode, navigate]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!isEditMode) {
      setSlug(convertToSlug(val));
      setLinkText(`Xem Các Sản Phẩm ${val}`);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Tên chủ đầu tư không được để trống';
    if (!slug.trim()) newErrors.slug = 'Slug không được để trống';
    if (!title.trim()) newErrors.title = 'Slogan/tiêu đề không được để trống';
    if (!description.trim()) newErrors.description = 'Mô tả không được để trống';
    if (!logo.trim()) newErrors.logo = 'Logo URL không được để trống';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const developers = MockDatabase.getDevelopers();

    if (isEditMode) {
      const updated = developers.map(d => {
        if (d.id === id) {
          return { ...d, name, logo, title, description, slug, linkText };
        }
        return d;
      });
      MockDatabase.saveDevelopers(updated);
    } else {
      const newDev: Developer = {
        id: `dev-${Date.now()}`,
        name,
        logo,
        title,
        description,
        slug,
        linkText
      };
      MockDatabase.saveDevelopers([...developers, newDev]);
    }

    navigate('/developers');
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/developers')}
          className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 rounded transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
            {isEditMode ? 'Chỉnh Sửa Chủ Đầu Tư' : 'Thêm Chủ Đầu Tư Mới'}
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Nhập đầy đủ các thông tin của chủ đầu tư bất động sản</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 lg:p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Tên chủ đầu tư <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Ví dụ: Vinhomes, MIK Group"
                value={name}
                onChange={handleNameChange}
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-650/20 text-xs text-slate-700 transition-all`}
              />
              {errors.name && <p className="text-[10px] text-red-500 font-semibold">{errors.name}</p>}
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                Slug <span className="text-red-500">*</span>
                {!isEditMode && <span title="Tự động phát sinh từ tên"><Sparkles className="w-3.5 h-3.5 text-indigo-500" /></span>}
              </label>
              <input
                type="text"
                placeholder="vinhomes"
                value={slug}
                onChange={(e) => setSlug(convertToSlug(e.target.value))}
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.slug ? 'border-red-500' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-655/20 text-xs text-slate-700 transition-all`}
              />
              {errors.slug && <p className="text-[10px] text-red-500 font-semibold">{errors.slug}</p>}
            </div>

            {/* Slogan/Title */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Slogan / Tiêu đề đại diện <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Ví dụ: Đại Đô Thị Biển Quốc Tế"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.title ? 'border-red-500' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-655/20 text-xs text-slate-700 transition-all`}
              />
              {errors.title && <p className="text-[10px] text-red-500 font-semibold">{errors.title}</p>}
            </div>

            {/* Logo Link */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Logo URL <span className="text-red-500">*</span></label>
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo..."
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  className={`flex-1 px-3 py-2 bg-slate-50 border ${errors.logo ? 'border-red-500' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-655/20 text-xs text-slate-700 transition-all`}
                />
                
                {/* Logo Preview */}
                <div className="w-8 h-8 rounded border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                  {logo ? (
                    <img src={logo} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=40&h=40&q=80' }} />
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">N/A</span>
                  )}
                </div>
              </div>
              {errors.logo && <p className="text-[10px] text-red-500 font-semibold">{errors.logo}</p>}
            </div>

            {/* Link Text */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Văn bản liên kết</label>
              <input
                type="text"
                placeholder="Ví dụ: Xem Các Sản Phẩm Vinhomes"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-655/20 text-xs text-slate-700 transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Mô tả chủ đầu tư <span className="text-red-500">*</span></label>
              <textarea
                placeholder="Thông tin giới thiệu chi tiết..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.description ? 'border-red-500' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-655/20 text-xs text-slate-700 transition-all`}
              />
              {errors.description && <p className="text-[10px] text-red-500 font-semibold">{errors.description}</p>}
            </div>

          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/developers')}
              className="px-3.5 py-2 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-600 font-bold uppercase transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold uppercase transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>LƯU DỮ LIỆU</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
