import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(async () => {
      try {
        const success = await login(email, password);
        setLoading(false);
        if (success) {
          navigate('/');
        } else {
          setError('Tài khoản hoặc mật khẩu không chính xác, hoặc tài khoản đã bị khóa.');
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
        setError('Có lỗi xảy ra khi kết nối tới máy chủ.');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Container */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-xl w-full max-w-4xl flex min-h-[500px] border border-slate-200/80">
        
        {/* Left Side: Branding */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-600 p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 -translate-x-20 translate-y-20"></div>

          <div className="flex items-center gap-2 z-10">
            <img
              src="/image/logo-yellow.png"
              alt="Logo"
              className="h-8 w-auto object-contain"
            />
            <span className="font-bold text-sm tracking-widest uppercase">REALTY PORTAL</span>
          </div>

          <div className="z-10 space-y-3">
            <h2 className="text-2xl font-bold leading-tight">
              Hệ thống quản trị
            </h2>
            <p className="text-indigo-100 text-xs leading-relaxed max-w-sm">
              Quản lý danh sách chủ đầu tư, dự án, danh mục sản phẩm căn hộ và nhân viên phân quyền nội bộ của Ánh Dương Property.
            </p>
          </div>

          <div className="text-[10px] text-indigo-200 z-10">
            © 2026 Anh Duong Property.
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider">Đăng nhập hệ thống</h3>
            <p className="text-xs text-slate-400 mt-1">Vui lòng cung cấp thông tin tài khoản của bạn</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-650 text-xs rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">Địa chỉ Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="admin@realty.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-800 transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600/20 text-xs text-slate-800 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-350 text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer" />
                <span>Ghi nhớ phiên</span>
              </label>
              <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-700">Quên mật khẩu?</a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs rounded transition-all flex items-center justify-center cursor-pointer shadow-md shadow-indigo-600/10"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'ĐĂNG NHẬP'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
