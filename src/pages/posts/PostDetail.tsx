import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import type { Post } from '../../data/mockData';
import { ArrowLeft, Edit, Calendar, BookOpen, AlertTriangle } from 'lucide-react';

export const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api.getPost(slug)
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-4 text-xs">
        <div className="w-12 h-12 rounded bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">KHÔNG TÌM THẤY BÀI VIẾT</h3>
        <p className="text-slate-500">Bài viết này không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
        <button onClick={() => navigate('/posts')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold uppercase cursor-pointer">
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
          onClick={() => navigate('/posts')}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Danh sách bài viết</span>
        </button>
        
        <Link 
          to={`/posts/${post.slug}/edit`}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-indigo-600 hover:text-indigo-700 rounded font-bold uppercase transition-colors"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Chỉnh sửa bài viết</span>
        </Link>
      </div>

      {/* Detail Container */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
        
        {/* Cover Banner */}
        <div className="relative h-64 sm:h-80 w-full bg-slate-100 overflow-hidden border-b border-slate-200">
          <img 
            src={post.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&h=400&q=80'} 
            alt={post.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&h=400&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-900/10 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <span className={`px-2.5 py-1 rounded text-[9px] font-extrabold uppercase tracking-wider ${
              post.category === 'Thị trường' ? 'bg-amber-500 text-white' :
              post.category === 'Quy hoạch' ? 'bg-indigo-600 text-white' :
              post.category === 'Cẩm nang' ? 'bg-teal-500 text-white' :
              'bg-blue-600 text-white'
            }`}>
              {post.category}
            </span>
            <h1 className="text-xl sm:text-3xl font-extrabold leading-tight tracking-wide drop-shadow-sm">{post.title}</h1>
          </div>
        </div>

        {/* Content Sheet */}
        <div className="p-6 sm:p-8 space-y-6 max-w-4xl">
          
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-slate-400 font-semibold border-b border-slate-100 pb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Ngày đăng: <strong className="text-slate-600">{post.publishedAt || 'Bản nháp'}</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Chủ đề: <strong className="text-slate-600">{post.category}</strong></span>
            </div>
            <span>ID: <strong className="text-slate-650">{post.id}</strong></span>
            <span>SLUG: <strong className="text-slate-650">{post.slug}</strong></span>
          </div>

          {/* Summary Quote Box */}
          {post.summary && (
            <div className="p-4 bg-slate-50 border-l-4 border-indigo-500 rounded-r-lg">
              <p className="text-slate-600 italic font-medium leading-relaxed text-xs">
                "{post.summary}"
              </p>
            </div>
          )}

          {/* Render HTML Content */}
          <div 
            className="prose max-w-none prose-indigo text-slate-700 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

        </div>
      </div>
    </div>
  );
};
