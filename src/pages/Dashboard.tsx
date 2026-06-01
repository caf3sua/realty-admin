import React from 'react';
import { Link } from 'react-router-dom';
import { MockDatabase } from '../data/mockData';
import { 
  Building2, 
  Layers, 
  Home, 
  Users, 
  Plus, 
  ArrowUpRight 
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const developers = MockDatabase.getDevelopers();
  const projects = MockDatabase.getProjects();
  const products = MockDatabase.getProducts();
  const users = MockDatabase.getUsers();

  const stats = [
    { 
      label: 'Chủ Đầu Tư', 
      count: developers.length, 
      icon: <Building2 className="w-5 h-5 text-emerald-600" />, 
      color: 'bg-slate-50 border-slate-200',
      link: '/developers'
    },
    { 
      label: 'Dự Án', 
      count: projects.length, 
      icon: <Layers className="w-5 h-5 text-teal-600" />, 
      color: 'bg-slate-50 border-slate-200',
      link: '/projects'
    },
    { 
      label: 'Sản Phẩm BĐS', 
      count: products.length, 
      icon: <Home className="w-5 h-5 text-cyan-600" />, 
      color: 'bg-slate-50 border-slate-200',
      link: '/products'
    },
    { 
      label: 'Người Dùng', 
      count: users.length, 
      icon: <Users className="w-5 h-5 text-sky-600" />, 
      color: 'bg-slate-50 border-slate-200',
      link: '/users'
    },
  ];

  const productTypes = products.reduce((acc, curr) => {
    acc[curr.productTypeName] = (acc[curr.productTypeName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const productTypeColors = ['bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500', 'bg-indigo-500'];

  const logs = [
    { timestamp: '10:15:32', level: 'INFO', user: 'admin', msg: 'Thêm mới biệt thự Ngọc Trai VIP (prod-1)' },
    { timestamp: '08:32:04', level: 'INFO', user: 'staff', msg: 'Cập nhật trạng thái dự án Vinhomes Ocean Park 2' },
    { timestamp: 'Hôm qua', level: 'INFO', user: 'admin', msg: 'Thêm chủ đầu tư mới Sun Group (dev-4)' },
    { timestamp: '2 ngày trước', level: 'WARN', user: 'admin', msg: 'Khóa tài khoản nhân viên Lê Văn Khóa (user-3)' },
    { timestamp: '3 ngày trước', level: 'INFO', user: 'staff', msg: 'Đăng ký tài khoản nhân viên mới Trần Thị Nhân Viên' },
  ];

  return (
    <div className="space-y-6">
      {/* Cluster Overview Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span>
              QUẢN TRỊ HỆ THỐNG ÁNH DƯƠNG PROPERTY
            </h2>
            <p className="text-slate-500 text-xs leading-relaxed max-w-2xl">
              Cơ sở điều khiển dữ liệu bất động sản. Các collection được liên kết qua ID/Slug và đồng bộ tự động xuống Local Database.
            </p>
          </div>
          
          <div className="flex gap-4 text-[10px] text-slate-400 shrink-0">
            <div>
              <span className="text-slate-400 block uppercase font-bold">Local Storage</span>
              <span className="text-slate-700 font-semibold">CONNECTED</span>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <span className="text-slate-400 block uppercase font-bold">Tổng tài nguyên</span>
              <span className="text-slate-700 font-semibold">{developers.length + projects.length + products.length} RECORDS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link 
            key={stat.label} 
            to={stat.link} 
            className="bg-white hover:bg-slate-50/50 border border-slate-200/80 rounded-xl p-5 transition-all duration-150 flex items-center justify-between group shadow-sm"
          >
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
              <h3 className="text-2xl font-bold text-slate-800 mt-1 group-hover:scale-102 transition-transform">{stat.count}</h3>
            </div>
            <div className={`w-9 h-9 rounded flex items-center justify-center border ${stat.color} group-hover:-translate-y-0.5 transition-all`}>
              {stat.icon}
            </div>
          </Link>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Data Distribution Card */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">CƠ CẤU SẢN PHẨM</h3>
                <p className="text-[10px] text-slate-400">Phân bố số lượng sản phẩm theo các phân khúc chính</p>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(productTypes).map(([type, count], index) => {
                const percentage = products.length ? (count / products.length) * 100 : 0;
                const bgColor = productTypeColors[index % productTypeColors.length];
                
                return (
                  <div key={type} className="space-y-1.5">
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>{type}</span>
                      <span className="font-semibold text-slate-800">{count} sản phẩm ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded h-2 overflow-hidden border border-slate-200/50">
                      <div 
                        className={`h-full rounded ${bgColor} transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 text-xs mb-3.5">LỐI TẮT TÁC VỤ NHANH</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link 
                to="/developers/new" 
                className="flex flex-col items-center gap-2 p-3.5 rounded border border-slate-200 bg-slate-50/60 hover:bg-indigo-50/40 hover:border-indigo-200 text-center transition-all group"
              >
                <div className="w-8 h-8 rounded bg-white border border-slate-200 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 group-hover:text-indigo-650 transition-colors">Thêm Chủ ĐT</span>
              </Link>
              <Link 
                to="/projects/new" 
                className="flex flex-col items-center gap-2 p-3.5 rounded border border-slate-200 bg-slate-50/60 hover:bg-indigo-50/40 hover:border-indigo-200 text-center transition-all group"
              >
                <div className="w-8 h-8 rounded bg-white border border-slate-200 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 group-hover:text-indigo-650 transition-colors">Thêm Dự Án</span>
              </Link>
              <Link 
                to="/products/new" 
                className="flex flex-col items-center gap-2 p-3.5 rounded border border-slate-200 bg-slate-50/60 hover:bg-indigo-50/40 hover:border-indigo-200 text-center transition-all group"
              >
                <div className="w-8 h-8 rounded bg-white border border-slate-200 text-cyan-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 group-hover:text-indigo-650 transition-colors">Đăng tin BĐS</span>
              </Link>
              <Link 
                to="/users/new" 
                className="flex flex-col items-center gap-2 p-3.5 rounded border border-slate-200 bg-slate-50/60 hover:bg-indigo-50/40 hover:border-indigo-200 text-center transition-all group"
              >
                <div className="w-8 h-8 rounded bg-white border border-slate-200 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 group-hover:text-indigo-650 transition-colors">Thêm Nhân viên</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width) - Activity Feed */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-600 rotate-45" />
              <h3 className="font-bold text-slate-800 text-sm uppercase">Lịch sử hoạt động</h3>
            </div>
          </div>

          <div className="flex-1 bg-slate-50 border border-slate-200/60 rounded-lg p-3 text-[11px] leading-relaxed space-y-3.5 h-[280px] overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="space-y-1 pb-2.5 border-b border-slate-200/60 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 text-slate-400">
                  <span>[{log.timestamp}]</span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                    log.level === 'WARN' 
                      ? 'bg-amber-50 text-amber-600 border-amber-200/50' 
                      : 'bg-indigo-50 text-indigo-600 border-indigo-150/50'
                  }`}>
                    {log.level}
                  </span>
                  <span className="text-slate-650 font-medium">@{log.user}</span>
                </div>
                <div className="text-slate-700 pl-1">
                  {log.msg}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 text-center">
            <span className="text-[10px] font-bold text-indigo-650 hover:text-indigo-700 cursor-pointer inline-flex items-center gap-1">
              XEM TOÀN BỘ LOGS HỆ THỐNG
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
