import React from 'react';
import { useApp } from '../AppContext';
import { ShoppingBag, Star, ArrowUpRight, HelpCircle } from 'lucide-react';

export default function ProductAffiliates() {
  const { affiliateProducts } = useApp();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Title Header */}
      <div className="mb-8">
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
          Sản Phẩm Khuyên Dùng
        </h2>
        <p className="mt-1 text-slate-505 text-sm text-slate-500 font-medium">
          Tuyển chọn đồ dùng tiện ích học tập giá mềm, tối ưu nhất cho sinh viên (bút stylus, giá đỡ laptop, sổ kế hoạch...) cậy học hiệu quả hơn.
        </p>
      </div>

      {/* Affiliate Support Disclaimer Banner */}
      <div className="mb-10 rounded-2xl bg-sky-50 border border-sky-100 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="rounded-xl bg-sky-100 p-2.5 text-sky-700 flex-shrink-0">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <div>
          <h4 className="font-display font-black text-sm text-sky-905 text-sky-900 flex items-center gap-1.5">
            Góc Đại Sứ Hoa Hồng Thần Kỳ
            <span className="rounded bg-sky-200 px-1.5 py-0.5 text-[10px] font-bold text-sky-800 uppercase tracking-widest">Ủng hộ duy trì</span>
          </h4>
          <p className="text-xs text-sky-700 leading-relaxed mt-1 font-semibold">
            Tất cả sản phẩm dưới đây đều đã được admin kiểm nghiệm chất lượng. Mỗi giao dịch mua hàng qua đường link tiếp thị (affiliate) của SinhVienHub sẽ trích một phần hoa hồng nhỏ (1% - 3%) từ sàn thương mại để gây quỹ phát triển, duy trì server hoàn toàn miễn phí cho bạn!
          </p>
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {affiliateProducts.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500">
            <HelpCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-bold">Chưa có sản phẩm đề cử nào.</p>
          </div>
        ) : (
          affiliateProducts.map((prod) => (
            <div 
              key={prod.id}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-indigo-200 hover:shadow-md"
            >
              <div>
                {/* Product Thumbnail Unsplash with referrer fallback */}
                <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-center transition duration-200 hover:scale-105"
                  />
                  
                  {prod.price < 150000 && (
                    <span className="absolute top-3 left-3 rounded-md bg-indigo-600 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-white shadow-sm">
                      GIÁ TỐT HỌC ĐƯỜNG
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="font-display font-bold text-gray-900 text-sm leading-snug line-clamp-2">
                    {prod.title}
                  </h3>
                  
                  <p className="mt-1.5 text-xs text-gray-500 leading-relaxed line-clamp-2 font-sans">
                    {prod.description}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 text-amber-400">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < Math.round(prod.rating) ? 'fill-current' : 'text-gray-200'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-gray-700">{prod.rating}</span>
                  </div>
                </div>
              </div>

              {/* Price and referral button */}
              <div className="p-5 pt-0">
                <div className="border-t border-gray-100 pt-4 flex items-center justify-between gap-2">
                  <div>
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest">Tham khảo từ</span>
                    <span className="font-mono text-sm font-bold text-gray-900">
                      {prod.price.toLocaleString('vi-VN')} đ
                    </span>
                  </div>

                  <a
                    href={prod.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white px-3.5 py-2 text-xs font-bold transition shadow-xs"
                  >
                    <span>Mua Ngay</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
