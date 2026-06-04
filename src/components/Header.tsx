import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { GraduationCap, LogIn, LogOut, Shield, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAdminModal: () => void;
}

export default function Header({ activeTab, setActiveTab, openAdminModal }: HeaderProps) {
  const { systemConfig, isAdminLoggedIn, logoutAdmin } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Trang Chủ' },
    { id: 'documents', label: 'Kho Tài Liệu' },
    { id: 'shares', label: 'Chia Sẻ Kinh Nghiệm' },
    { id: 'products', label: 'Sản Phẩm Đồ Dùng' },
    { id: 'contact', label: 'Liên Hệ' }
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 text-indigo-600 transition hover:opacity-90"
        >
          <GraduationCap className="h-7 w-7 text-indigo-600" id="logo-icon" />
          <span className="font-display text-xl font-bold tracking-tight text-gray-800" id="logo-text">
            {systemConfig.siteName}
          </span>
          <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700">Hub SV</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition duration-200 ${
                activeTab === item.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Admin/Logout Actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={systemConfig.zaloLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
          >
            Nhóm Zalo
          </a>
          
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold max-sm:px-2 ${
                  activeTab === 'admin' 
                    ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Shield className="h-3.5 w-3.5" />
                <span>Bàn Làm Việc Admin</span>
              </button>
              <button
                onClick={logoutAdmin}
                className="rounded-full p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition"
                title="Đăng xuất khỏi Admin"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAdminModal}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-950"
            >
              <LogIn className="h-3.5 w-3.5 text-slate-400" />
              <span>Đăng nhập Admin</span>
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href={systemConfig.zaloLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
          >
            Zalo
          </a>
          
          {isAdminLoggedIn && (
            <button
              onClick={() => handleNavClick('admin')}
              className="rounded-full bg-rose-50 p-2 text-rose-700 border border-rose-100"
              title="Admin Dashboard"
            >
              <Shield className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-b border-gray-200 bg-white px-4 pt-2 pb-6 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex w-full items-center rounded-lg px-3 py-2 text-base font-medium ${
                  activeTab === item.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-650 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            <hr className="my-2 border-slate-100" />
            
            {isAdminLoggedIn ? (
              <button
                onClick={logoutAdmin}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-base font-medium text-rose-600 hover:bg-rose-50"
              >
                <span>Đăng xuất Admin</span>
                <LogOut className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAdminModal();
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                <span>Đăng nhập Admin</span>
                <LogIn className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
