import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { ArrowLeft, Save, Sparkles, Upload, Loader2 } from 'lucide-react';

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


export const DeveloperForm: React.FC = () => {
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isEditMode = !!routeSlug;

  const [developerId, setDeveloperId] = useState('');
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [linkText, setLinkText] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Kích thước ảnh tối đa là 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      const result = await api.uploadFile(file);
      setLogo(result.url);
      
      if (errors.logo) {
        setErrors(prev => {
          const { logo: _, ...rest } = prev;
          return rest;
        });
      }
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Lỗi khi tải ảnh lên server');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (isEditMode && routeSlug) {
      api.getDeveloper(routeSlug)
        .then(dev => {
          setDeveloperId(dev.id);
          setName(dev.name);
          setLogo(dev.logo);
          setTitle(dev.title);
          setDescription(dev.description);
          setSlug(dev.slug);
          setLinkText(dev.linkText);
        })
        .catch(err => {
          console.error(err);
          navigate('/developers');
        });
    }
  }, [routeSlug, isEditMode, navigate]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const devData = { name, logo, title, description, slug, linkText };
      if (isEditMode && developerId) {
        await api.updateDeveloper(developerId, devData);
      } else {
        await api.createDeveloper(devData);
      }
      navigate('/developers');
    } catch (err) {
      console.error(err);
    }
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

            {/* Logo S3 Upload */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Logo Chủ Đầu Tư <span className="text-red-500">*</span></label>
              
              <div className="flex items-start gap-4">
                {/* Upload zone / Preview */}
                <div className="relative flex-1">
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                    disabled={isUploading}
                  />
                  
                  <label
                    htmlFor="logo-upload"
                    className={`flex flex-col items-center justify-center border-2 border-dashed ${
                      errors.logo || uploadError ? 'border-red-300 hover:border-red-400 bg-red-50/20' : 'border-slate-300 hover:border-indigo-500 bg-slate-50/50'
                    } rounded-xl p-6 cursor-pointer transition-all duration-200 group text-center min-h-[140px]`}
                  >
                    {isUploading ? (
                      <div className="space-y-2 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                        <span className="text-xs text-slate-500 font-medium">Đang tải ảnh lên S3...</span>
                      </div>
                    ) : logo ? (
                      <div className="space-y-2 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-lg border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-200">
                          <img src={logo} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                        </div>
                        <span className="text-[10px] text-indigo-600 font-bold group-hover:underline uppercase tracking-wider">Chọn ảnh khác</span>
                      </div>
                    ) : (
                      <div className="space-y-2 flex flex-col items-center justify-center">
                        <div className="p-3 bg-slate-100 rounded-full group-hover:bg-indigo-50 transition-colors duration-200">
                          <Upload className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-semibold">Tải logo lên S3</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Hỗ trợ định dạng PNG, JPG, SVG tối đa 5MB</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
                
                {/* Helper info / Direct URL preview */}
                {logo && (
                  <div className="hidden sm:block flex-1 space-y-2 text-slate-500 bg-slate-50 border border-slate-200/60 rounded-xl p-4 text-[11px] self-stretch">
                    <p className="font-bold text-slate-600 uppercase text-[9px] tracking-wider">Thông tin tệp tin</p>
                    <div className="break-all space-y-1">
                      <p><span className="font-semibold">Đường dẫn S3:</span></p>
                      <a href={logo} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline break-all block">{logo}</a>
                    </div>
                  </div>
                )}
              </div>
              
              {uploadError && <p className="text-[10px] text-red-500 font-semibold">{uploadError}</p>}
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
              disabled={isUploading}
              className={`flex items-center gap-1.5 px-4 py-2 ${
                isUploading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
              } text-white rounded font-bold uppercase transition-colors`}
            >
              {isUploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>LƯU DỮ LIỆU</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
