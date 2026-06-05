import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { RichTextEditor } from '../../components/RichTextEditor';
import { ArrowLeft, Save, Sparkles, Upload, Loader2 } from 'lucide-react';

const convertToSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const PostForm: React.FC = () => {
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isEditMode = !!routeSlug;

  const [postId, setPostId] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState<'Thị trường' | 'Quy hoạch' | 'Cẩm nang' | 'Dự án'>('Thị trường');
  const [slug, setSlug] = useState('');
  const [publishedAt, setPublishedAt] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditMode && routeSlug) {
      api.getPost(routeSlug)
        .then(post => {
          setPostId(post.id);
          setTitle(post.title);
          setSummary(post.summary);
          setContent(post.content);
          setImage(post.image);
          setCategory(post.category);
          setSlug(post.slug);
          setPublishedAt(post.publishedAt);
        })
        .catch(err => {
          console.error(err);
          navigate('/posts');
        });
    }
  }, [routeSlug, isEditMode, navigate]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEditMode) {
      setSlug(convertToSlug(val));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setImage(result.url);
      
      if (errors.image) {
        setErrors(prev => {
          const { image: _, ...rest } = prev;
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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Tiêu đề bài viết không được để trống';
    if (!slug.trim()) newErrors.slug = 'Slug không được để trống';
    if (!summary.trim()) newErrors.summary = 'Tóm tắt bài viết không được để trống';
    if (!content.trim() || content === '<br>') newErrors.content = 'Nội dung bài viết không được để trống';
    if (!image.trim()) newErrors.image = 'Ảnh bìa bài viết không được để trống';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSaving(true);
      
      // Get current date as string 'YYYY-MM-DD' if publishedAt is empty
      const todayStr = publishedAt || new Date().toISOString().split('T')[0];

      const postData = {
        title,
        summary,
        content,
        image,
        category,
        slug,
        publishedAt: todayStr
      };

      if (isEditMode && postId) {
        await api.updatePost(postId, postData);
      } else {
        await api.createPost(postData);
      }
      navigate('/posts');
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/posts')}
          className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 rounded transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
            {isEditMode ? 'Chỉnh Sửa Bài Viết' : 'Viết Bài Mới'}
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Nhập đầy đủ thông tin bài viết và định dạng bằng trình soạn thảo rich text</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 lg:p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Title */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Tiêu đề bài viết <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Ví dụ: Bất Động Sản Ven Biển Quảng Ninh Bứt Phá"
                value={title}
                onChange={handleTitleChange}
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.title ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-650/20 text-xs text-slate-700 transition-all`}
              />
              {errors.title && <p className="text-[10px] text-red-500 font-semibold">{errors.title}</p>}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Danh mục bài viết <span className="text-red-500">*</span></label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-650/20 text-xs text-slate-750 transition-all font-semibold cursor-pointer"
              >
                <option value="Thị trường">Thị trường</option>
                <option value="Quy hoạch">Quy hoạch</option>
                <option value="Cẩm nang">Cẩm nang</option>
                <option value="Dự án">Dự án</option>
              </select>
            </div>

            {/* Slug */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                Slug <span className="text-red-500">*</span>
                {!isEditMode && <span title="Tự động phát sinh từ tiêu đề"><Sparkles className="w-3.5 h-3.5 text-indigo-500" /></span>}
              </label>
              <input
                type="text"
                placeholder="bat-dong-san-ven-bien-quang-ninh"
                value={slug}
                onChange={(e) => setSlug(convertToSlug(e.target.value))}
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.slug ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-650/20 text-xs text-slate-700 transition-all`}
              />
              <p className="text-[9px] text-slate-400 font-medium italic mt-0.5">
                {!isEditMode 
                  ? 'Hệ thống sẽ tự động thêm một chuỗi ngẫu nhiên (ví dụ: -a8f3b) vào cuối slug khi lưu để tránh trùng lặp.'
                  : 'Slug hiện tại của bài viết.'}
              </p>
              {errors.slug && <p className="text-[10px] text-red-500 font-semibold">{errors.slug}</p>}
            </div>

            {/* Publication Date */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Ngày đăng (YYYY-MM-DD)</label>
              <input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-650/20 text-xs text-slate-700 transition-all"
              />
            </div>

            {/* Summary */}
            <div className="space-y-1.5 md:col-span-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Tóm tắt ngắn <span className="text-red-500">*</span></label>
              <textarea
                placeholder="Nhập tóm tắt ngắn cho bài viết (hiển thị trên danh sách tin tức)..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.summary ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-650/20 text-xs text-slate-700 transition-all`}
              />
              {errors.summary && <p className="text-[10px] text-red-500 font-semibold">{errors.summary}</p>}
            </div>

            {/* Banner Image Upload */}
            <div className="space-y-1.5 md:col-span-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Ảnh bìa bài viết <span className="text-red-500">*</span></label>
              
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Upload zone */}
                <div className="relative flex-1 w-full">
                  <input
                    type="file"
                    id="post-image-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                  
                  <label
                    htmlFor="post-image-upload"
                    className={`flex flex-col items-center justify-center border-2 border-dashed ${
                      errors.image || uploadError ? 'border-red-300 hover:border-red-400 bg-red-50/20' : 'border-slate-300 hover:border-indigo-500 bg-slate-50/50'
                    } rounded-xl p-6 cursor-pointer transition-all duration-200 group text-center min-h-[140px] w-full`}
                  >
                    {isUploading ? (
                      <div className="space-y-2 flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                        <span className="text-xs text-slate-500 font-medium">Đang tải hình ảnh lên S3...</span>
                      </div>
                    ) : image ? (
                      <div className="space-y-2 flex flex-col items-center justify-center">
                        <div className="w-48 h-24 rounded-lg border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-102 transition-transform duration-200">
                          <img src={image} alt="Banner Preview" className="w-full h-full object-cover rounded" />
                        </div>
                        <span className="text-[10px] text-indigo-600 font-bold group-hover:underline uppercase tracking-wider">Chọn ảnh khác</span>
                      </div>
                    ) : (
                      <div className="space-y-2 flex flex-col items-center justify-center">
                        <div className="p-3 bg-slate-100 rounded-full group-hover:bg-indigo-50 transition-colors duration-200">
                          <Upload className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-semibold">Tải ảnh bìa lên S3</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Hỗ trợ PNG, JPG, JPEG tối đa 5MB</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
                
                {/* Banner link preview */}
                {image && (
                  <div className="w-full sm:flex-1 space-y-2 text-slate-550 bg-slate-50 border border-slate-200/60 rounded-xl p-4 text-[11px] self-stretch break-all">
                    <p className="font-bold text-slate-600 uppercase text-[9px] tracking-wider">Đường dẫn S3 ảnh bìa</p>
                    <a href={image} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline break-all block mt-1 font-semibold">{image}</a>
                  </div>
                )}
              </div>
              
              {uploadError && <p className="text-[10px] text-red-500 font-semibold">{uploadError}</p>}
              {errors.image && <p className="text-[10px] text-red-500 font-semibold">{errors.image}</p>}
            </div>

            {/* Rich Text Editor for Content */}
            <div className="space-y-1.5 md:col-span-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Nội dung chi tiết <span className="text-red-500">*</span></label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Nhập nội dung bài viết và định dạng tại đây..."
              />
              {errors.content && <p className="text-[10px] text-red-500 font-semibold">{errors.content}</p>}
            </div>

          </div>

          {/* Action buttons */}
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/posts')}
              className="px-3.5 py-2 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-600 font-bold uppercase transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isUploading || isSaving}
              className={`flex items-center gap-1.5 px-4 py-2 ${
                isUploading || isSaving ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
              } text-white rounded font-bold uppercase transition-colors`}
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{isSaving ? 'Đang lưu...' : 'Lưu bài viết'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
