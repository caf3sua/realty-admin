import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MockDatabase } from '../../data/mockData';
import type { User } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Save } from 'lucide-react';

export const UserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const isEditMode = !!id;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'staff'>('staff');
  const [status, setStatus] = useState<User['status']>('active');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode) {
      const users = MockDatabase.getUsers();
      const usr = users.find(u => u.id === id);
      if (usr) {
        setName(usr.name);
        setEmail(usr.email);
        setRole(usr.role);
        setStatus(usr.status);
      } else {
        navigate('/users');
      }
    }
  }, [id, isEditMode, navigate]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Họ và tên không được để trống';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Email không đúng cấu trúc (ví dụ: name@realty.com)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditMode && id === currentUser?.id && status === 'inactive') {
      alert('Bạn không thể tự khóa tài khoản của chính mình!');
      return;
    }

    const users = MockDatabase.getUsers();

    if (isEditMode) {
      const updated = users.map(u => {
        if (u.id === id) {
          return { ...u, name, email, role, status };
        }
        return u;
      });
      MockDatabase.saveUsers(updated);
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
        status,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        setErrors({ email: 'Email này đã tồn tại trên hệ thống.' });
        return;
      }

      MockDatabase.saveUsers([...users, newUser]);
    }

    navigate('/users');
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/users')}
          className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 rounded transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
            {isEditMode ? 'Chỉnh Sửa Người Dùng' : 'Thêm Người Dùng Mới'}
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Thiết lập quyền truy cập hệ thống và trạng thái hoạt động của nhân viên</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 lg:p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Full Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Họ và tên <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Ví dụ: Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.name ? 'border-red-555 focus:border-red-555' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all`}
              />
              {errors.name && <p className="text-[10px] text-red-500 font-semibold">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Địa chỉ Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                placeholder="name@realty.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 bg-slate-50 border ${errors.email ? 'border-red-555 focus:border-red-555' : 'border-slate-200 focus:border-indigo-600'} rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all`}
              />
              {errors.email && <p className="text-[10px] text-red-500 font-semibold">{errors.email}</p>}
            </div>

            {/* Role Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Vai trò truy cập <span className="text-red-500">*</span></label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'staff')}
                className="w-full px-3 py-2 bg-slate-55 border border-slate-200 focus:border-indigo-600 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all cursor-pointer"
              >
                <option value="admin">Quản trị viên (Admin)</option>
                <option value="staff">Nhân viên (Staff)</option>
              </select>
            </div>

            {/* Status Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Trạng thái tài khoản <span className="text-red-500">*</span></label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as User['status'])}
                className="w-full px-3 py-2 bg-slate-55 border border-slate-200 focus:border-indigo-600 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-700 transition-all cursor-pointer"
              >
                <option value="active">Hoạt động (Active)</option>
                <option value="inactive">Tạm khóa (Inactive)</option>
              </select>
            </div>

          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/users')}
              className="px-3.5 py-2 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-655 font-bold uppercase transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold uppercase transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu tài khoản</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
