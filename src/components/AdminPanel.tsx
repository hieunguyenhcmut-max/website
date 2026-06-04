import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { 
  DocumentItem, SharePost, AffiliateProduct, Transaction 
} from '../types';
import { 
  Settings, CreditCard, FileText, Share2, ShoppingBag, 
  History, Users, Plus, Edit2, Trash2, Check, RefreshCw, MailOpen, X,
  Lock, Upload, Image
} from 'lucide-react';

export default function AdminPanel() {
  const {
    systemConfig,
    updateSystemConfig,
    paymentConfig,
    updatePaymentConfig,
    documents,
    addDocument,
    updateDocument,
    deleteDocument,
    sharePosts,
    addSharePost,
    updateSharePost,
    deleteSharePost,
    affiliateProducts,
    addAffiliateProduct,
    updateAffiliateProduct,
    deleteAffiliateProduct,
    transactions,
    updateTransactionStatus,
    customers,
    adminPassword,
    updateAdminPassword
  } = useApp();

  const [activeMenu, setActiveMenu] = useState<'config' | 'docs' | 'shares' | 'products' | 'transactions' | 'customers'>('config');

  // --- LOCAL FORM STATES ---

  // 1. General Config
  const [siteName, setSiteName] = useState(systemConfig.siteName);
  const [heroTitle, setHeroTitle] = useState(systemConfig.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(systemConfig.heroSubtitle);
  const [zaloLink, setZaloLink] = useState(systemConfig.zaloLink);
  const [facebookLink, setFacebookLink] = useState(systemConfig.facebookLink);
  const [contactEmail, setContactEmail] = useState(systemConfig.contactEmail);
  const [contactPhone, setContactPhone] = useState(systemConfig.contactPhone);
  const [footerText, setFooterText] = useState(systemConfig.footerText || '');
  const [configSuccess, setConfigSuccess] = useState(false);

  // 2. Payment Config
  const [bankName, setBankName] = useState(paymentConfig.bankName);
  const [accountNumber, setAccountNumber] = useState(paymentConfig.accountNumber);
  const [accountHolder, setAccountHolder] = useState(paymentConfig.accountHolder);
  const [qrMemoTemplate, setQrMemoTemplate] = useState(paymentConfig.qrMemoTemplate);
  const [useCustomQr, setUseCustomQr] = useState(paymentConfig.useCustomQr || false);
  const [customQrImage, setCustomQrImage] = useState(paymentConfig.customQrImage || '');
  const [paySuccess, setPaySuccess] = useState(false);

  // 2.1 Password change Form state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // 3. Document CRUD
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [docTitle, setDocTitle] = useState('');
  const [docDesc, setDocDesc] = useState('');
  const [docPrice, setDocPrice] = useState(0);
  const [docFileUrl, setDocFileUrl] = useState('');
  const [docYear, setDocYear] = useState(1);
  const [docCategory, setDocCategory] = useState('');

  // 4. Share CRUD
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [editingShareId, setEditingShareId] = useState<string | null>(null);
  const [shareTitle, setShareTitle] = useState('');
  const [shareAuthor, setShareAuthor] = useState('');
  const [shareContent, setShareContent] = useState('');
  const [shareCategory, setShareCategory] = useState('');
  const [shareReadTime, setShareReadTime] = useState('5 phút đọc');

  // 5. Affiliate Product CRUD
  const [isProdModalOpen, setIsProdModalOpen] = useState(false);
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [prodTitle, setProdTitle] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodImg, setProdImg] = useState('');
  const [prodAffLink, setProdAffLink] = useState('');

  // 6. Marketing / Email blast mock state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [blastSuccess, setBlastSuccess] = useState(false);

  // --- SAVE ACTIONS ---

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemConfig({
      siteName,
      heroTitle,
      heroSubtitle,
      zaloLink,
      facebookLink,
      contactEmail,
      contactPhone,
      footerText
    });
    setConfigSuccess(true);
    setTimeout(() => setConfigSuccess(false), 3000);
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomQrImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentConfig({
      bankName,
      accountNumber,
      accountHolder,
      qrMemoTemplate,
      useCustomQr,
      customQrImage
    });
    setPaySuccess(true);
    setTimeout(() => setPaySuccess(false), 3000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!newPassword) {
      setPasswordError('Vui lòng nhập mật khẩu mới.');
      return;
    }
    if (newPassword.length < 3) {
      setPasswordError('Mật khẩu mới phải từ 3 ký tự trở lên.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu nhập lại không trùng khớp.');
      return;
    }

    updateAdminPassword(newPassword);
    setPasswordSuccess(true);
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 5000);
  };

  // Document modal CRUD trigger
  const openDocAdd = () => {
    setEditingDocId(null);
    setDocTitle('');
    setDocDesc('');
    setDocPrice(0);
    setDocFileUrl('');
    setDocYear(1);
    setDocCategory('Đại cương');
    setIsDocModalOpen(true);
  };

  const openDocEdit = (doc: DocumentItem) => {
    setEditingDocId(doc.id);
    setDocTitle(doc.title);
    setDocDesc(doc.description);
    setDocPrice(doc.price);
    setDocFileUrl(doc.fileUrl);
    setDocYear(doc.year);
    setDocCategory(doc.category);
    setIsDocModalOpen(true);
  };

  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const docPayload = {
      title: docTitle,
      description: docDesc,
      price: Number(docPrice),
      fileUrl: docFileUrl,
      year: Number(docYear),
      category: docCategory || 'Đại cương'
    };

    if (editingDocId) {
      updateDocument(editingDocId, docPayload);
    } else {
      addDocument(docPayload);
    }
    setIsDocModalOpen(false);
  };

  // Share blogs CRUD trigger
  const openShareAdd = () => {
    setEditingShareId(null);
    setShareTitle('');
    setShareAuthor('Admin SinhVienHub');
    setShareContent('');
    setShareCategory('Kinh nghiệm học tập');
    setShareReadTime('5 phút đọc');
    setIsShareModalOpen(true);
  };

  const openShareEdit = (post: SharePost) => {
    setEditingShareId(post.id);
    setShareTitle(post.title);
    setShareAuthor(post.author);
    setShareContent(post.content);
    setShareCategory(post.category);
    setShareReadTime(post.readTime);
    setIsShareModalOpen(true);
  };

  const handleSaveShare = (e: React.FormEvent) => {
    e.preventDefault();
    const sharePayload = {
      title: shareTitle,
      author: shareAuthor,
      content: shareContent,
      category: shareCategory,
      readTime: shareReadTime
    };

    if (editingShareId) {
      updateSharePost(editingShareId, sharePayload);
    } else {
      addSharePost(sharePayload);
    }
    setIsShareModalOpen(false);
  };

  // Affiliate CRUD trigger
  const openProdAdd = () => {
    setEditingProdId(null);
    setProdTitle('');
    setProdDesc('');
    setProdPrice(0);
    setProdImg('https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400');
    setProdAffLink('');
    setIsProdModalOpen(true);
  };

  const openProdEdit = (p: AffiliateProduct) => {
    setEditingProdId(p.id);
    setProdTitle(p.title);
    setProdDesc(p.description);
    setProdPrice(p.price);
    setProdImg(p.imageUrl);
    setProdAffLink(p.affiliateLink);
    setIsProdModalOpen(true);
  };

  const handleSaveAffProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const prodPayload = {
      title: prodTitle,
      description: prodDesc,
      price: Number(prodPrice),
      imageUrl: prodImg,
      affiliateLink: prodAffLink,
      rating: 4.8
    };

    if (editingProdId) {
      updateAffiliateProduct(editingProdId, prodPayload);
    } else {
      addAffiliateProduct(prodPayload);
    }
    setIsProdModalOpen(false);
  };

  const handleSendEmailBlast = (e: React.FormEvent) => {
    e.preventDefault();
    setBlastSuccess(true);
    setTimeout(() => {
      setBlastSuccess(false);
      setIsEmailModalOpen(false);
      setEmailSubject('');
      setEmailBody('');
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Container header */}
      <div className="mb-8 border-b border-indigo-100 bg-indigo-50/55 p-6 rounded-2xl flex items-center justify-between shadow-sm animate-fade-in">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-indigo-900">Cổng Quản Trị Hệ Thống SinhVienHub</h2>
          <p className="text-xs text-indigo-700 font-semibold mt-1">
            Chào mừng Admin! Đây là trang thay đổi toàn bộ cấu hình, dán link Zalo, cập nhật tài liệu học, sách bán và sản phẩm affiliate.
          </p>
        </div>
        <div className="rounded-full bg-indigo-100 text-indigo-700 px-3 py-1 text-xs font-bold uppercase tracking-wider">
          Live Sync active
        </div>
      </div>

      {/* Admin Body - Sidebar / Tabs navigation split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side menu navigation */}
        <div className="space-y-1 bg-white rounded-xl border border-gray-200 p-3 self-start shadow-sm">
          <button
            onClick={() => setActiveMenu('config')}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
              activeMenu === 'config' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Settings className="h-4.5 w-4.5" />
            <span>Cấu hình & Zalo Link</span>
          </button>
          
          <button
            onClick={() => setActiveMenu('docs')}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
              activeMenu === 'docs' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="h-4.5 w-4.5" />
            <span>Quản lý Tài liệu</span>
          </button>

          <button
            onClick={() => setActiveMenu('shares')}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
              activeMenu === 'shares' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Share2 className="h-4.5 w-4.5" />
            <span>Quản lý Bài viết chia sẻ</span>
          </button>

          <button
            onClick={() => setActiveMenu('products')}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
              activeMenu === 'products' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            <span>Quản lý Sản phẩm</span>
          </button>

          <button
            onClick={() => setActiveMenu('transactions')}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
              activeMenu === 'transactions' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <History className="h-4.5 w-4.5" />
            <span className="flex-grow text-left">Lịch sử giao dịch QR</span>
            <span className="rounded bg-gray-100 text-gray-700 px-1.5 py-0.5 text-xs font-bold font-mono">
              {transactions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveMenu('customers')}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
              activeMenu === 'customers' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="h-4.5 w-4.5" />
            <span className="flex-grow text-left">Thông tin Khách hàng</span>
            <span className="rounded bg-sky-150 bg-sky-100 text-sky-700 px-1.5 py-0.5 text-xs font-bold font-mono">
              {customers.length}
            </span>
          </button>
        </div>


        {/* Right Content Panels */}
        <div className="lg:col-span-3">

          {/* TAB 1: GENERAL & PAYMENT CONFIGS */}
          {activeMenu === 'config' && (
            <div className="space-y-8">
              {/* Cấu hình chung */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="font-display font-extrabold text-lg text-gray-800 mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-indigo-600" />
                  <span>Thay đổi cấu hình Website & dán link Zalo</span>
                </h3>

                {configSuccess && (
                  <div className="mb-4 rounded-lg bg-indigo-50 p-3.5 text-xs text-indigo-800 font-bold flex items-center gap-2 font-sans">
                    <Check className="h-4.5 w-4.5" />
                    <span>Lưu thông tin thành công! Màn hình người dùng đã được đồng bộ.</span>
                  </div>
                )}

                <form onSubmit={handleSaveConfig} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Tên Trang Web</label>
                      <input
                        type="text"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-850 focus:border-indigo-500 focus:outline-none font-bold font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">ĐƯỜNG DẪN NHÓM ZALO CỘNG ĐỒNG</label>
                      <input
                        type="url"
                        value={zaloLink}
                        onChange={(e) => setZaloLink(e.target.value)}
                        className="w-full rounded-lg border border-indigo-200 bg-indigo-50/25 px-3.5 py-2.5 text-sm text-indigo-900 focus:border-indigo-500 focus:outline-none font-mono font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Tiêu đề Banner Chính (Hero Banner)</label>
                    <input
                      type="text"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-850 focus:border-indigo-500 focus:outline-none font-extrabold font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Lời phát biểu phụ (Hero Subtitle)</label>
                    <textarea
                      rows={3}
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-850 focus:border-indigo-500 focus:outline-none font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Thư điện tử Admin</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-850 focus:border-indigo-500 focus:outline-none font-medium font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Hotline Admin</label>
                      <input
                        type="text"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-850 focus:border-indigo-500 focus:outline-none font-mono font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Nội dung chân trang Landing page (Footer text)</label>
                    <textarea
                      rows={2}
                      value={footerText}
                      onChange={(e) => setFooterText(e.target.value)}
                      placeholder="Nhập nội dung chân trang bằng chữ thường hoặc mã HTML..."
                      className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-850 focus:border-indigo-500 focus:outline-none font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs font-bold text-white transition shadow-sm font-sans cursor-pointer"
                  >
                    Lưu Thay đổi Tổng Thể
                  </button>
                </form>
              </div>

              {/* Tài khoản nhận tiền thanh toán tự động */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="font-display font-extrabold text-lg text-gray-800 mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-indigo-600" />
                  <span>Thay đổi cấu hình tài khoản nhận thanh toán VietQR</span>
                </h3>

                {paySuccess && (
                  <div className="mb-4 rounded-lg bg-indigo-50 p-3.5 text-xs text-indigo-800 font-bold flex items-center gap-2 font-sans">
                    <Check className="h-4.5 w-4.5" />
                    <span>Lưu tài khoản ngân hàng thành công! Hoạt động VietQR đã tự động đồng bộ.</span>
                  </div>
                )}

                <form onSubmit={handleSavePayment} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Tên Ngân hàng (MB Bank, Techcombank,...)</label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 text-indigo-600 font-sans">SỐ TÀI KHOẢN nhận tiền</label>
                      <input
                        type="text"
                        required
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full rounded-lg border border-indigo-400 bg-indigo-50/10 px-3.5 py-2.5 text-sm text-gray-900 focus:ring-indigo-500 focus:outline-none font-mono font-extrabold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">CHỦ TÀI KHOẢN (Chữ in hoa viết liền không dấu)</label>
                      <input
                        type="text"
                        required
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-850 focus:border-indigo-500 focus:outline-none uppercase font-bold font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1 font-sans">Tiêu ngữ chuyển khoản (QR Memo template)</label>
                      <input
                        type="text"
                        value={qrMemoTemplate}
                        onChange={(e) => setQrMemoTemplate(e.target.value)}
                        className="w-full rounded-lg border border-gray-250 border-gray-200 px-3.5 py-2.5 text-sm text-gray-850 focus:border-indigo-500 focus:outline-none font-mono uppercase font-bold"
                      />
                    </div>
                  </div>

                  {/* CUSTOM QR CODE UPLOAD SECTION */}
                  <div className="border-t border-gray-150 pt-4 mt-4 space-y-4">
                    <div className="flex items-start gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="useCustomQr"
                        checked={useCustomQr}
                        onChange={(e) => setUseCustomQr(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <label htmlFor="useCustomQr" className="text-xs font-bold text-gray-700 select-none cursor-pointer font-sans uppercase tracking-wider block">
                        Sử dụng hình ảnh Mã QR cá nhân tự tải lên (Thay vì tạo mã VietQR tự động)
                      </label>
                    </div>

                    {useCustomQr && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/55 p-4 rounded-xl border border-gray-150 animate-fade-in">
                        <div className="md:col-span-2 space-y-2">
                          <label className="block text-xs font-bold text-gray-500 font-sans uppercase">Tải lên hình ảnh Mã QR của bạn</label>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-white hover:bg-indigo-50 px-4 py-2.5 text-xs font-bold text-indigo-700 transition cursor-pointer shadow-sm">
                              <Upload className="h-4 w-4" />
                              <span>Chọn tệp ảnh QR...</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleQrUpload}
                                className="hidden"
                              />
                            </label>
                            {customQrImage ? (
                              <button
                                type="button"
                                onClick={() => setCustomQrImage('')}
                                className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer"
                              >
                                Xóa ảnh đã tải
                              </button>
                            ) : (
                              <span className="text-xs text-gray-450">Chấp nhận JPG, PNG (tối đa 2MB)</span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-400 font-medium font-sans leading-relaxed mt-1">
                            Mẹo: Chụp màn hình mã QR chuyển khoản từ ứng dụng ngân hàng của bạn (có kèm số tài khoản & ngân hàng, hoặc QR chuyển khoản nhanh MoMo/ZaloPay) rồi tải lên đây. Hệ thống sẽ hiển thị trực tiếp QR này khi người dùng mua tài liệu.
                          </p>
                        </div>
                        <div className="flex flex-col items-center justify-center border-l md:border-l-0 border-t md:border-t-0 md:pl-4 pt-4 md:pt-0 border-gray-150/50">
                          {customQrImage ? (
                            <div className="text-center space-y-1">
                              <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">Ảnh QR đã nhận</span>
                              <img
                                src={customQrImage}
                                alt="Xem trước bản QR"
                                className="h-28 w-28 object-contain rounded-lg border border-gray-200 bg-white p-1 mx-auto shadow-xs"
                              />
                            </div>
                          ) : (
                            <div className="h-28 w-28 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 bg-white">
                              <Image className="h-6 w-6 stroke-1 mb-1 text-gray-300 animate-pulse" />
                              <span className="text-[10px] font-semibold text-center leading-tight">Chưa có ảnh<br/>QR cá nhân</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs font-bold text-white transition shadow-sm font-sans cursor-pointer"
                  >
                    Lưu Tài Khoản Nhận Tiền
                  </button>
                </form>
              </div>

              {/* ADMIN PASSWORD MODIFICATION CARD */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="font-display font-extrabold text-lg text-gray-800 mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-indigo-600" />
                  <span>Cài đặt hệ thống bảo mật - Thay đổi mật khẩu Admin</span>
                </h3>

                {passwordSuccess && (
                  <div className="mb-4 rounded-lg bg-green-50 p-3.5 text-xs text-green-800 font-bold flex items-center gap-2 font-sans">
                    <Check className="h-4.5 w-4.5 text-green-600" />
                    <span>Đổi mật khẩu thành công! Xác thực phiên đăng nhập mới đã được áp dụng.</span>
                  </div>
                )}

                {passwordError && (
                  <div className="mb-4 rounded-lg bg-red-50 p-3.5 text-xs text-red-800 font-bold flex items-center gap-2 font-sans">
                    <X className="h-4.5 w-4.5 text-red-500" />
                    <span>Lỗi: {passwordError}</span>
                  </div>
                )}

                <form onSubmit={handleSavePassword} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Mật khẩu quản trị mới</label>
                      <input
                        type="password"
                        required
                        placeholder="Có tối thiểu 3 ký tự trở lên..."
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-850 focus:border-indigo-500 focus:outline-none font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Xác nhận mật khẩu mới chính xác</label>
                      <input
                        type="password"
                        required
                        placeholder="Nhập lại mật khẩu quản trị..."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-850 focus:border-indigo-500 focus:outline-none font-sans"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs font-bold text-white transition shadow-sm font-sans cursor-pointer"
                  >
                    Cập Nhật Mật Khẩu Admin
                  </button>
                </form>
              </div>
            </div>
          )}


          {/* TAB 2: DOCUMENTS CRUD */}
          {activeMenu === 'docs' && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-gray-900">Kho Tài Liệu Đóng Gói</h3>
                  <p className="text-xs text-gray-500 font-sans">Danh sách tài liệu học tập, bao gồm miễn phí và có phí.</p>
                </div>
                
                <button
                  onClick={openDocAdd}
                  className="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-bold text-white transition flex items-center gap-1.5 shadow-sm cursor-pointer font-sans"
                >
                  <Plus className="h-4 w-4" />
                  <span>Thêm tài liệu mới</span>
                </button>
              </div>

              {/* Document table index */}
              <div className="overflow-x-auto border border-gray-150 rounded-xl">
                <table className="min-w-full divide-y divide-gray-150 text-left text-xs text-gray-600 font-sans">
                  <thead className="bg-gray-50 font-bold text-gray-500 text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Tài liệu</th>
                      <th className="px-5 py-3.5">Chuyên Ngành</th>
                      <th className="px-5 py-3.5">Năm</th>
                      <th className="px-5 py-3.5 text-right">Giá bán</th>
                      <th className="px-5 py-3.5 text-center">Tác vụ</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-gray-150">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50/50">
                        <td className="px-5 py-3.5 font-bold text-gray-900 max-w-xs truncate">
                          {doc.title}
                          <span className="block font-normal text-gray-400 truncate text-[11px] font-mono mt-0.5">{doc.fileUrl}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="rounded bg-indigo-50 px-1.5 py-0.5 font-bold text-indigo-850 uppercase tracking-widest text-[9px]">{doc.category}</span>
                        </td>
                        <td className="px-5 py-3.5 font-bold text-gray-500">Năm {doc.year}</td>
                        <td className="px-5 py-3.5 text-right font-mono font-bold text-gray-900">
                          {doc.price === 0 ? <span className="text-indigo-650 text-indigo-600 uppercase text-[10px] font-bold">Miễn phí</span> : `${doc.price.toLocaleString('vi-VN')}đ`}
                        </td>
                        <td className="px-5 py-3.5 text-center flex items-center justify-center gap-2">
                          <button
                            onClick={() => openDocEdit(doc)}
                            className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 cursor-pointer"
                            title="Sửa tài liệu"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteDocument(doc.id)}
                            className="rounded-md border border-red-200 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                            title="Xóa tài liệu"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* TAB 3: SHARES BLOGS CRUD */}
          {activeMenu === 'shares' && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-gray-900">Kinh Nghiệm Học Tập & Ôn Thi</h3>
                  <p className="text-xs text-gray-500 font-sans">Các bài viết chia sẻ cẩm nang cứu bồ, mẹo thi và săn học bổng.</p>
                </div>
                
                <button
                  onClick={openShareAdd}
                  className="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-bold text-white transition flex items-center gap-1.5 shadow-sm cursor-pointer font-sans"
                >
                  <Plus className="h-4 w-4" />
                  <span>Viết bài mới</span>
                </button>
              </div>

              {/* Shares Table */}
              <div className="overflow-x-auto border border-gray-150 rounded-xl">
                <table className="min-w-full divide-y divide-gray-150 text-left text-xs text-gray-600 font-sans">
                  <thead className="bg-gray-50 font-bold text-gray-500 text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Tiêu đề bài viết</th>
                      <th className="px-5 py-3.5">Tác giả</th>
                      <th className="px-5 py-3.5">Đọc nhanh</th>
                      <th className="px-5 py-3.5">Ngày đăng</th>
                      <th className="px-5 py-3.5 text-center">Tác vụ</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-gray-150">
                    {sharePosts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50/50">
                        <td className="px-5 py-3.5 font-bold text-gray-900 max-w-xs truncate">
                          {post.title}
                          <span className="block font-normal text-gray-400 text-[10px] mt-0.5">{post.category}</span>
                        </td>
                        <td className="px-5 py-3.5 font-medium">{post.author}</td>
                        <td className="px-5 py-3.5 text-gray-500 font-semibold">{post.readTime}</td>
                        <td className="px-5 py-3.5 text-gray-450">{post.date}</td>
                        <td className="px-5 py-3.5 text-center flex items-center justify-center gap-2">
                          <button
                            onClick={() => openShareEdit(post)}
                            className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteSharePost(post.id)}
                            className="rounded-md border border-red-200 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* TAB 4: PRODUCT AFFILIATES CRUD */}
          {activeMenu === 'products' && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-gray-900">Sản Phẩm Affiliate Sinh Viên</h3>
                  <p className="text-xs text-gray-500 font-sans">Các tiện ích học đường gợi ý, kiêm hoa hồng Shopee/Lazada.</p>
                </div>
                
                <button
                  onClick={openProdAdd}
                  className="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-bold text-white transition flex items-center gap-1.5 shadow-sm cursor-pointer font-sans"
                >
                  <Plus className="h-4 w-4" />
                  <span>Đăng sản phẩm mới</span>
                </button>
              </div>

              {/* Affiliate Table */}
              <div className="overflow-x-auto border border-gray-150 rounded-xl">
                <table className="min-w-full divide-y divide-gray-150 text-left text-xs text-gray-600 font-sans">
                  <thead className="bg-gray-50 font-bold text-gray-500 text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Sản phẩm</th>
                      <th className="px-5 py-3.5 text-right">Mức giá tham khảo</th>
                      <th className="px-5 py-3.5">Liên kết tiếp thị (Affiliate)</th>
                      <th className="px-5 py-3.5 text-center">Tác vụ</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-gray-150">
                    {affiliateProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/50">
                        <td className="px-5 py-3.5 font-bold text-gray-900 flex items-center gap-2">
                          <img src={p.imageUrl} className="h-8 w-8 rounded object-cover flex-shrink-0" alt="" />
                          <span className="truncate max-w-[160px]">{p.title}</span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono font-bold text-gray-900">{p.price.toLocaleString('vi-VN')}đ</td>
                        <td className="px-5 py-3.5 font-mono text-gray-400 max-w-[150px] truncate">{p.affiliateLink}</td>
                        <td className="px-5 py-3.5 text-center flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openProdEdit(p)}
                            className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteAffiliateProduct(p.id)}
                            className="rounded-md border border-red-200 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* TAB 5: DETAILED TRANSACTION CHECKOUT LOG */}
          {activeMenu === 'transactions' && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6 animate-fade-in">
              <div>
                <h3 className="font-display font-extrabold text-lg text-gray-900">Lịch Sử Giao Dịch Chuyển Khoản QR</h3>
                <p className="text-xs text-gray-500 mt-0.5 font-sans">Danh sách yêu cầu mua tài liệu có phí qua VietQR. Click hành động để duyệt thành công thủ công.</p>
              </div>

              {transactions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-gray-500 font-sans">
                  <span>Chưa phát sinh giao dịch nào.</span>
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-150 rounded-xl">
                  <table className="min-w-full divide-y divide-gray-150 text-xs text-gray-600 text-left font-sans">
                    <thead className="bg-gray-50 font-bold text-gray-500 text-[9px] uppercase tracking-widest">
                      <tr>
                        <th className="px-4 py-3">Khách hàng / Liên hệ</th>
                        <th className="px-4 py-3">Tài liệu đặt mua</th>
                        <th className="px-4 py-3 text-right">Số tiền</th>
                        <th className="px-4 py-3">Nội dung (Memo)</th>
                        <th className="px-4 py-3 text-center">Trạng thái</th>
                        <th className="px-4 py-3 text-center">Tác vụ mô phỏng</th>
                      </tr>
                    </thead>
                    
                    <tbody className="divide-y divide-gray-150">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3">
                            <span className="block font-bold text-gray-900">{tx.customerName}</span>
                            <span className="block text-[10px] text-gray-400 font-mono">{tx.customerEmail}</span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-700 max-w-xs truncate">{tx.docTitle}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-gray-900">{tx.price.toLocaleString('vi-VN')} đ</td>
                          <td className="px-4 py-3 font-mono font-bold text-amber-800 bg-amber-50/50">{tx.qrContent}</td>
                          <td className="px-4 py-3 text-center">
                            {tx.status === 'success' ? (
                              <span className="inline-flex items-center gap-1 rounded bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold text-indigo-800 uppercase tracking-widest">
                                <Check className="h-3 w-3" /> THÀNH CÔNG
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-800 uppercase tracking-widest">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" /> ĐANG TRẢ MÃ
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {tx.status !== 'success' && (
                              <button
                                onClick={() => updateTransactionStatus(tx.id, 'success')}
                                className="inline-flex items-center gap-1 rounded bg-indigo-650 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-2.5 text-[10px] transition shadow-xs cursor-pointer font-sans"
                              >
                                <RefreshCw className="h-3 w-3" />
                                <span>Kích hoạt tải</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}


          {/* TAB 6: CUSTOMER DATABASE & EMAIL CAMPAIGN SENDER */}
          {activeMenu === 'customers' && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-gray-900">Dữ liệu thông tin Khách Hàng</h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-sans">Danh sách email, tên sinh viên đã mua tài liệu được lưu giữ để chăm sóc định kỳ.</p>
                </div>

                <button
                  onClick={() => setIsEmailModalOpen(true)}
                  disabled={customers.length === 0}
                  className="rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-4 py-2.5 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer font-sans shadow-xs"
                >
                  <MailOpen className="h-4.5 w-4.5" />
                  <span>Xây dựng chiến dịch Email ưu đãi</span>
                </button>
              </div>

              {customers.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-gray-500 font-sans">
                  <span>Chưa có khách mua hàng đăng ký trong tệp.</span>
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-150 rounded-xl">
                  <table className="min-w-full divide-y divide-gray-150 text-xs text-left text-gray-600 font-sans">
                    <thead className="bg-gray-50 font-bold text-gray-500 text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="px-5 py-3">Họ và Tên</th>
                        <th className="px-5 py-3">Thư điện tử (Email)</th>
                        <th className="px-5 py-3">Tài liệu đã sở hữu</th>
                        <th className="px-5 py-3 text-right">Tổng chi tiêu</th>
                        <th className="px-5 py-3">Ngày tham gia</th>
                      </tr>
                    </thead>
                    
                    <tbody className="divide-y divide-gray-150">
                      {customers.map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50/50">
                          <td className="px-5 py-3 font-bold text-gray-900">{c.name}</td>
                          <td className="px-5 py-3 font-semibold font-mono text-gray-700">{c.email}</td>
                          <td className="px-5 py-3 max-w-xs truncate font-medium">{c.purchasedDocs.join(', ')}</td>
                          <td className="px-5 py-3 text-right font-mono font-bold text-indigo-600">{c.totalSpent.toLocaleString('vi-VN')} đ</td>
                          <td className="px-5 py-3 text-gray-400 font-mono">{c.joinedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>


      {/* DOC EDITING MODAL DIALOG */}
      {isDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl flex flex-col max-h-[90vh] animate-fade-in">
            
            <div className="border-b border-gray-150 px-6 py-4 flex items-center justify-between bg-gray-50">
              <h4 className="font-display font-extrabold text-sm text-gray-900">
                {editingDocId ? 'Sửa thông tin tài liệu' : 'Đăng tải tài liệu mới'}
              </h4>
              <button onClick={() => setIsDocModalOpen(false)} className="rounded p-1 text-gray-400 hover:bg-gray-100 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDocument} className="overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Tiêu đề tài liệu</label>
                <input
                  type="text"
                  required
                  placeholder="Vd: Sách giải bài tập Kinh tế Lượng"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Mô tả (lợi ích chính của tài liệu học)</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Vd: Bản tóm tắt đầy đủ nhất 12 chương học kèm sơ đồ tư duy..."
                  value={docDesc}
                  onChange={(e) => setDocDesc(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-indigo-700 mb-1 font-sans">GIÁ BÁN (VND - 0 nếu muốn miễn phí)</label>
                  <input
                    type="number"
                    required
                    value={docPrice}
                    onChange={(e) => setDocPrice(Number(e.target.value))}
                    className="w-full rounded-lg border border-indigo-400 bg-indigo-50/5 px-3 py-2 text-sm text-gray-900 focus:outline-none font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Đường dẫn tệp tải (Google Drive/Docs URL link)</label>
                  <input
                    type="url"
                    required
                    placeholder="https://drive.google.com/file/.../view"
                    value={docFileUrl}
                    onChange={(e) => setDocFileUrl(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Chuyên ngành học</label>
                  <input
                    type="text"
                    required
                    placeholder="Vd: Đại cương / Y Dược / Công nghệ thông tin..."
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Khuyên dùng cho Sinh viên năm</label>
                  <select
                    value={docYear}
                    onChange={(e) => setDocYear(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none font-sans bg-white"
                  >
                    <option value="1">Sinh viên Năm Nhất (Năm 1)</option>
                    <option value="2">Sinh viên Năm Hai (Năm 2)</option>
                    <option value="3">Sinh viên Năm Ba (Năm 3)</option>
                    <option value="4">Sinh viên Năm Cuối / Mọi năm</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-150 pt-4 flex gap-2 justify-end">
                <button type="button" onClick={() => setIsDocModalOpen(false)} className="rounded px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 cursor-pointer font-sans">Hủy</button>
                <button type="submit" className="rounded bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer font-sans shadow-xs">Lưu Tài Liệu</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* SHARE (BLOG) EDITING MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl flex flex-col max-h-[90vh]">
            
            <div className="border-b border-gray-150 px-6 py-4 flex items-center justify-between bg-gray-50">
              <h4 className="font-display font-extrabold text-sm text-gray-900">
                {editingShareId ? 'Chỉnh sửa nội dung chia sẻ' : 'Viết cẩm nang mới'}
              </h4>
              <button onClick={() => setIsShareModalOpen(false)} className="rounded p-1 text-gray-400 hover:bg-gray-100 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShare} className="overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Tiêu đề bài học</label>
                <input
                  type="text"
                  required
                  placeholder="Vd: Cách tự học lập trình cho người trái ngành..."
                  value={shareTitle}
                  onChange={(e) => setShareTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-indigo-505 focus:outline-none font-bold font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Họ tên Tác giả</label>
                  <input
                    type="text"
                    required
                    value={shareAuthor}
                    onChange={(e) => setShareAuthor(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Phân loại (Category)</label>
                  <select
                    value={shareCategory}
                    onChange={(e) => setShareCategory(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none font-sans bg-white"
                  >
                    <option value="Kinh nghiệm học tập">Kinh nghiệm học tập</option>
                    <option value="Mẹo thi cử">Mẹo thi cử</option>
                    <option value="Định hướng nghề nghiệp">Định hướng nghề nghiệp</option>
                    <option value="Học bổng">Tin tức & Học bổng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Thời gian đọc nhanh (Vd: 5 phút đọc)</label>
                <input
                  type="text"
                  value={shareReadTime}
                  onChange={(e) => setShareReadTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-indigo-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Nội dung chi tiết (Sử dụng '### ' cho đầu mục, double newline cho đoạn mới)</label>
                <textarea
                  rows={8}
                  required
                  placeholder="### 1. Đầu mục chính đầu tiên..."
                  value={shareContent}
                  onChange={(e) => setShareContent(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-805 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="border-t border-gray-150 pt-4 flex gap-2 justify-end">
                <button type="button" onClick={() => setIsShareModalOpen(false)} className="rounded px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 cursor-pointer font-sans">Hủy</button>
                <button type="submit" className="rounded bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer font-sans shadow-xs">Lưu Bài Viết</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* AFFILIATE PRODUCT EDITING MODAL */}
      {isProdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl flex flex-col max-h-[90vh]">
            
            <div className="border-b border-gray-150 px-6 py-4 flex items-center justify-between bg-gray-50">
              <h4 className="font-display font-extrabold text-sm text-gray-900">
                {editingProdId ? 'Sửa thông tin sản phẩm' : 'Đăng sản phẩm khuyên dùng'}
              </h4>
              <button onClick={() => setIsProdModalOpen(false)} className="rounded p-1 text-gray-400 hover:bg-gray-100 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAffProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Tên sản phẩm thiết bị</label>
                <input
                  type="text"
                  required
                  placeholder="Vd: Đèn học chống cận Điện Quang..."
                  value={prodTitle}
                  onChange={(e) => setProdTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none font-bold font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Mô tả ngắn</label>
                <input
                  type="text"
                  required
                  placeholder="Nâng hạ chiều cao, pin sạc USB..."
                  value={prodDesc}
                  onChange={(e) => {}}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none font-sans"
                  onBlur={(e) => setProdDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Giá bán tham khảo (VND)</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-550 mb-1 font-sans">Đường dẫn ảnh Unsplash mẫu (URL)</label>
                  <input
                    type="text"
                    required
                    value={prodImg}
                    onChange={(e) => setProdImg(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-indigo-805 mb-1 font-sans">LINK TIẾP THỊ LIÊN KẾT (Affiliate Shopee/Lazada/...)</label>
                <input
                  type="url"
                  required
                  placeholder="https://shopee.vn/search?keyword=..."
                  value={prodAffLink}
                  onChange={(e) => setProdAffLink(e.target.value)}
                  className="w-full rounded-lg border border-indigo-400 bg-indigo-50/5 px-3 py-2 text-sm text-indigo-900 focus:outline-none font-mono"
                />
              </div>

              <div className="border-t border-gray-150 pt-4 flex gap-2 justify-end">
                <button type="button" onClick={() => setIsProdModalOpen(false)} className="rounded px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 cursor-pointer font-sans">Hủy</button>
                <button type="submit" className="rounded bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer font-sans shadow-xs">Lưu Sản Phẩm</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* EMAIL MARKETING MODAL DIALOG */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl flex flex-col">
            
            <div className="border-b border-indigo-100 bg-indigo-100/30 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-indigo-700">
                <MailOpen className="h-5 w-5" />
                <span className="font-display font-extrabold text-sm text-indigo-900">Chiến dịch Email Định Kỳ</span>
              </div>
              <button onClick={() => setIsEmailModalOpen(false)} className="rounded p-1 text-gray-405 text-gray-400 hover:bg-gray-100 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSendEmailBlast} className="p-6 space-y-4">
              <div className="rounded-xl bg-indigo-50/40 p-4 border border-indigo-100/60">
                <span className="block text-[10px] font-bold text-indigo-805 uppercase tracking-wider mb-1">Tệp khách hàng mục tiêu:</span>
                <p className="text-xs font-semibold text-slate-700 font-sans">
                  Phát tin nhắn khuyến mãi học đường cho <span className="font-bold text-indigo-800 text-sm font-mono bg-indigo-100/60 py-0.5 px-2 rounded-full">{customers.length}</span> danh bạ sinh viên đã mua tài liệu.
                </p>
              </div>

              {blastSuccess && (
                <div className="rounded-lg bg-indigo-50 p-3 text-xs text-indigo-850 font-bold flex items-center gap-2 font-sans">
                  <Check className="h-4 w-4" />
                  <span>Chạy chiến dịch thành công! Các email đã được gửi vào hàng chờ.</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Tiêu đề Thư (Subject Email)</label>
                <input
                  type="text"
                  required
                  placeholder="Vd: [SinhVienHub] Tặng ngay bộ Slide công thức cực độc cho kỳ thi sắp tới!"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 font-sans">Nội dung thư Email (Hỗ trợ định dạng văn bản tự do)</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Vd: Chào bạn, cảm ơn bạn đã đồng hành cùng SinhVienHub trong thời gian qua. Chúng tôi gửi tặng bạn mã GIAM30 để được giảm giá khi mở khóa tệp tài liệu mới..."
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none font-sans"
                />
              </div>

              <div className="border-t border-gray-150 pt-4 flex gap-2 justify-end text-xs font-bold font-sans">
                <button type="button" onClick={() => setIsEmailModalOpen(false)} className="rounded px-4 py-2 text-gray-500 hover:bg-gray-100 cursor-pointer">Hủy bỏ</button>
                <button type="submit" className="rounded bg-indigo-65 bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-white transition cursor-pointer shadow-xs">Bắn chiến dịch Ngay</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
