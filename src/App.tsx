import React, { useState } from 'react';
import { AppProvider, useApp } from './AppContext';
import Header from './components/Header';
import HomeHero from './components/HomeHero';
import DocumentLibrary from './components/DocumentLibrary';
import BlogShares from './components/BlogShares';
import ProductAffiliates from './components/ProductAffiliates';
import ContactComp from './components/ContactComp';
import AdminPanel from './components/AdminPanel';
import { 
  FileText, Shield, Sparkles, MessageSquare, BookOpen, 
  ArrowRight, ShieldCheck, Mail, Phone, ExternalLink, GraduationCap
} from 'lucide-react';

function AppContent() {
  const { 
    systemConfig, 
    documents, 
    sharePosts, 
    affiliateProducts, 
    isAdminLoggedIn, 
    loginAdmin 
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Admin login popups
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(username, password);
    if (success) {
      setIsLoginModalOpen(false);
      setLoginError(false);
      setUsername('');
      setPassword('');
      setActiveTab('admin');
    } else {
      setLoginError(true);
    }
  };

  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between text-slate-800 font-sans" id="app-shell">
      
      {/* Dynamic Navigation Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        openAdminModal={() => { setIsLoginModalOpen(true); setLoginError(false); }}
      />

      {/* Main Content Router */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <div className="space-y-16 pb-20 animate-fade-in">
            {/* 1. Hero banner */}
            <HomeHero onSearch={handleHeroSearch} setActiveTab={setActiveTab} />

            {/* 2. Highlights Document Section - Top 3 */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8 border-b border-gray-150 pb-4">
                <div>
                  <span className="block text-xs font-bold text-indigo-650 text-indigo-600 uppercase tracking-widest font-sans">Nổi bật học đường</span>
                  <h3 className="font-display font-extrabold text-2xl text-gray-950 mt-1">Tài Liệu Xem Nhiều Nhất</h3>
                </div>
                <button
                  onClick={() => { setActiveTab('documents'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition cursor-pointer font-sans"
                >
                  <span>Xem tất cả tài liệu</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {documents.slice(0, 3).map((doc) => (
                  <div 
                    key={doc.id}
                    onClick={() => { setActiveTab('documents'); window.scrollTo({ top: 0 }); }}
                    className="group border border-gray-200 rounded-2xl p-5 bg-white shadow-xs hover:border-indigo-200 hover:shadow-md transition cursor-pointer"
                  >
                    <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wide font-sans">
                      {doc.category}
                    </span>
                    <h4 className="font-display font-bold text-gray-955 text-gray-900 text-[15px] mt-3 group-hover:text-indigo-700 transition line-clamp-1">
                      {doc.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed font-sans">
                      {doc.description}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-150 flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-700 font-mono">
                        {doc.price === 0 ? <span className="text-indigo-600 uppercase">Miễn phí</span> : `${doc.price.toLocaleString('vi-VN')} đ`}
                      </span>
                      <span className="text-indigo-600 flex items-center gap-1">
                        <span>Chi tiết</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Zalo community join grid item */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="rounded-3xl border border-gray-200 p-6 md:p-8 bg-white shadow-xs max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 uppercase tracking-widest font-sans">
                    Mạng Lưới Kết Nối
                  </span>
                  <h4 className="font-display font-extrabold text-xl text-gray-900 leading-snug">
                    Tham gia nhóm Zalo hỏi bài & nhận tài liệu gốc
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-semibold font-sans">
                    Hàng nghìn thành viên đã đồng hành cùng hub. Nơi giải đáp các câu hỏi học tập, đề thi mẫu, và cập nhật những file tài liệu mật miễn phí cực hay hàng ngày!
                  </p>
                </div>

                <a
                  href={systemConfig.zaloLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-6 py-3.5 text-xs font-bold text-white shadow-md transition duration-200 hover:scale-105 flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                >
                  <span>VÀO NHÓM ZALO KHÔNG CẦN DUYỆT</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* 3. Highlights Share Section - Top 1 */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8 border-b border-gray-150 pb-4">
                <div>
                  <span className="block text-xs font-bold text-indigo-600 uppercase tracking-widest font-sans">Kỹ năng vàng</span>
                  <h3 className="font-display font-extrabold text-2xl text-gray-950 mt-1">Cẩm Nang Mới Từ Thủ Khoa</h3>
                </div>
                <button
                  onClick={() => { setActiveTab('shares'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition cursor-pointer font-sans"
                >
                  <span>Xem thêm cẩm nang</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {sharePosts.length > 0 && (
                <div 
                  onClick={() => { setActiveTab('shares'); window.scrollTo({ top: 0 }); }}
                  className="max-w-3xl mx-auto rounded-2xl border border-gray-200 bg-white p-6 md:p-8 hover:border-indigo-100 hover:shadow-md cursor-pointer transition flex flex-col md:flex-row gap-6 items-start animate-fade-in"
                >
                  <div className="rounded-xl bg-indigo-50 text-indigo-600 p-4 flex-shrink-0 max-sm:aspect-square">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <div>
                    <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wider font-sans">
                      {sharePosts[0].category}
                    </span>
                    <h4 className="font-display font-extrabold text-lg text-gray-900 mt-3 hover:text-indigo-705 transition leading-snug">
                      {sharePosts[0].title}
                    </h4>
                    <p className="text-xs text-gray-400 font-semibold mt-1 font-sans">Viết bởi: {sharePosts[0].author} • Thao khảo {sharePosts[0].readTime}</p>
                    <p className="text-xs text-gray-500 mt-3 leading-relaxed class line-clamp-2 font-sans">
                      {sharePosts[0].content}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Highlights Product Affiliate - Top 2 */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8 border-b border-gray-150 pb-4">
                <div>
                  <span className="block text-xs font-bold text-indigo-600 uppercase tracking-widest font-sans">Tiện ích đề cử</span>
                  <h3 className="font-display font-extrabold text-2xl text-gray-950 mt-1">Đồ Dùng Học Tập Sinh Viên</h3>
                </div>
                <button
                  onClick={() => { setActiveTab('products'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition cursor-pointer font-sans"
                >
                  <span>Xem tất cả sản phẩm học</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {affiliateProducts.slice(0, 2).map((p) => (
                  <div 
                    key={p.id}
                    className="flex rounded-2xl overflow-hidden border border-gray-200 bg-white items-center hover:border-indigo-100 shadow-xs transition"
                  >
                    <img src={p.imageUrl} className="h-32 w-32 object-cover aspect-square flex-shrink-0 bg-gray-50" alt="" referrerPolicy="no-referrer" />
                    <div className="p-4 space-y-1">
                      <h4 className="font-display font-bold text-xs text-gray-900 line-clamp-1">{p.title}</h4>
                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed font-sans">{p.description}</p>
                      <div className="pt-2 flex items-center justify-between gap-4">
                        <span className="font-mono text-xs font-bold text-gray-900">{p.price.toLocaleString('vi-VN')} đ</span>
                        <a 
                          href={p.affiliateLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="rounded bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700 hover:bg-indigo-600 hover:text-white transition cursor-pointer font-sans"
                        >
                          Xem giá Shopee
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Contact Section */}
            <div className="border-t border-slate-100 pt-10">
              <ContactComp />
            </div>
          </div>
        )}

        {activeTab === 'documents' && <DocumentLibrary initialSearchQuery={searchQuery} />}
        {activeTab === 'shares' && <BlogShares />}
        {activeTab === 'products' && <ProductAffiliates />}
        {activeTab === 'contact' && <ContactComp />}
        
        {activeTab === 'admin' && (
          isAdminLoggedIn ? <AdminPanel /> : (
            <div className="p-16 text-center">
              <Shield className="h-10 w-10 text-rose-500 mx-auto" />
              <h3 className="font-display font-bold text-lg text-slate-800 mt-4">Cần đăng nhập</h3>
              <p className="text-xs text-slate-500 mt-1">Bạn vui lòng đăng nhập quyền quản trị viên.</p>
            </div>
          )
        )}
      </main>


      {/* ADMIN PORTAL LOGIN CONTAINER */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-xl overflow-hidden">
            
            {/* Modal Head */}
            <div className="border-b border-rose-100 bg-rose-50/50 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-rose-700">
                <Shield className="h-5 w-5" />
                <span className="font-display font-bold text-sm text-rose-900">Đăng nhập Quản Trị Viên</span>
              </div>
              <button 
                onClick={() => setIsLoginModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-1 p-1"
              >
                X
              </button>
            </div>

            {/* Input sequence */}
            <form onSubmit={handleAdminLogin} className="p-6 space-y-4">
              
              {/* Informative credentials guide badge */}
              <div className="rounded-xl border border-rose-100 bg-rose-50/30 p-3.5 text-rose-800 text-xs text-left leading-relaxed font-semibold">
                🔑 Tài khoản trải nghiệm mặc định:<br />
                - <span className="font-bold">Tên tài khoản:</span> <code className="bg-white/80 px-1 rounded border">admin</code><br />
                - <span className="font-bold">Mật khẩu:</span> <code className="bg-white/80 px-1 rounded border">123</code>
              </div>

              {loginError && (
                <div className="rounded-lg bg-rose-55 bg-rose-50 p-2.5 text-xs text-rose-800 font-bold">
                  ❌ Sai tên tài khoản hoặc mật khẩu!
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Tên tài khoản</label>
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Mật khẩu</label>
                <input
                  type="password"
                  required
                  placeholder="•••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 py-3 text-xs font-bold text-white transition shadow-sm cursor-pointer font-sans"
              >
                Xác nhận Đăng nhập
              </button>
            </form>
          </div>
        </div>
      )}


      {/* Page Footer */}
      <footer className="border-t border-gray-200 bg-white py-8" id="page-footer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="flex justify-center items-center gap-1.5 text-gray-700 font-display font-extrabold text-sm">
            <GraduationCap className="h-5 w-5 text-indigo-600" />
            <span>{systemConfig.siteName}</span>
            <span className="text-xs text-slate-350 px-1.5">•</span>
            <span className="text-xs text-gray-400 font-medium font-sans">Kênh Chia Sẻ Học thuật Toàn Diện</span>
          </div>

          <p className="text-[11px] text-gray-400 max-w-md mx-auto leading-relaxed font-semibold font-sans">
            {systemConfig.footerText || `VietQR & MBBank Sandbox Automated. Tài liệu bản quyền của cộng đồng đóng góp. Bản quyền bảo lưu của SinhVienHub \u00a9 ${new Date().getFullYear()}.`}
          </p>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
