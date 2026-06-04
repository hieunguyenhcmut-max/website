import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Search, Users, FileText, Gift, Award, ArrowUpRight } from 'lucide-react';

interface HomeHeroProps {
  onSearch: (query: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function HomeHero({ onSearch, setActiveTab }: HomeHeroProps) {
  const { systemConfig, documents, sharePosts } = useApp();
  const [localSearch, setLocalSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearch);
    setActiveTab('documents');
  };

  // Fun metrics calculated dynamically
  const documentCount = documents.length + 420; // adding fake historical number
  const blogCount = sharePosts.length + 15;

  return (
    <section className="relative overflow-hidden bg-white border-b border-gray-200 pt-16 pb-20 md:pt-24 md:pb-28">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-indigo-50 opacity-40 blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-indigo-50/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Tagline */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-800 ring-1 ring-inset ring-indigo-600/10 mb-6">
            <Gift className="h-3.5 w-3.5 text-indigo-600" />
            <span>Kênh Học Tập Hoàn Toàn Miễn Phí & Có Phí Tối Giản</span>
          </span>

          {/* Heading */}
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-tight">
            {systemConfig.heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {systemConfig.heroSubtitle}
          </p>

          {/* Unified search action */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="mt-10 mx-auto max-w-xl flex items-center bg-white p-2 rounded-2xl shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500"
          >
            <div className="relative flex-grow flex items-center px-2">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Tìm tài liệu (Toán cao cấp, DSA, TOEIC,...)..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full text-gray-800 placeholder-gray-400 bg-transparent py-2.5 focus:outline-none text-sm font-medium"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Tìm Kiếm
            </button>
          </form>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={systemConfig.zaloLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/10 transition duration-200 hover:bg-indigo-700 hover:scale-105"
            >
              <span>Tham gia Nhóm Zalo Sinh Viên</span>
              <ArrowUpRight className="h-4 w-4 transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            
            <button
              onClick={() => setActiveTab('documents')}
              className="border border-gray-200 hover:border-gray-300 bg-white rounded-full px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-55 hover:bg-gray-50"
            >
              Xem Kho Tài Liệu
            </button>
          </div>

          {/* Statistics Grid */}
          <div className="mt-16 sm:mt-20 border-t border-gray-200 pt-10 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-1 text-indigo-600">
                <Users className="h-6 w-6" />
              </div>
              <span className="block font-display text-3xl font-extrabold text-gray-900" id="stat-students">
                6,200+
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Sinh viên tham gia
              </span>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-1 text-indigo-600">
                <FileText className="h-6 w-6" />
              </div>
              <span className="block font-display text-3xl font-extrabold text-gray-900" id="stat-docs">
                {documentCount}+
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Tài liệu chia sẻ
              </span>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-1 text-indigo-600">
                <Award className="h-6 w-6" />
              </div>
              <span className="block font-display text-3xl font-extrabold text-gray-900" id="stat-shares">
                {blogCount}+
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Kinh nghiệm đỗ A
              </span>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-1 text-indigo-600">
                <Users className="h-6 w-6" id="fake-rating-icon" />
              </div>
              <span className="block font-display text-3xl font-extrabold text-gray-900" id="stat-rating">
                100%
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Tự động duyệt tải
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
