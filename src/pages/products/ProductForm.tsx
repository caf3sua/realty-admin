import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import type { Product, Project, Developer, Amenity } from '../../data/mockData';
import { MultiSelect } from '../../components/MultiSelect';
import { ArrowLeft, Save, Sparkles, Upload, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react';

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

const productTypesList = [
  { value: 'villa', label: 'Biệt thự' },
  { value: 'townhouse', label: 'Nhà liền kề' },
  { value: 'apartment', label: 'Căn hộ chung cư' },
  { value: 'shophouse', label: 'Shophouse thương mại' },
  { value: 'residential', label: 'Nhà thổ cư' }
];

const defaultUnsplashPics = [
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
];

export const ProductForm: React.FC = () => {
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isEditMode = !!routeSlug;

  const [productId, setProductId] = useState('');

  const [projects, setProjects] = useState<Project[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [amenitiesList, setAmenitiesList] = useState<Amenity[]>([]);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [area, setArea] = useState<number | ''>('');
  const [bedrooms, setBedrooms] = useState<number>(1);
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [projectSlug, setProjectSlug] = useState('ngoai-du-an');
  const [productType, setProductType] = useState<Product['productType']>('villa');
  const [isPremium, setIsPremium] = useState(false);
  const [isHot, setIsHot] = useState(false);
  const [developer, setDeveloper] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<Product['status']>('Còn hàng');
  const [direction, setDirection] = useState('Đông Nam');
  const [legal, setLegal] = useState('Sổ đỏ lâu dài');
  const [handoverCondition, setHandoverCondition] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [projs, devs, ams] = await Promise.all([
          api.getProjects(),
          api.getDevelopers(),
          api.getAmenities()
        ]);
        setProjects(projs);
        setDevelopers(devs);
        setAmenitiesList(ams.filter(a => a.is_active));

        if (isEditMode && routeSlug) {
          const prod = await api.getProduct(routeSlug);
          setProductId(prod.id);
          setTitle(prod.title);
          setSlug(prod.slug);
          setPrice(prod.price);
          setArea(prod.area);
          setBedrooms(prod.bedrooms);
          setBathrooms(prod.bathrooms);
          setLocation(prod.location);
          setDescription(prod.description);
          setProjectSlug(prod.projectSlug);
          setProductType(prod.productType);
          setIsPremium(prod.isPremium);
          setIsHot(prod.isHot || false);
          setDeveloper(prod.developer || '');
          setImages(prod.images || []);
          setStatus(prod.status);
          setDirection(prod.direction);
          setLegal(prod.legal);
          setHandoverCondition(prod.handoverCondition || '');
          setPaymentMethod(prod.paymentMethod || '');
          setSelectedAmenities((prod.amenities || []).map((a: any) => typeof a === 'string' ? a : a.id));
        } else {
          const randomPic = defaultUnsplashPics[Math.floor(Math.random() * defaultUnsplashPics.length)];
          setImages([randomPic]);
          if (devs.length > 0) {
            setDeveloper(devs[0].name);
          }
        }
      } catch (err) {
        console.error(err);
        if (isEditMode) navigate('/products');
      }
    };
    loadInitialData();
  }, [routeSlug, isEditMode, navigate]);

  const handleProjectChange = (projSlug: string) => {
    setProjectSlug(projSlug);
    if (projSlug !== 'ngoai-du-an') {
      const matchedProject = projects.find(p => p.slug === projSlug);
      if (matchedProject) {
        setDeveloper(matchedProject.developer);
      }
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEditMode) {
      setSlug(convertToSlug(val));
    }
  };

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    const uploadedUrls: string[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`Ảnh "${file.name}" vượt quá dung lượng tối đa 5MB`);
        }
        const result = await api.uploadFile(file);
        uploadedUrls.push(result.url);
      }
      
      setImages(prev => [...prev, ...uploadedUrls]);
      
      if (errors.images) {
        setErrors(prev => {
          const { images: _, ...rest } = prev;
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

  const handleDeleteImage = (index: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleMoveLeft = (index: number) => {
    if (index === 0) return;
    setImages(prev => {
      const updated = [...prev];
      const temp = updated[index - 1];
      updated[index - 1] = updated[index];
      updated[index] = temp;
      return updated;
    });
  };

  const handleMoveRight = (index: number) => {
    if (index === images.length - 1) return;
    setImages(prev => {
      const updated = [...prev];
      const temp = updated[index + 1];
      updated[index + 1] = updated[index];
      updated[index] = temp;
      return updated;
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Tiêu đề sản phẩm không được để trống';
    if (!slug.trim()) newErrors.slug = 'Slug không được để trống';
    if (price === '' || price <= 0) newErrors.price = 'Giá bán phải là số dương lớn hơn 0';
    if (area === '' || area <= 0) newErrors.area = 'Diện tích phải là số dương lớn hơn 0';
    if (!location.trim()) newErrors.location = 'Vị trí địa chỉ không được để trống';
    if (!description.trim()) newErrors.description = 'Mô tả chi tiết không được để trống';
    if (images.length === 0) newErrors.images = 'Ít nhất phải có 1 hình ảnh sản phẩm';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const priceNum = Number(price);
    const areaNum = Number(area);
    const pricePerSqm = Math.round((priceNum * 1000) / areaNum);
    const productTypeName = productTypesList.find(t => t.value === productType)?.label || productType;

    const prodData = {
      title,
      slug,
      price: priceNum,
      pricePerSqm,
      area: areaNum,
      bedrooms,
      bathrooms,
      location,
      description,
      projectSlug,
      productType,
      productTypeName,
      isPremium,
      isHot,
      developer: developer || undefined,
      images,
      status,
      direction,
      legal,
      handoverCondition,
      paymentMethod,
      amenities: selectedAmenities.reduce((acc, id) => {
        const found = amenitiesList.find(a => a.id === id);
        if (found) {
          acc.push({ id: found.id, name: found.name, icon: found.icon });
        }
        return acc;
      }, [] as { id: string; name: string; icon?: string }[])
    };

    try {
      if (isEditMode && productId) {
        await api.updateProduct(productId, prodData);
      } else {
        await api.createProduct(prodData);
      }
      navigate('/products');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/products')}
          className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 rounded transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
            {isEditMode ? 'Chỉnh Sửa Tin Bất Động Sản' : 'Đăng Tin Bất Động Sản Mới'}
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Nhập thông tin kỹ thuật căn hộ, hướng nhà, pháp lý và thiết lập liên kết</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 lg:p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Title */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Tiêu đề tin đăng <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Ví dụ: Căn Hộ Penthouse View Trọn Biển Hồ Ngọc Trai"
                value={title}
                onChange={handleTitleChange}
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.title ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all`}
              />
              {errors.title && <p className="text-[10px] text-red-500 font-semibold">{errors.title}</p>}
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                Slug <span className="text-red-500">*</span>
                {!isEditMode && <span title="Tự động phát sinh từ tên"><Sparkles className="w-3.5 h-3.5 text-indigo-500" /></span>}
              </label>
              <input
                type="text"
                placeholder="can-ho-penthouse-ocean-park"
                value={slug}
                onChange={(e) => setSlug(convertToSlug(e.target.value))}
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.slug ? 'border-red-500' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all`}
              />
              {errors.slug && <p className="text-[10px] text-red-500 font-semibold">{errors.slug}</p>}
            </div>

            {/* Project Relation */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Thuộc dự án</label>
              <select
                value={projectSlug}
                onChange={(e) => handleProjectChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-55 border border-slate-200 focus:border-indigo-600 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all cursor-pointer"
              >
                <option value="ngoai-du-an">Không thuộc dự án nào (Ngoài dự án)</option>
                {projects.map(p => (
                  <option key={p.id} value={p.slug}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Product Type */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Loại hình sản phẩm <span className="text-red-500">*</span></label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value as Product['productType'])}
                className="w-full px-3 py-2 bg-slate-55 border border-slate-200 focus:border-indigo-600 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all cursor-pointer"
              >
                {productTypesList.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Developer Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Chủ đầu tư</label>
              <select
                value={developer}
                onChange={(e) => setDeveloper(e.target.value)}
                className="w-full px-3 py-2 bg-slate-55 border border-slate-200 focus:border-indigo-600 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all cursor-pointer"
              >
                <option value="">Không liên kết chủ đầu tư</option>
                {developers.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Price (Billion VNĐ) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                Giá bán (Tỷ VNĐ) <span className="text-red-500">*</span>
                {(price !== '' && area !== '' && area > 0) && (
                  <span className="text-[9px] text-indigo-600 font-semibold lowercase">
                    (~ {Math.round((Number(price) * 1000) / Number(area))} tr/m²)
                  </span>
                )}
              </label>
              <input
                type="number"
                step="any"
                placeholder="Ví dụ: 8.5"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.price ? 'border-red-500' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all`}
              />
              {errors.price && <p className="text-[10px] text-red-500 font-semibold">{errors.price}</p>}
            </div>

            {/* Area (sqm) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Diện tích (m²) <span className="text-red-500">*</span></label>
              <input
                type="number"
                placeholder="Ví dụ: 120"
                value={area}
                onChange={(e) => setArea(e.target.value === '' ? '' : Number(e.target.value))}
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.area ? 'border-red-500' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all`}
              />
              {errors.area && <p className="text-[10px] text-red-500 font-semibold">{errors.area}</p>}
            </div>

            {/* Product Status */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Trạng thái giỏ hàng <span className="text-red-500">*</span></label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Product['status'])}
                className="w-full px-3 py-2 bg-slate-55 border border-slate-200 focus:border-indigo-600 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all cursor-pointer"
              >
                <option value="Còn hàng">Còn hàng (Sẵn sàng)</option>
                <option value="Đang bán">Đang bán</option>
                <option value="Đã cọc">Đã cọc</option>
                <option value="Đã bán">Đã bán</option>
                <option value="Sắp mở bán">Sắp mở bán</option>
              </select>
            </div>

            {/* Bedrooms */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Số phòng ngủ</label>
              <input
                type="number"
                min="0"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-55 border border-slate-200 focus:border-indigo-600 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all"
              />
            </div>

            {/* Bathrooms */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Số phòng tắm/WC</label>
              <input
                type="number"
                min="0"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-55 border border-slate-200 focus:border-indigo-600 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all"
              />
            </div>

            {/* Direction */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Hướng nhà / Ban công</label>
              <input
                type="text"
                placeholder="Ví dụ: Đông Nam, Tây Bắc"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all"
              />
            </div>

            {/* Legal */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Tình trạng pháp lý</label>
              <input
                type="text"
                placeholder="Ví dụ: Sổ đỏ lâu dài, HĐMB"
                value={legal}
                onChange={(e) => setLegal(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all"
              />
            </div>

            {/* Handover Condition */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Tình trạng bàn giao</label>
              <input
                type="text"
                placeholder="Ví dụ: Bàn giao thô, Hoàn thiện cơ bản"
                value={handoverCondition}
                onChange={(e) => setHandoverCondition(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all"
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Phương thức thanh toán</label>
              <input
                type="text"
                placeholder="Ví dụ: Thanh toán theo tiến độ, Vay 70%"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all"
              />
            </div>

            {/* Premium & New product checkboxes */}
            <div className="space-y-1.5 flex flex-wrap items-center pt-6 gap-6 md:col-span-3">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-500 uppercase text-[9px] tracking-wider">
                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600/20 w-3.5 h-3.5 cursor-pointer"
                />
                <span>Căn hộ Cao Cấp (Premium)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-500 uppercase text-[9px] tracking-wider">
                <input
                  type="checkbox"
                  checked={isHot}
                  onChange={(e) => setIsHot(e.target.checked)}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-600/20 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-rose-600">Sản phẩm hot</span>
              </label>
            </div>

            {/* Amenities Multiselect */}
            <div className="space-y-1.5 md:col-span-3 pt-6 border-t border-slate-100">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Tiện ích đi kèm</label>
              <MultiSelect 
                options={amenitiesList.filter(a => a.product_type === 'all' || a.product_type === productType).map(a => ({ id: a.id, name: a.name, icon: a.icon }))}
                selectedIds={selectedAmenities}
                onChange={setSelectedAmenities}
                placeholder="Tìm và chọn các tiện ích phù hợp..."
              />
            </div>

            {/* Detailed Location Address */}
            <div className="space-y-1.5 md:col-span-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Địa chỉ vị trí chi tiết <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Ví dụ: Phân khu Ngọc Trai, Vinhomes Ocean Park 1, Gia Lâm, Hà Nội"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.location ? 'border-red-500' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all`}
              />
              {errors.location && <p className="text-[10px] text-red-500 font-semibold">{errors.location}</p>}
            </div>

            {/* Multi Images S3 Upload */}
            <div className="space-y-2 md:col-span-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Hình ảnh sản phẩm (Ảnh đầu tiên sẽ làm ảnh đại diện) <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="file"
                  id="product-images-upload"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImagesUpload}
                  disabled={isUploading}
                />
                <label
                  htmlFor="product-images-upload"
                  className={`flex flex-col items-center justify-center border-2 border-dashed ${
                    errors.images || uploadError ? 'border-red-300 hover:border-red-400 bg-red-50/20' : 'border-slate-300 hover:border-indigo-500 bg-slate-50/50'
                  } rounded-xl p-6 cursor-pointer transition-all duration-200 group text-center min-h-[120px]`}
                >
                  {isUploading ? (
                    <div className="space-y-2 flex flex-col items-center justify-center">
                      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                      <span className="text-xs text-slate-500 font-medium">Đang tải ảnh lên S3...</span>
                    </div>
                  ) : (
                    <div className="space-y-2 flex flex-col items-center justify-center">
                      <div className="p-3 bg-slate-100 rounded-full group-hover:bg-indigo-50 transition-colors duration-200">
                        <Upload className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 font-semibold">Tải ảnh lên (Hỗ trợ chọn & tải nhiều ảnh cùng lúc)</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Kéo thả hoặc click chọn hình ảnh định dạng PNG, JPG tối đa 5MB</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
              {uploadError && <p className="text-[10px] text-red-500 font-semibold">{uploadError}</p>}
              {errors.images && <p className="text-[10px] text-red-500 font-semibold">{errors.images}</p>}
              {images.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Danh sách ảnh đã tải lên ({images.length}) - Kéo thả hoặc bấm mũi tên để sắp xếp thứ tự</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {images.map((img, index) => {
                      const isMain = index === 0;
                      return (
                        <div
                          key={`${img}-${index}`}
                          draggable
                          onDragStart={() => setDraggedIndex(index)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => {
                            if (draggedIndex === null || draggedIndex === index) return;
                            setImages(prev => {
                              const updated = [...prev];
                              const [draggedItem] = updated.splice(draggedIndex, 1);
                              updated.splice(index, 0, draggedItem);
                              return updated;
                            });
                            setDraggedIndex(null);
                          }}
                          onDragEnd={() => setDraggedIndex(null)}
                          className={`relative aspect-square rounded-lg overflow-hidden border ${
                            isMain ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200'
                          } bg-slate-50 bg-white group transition-all cursor-grab active:cursor-grabbing hover:shadow-sm`}
                        >
                          <img src={img} alt={`Product ${index}`} className="w-full h-full object-cover select-none" />
                          {isMain && (
                            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold bg-indigo-600 text-white shadow-sm tracking-wider uppercase">
                              Ảnh chính
                            </span>
                          )}
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleDeleteImage(index)}
                                className="p-1 rounded bg-red-600 text-white hover:bg-red-700 shadow-sm cursor-pointer transition-colors"
                                title="Xóa ảnh này"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="flex justify-between items-center bg-slate-900/60 backdrop-blur-xs rounded p-0.5">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => handleMoveLeft(index)}
                                className={`p-1 rounded text-white ${
                                  index === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-800 cursor-pointer'
                                }`}
                                title="Di chuyển lên trước"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-[9px] text-white font-bold px-1 select-none">
                                {index + 1}
                              </span>
                              <button
                                type="button"
                                disabled={index === images.length - 1}
                                onClick={() => handleMoveRight(index)}
                                className={`p-1 rounded text-white ${
                                  index === images.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-800 cursor-pointer'
                                }`}
                                title="Di chuyển ra sau"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5 md:col-span-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Mô tả chi tiết sản phẩm <span className="text-red-500">*</span></label>
              <textarea
                placeholder="Mô tả thông tin chi tiết..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.description ? 'border-red-500' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all`}
              />
              {errors.description && <p className="text-[10px] text-red-500 font-semibold">{errors.description}</p>}
            </div>

          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-3.5 py-2 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-655 font-bold uppercase transition-colors"
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
              <span>Lưu tin đăng</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
