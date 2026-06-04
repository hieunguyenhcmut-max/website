import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { SharePost } from '../types';
import { Search, BookOpen, Clock, Calendar, User, ArrowRight, X, ChevronRight } from 'lucide-react';

export default function BlogShares() {
  const { sharePosts } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [readingPost, setReadingPost] = useState<SharePost | null>(null);

  // Extract unique categories safely
  const categories = ['all', ...Array.from(new Set(sharePosts.map(p => p.category)))];

  // Filtering blogs
  const filteredPosts = sharePosts.filter(post => {
    const matchSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                        post.content.toLowerCase().includes(search.toLowerCase()) ||
                        post.author.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'all' ? true : post.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  // Basic custom markdown formatter to render high-contrast formatted paragraphs
  const renderFormattedContent = (txt: string) => {
    return txt.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('### ')) {
        return (
          <h4 key={index} className="font-display font-bold text-base text-slate-850 mt-6 mb-2 flex items-center gap-1">
            <span className="h-1.5 w-1.5 bg-emerald-600 rounded-full inline-block" />
            {paragraph.replace('### ', '')}
          </h4>
        );
      }
      
      if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
        const lines = paragraph.split('\n');
        return (
          <ul key={index} className="list-disc pl-5 my-3 space-y-1.5 text-slate-650 text-sm">
            {lines.map((line, lIdx) => (
              <li key={lIdx}>
                {line.replace(/^[-\d.]\s+/, '')}
              </li>
            ))}
          </ul>
        );
      }

      // Handle simple inline bold markings like **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      if (boldRegex.test(paragraph)) {
        const parts = paragraph.split(boldRegex);
        return (
          <p key={index} className="text-sm leading-relaxed text-slate-600 my-3">
            {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-slate-800">{part}</strong> : part)}
          </p>
        );
      }

      return (
        <p key={index} className="text-sm leading-relaxed text-slate-605 my-3 text-slate-600">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Title Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-gray-800 flex items-center gap-2">
            Chia Sẻ Kinh Nghiệm Ôn Thi
          </h2>
          <p className="mt-1 text-gray-500 font-medium text-sm">
            Góc chia sẻ cẩm nang, kinh nghiệm học bổ ích, định hướng chuẩn chỉ từ thủ khoa và cựu sinh viên.
          </p>
        </div>

        {/* Dynamic Category Quick pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {cat === 'all' ? 'Tất cả chủ đề' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input bar */}
      <div className="mb-8 max-w-xl relative">
        <Search className="absolute top-2.5 left-3.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm bài viết kinh nghiệm (học bổng, mẹo thi, cv)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 pl-11 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:outline-none bg-white shadow-xs"
        />
      </div>

      {/* Grid view lists */}
      {filteredPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-255 border-gray-200 bg-white p-12 text-center">
          <BookOpen className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <h3 className="font-display text-lg font-bold text-gray-800">Không tìm thấy bài viết nào</h3>
          <p className="text-gray-500 text-xs mt-1">Vui lòng tinh chỉnh từ khóa tìm kiếm của bạn.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div 
              key={post.id}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-205 border-gray-200 bg-white p-6 shadow-sm transition hover:border-indigo-150 hover:border-indigo-200 hover:shadow-md cursor-pointer"
              onClick={() => setReadingPost(post)}
            >
              <div>
                <span className="rounded-md bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                  {post.category}
                </span>

                <h3 className="mt-4 font-display font-medium text-gray-900 text-base leading-snug hover:text-indigo-650 transition line-clamp-2">
                  {post.title}
                </h3>

                <p className="mt-3 text-xs leading-relaxed text-gray-550 line-clamp-3">
                  {post.content.replace(/[#*`]/g, '')}
                </p>
              </div>

              {/* Author & Read time block */}
              <div className="mt-6 border-t border-gray-100 pt-4 flex items-center justify-between text-[11px] text-gray-500 font-semibold mb-1">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-gray-400" />
                  <span className="line-clamp-1 max-w-[120px]">{post.author.split('(')[0]}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    <span>{post.readTime}</span>
                  </div>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* IMMERSIVE READER MODAL */}
      {readingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col">
            
            {/* Nav Header */}
            <div className="border-b border-gray-150 px-6 py-4 flex items-center justify-between">
              <span className="rounded-md bg-indigo-55 bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-800 uppercase tracking-widest">
                {readingPost.category}
              </span>
              
              <button 
                onClick={() => setReadingPost(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Read Canvas Content */}
            <div className="flex-grow overflow-y-auto p-6 md:p-8">
              
              {/* Title heading */}
              <h1 className="font-display font-extrabold text-slate-900 text-2xl md:text-3xl leading-snug">
                {readingPost.title}
              </h1>

              {/* Author and Date bar */}
              <div className="mt-4 flex flex-wrap gap-4 items-center text-xs text-slate-400 font-semibold border-b border-slate-100 pb-4">
                <div className="flex items-center gap-1 text-slate-600">
                  <User className="h-4 w-4 text-slate-400" />
                  <span>Viết bởi: <span className="font-bold text-slate-800">{readingPost.author}</span></span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{readingPost.readTime}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Đăng ngày {readingPost.date}</span>
                </div>
              </div>

              {/* Main article nodes formatted */}
              <div className="mt-6 prose prose-slate max-w-none">
                {renderFormattedContent(readingPost.content)}
              </div>

            </div>

            {/* Read Footer */}
            <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-end">
              <button
                onClick={() => setReadingPost(null)}
                className="rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2 transition"
              >
                Đã Đọc Xong
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
