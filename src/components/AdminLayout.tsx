import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Building2, 
  Layers, 
  Home, 
  Users, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  Newspaper
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, active, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 border-l-2 transition-all duration-150 group ${
        active 
          ? 'bg-indigo-50/70 border-indigo-600 text-indigo-600 font-semibold' 
          : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <span className={`transition-transform duration-150 ${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
      {active && <ChevronRight className="ml-auto w-3.5 h-3.5 text-indigo-500/50" />}
    </Link>
  );
};

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { to: '/', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
    { to: '/developers', icon: <Building2 className="w-4 h-4" />, label: 'Chủ Đầu Tư' },
    { to: '/projects', icon: <Layers className="w-4 h-4" />, label: 'Dự Án' },
    { to: '/products', icon: <Home className="w-4 h-4" />, label: 'Sản Phẩm BĐS' },
    { to: '/posts', icon: <Newspaper className="w-4 h-4" />, label: 'Bài Viết' },
    { to: '/users', icon: <Users className="w-4 h-4" />, label: 'Người Dùng' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Tổng quan Dashboard';
    if (path.startsWith('/developers')) return 'Quản lý Chủ Đầu Tư';
    if (path.startsWith('/projects')) return 'Quản lý Dự Án';
    if (path.startsWith('/products')) return 'Quản lý Sản Phẩm Bất Động Sản';
    if (path.startsWith('/posts')) return 'Quản lý Bài Viết';
    if (path.startsWith('/users')) return 'Quản lý Người Dùng';
    return 'Realty Admin';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-slate-200/80 p-0 shrink-0">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-slate-100">
          <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            R
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-sm leading-none">Realty Admin</h1>
            <span className="text-[9px] text-slate-400 font-semibold tracking-widest uppercase mt-0.5 block">Portal Quản Lý</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 space-y-0.5">
          {navigation.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={
                item.to === '/' 
                  ? location.pathname === '/' 
                  : location.pathname.startsWith(item.to)
              }
            />
          ))}
        </nav>

        {/* User Profile & Logout at Bottom */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 px-2 py-2 mb-3 bg-slate-50 border border-slate-200/60 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-semibold shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-semibold text-xs text-slate-800 truncate">{user?.name}</h4>
              <p className="text-[9px] text-slate-400 capitalize">{user?.role === 'admin' ? 'Quản trị' : 'Nhân viên'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-xs font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex animate-fade-in">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer content */}
          <div className="relative w-60 bg-white h-full flex flex-col p-0 border-r border-slate-200/80 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  R
                </div>
                <h1 className="font-bold text-slate-900 text-sm">Realty Admin</h1>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <nav className="flex-1 space-y-0.5">
              {navigation.map((item) => (
                <SidebarItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={
                    item.to === '/' 
                      ? location.pathname === '/' 
                      : location.pathname.startsWith(item.to)
                  }
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}
            </nav>

            <div className="border-t border-slate-100 p-4 mt-auto">
              <div className="flex items-center gap-3 px-2 py-2 mb-3 bg-slate-50 border border-slate-200/60 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-semibold shrink-0">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-semibold text-xs text-slate-800 truncate">{user?.name}</h4>
                  <p className="text-[9px] text-slate-400 capitalize">{user?.role === 'admin' ? 'Quản trị' : 'Nhân viên'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded text-red-650 hover:bg-red-50 hover:text-red-700 transition-colors text-xs font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-slate-200/80 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
            <h2 className="font-bold text-slate-800 text-sm tracking-wide truncate">{getPageTitle()}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* System Status Pulse Dot */}
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200/50 rounded-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold uppercase">Hoạt động</span>
            </div>

            <div className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200 uppercase">
              ROLE: {user?.role === 'admin' ? 'ADMIN' : 'STAFF'}
            </div>
          </div>
        </header>

        {/* Main Slot */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
};
