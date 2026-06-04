import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Mail, Phone, Globe, MessageSquare, Send, CheckCircle, GraduationCap } from 'lucide-react';

export default function ContactComp() {
  const { systemConfig } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [docRequest, setDocRequest] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setDocRequest('');
      setMessage('');
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 bg-white rounded-3xl border border-gray-150 p-6 md:p-10 shadow-xs">
        
        {/* Left Column: Contact info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 mb-4">
              <GraduationCap className="h-8 w-8" />
              <span className="font-display font-black text-xl text-gray-800">{systemConfig.siteName}</span>
            </div>
            <h3 className="font-display font-extrabold text-2xl text-gray-805 leading-tight">
              Bạn có bộ tài liệu hay muốn đóng góp?
            </h3>
            <p className="mt-3 text-gray-500 font-medium text-sm leading-relaxed font-sans">
              Mọi đóng góp, hợp tác hoặc nếu bạn gặp bất kỳ vấn đề gì liên quan đến thanh toán mở khóa tệp tải, vui lòng kết nối ngay qua Zalo nhóm chính hoặc liên hệ trực tiếp:
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100 text-sm font-semibold text-gray-700 font-sans">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Email liên hệ</span>
                <a href={`mailto:${systemConfig.contactEmail}`} className="hover:text-indigo-600 transition">
                  {systemConfig.contactEmail}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                <Phone className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Hotline hỗ trợ</span>
                <a href={`tel:${systemConfig.contactPhone}`} className="hover:text-indigo-600 transition font-mono">
                  {systemConfig.contactPhone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                <Globe className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Cộng đồng chính thức</span>
                <a 
                  href={systemConfig.facebookLink}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-indigo-600 transition"
                >
                  Nhóm Facebook SinhVienHub
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interaction Form */}
        <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-gray-150 pt-8 lg:pt-0 lg:pl-10">
          <h4 className="font-display font-black text-lg text-gray-800 mb-6 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
            <span>Yêu cầu tài liệu học tập hoặc góp ý</span>
          </h4>

          {isSubmitted && (
            <div className="mb-6 rounded-2xl bg-indigo-50 border border-indigo-100 p-4 text-indigo-850 font-bold flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-sm font-black text-indigo-900">Gửi yêu cầu thành công!</h5>
                <p className="text-xs font-semibold text-indigo-700 leading-relaxed mt-1">
                  Đội ngũ học thuật và các Thầy Cô cố vấn đã ghi nhận đề xuất về cuốn tài liệu/nhận xét này. Chúng tôi sẽ cố gắng bổ sung nhanh nhất có thể!
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans">Tên của bạn</label>
                <input
                  type="text"
                  required
                  placeholder="Vd: Nguyễn Văn B"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none bg-white font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans">Thư điện tử (Email)</label>
                <input
                  type="email"
                  required
                  placeholder="Vd: user@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none bg-white font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans">Tên tài liệu / Giáo trình muốn yêu cầu (nếu có)</label>
              <input
                type="text"
                placeholder="Vd: Đề cương môn Nguyên lý Hệ thống năm 2026..."
                value={docRequest}
                onChange={(e) => setDocRequest(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none bg-white font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans">Lời nhắn gửi hoặc thắc mắc</label>
              <textarea
                rows={4}
                required
                placeholder="Nên bổ sung thêm nội dung bài học gì? Góp ý dịch vụ hoặc bất kỳ thắc mắc của bạn..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-indigo-500 focus:outline-none bg-white font-sans"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-6 py-3 font-bold text-sm text-white transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Send className="h-4 w-4" />
              <span>Gửi Yêu Cầu Cho Đội Ngũ</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
