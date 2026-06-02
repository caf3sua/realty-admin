import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import type { User } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { Search, Plus, Eye, Edit, Trash2, AlertTriangle, Shield, CheckCircle, Ban } from 'lucide-react';

export const UserList: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  useEffect(() => {
    api.getUsers()
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDeleteClick = (usr: User) => {
    if (usr.id === currentUser?.id) {
      alert('Bạn không thể tự xóa tài khoản của chính mình!');
      return;
    }
    setDeleteTarget(usr);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteUser(deleteTarget.id);
      setUsers(users.filter(u => u.id !== deleteTarget.id));
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


  const filteredUsers = users.filter(usr => {
    const matchesSearch = usr.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          usr.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || usr.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-4">
      {/* Filters Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm text-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm người dùng theo tên, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded text-slate-500">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent focus:outline-none text-[11px] font-bold cursor-pointer text-slate-700"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="staff">Nhân viên</option>
            </select>
          </div>

          {/* Add Button */}
          <Link 
            to="/users/new"
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold uppercase shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm tài khoản</span>
          </Link>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider">
                <th className="px-5 py-3">Avatar & Tên</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Vai trò</th>
                <th className="px-5 py-3">Ngày tạo</th>
                <th className="px-5 py-3 text-center">Trạng thái</th>
                <th className="px-5 py-3 text-center w-28">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Name & Avatar */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {usr.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-800 hover:text-indigo-600">
                            <Link to={`/users/${usr.id}`}>{usr.name}</Link>
                            {usr.id === currentUser?.id && (
                              <span className="ml-2 px-1.5 py-0.5 rounded text-[8px] bg-slate-100 text-slate-500 font-bold border border-slate-200">ME</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-3.5 text-slate-500">
                      {usr.email}
                    </td>

                    {/* Role */}
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                        usr.role === 'admin' 
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200/60' 
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {usr.role === 'admin' ? 'ADMIN' : 'STAFF'}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="px-5 py-3.5 text-slate-500">
                      {usr.createdAt}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-bold border ${
                        usr.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                          : 'bg-rose-50 text-rose-700 border-rose-200/60'
                      }`}>
                        {usr.status === 'active' ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>ONLINE</span>
                          </>
                        ) : (
                          <>
                            <Ban className="w-3 h-3 text-rose-600" />
                            <span>LOCKED</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        <Link 
                          to={`/users/${usr.id}`}
                          className="p-1.5 rounded text-slate-450 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link 
                          to={`/users/${usr.id}/edit`}
                          className="p-1.5 rounded text-slate-450 hover:bg-slate-100 hover:text-indigo-650 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(usr)}
                          disabled={usr.id === currentUser?.id}
                          className={`p-1.5 rounded transition-colors ${
                            usr.id === currentUser?.id 
                              ? 'text-slate-300 cursor-not-allowed' 
                              : 'text-slate-450 hover:bg-slate-100 hover:text-red-650'
                          }`}
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
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400 font-medium italic">
                    Không tìm thấy người dùng nào phù hợp.
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
              <div className="w-9 h-9 rounded bg-red-50 border border-red-100 flex items-center justify-center text-red-650 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-850 text-sm uppercase">Xác nhận xóa tài khoản?</h4>
                <p className="text-slate-500 leading-normal">
                  Bạn có chắc chắn muốn xóa tài khoản của nhân viên <strong className="text-slate-850">{deleteTarget.name}</strong> ({deleteTarget.email})? Người dùng này sẽ mất toàn bộ quyền truy cập và không thể khôi phục lại.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button 
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-2 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-655 font-bold uppercase transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold uppercase transition-colors"
              >
                Xóa bản ghi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
