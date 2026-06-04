import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { DocumentItem, Feedback } from '../types';
import { 
  Search, Filter, Star, Eye, Download, Lock, Check, Sparkles, 
  ChevronRight, ArrowLeft, Loader2, CreditCard, Send, X, ShieldCheck 
} from 'lucide-react';

interface DocumentLibraryProps {
  initialSearchQuery: string;
}

export default function DocumentLibrary({ initialSearchQuery }: DocumentLibraryProps) {
  const { 
    documents, 
    paymentConfig, 
    createTransaction, 
    updateTransactionStatus,
    addFeedbackToDoc 
  } = useApp();

  const [search, setSearch] = useState(initialSearchQuery);
  const [filterType, setFilterType] = useState<'all' | 'free' | 'paid'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Detail item viewing state for feedback list & rating form
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);
  
  // Feedback writing states
  const [fbAuthor, setFbAuthor] = useState('');
  const [fbRating, setFbRating] = useState(5);
  const [fbComment, setFbComment] = useState('');
  const [fbSuccess, setFbSuccess] = useState(false);

  // Checkout states
  const [checkoutDoc, setCheckoutDoc] = useState<DocumentItem | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'info' | 'qr' | 'success'>('info');
  const [activeQrMemo, setActiveQrMemo] = useState('');
  const [activeTxId, setActiveTxId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Keep search inputs updated when query comes from hero banner
  useEffect(() => {
    setSearch(initialSearchQuery);
  }, [initialSearchQuery]);

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(documents.map(d => d.category)))];

  // Filtering logic
  const filteredDocs = documents.filter(doc => {
    const matchSearch = doc.title.toLowerCase().includes(search.toLowerCase()) || 
                        doc.description.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' ? true : 
                      filterType === 'free' ? doc.price === 0 : doc.price > 0;
    const matchCategory = selectedCategory === 'all' ? true : doc.category === selectedCategory;
    const matchYear = selectedYear === 'all' ? true : doc.year === Number(selectedYear);
    return matchSearch && matchType && matchCategory && matchYear;
  });

  // Start checkout sequence
  const handlePurchaseInit = (doc: DocumentItem) => {
    setCheckoutDoc(doc);
    setCustomerName('');
    setCustomerEmail('');
    setCheckoutStep('info');
  };

  // Generate QR flow
  const handleGenerateQR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutDoc) return;

    // Unique reference: template + unix timestamp suffix (5 chars)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const contentMemo = `${paymentConfig.qrMemoTemplate}${checkoutDoc.id.replace('doc-', '')}_${randomSuffix}`;
    const txId = `tx-${Date.now()}`;

    // Create the transaction node under 'pending' in global state
    createTransaction({
      docId: checkoutDoc.id,
      docTitle: checkoutDoc.title,
      price: checkoutDoc.price,
      customerName,
      customerEmail,
      qrContent: contentMemo
    });

    setActiveQrMemo(contentMemo);
    setActiveTxId(txId);
    setCheckoutStep('qr');
  };

  const triggerSuccess = () => {
    setIsVerifying(true);
    setTimeout(() => {
      // update payment node status
      updateTransactionStatus(activeTxId, 'success');
      setCheckoutStep('success');
      setIsVerifying(false);
    }, 1500);
  };

  // Submit product feedback
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingDoc || !fbAuthor || !fbComment) return;

    addFeedbackToDoc(viewingDoc.id, {
      author: fbAuthor,
      rating: fbRating,
      comment: fbComment
    });

    setFbComment('');
    setFbAuthor('');
    setFbRating(5);
    setFbSuccess(true);
    setTimeout(() => setFbSuccess(false), 3000);

    // Refresh state modal view
    const freshlyUpdated = documents.find(d => d.id === viewingDoc.id);
    if (freshlyUpdated) {
      setViewingDoc(freshlyUpdated);
    }
  };

  // VietQR format mapper
  const getVietQRUrl = () => {
    if (!checkoutDoc) return '';
    
    // Example format: https://img.vietqr.io/image/<bankName>-<accountNumber>-compact.png?amount=<price>&addInfo=<content>&accountName=<holder>
    // Safe URL Encode parameters
    // Handle typical bank abbreviation codes
    const bankMap: { [key: string]: string } = {
      "vietcombank": "vietcombank",
      "mb bank": "mbbank",
      "techcombank": "techcombank",
      "vietinbank": "vietinbank",
      "agribank": "agribank",
      "acb": "acb",
      "vpbank": "vpbank",
      "bidv": "bidv"
    };

    let matchedBank = "mbbank"; // default fallback
    const bankLower = paymentConfig.bankName.toLowerCase();
    for (const key of Object.keys(bankMap)) {
      if (bankLower.includes(key)) {
        matchedBank = bankMap[key];
        break;
      }
    }

    const encodedHolder = encodeURIComponent(paymentConfig.accountHolder);
    const encodedMemo = encodeURIComponent(activeQrMemo);
    return `https://img.vietqr.io/image/${matchedBank}-${paymentConfig.accountNumber}-qr_only.png?amount=${checkoutDoc.price}&addInfo=${encodedMemo}&accountName=${encodedHolder}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Search Header and Quick Filters */}
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
            Kho Tài Liệu Học Tập
          </h2>
          <p className="mt-1 text-slate-500 font-medium text-sm">
            Tất cả tài liệu được tuyển chọn kỹ lưỡng từ các đề án, giáo trình xuất sắc.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Filter: Free/Paid */}
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5">
            <button
               onClick={() => setFilterType('all')}
               className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
                 filterType === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
               }`}
            >
              Tất Cả
            </button>
            <button
               onClick={() => setFilterType('free')}
               className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
                 filterType === 'free' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
               }`}
            >
              Miễn Phí
            </button>
            <button
               onClick={() => setFilterType('paid')}
               className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
                 filterType === 'paid' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
               }`}
            >
              Trả Phí
            </button>
          </div>
        </div>
      </div>

      {/* Advanced search parameters */}
      <div className="mb-10 grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow-xs border border-gray-200">
        <div className="relative md:col-span-2">
          <Search className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, tác giả hoặc mô tả..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Category dropdown */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none bg-white"
          >
            <option value="all">Chuyên Ngành (Tất cả)</option>
            {categories.filter(c => c !== 'all').map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Year level filter */}
        <div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none bg-white"
          >
            <option value="all">Năm học (Tất cả)</option>
            <option value="1">Sinh viên Năm nhất</option>
            <option value="2">Sinh viên Năm hai</option>
            <option value="3">Sinh viên Năm ba</option>
            <option value="4">Sinh viên Năm cuối / Khác</option>
          </select>
        </div>
      </div>

      {/* Grid listing */}
      {filteredDocs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-4">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-gray-850">Không tìm thấy tài liệu phù hợp</h3>
          <p className="mt-1 text-gray-500 text-sm max-w-md mx-auto">
            Hệ thống chưa tìm thấy tài liệu tương ứng với bộ lọc hoặc từ khóa của bạn. Vui lòng đổi tiêu chí tìm kiếm hoặc yêu cầu tài liệu thêm với Admin!
          </p>
          <button 
            onClick={() => { setSearch(''); setSelectedCategory('all'); setSelectedYear('all'); }}
            className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Đặt lại Bộ Lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div 
              key={doc.id} 
              id={`doc-card-${doc.id}`}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-250 border-gray-200 bg-white shadow-sm transition hover:border-indigo-200 hover:shadow-md"
            >
              {/* Product Header */}
              <div className="p-6">
                <div className="flex items-center justify-between gap-1 mb-4">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                    {doc.category}
                  </span>
                  
                  {doc.year && (
                    <span className="text-[11px] font-semibold text-gray-500">
                      Năm học {doc.year}
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-gray-900 group-hover:text-indigo-600 transition line-clamp-2 leading-snug">
                  {doc.title}
                </h3>
                
                <p className="mt-2.5 text-sm leading-relaxed text-gray-650 line-clamp-3">
                  {doc.description}
                </p>

                {/* Rating component */}
                <button
                  onClick={() => setViewingDoc(doc)}
                  className="mt-4 flex items-center gap-1.5 transition text-gray-500 hover:text-indigo-600"
                  title="Nhấp để xem feedback chi tiết"
                >
                  <div className="flex gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.round(doc.rating) ? 'fill-current' : 'text-gray-200'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-700">{doc.rating}</span>
                  <span className="text-xs text-gray-400">({doc.feedbackList.length} feedback)</span>
                </button>
              </div>

              {/* Product Price and Action Footer */}
              <div className="border-t border-gray-100 bg-gray-50/50 p-6 flex items-center justify-between gap-4">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Mức giá</span>
                  <span className="text-lg font-mono font-bold text-gray-900">
                    {doc.price === 0 ? (
                      <span className="text-indigo-600 font-extrabold uppercase text-base font-display">MIỄN PHÍ</span>
                    ) : (
                      `${doc.price.toLocaleString('vi-VN')} đ`
                    )}
                  </span>
                </div>

                {doc.price === 0 ? (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-full bg-gray-900 hover:bg-black text-white px-5 py-2.5 text-xs font-bold transition shadow-sm"
                  >
                    <Download className="h-4 w-4" />
                    <span>Tải Miễn Phí</span>
                  </a>
                ) : (
                  <button
                    onClick={() => handlePurchaseInit(doc)}
                    className="flex items-center gap-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-xs font-bold transition shadow-sm hover:shadow-indigo-600/10"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    <span>Mua Tài Liệu</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FEEDBACK & REVIEWS POPUP DIALOG */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-850 line-clamp-1">{viewingDoc.title}</h3>
                <p className="text-xs text-slate-500 font-semibold">Khách hàng nhận xét bài giảng</p>
              </div>
              <button 
                onClick={() => setViewingDoc(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable feed */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {viewingDoc.feedbackList.length === 0 ? (
                <div className="rounded-xl bg-slate-50 p-8 text-center text-slate-500">
                  <Star className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium">Chưa có đánh giá nào cho tài liệu này.</p>
                  <p className="text-xs text-slate-400 mt-1">Hãy là người đầu tiên để lại ý kiến đóng góp cứu trợ học tập!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {viewingDoc.feedbackList.map((fb) => (
                    <div key={fb.id} className="rounded-xl border border-slate-100 bg-slate-50/30 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-slate-800">{fb.author}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{fb.date}</span>
                      </div>
                      
                      <div className="flex gap-0.5 text-amber-400 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < fb.rating ? 'fill-current' : 'text-slate-200'}`} 
                          />
                        ))}
                      </div>

                      <p className="text-sm leading-relaxed text-slate-600 italic">
                        &ldquo;{fb.comment}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Feedback Input Fields */}
              <div className="border-t border-slate-100 pt-6">
                <h4 className="font-display font-bold text-sm text-slate-800 mb-4">Gửi đánh giá của bạn</h4>
                
                {fbSuccess && (
                  <div className="mb-4 rounded-lg bg-emerald-50 p-3.5 text-xs text-emerald-800 font-bold flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <span>Cảm ơn phản hồi đóng góp quý giá của bạn!</span>
                  </div>
                )}

                <form onSubmit={handleCommentSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Tên của bạn hoặc Trường học</label>
                      <input
                        type="text"
                        required
                        placeholder="Vd: Hoàng Linh (Kinh tế)"
                        value={fbAuthor}
                        onChange={(e) => setFbAuthor(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Đánh giá sao</label>
                      <select
                        value={fbRating}
                        onChange={(e) => setFbRating(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ 5 Sao - Tài liệu cực nét</option>
                        <option value="4">⭐⭐⭐⭐ 4 Sao - Đầy đủ kiến thức</option>
                        <option value="3">⭐⭐⭐ 3 Sao - Tạm chấp nhận</option>
                        <option value="2">⭐⭐ 2 Sao - Nội dung sơ sài</option>
                        <option value="1">⭐ 1 Sao - Thiếu công thức</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Nhận xét chi tiết</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Chia sẻ trải nghiệm ôn tập vượt vũ môn của bạn nhờ slide tài liệu này..."
                      value={fbComment}
                      onChange={(e) => setFbComment(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-lg bg-slate-850 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-950 transition"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Gửi Feedback</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* AUTOMATED TRANSACTION CHECKOUT MODAL FLOW */}
      {checkoutDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
            
            {/* Modal Header */}
            <div className="border-b border-gray-150 bg-gray-50 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600">
                <CreditCard className="h-5 w-5" />
                <span className="font-display font-bold text-[15px] text-gray-800">Thanh toán tài liệu</span>
              </div>
              <button 
                onClick={() => setCheckoutDoc(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sequence 1: Input Consumer Information (Captured for admin data emailing) */}
            {checkoutStep === 'info' && (
              <form onSubmit={handleGenerateQR} className="p-6 space-y-4">
                <div className="rounded-xl bg-indigo-50/50 border border-indigo-100 p-4">
                  <span className="block text-[11px] font-bold text-indigo-800 uppercase tracking-wider mb-1">Tài liệu đặt mua:</span>
                  <p className="font-display font-extrabold text-sm text-gray-800">{checkoutDoc.title}</p>
                  <p className="text-xs text-gray-500 mt-1 font-semibold">Tài liệu chất lượng cao, định dạng PDF tải về lập tức.</p>
                  
                  <div className="mt-3 flex items-center justify-between text-xs border-t border-indigo-100/60 pt-2.5">
                    <span className="text-gray-600 font-medium">Giá bán:</span>
                    <span className="font-mono font-bold text-indigo-700 text-sm">{checkoutDoc.price.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Họ và Tên sinh viên</label>
                    <input
                      type="text"
                      required
                      placeholder="Vd: Nguyễn Văn A"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Địa chỉ Email nhận quà ưu đãi</label>
                    <input
                      type="email"
                      required
                      placeholder="Vd: nguyenva@gmai.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3.5 py-2 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-gray-450 mt-1 leading-relaxed">
                      * Hệ thống lưu trữ email này để admin gửi tặng các mã ưu đãi và cập nhật tài liệu mới hoàn toàn miễn phí định kỳ.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 py-3 text-sm font-bold text-white transition shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Chuyển khoản nhận QR VietQR</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {/* Sequence 2: Display VietQR and check transaction auto-simulation */}
            {checkoutStep === 'qr' && (
              <div className="p-6 text-center space-y-4 animate-fade-in">
                {/* QR Section */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 max-w-[245px] mx-auto shadow-xs">
                  <img
                    src={paymentConfig.useCustomQr && paymentConfig.customQrImage ? paymentConfig.customQrImage : getVietQRUrl()}
                    alt="Mã QR Thanh Toán"
                    className="w-full aspect-square object-contain mx-auto rounded-lg transition duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      console.log('QR loading error');
                    }}
                  />
                  <span className="block text-[10px] font-bold text-indigo-600 tracking-wider uppercase mt-2.5 font-sans">
                    Quét mã để tải tài liệu tự động
                  </span>
                </div>

                {/* Info Section - ONLY Displays Order Information */}
                <div className="space-y-2 bg-gray-50/50 p-4 rounded-xl border border-gray-200 text-left text-xs font-sans">
                  <div className="border-b border-gray-150 pb-2 mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Thông tin đơn hàng</span>
                  </div>
                  <div className="flex flex-col gap-1.5 animate-fade-in">
                    <div>
                      <span className="text-gray-450 font-semibold block mb-0.5 text-[10px] uppercase">Tài liệu đặt mua:</span>
                      <span className="font-semibold text-gray-800 line-clamp-2 text-xs leading-relaxed">{checkoutDoc.title}</span>
                    </div>
                    <div className="flex justify-between py-1 border-t border-gray-100/50 pt-1.5 mt-1">
                      <span className="text-gray-455 font-semibold text-[10px] uppercase">Số tiền thanh toán:</span>
                      <span className="font-mono font-extrabold text-indigo-700 text-sm">{checkoutDoc.price.toLocaleString('vi-VN')} đ</span>
                    </div>
                    <div className="flex justify-between py-1 border-t border-gray-100/50 pt-1.5 mt-1">
                      <span className="text-gray-455 font-semibold text-[10px] uppercase">Nội dung chuyển khoản (Memo):</span>
                      <span className="font-mono font-extrabold bg-amber-50 text-amber-800 px-1.5 py-0.5 border border-dashed border-amber-300 rounded text-xs select-all">{activeQrMemo}</span>
                    </div>
                  </div>
                </div>

                {/* Visual indicators and manual verification */}
                <div className="rounded-xl bg-indigo-50/45 p-4 border border-indigo-100 flex flex-col items-center justify-center gap-3">
                  {isVerifying ? (
                    <div className="flex items-center gap-2 text-xs text-indigo-800 font-bold font-sans py-2">
                      <Loader2 className="h-4.5 w-4.5 animate-spin text-indigo-600" />
                      <span>Hệ thống đang đối soát và duyệt giao dịch...</span>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-600 font-medium font-sans text-center leading-relaxed">
                      Để nhận tài liệu qua email, vui lòng bấm nút xác nhận dưới đây sau khi đã chuyển khoản thành công.
                    </div>
                  )}

                  {!isVerifying && (
                    <div className="flex flex-col gap-2 w-full mt-1 font-sans">
                      <button
                        onClick={triggerSuccess}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2.5 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        <span>Tôi đã chuyển khoản xong</span>
                      </button>
                      <button
                        onClick={() => setCheckoutStep('info')}
                        className="text-gray-400 hover:text-gray-650 text-[11px] font-semibold cursor-pointer py-1"
                      >
                        Quay lại chỉnh sửa thông tin đơn hàng
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sequence 3: Success payment. Inform Document will be sent via Email */}
            {checkoutStep === 'success' && (
              <div className="p-6 text-center space-y-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                  <Send className="h-6 w-6 text-indigo-600" />
                </div>

                <div className="space-y-3 font-sans">
                  <h3 className="font-display text-lg font-bold text-gray-900 leading-tight">Yêu cầu đã được xác nhận</h3>
                  
                  <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 max-w-sm mx-auto text-center space-y-2.5">
                    <p className="text-xs font-extrabold text-indigo-800 tracking-wider uppercase">
                      TÀI LIỆU SẼ SỚM GỬI ĐẾN BẠN QUA EMAIL
                    </p>
                    {customerEmail && (
                      <p className="text-xs text-indigo-700 font-bold bg-white/90 py-1.5 px-3 rounded-lg border border-indigo-50 inline-block font-mono max-w-full truncate">
                        {customerEmail}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 font-semibold px-4 leading-relaxed">
                    Đội ngũ quản trị viên SinhVienHub đang đối soát tài khoản giao dịch với nội dung bản tin <span className="font-bold text-indigo-700">{activeQrMemo}</span> và sẽ gửi file mềm trực tiếp tới hòm thư của bạn sớm nhất có thể.
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-150 text-left">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Tài liệu đã đăng ký:</span>
                  <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-relaxed">{checkoutDoc.title}</p>
                </div>

                <div className="pt-2 font-sans">
                  <button
                    onClick={() => setCheckoutDoc(null)}
                    className="w-full rounded-xl bg-gray-900 hover:bg-black text-white py-3 text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    Hoàn tất & Đóng
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
