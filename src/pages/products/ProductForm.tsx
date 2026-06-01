import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MockDatabase } from '../../data/mockData';
import type { Product, Project, Developer } from '../../data/mockData';
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [projects, setProjects] = useState<Project[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);

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
  const [developer, setDeveloper] = useState('');
  const [imagesInput, setImagesInput] = useState('');
  const [status, setStatus] = useState<Product['status']>('Còn hàng');
  const [direction, setDirection] = useState('Đông Nam');
  const [legal, setLegal] = useState('Sổ đỏ lâu dài');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const projs = MockDatabase.getProjects();
    const devs = MockDatabase.getDevelopers();
    setProjects(projs);
    setDevelopers(devs);

    if (isEditMode) {
      const products = MockDatabase.getProducts();
      const prod = products.find(p => p.id === id);
      if (prod) {
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
        setDeveloper(prod.developer || '');
        setImagesInput(prod.images.join(', '));
        setStatus(prod.status);
        setDirection(prod.direction);
        setLegal(prod.legal);
      } else {
        navigate('/products');
      }
    } else {
      const randomPic = defaultUnsplashPics[Math.floor(Math.random() * defaultUnsplashPics.length)];
      setImagesInput(randomPic);
      if (devs.length > 0) {
        setDeveloper(devs[0].name);
      }
    }
  }, [id, isEditMode, navigate]);

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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Tiêu đề sản phẩm không được để trống';
    if (!slug.trim()) newErrors.slug = 'Slug không được để trống';
    if (price === '' || price <= 0) newErrors.price = 'Giá bán phải là số dương lớn hơn 0';
    if (area === '' || area <= 0) newErrors.area = 'Diện tích phải là số dương lớn hơn 0';
    if (!location.trim()) newErrors.location = 'Vị trí địa chỉ không được để trống';
    if (!description.trim()) newErrors.description = 'Mô tả chi tiết không được để trống';
    if (!imagesInput.trim()) newErrors.images = 'Ít nhất phải có 1 hình ảnh URL';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const products = MockDatabase.getProducts();
    const images = imagesInput
      .split(',')
      .map(img => img.trim())
      .filter(img => img.length > 0);

    const priceNum = Number(price);
    const areaNum = Number(area);
    const pricePerSqm = Math.round((priceNum * 1000) / areaNum);
    const productTypeName = productTypesList.find(t => t.value === productType)?.label || productType;

    if (isEditMode) {
      const updated = products.map(p => {
        if (p.id === id) {
          return { 
            ...p, 
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
            developer: developer || undefined, 
            images, 
            status, 
            direction, 
            legal 
          };
        }
        return p;
      });
      MockDatabase.saveProducts(updated);
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
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
        developer: developer || undefined,
        images,
        status,
        direction,
        legal
      };
      MockDatabase.saveProducts([...products, newProd]);
    }

    navigate('/products');
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
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.title ? 'border-red-555 focus:border-red-555' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all`}
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
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.slug ? 'border-red-555' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all`}
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
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.price ? 'border-red-555' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all`}
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
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.area ? 'border-red-555' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all`}
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

            {/* Premium product checkbox */}
            <div className="space-y-1.5 flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-500 uppercase text-[9px] tracking-wider">
                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600/20 w-3.5 h-3.5 cursor-pointer"
                />
                <span>Căn hộ Cao Cấp (Premium)</span>
              </label>
            </div>

            {/* Detailed Location Address */}
            <div className="space-y-1.5 md:col-span-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Địa chỉ vị trí chi tiết <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Ví dụ: Phân khu Ngọc Trai, Vinhomes Ocean Park 1, Gia Lâm, Hà Nội"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.location ? 'border-red-555' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all`}
              />
              {errors.location && <p className="text-[10px] text-red-500 font-semibold">{errors.location}</p>}
            </div>

            {/* Images URLs */}
            <div className="space-y-1.5 md:col-span-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Danh sách ảnh URLs (cách nhau bằng dấu phẩy) <span className="text-red-500">*</span></label>
              <div className="flex gap-4 items-center">
                <textarea
                  placeholder="Link 1, Link 2..."
                  value={imagesInput}
                  onChange={(e) => setImagesInput(e.target.value)}
                  rows={2}
                  className={`flex-1 px-3 py-2 bg-slate-50 border ${errors.images ? 'border-red-555' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all`}
                />
                
                {/* Images Preview thumb */}
                <div className="w-16 h-10 rounded border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                  {imagesInput.split(',')[0] ? (
                    <img src={imagesInput.split(',')[0].trim()} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=60&h=40&q=80' }} />
                  ) : (
                    <span className="text-[9px] text-slate-400 font-bold">No Image</span>
                  )}
                </div>
              </div>
              {errors.images && <p className="text-[10px] text-red-500 font-semibold">{errors.images}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1.5 md:col-span-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Mô tả chi tiết sản phẩm <span className="text-red-500">*</span></label>
              <textarea
                placeholder="Mô tả thông tin chi tiết..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.description ? 'border-red-555' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all`}
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
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold uppercase transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu tin đăng</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
