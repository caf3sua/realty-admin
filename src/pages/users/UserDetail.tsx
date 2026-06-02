import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import type { User } from '../../data/mockData';
import { ArrowLeft, Edit, Shield, Mail, Calendar, Key, UserCheck, UserX } from 'lucide-react';

export const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.getUser(id)
      .then(usr => {
        setUser(usr);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-4 text-xs">
        <h3 className="text-sm font-bold text-slate-800">KHÔNG TÌM THẤY NGƯỜI DÙNG</h3>
        <p className="text-slate-500">Tài khoản này không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
        <button onClick={() => navigate('/users')} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold uppercase cursor-pointer">
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
          onClick={() => navigate('/users')}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Danh sách tài khoản</span>
        </button>
        
        <Link 
          to={`/users/${user.id}/edit`}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-indigo-600 hover:text-indigo-700 hover:border-slate-350 rounded font-bold uppercase transition-colors"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Chỉnh sửa tài khoản</span>
        </Link>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 lg:p-6 shadow-sm space-y-6 max-w-2xl">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
          
          {/* Large Avatar */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
            {user.name.charAt(0)}
          </div>
          
          <div className="space-y-2.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                user.role === 'admin' 
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200/60' 
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}>
                {user.role === 'admin' ? 'ADMIN' : 'STAFF'}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-bold border ${
                user.status === 'active' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                  : 'bg-rose-50 text-rose-700 border-rose-200/60'
              }`}>
                {user.status === 'active' ? (
                  <>
                    <UserCheck className="w-3 h-3 text-emerald-600" />
                    <span>ONLINE</span>
                  </>
                ) : (
                  <>
                    <UserX className="w-3 h-3 text-rose-600" />
                    <span>LOCKED</span>
                  </>
                )}
              </span>
            </div>
            
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-none">{user.name}</h3>
            <p className="text-[10px] text-slate-400">ACCOUNT ID: {user.id}</p>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Credentials and metadata list */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Thông tin liên lạc & phân quyền</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded text-xs">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[9px] text-slate-400 block font-bold uppercase">Địa chỉ Email</span>
                <span className="font-bold text-slate-700 truncate block mt-0.5">{user.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 text-xs">
              <Shield className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[9px] text-slate-400 block font-bold uppercase">Cấp bậc truy cập</span>
                <span className="font-bold text-slate-700 block mt-0.5">{user.role === 'admin' ? 'Quyền Quản Trị Hệ Thống' : 'Quyền Nhân Viên Nhập Liệu'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 text-xs">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[9px] text-slate-400 block font-bold uppercase">Ngày khởi tạo tài khoản</span>
                <span className="font-bold text-slate-700 block mt-0.5">{user.createdAt}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 text-xs">
              <Key className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[9px] text-slate-400 block font-bold uppercase">Mật khẩu (Mặc định demo)</span>
                <span className="font-bold text-slate-700 block mt-0.5">•••••••• (dùng 'password123')</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
