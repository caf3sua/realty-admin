import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import type { Post } from '../../data/mockData';
import { Search, Plus, Eye, Edit, Trash2, AlertTriangle, Calendar } from 'lucide-react';

export const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Tất cả');
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);

  useEffect(() => {
    api.getPosts()
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDeleteClick = (post: Post) => {
    setDeleteTarget(post);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deletePost(deleteTarget.id);
      setPosts(posts.filter(p => p.id !== deleteTarget.id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'Tất cả' || post.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Tất cả', 'Thị trường', 'Quy hoạch', 'Cẩm nang', 'Dự án'];

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row flex-1 gap-3 max-w-2xl">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết theo tiêu đề hoặc tóm tắt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all"
            />
          </div>

          {/* Category Dropdown Filter */}
          <div className="relative w-full sm:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none text-xs text-slate-750 font-medium cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Button */}
        <Link 
          to="/posts/new"
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>VIẾT BÀI MỚI</span>
        </Link>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider">
                <th className="px-5 py-3">Bài viết</th>
                <th className="px-5 py-3">Danh mục</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3">Ngày đăng</th>
                <th className="px-5 py-3 text-center w-28">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Thumbnail & Title */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img 
                          src={post.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=80&h=80&q=80'} 
                          alt={post.title} 
                          className="w-12 h-9 rounded bg-slate-50 object-cover border border-slate-200 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=80&h=80&q=80';
                          }}
                        />
                        <div className="space-y-0.5">
                          <Link to={`/posts/${post.slug}`} className="font-bold text-slate-800 hover:text-indigo-650 line-clamp-1">
                            {post.title}
                          </Link>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{post.summary}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${
                        post.category === 'Thị trường' ? 'bg-amber-50 text-amber-700 border border-amber-200/50' :
                        post.category === 'Quy hoạch' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/50' :
                        post.category === 'Cẩm nang' ? 'bg-teal-50 text-teal-700 border border-teal-200/50' :
                        'bg-blue-50 text-blue-700 border border-blue-200/50'
                      }`}>
                        {post.category}
                      </span>
                    </td>

                    {/* Slug */}
                    <td className="px-5 py-3.5 text-slate-400 font-semibold truncate max-w-[150px]" title={post.slug}>
                      {post.slug}
                    </td>

                    {/* Published Date */}
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{post.publishedAt || 'Nháp'}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        <Link 
                          to={`/posts/${post.slug}`}
                          className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link 
                          to={`/posts/${post.slug}/edit`}
                          className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(post)}
                          className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-red-650 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400 font-medium italic">
                    Không tìm thấy bài viết nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={() => setDeleteTarget(null)} />
          
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md p-5 overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150 text-xs">
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-sm uppercase">Xác nhận xóa bài viết?</h4>
                <p className="text-slate-500 leading-normal">
                  Bạn có chắc chắn muốn xóa bài viết <strong className="text-slate-850">{deleteTarget.title}</strong>? Thao tác này sẽ xóa vĩnh viễn và không thể hoàn tác.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button 
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-2 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-600 font-bold uppercase transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="px-3.5 py-2 bg-red-650 hover:bg-red-700 text-white rounded font-bold uppercase transition-colors"
              >
                Xóa bài viết
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
