import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import type { Project, Developer } from '../../data/mockData';
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

const defaultUnsplashImages = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&h=400&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&h=400&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&h=400&q=80',
];

export const ProjectForm: React.FC = () => {
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isEditMode = !!routeSlug;

  const [projectId, setProjectId] = useState('');

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [developer, setDeveloper] = useState('');
  const [status, setStatus] = useState<Project['status']>('Đang mở bán');
  const [location, setLocation] = useState('');
  const [scale, setScale] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [image, setImage] = useState('');
  const [banner, setBanner] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [bannerUploadError, setBannerUploadError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const devs = await api.getDevelopers();
        setDevelopers(devs);
        
        if (isEditMode && routeSlug) {
          const proj = await api.getProject(routeSlug);
          setProjectId(proj.id);
          setName(proj.name);
          setSlug(proj.slug);
          setDeveloper(proj.developer);
          setStatus(proj.status);
          setLocation(proj.location);
          setScale(proj.scale);
          setPriceRange(proj.priceRange);
          setTagsInput(proj.tags.join(', '));
          setImage(proj.image);
          setBanner(proj.banner);
          setShortDescription(proj.shortDescription);
          setDescription(proj.description);
        } else {
          if (devs.length > 0) {
            setDeveloper(devs[0].name);
          }
          const randomImg = defaultUnsplashImages[Math.floor(Math.random() * defaultUnsplashImages.length)];
          setImage(randomImg);
          setBanner(randomImg);
        }
      } catch (err) {
        console.error(err);
        if (isEditMode) navigate('/projects');
      }
    };
    loadInitialData();
  }, [routeSlug, isEditMode, navigate]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!isEditMode) {
      setSlug(convertToSlug(val));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setImageUploadError('Kích thước ảnh tối đa là 5MB');
      return;
    }

    try {
      setIsUploadingImage(true);
      setImageUploadError(null);
      const result = await api.uploadFile(file);
      setImage(result.url);
      
      if (errors.image) {
        setErrors(prev => {
          const { image: _, ...rest } = prev;
          return rest;
        });
      }
    } catch (err: any) {
      console.error(err);
      setImageUploadError(err.message || 'Lỗi khi tải ảnh lên server');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setBannerUploadError('Kích thước ảnh tối đa là 5MB');
      return;
    }

    try {
      setIsUploadingBanner(true);
      setBannerUploadError(null);
      const result = await api.uploadFile(file);
      setBanner(result.url);
      
      if (errors.banner) {
        setErrors(prev => {
          const { banner: _, ...rest } = prev;
          return rest;
        });
      }
    } catch (err: any) {
      console.error(err);
      setBannerUploadError(err.message || 'Lỗi khi tải ảnh lên server');
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Tên dự án không được để trống';
    if (!slug.trim()) newErrors.slug = 'Slug không được để trống';
    if (!developer.trim()) newErrors.developer = 'Chủ đầu tư không được để trống';
    if (!location.trim()) newErrors.location = 'Vị trí không được để trống';
    if (!scale.trim()) newErrors.scale = 'Quy mô không được để trống';
    if (!priceRange.trim()) newErrors.priceRange = 'Khoảng giá không được để trống';
    if (!image.trim()) newErrors.image = 'Ảnh đại diện không được để trống';
    if (!banner.trim()) newErrors.banner = 'Ảnh banner không được để trống';
    if (!shortDescription.trim()) newErrors.shortDescription = 'Mô tả tóm tắt không được để trống';
    if (!description.trim()) newErrors.description = 'Mô tả chi tiết không được để trống';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const projData = {
      name,
      slug,
      developer,
      status,
      location,
      scale,
      priceRange,
      tags,
      image,
      banner,
      shortDescription,
      description
    };

    try {
      if (isEditMode && projectId) {
        await api.updateProject(projectId, projData);
      } else {
        await api.createProject(projData);
      }
      navigate('/projects');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/projects')}
          className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 rounded transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
            {isEditMode ? 'Chỉnh Sửa Dự Án' : 'Thêm Dự Án Mới'}
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Nhập thông tin chi tiết và thiết lập trạng thái kinh doanh của dự án</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 lg:p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Project Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Tên dự án <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Ví dụ: Vinhomes Ocean Park 3"
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
                placeholder="ocean-park-3"
                value={slug}
                onChange={(e) => setSlug(convertToSlug(e.target.value))}
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.slug ? 'border-red-500' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-650/20 text-xs text-slate-700 transition-all`}
              />
              {errors.slug && <p className="text-[10px] text-red-500 font-semibold">{errors.slug}</p>}
            </div>

            {/* Developer Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Chủ đầu tư phát triển <span className="text-red-500">*</span></label>
              <select
                value={developer}
                onChange={(e) => setDeveloper(e.target.value)}
                className={`w-full px-3 py-2 bg-slate-55 border ${errors.developer ? 'border-red-500' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-650/20 text-xs text-slate-700 transition-all cursor-pointer`}
              >
                {developers.length > 0 ? (
                  developers.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))
                ) : (
                  <option value="">-- Chưa có chủ đầu tư trong DB --</option>
                )}
              </select>
              {errors.developer && <p className="text-[10px] text-red-500 font-semibold">{errors.developer}</p>}
            </div>

            {/* Project Status */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Trạng thái bán hàng <span className="text-red-500">*</span></label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Project['status'])}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-650/20 text-xs text-slate-700 transition-all cursor-pointer"
              >
                <option value="Đang mở bán">Đang mở bán</option>
                <option value="Sắp mở bán">Sắp mở bán</option>
                <option value="Đã bàn giao">Đã bàn giao</option>
              </select>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Vị trí địa lý <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Ví dụ: Văn Giang, Hưng Yên"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.location ? 'border-red-500' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-650/20 text-xs text-slate-700 transition-all`}
              />
              {errors.location && <p className="text-[10px] text-red-500 font-semibold">{errors.location}</p>}
            </div>

            {/* Scale */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Quy mô diện tích <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Ví dụ: 294 ha, 3 tòa tháp"
                value={scale}
                onChange={(e) => setScale(e.target.value)}
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.scale ? 'border-red-500' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-650/20 text-xs text-slate-700 transition-all`}
              />
              {errors.scale && <p className="text-[10px] text-red-500 font-semibold">{errors.scale}</p>}
            </div>

            {/* Price Range */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Khoảng giá dự kiến <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Ví dụ: 3 tỷ - 80 tỷ, Liên hệ"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.priceRange ? 'border-red-500' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-650/20 text-xs text-slate-700 transition-all`}
              />
              {errors.priceRange && <p className="text-[10px] text-red-500 font-semibold">{errors.priceRange}</p>}
            </div>

            {/* Tags (comma separated) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Nhãn / Tiện ích nổi bật (phân cách bằng dấu phẩy)</label>
              <input
                type="text"
                placeholder="Ví dụ: Hồ nước ngọt, Gần trường học, Gia Lâm"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-650/20 text-xs text-slate-700 transition-all"
              />
            </div>

            {/* Main Image Upload */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Ảnh đại diện dự án <span className="text-red-500">*</span></label>
              <div className="flex items-start gap-4">
                <div className="relative flex-1">
                  <input
                    type="file"
                    id="project-image-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                  />
                  <label
                    htmlFor="project-image-upload"
                    className={`flex flex-col items-center justify-center border-2 border-dashed ${
                      errors.image || imageUploadError ? 'border-red-300 hover:border-red-400 bg-red-50/20' : 'border-slate-300 hover:border-indigo-500 bg-slate-50/50'
                    } rounded-xl p-6 cursor-pointer transition-all duration-200 group text-center min-h-[140px]`}
                  >
                    {isUploadingImage ? (
                      <div className="space-y-2 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                        <span className="text-xs text-slate-500 font-medium">Đang tải ảnh lên S3...</span>
                      </div>
                    ) : image ? (
                      <div className="space-y-2 flex flex-col items-center justify-center">
                        <div className="w-20 h-14 rounded-lg border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-200">
                          <img src={image} alt="Preview" className="max-w-full max-h-full object-cover rounded" />
                        </div>
                        <span className="text-[10px] text-indigo-600 font-bold group-hover:underline uppercase tracking-wider">Chọn ảnh khác</span>
                      </div>
                    ) : (
                      <div className="space-y-2 flex flex-col items-center justify-center">
                        <div className="p-3 bg-slate-100 rounded-full group-hover:bg-indigo-50 transition-colors duration-200">
                          <Upload className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-semibold">Tải ảnh đại diện lên S3</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Hỗ trợ định dạng PNG, JPG, SVG tối đa 5MB</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
                {image && (
                  <div className="hidden sm:block flex-1 space-y-2 text-slate-500 bg-slate-50 border border-slate-200/60 rounded-xl p-4 text-[11px] self-stretch">
                    <p className="font-bold text-slate-600 uppercase text-[9px] tracking-wider">Thông tin tệp tin</p>
                    <div className="break-all space-y-1">
                      <p><span className="font-semibold">Đường dẫn S3:</span></p>
                      <a href={image} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline break-all block">{image}</a>
                    </div>
                  </div>
                )}
              </div>
              {imageUploadError && <p className="text-[10px] text-red-500 font-semibold">{imageUploadError}</p>}
              {errors.image && <p className="text-[10px] text-red-500 font-semibold">{errors.image}</p>}
            </div>

            {/* Banner Image Upload */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Ảnh banner dự án <span className="text-red-500">*</span></label>
              <div className="flex items-start gap-4">
                <div className="relative flex-1">
                  <input
                    type="file"
                    id="project-banner-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerUpload}
                    disabled={isUploadingBanner}
                  />
                  <label
                    htmlFor="project-banner-upload"
                    className={`flex flex-col items-center justify-center border-2 border-dashed ${
                      errors.banner || bannerUploadError ? 'border-red-300 hover:border-red-400 bg-red-50/20' : 'border-slate-300 hover:border-indigo-500 bg-slate-50/50'
                    } rounded-xl p-6 cursor-pointer transition-all duration-200 group text-center min-h-[140px]`}
                  >
                    {isUploadingBanner ? (
                      <div className="space-y-2 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                        <span className="text-xs text-slate-500 font-medium">Đang tải ảnh lên S3...</span>
                      </div>
                    ) : banner ? (
                      <div className="space-y-2 flex flex-col items-center justify-center">
                        <div className="w-20 h-14 rounded-lg border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-200">
                          <img src={banner} alt="Preview" className="max-w-full max-h-full object-cover rounded" />
                        </div>
                        <span className="text-[10px] text-indigo-600 font-bold group-hover:underline uppercase tracking-wider">Chọn ảnh khác</span>
                      </div>
                    ) : (
                      <div className="space-y-2 flex flex-col items-center justify-center">
                        <div className="p-3 bg-slate-100 rounded-full group-hover:bg-indigo-50 transition-colors duration-200">
                          <Upload className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-semibold">Tải ảnh banner lên S3</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Hỗ trợ định dạng PNG, JPG, SVG tối đa 5MB</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
                {banner && (
                  <div className="hidden sm:block flex-1 space-y-2 text-slate-500 bg-slate-50 border border-slate-200/60 rounded-xl p-4 text-[11px] self-stretch">
                    <p className="font-bold text-slate-600 uppercase text-[9px] tracking-wider">Thông tin tệp tin</p>
                    <div className="break-all space-y-1">
                      <p><span className="font-semibold">Đường dẫn S3:</span></p>
                      <a href={banner} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline break-all block">{banner}</a>
                    </div>
                  </div>
                )}
              </div>
              {bannerUploadError && <p className="text-[10px] text-red-500 font-semibold">{bannerUploadError}</p>}
              {errors.banner && <p className="text-[10px] text-red-500 font-semibold">{errors.banner}</p>}
            </div>

            {/* Short Description */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Mô tả tóm tắt ngắn <span className="text-red-500">*</span></label>
              <textarea
                placeholder="Câu tóm tắt nhanh về dự án hiển thị ở danh mục tìm kiếm..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                rows={2}
                className={`w-full px-3 py-2 bg-slate-55 border ${errors.shortDescription ? 'border-red-500' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-650/20 text-xs text-slate-700 transition-all`}
              />
              {errors.shortDescription && <p className="text-[10px] text-red-500 font-semibold">{errors.shortDescription}</p>}
            </div>

            {/* Detailed Description */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Mô tả chi tiết <span className="text-red-500">*</span></label>
              <textarea
                placeholder="Thông tin quy hoạch, hạ tầng tiện ích..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className={`w-full px-3 py-2 bg-slate-55 border ${errors.description ? 'border-red-500' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-650/20 text-xs text-slate-700 transition-all`}
              />
              {errors.description && <p className="text-[10px] text-red-500 font-semibold">{errors.description}</p>}
            </div>

          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="px-3.5 py-2 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-655 font-bold uppercase transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isUploadingImage || isUploadingBanner}
              className={`flex items-center gap-1.5 px-4 py-2 ${
                isUploadingImage || isUploadingBanner
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
              } text-white rounded font-bold uppercase transition-colors`}
            >
              {isUploadingImage || isUploadingBanner ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>Lưu dự án</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
