import { SystemConfig, PaymentConfig, DocumentItem, SharePost, AffiliateProduct, Transaction, Customer } from './types';

export const initialSystemConfig: SystemConfig = {
  siteName: "SinhVienHub",
  heroTitle: "Chia sẻ Tri thức - Kiến tạo Tương lai",
  heroSubtitle: "Cộng đồng chia sẻ tài liệu và kinh nghiệm học tập hàng đầu dành cho sinh viên Việt Nam. Tài liệu chất lượng, thanh toán tự động tải về tích tắc.",
  zaloLink: "https://zalo.me/g/svhubcomm",
  facebookLink: "https://facebook.com/groups/sinhvienhub",
  contactEmail: "admin@sinhvienhub.edu.vn",
  contactPhone: "0987.654.321",
  footerText: "VietQR & MBBank Sandbox Automated. Tài liệu bản quyền của cộng đồng đóng góp. Bản quyền bảo lưu của SinhVienHub &copy; 2026."
};

export const initialPaymentConfig: PaymentConfig = {
  bankName: "MB Bank (Ngân hàng Quân đội)",
  accountNumber: "190620268888",
  accountHolder: "NGUYEN CHI HIEU",
  qrMemoTemplate: "SVHB_",
  useCustomQr: false,
  customQrImage: ""
};

export const initialDocuments: DocumentItem[] = [
  {
    id: "doc-1",
    title: "Trọn bộ Đề cương & Đề thi mẫu Toán Cao Cấp (A1, A2, A3)",
    description: "Bộ sơ đồ tư duy tóm tắt toàn bộ công thức, kèm giải chi tiết 15 đề thi trường Đại học Quốc Gia các năm gần nhất. Cực kỳ hữu dụng cho ôn thi giữa kỳ và cuối kỳ.",
    price: 0,
    fileUrl: "https://drive.google.com/file/d/1_demo_free_math_pdf/view",
    rating: 4.8,
    year: 1,
    category: "Đại cương",
    feedbackList: [
      {
        id: "fb-1",
        author: "Trần Thế Bảo (ĐH Bách Khoa)",
        rating: 5,
        comment: "Tóm tắt công thức cực kỳ dễ hiểu, nhất là phần tích phân kép và ma trận. Mình được 9.5 Toán nhờ bộ tài liệu này cứu bồ!",
        date: "2026-05-18"
      },
      {
        id: "fb-2",
        author: "Lê Mỹ Linh (ĐH Kinh Tế)",
        rating: 4.6,
        comment: "File trình bày sạch sẽ, đẹp mắt. Nhiều ví dụ dễ áp dụng thực tế.",
        date: "2026-05-24"
      }
    ]
  },
  {
    id: "doc-2",
    title: "Cẩm nang Cấu trúc Dữ liệu & Giải thuật (Java/C++ Visualized)",
    description: "Giải thích trực quan các cấu trúc dữ liệu cơ bản đến nâng cao (Danh sách liên kết, Cây nhị phân, Đồ thị) kèm code mẫu chi tiết được giải thích từng dòng, cực kỳ tối ưu cho phỏng vấn và thi cử môn chuyên ngành.",
    price: 49000,
    fileUrl: "https://drive.google.com/file/d/1_demo_paid_dsa_pdf/view",
    rating: 4.9,
    year: 2,
    category: "Công nghệ thông tin",
    feedbackList: [
      {
        id: "fb-3",
        author: "Phạm Hữu Đạt (ĐH KHTN)",
        rating: 5,
        comment: "Từ một đứa mù mờ về đệ quy và con trỏ, mình đã hiểu sâu sắc cách hoạt động của DSLK nhờ hình vẽ minh họa. 49k xứng đáng từng đồng!",
        date: "2026-05-28"
      },
      {
        id: "fb-4",
        author: "Vũ Nhật Nam (ĐH CNTT)",
        rating: 4.8,
        comment: "Mong tác giả làm thêm phần giải thuật nâng cao như Quy hoạch động. Giao dịch mua tự động nhanh, chuyển khoản xong hệ thống duyệt link tải luôn.",
        date: "2026-06-01"
      }
    ]
  },
  {
    id: "doc-3",
    title: "Bí kíp luyện thi TOEIC 750+ phần Ngữ pháp & Từ vựng cốt lõi",
    description: "Tuyển tập 12 chủ điểm ngữ pháp chắc chắn xuất hiện trong đề thi TOEIC và 600 từ vựng căn bản phân loại theo sơ đồ tư duy giúp nhớ lâu, kèm mẹo tránh bẫy Part 5, 6 cực đỉnh.",
    price: 39000,
    fileUrl: "https://drive.google.com/file/d/1_demo_toeic_pdf/view",
    rating: 4.7,
    year: 2,
    category: "Đại cương",
    feedbackList: [
      {
        id: "fb-5",
        author: "Nguyễn Hương Giang (ĐH Ngoại Thương)",
        rating: 5,
        comment: "Mẹo làm bài rất thiết thực, giúp mình tiết kiệm được khối thời gian ôn thi dồn dập. Đã kiểm chứng tăng từ 550 lên 780 điểm sau khi cày bộ này.",
        date: "2026-05-20"
      }
    ]
  },
  {
    id: "doc-4",
    title: "Bộ Giáo trình Kinh tế Vĩ mô & Vi mô thực tế và Sơ đồ hoá",
    description: "Hệ thống hóa toàn bộ các lý thuyết kinh tế, đồ thị cung cầu, chính sách tài khóa tiền tệ kèm bài tập tự luận có đáp án đạt chuẩn đề thi quốc gia. Thích hợp cho khối ngành Kinh tế mọi cấp học.",
    price: 29000,
    fileUrl: "https://drive.google.com/file/d/1_demo_micro_macro_pdf/view",
    rating: 4.5,
    year: 1,
    category: "Kinh tế",
    feedbackList: []
  },
  {
    id: "doc-5",
    title: "Cẩm nang Thực tế Thực tập và Viết Báo cáo khoa học xuất sắc",
    description: "Hướng dẫn chi tiết quy trình viết báo cáo nghiên cứu khoa học, khóa luận tốt nghiệp đạt điểm số tối đa, kèm CV template chuẩn chinh phục mọi nhà tuyển dụng khi đi thực tập sớm từ năm 3.",
    price: 59000,
    fileUrl: "https://drive.google.com/file/d/1_demo_internship_report/view",
    rating: 5,
    year: 3,
    category: "Công nghiệp & Kỹ năng",
    feedbackList: [
      {
        id: "fb-6",
        author: "Lê Hoàng Quân (ĐH Kinh Tế Quốc Dân)",
        rating: 5,
        comment: "Template CV cực xịn, mình sửa theo và đã đỗ phỏng vấn thực tập sinh tại Big4. Tài liệu trình bày lớp lang, chuyên nghiệp.",
        date: "2026-06-03"
      }
    ]
  }
];

export const initialSharePosts: SharePost[] = [
  {
    id: "post-1",
    title: "Làm sao để săn Học bổng khuyến khích xuất sắc 3 kỳ liên tiếp ở Đại Học?",
    author: "Phạm Minh Hằng (GPA 3.96/4.0 - Khoa Kinh tế)",
    category: "Kinh nghiệm học tập",
    readTime: "6 phút đọc",
    date: "2026-05-15",
    content: `Mình viết bài này để chia sẻ lại chặng hành trình duy trì học bổng của mình. Nhiều bạn nghĩ phải là 'siêu nhân' mới giật được học bổng đại học, thực chất yếu tố lớn nhất là **chiến lược và sự phân bổ thời gian**:\n\n` +
      `### 1. Cách đăng ký tín chỉ thông minh\n` +
      `Đừng gom quá nhiều môn khó vào cùng một kỳ. Hãy phối hợp môn đại cương nặng với 1-2 môn tự chọn nhẹ nhàng để cân bằng điểm trung bình hoặc giữ sức đầu óc.\n\n` +
      `### 2. Tận dụng triệt để Điểm thành phần\n` +
      `Điểm chuyên cần, điểm phát biểu và bài tập nhóm chiếm tới 30-50% tổng điểm số. Rất nhiều bạn chỉ lo học thi cuối kỳ mà bỏ qua điểm thành phần. Hãy đi học đầy đủ xung phong làm nhóm trưởng. Bài tập nhóm xuất sắc sẽ giúp gánh lại điểm thi lý thuyết nếu lỡ tay làm bài không tốt.\n\n` +
      `### 3. Tìm tài liệu và đề cương ôn tập đúng nhóm\n` +
      `Bắt đầu ôn thi trước ít nhất 3 tuần. Học từ đề thi cũ là con đường ngắn nhất để làm quen cấu trúc đề của các Thầy Cô.`
  },
  {
    id: "post-2",
    title: "Kinh nghiệm phỏng vấn và thực tập sớm ngành Công nghệ thông tin từ năm 3",
    author: "Lê Quốc Bảo (Software Engineer tại MB Bank)",
    category: "Định hướng nghề nghiệp",
    readTime: "8 phút đọc",
    date: "2026-05-28",
    content: `Chào các bạn sinh viên CNTT, mình vừa tốt nghiệp năm ngoái nhưng đã đi làm thực tế từ cuối năm 2. Dưới đây là bài học xương máu mình rút ra cho các bạn muốn đi làm sớm:\n\n` +
      `### 1. Kiến thức nền tảng (Computer Science Core)\n` +
      `Đừng chỉ cắm đầu học các framework hot như React, Spring Boot, Flutter. Khi phỏng vấn, các doanh nghiệp lớn cực kỳ quan tâm đến **Cấu trúc dữ liệu & Giải thuật**, **Mạng máy tính**, và **Hệ điều hành**. Họ cần một người có nền tảng tư duy tốt để huấn luyện lâu dài.\n\n` +
      `### 2. Dự án cá nhân (Pet project) mang bản nét cá nhân\n` +
      `CV của bạn sẽ bị loại ngay lập tức nếu chỉ ghi các dự án thực hành trên lớp (như quản lý thư viện hay app to-do đơn giản). Hãy tự xây dựng một sản phẩm giải quyết vấn đề thực tế: một tool tự động hóa kết quả học tập, chatbot cứu bồ mùa thi... rồi đẩy lên GitHub kèm hướng dẫn chi tiết.\n\n` +
      `### 3. Chuẩn bị CV & Kỹ năng mềm\n` +
      `Viết CV ngắn gọn trong 1 trang giấy, tập trung vào công nghệ sử dụng và kết quả đo lường (Ví dụ: Tối ưu tốc độ tải trang thêm 30%,...).\n` +
      `Khi phỏng vấn, thái độ cầu tiến và sự trung thực luôn ăn điểm nhiều hơn là bốc phét những thứ bạn chưa rõ.`
  },
  {
    id: "post-3",
    title: "Hướng dẫn giải tỏa căng thẳng áp lực thi cử (Stress Management)",
    author: "ThS. Tâm lý học Nguyễn An Nhiên",
    category: "Mẹo thi cử",
    readTime: "4 phút đọc",
    date: "2026-06-02",
    content: `Kỳ thi đang cận kề và bạn bắt đầu có triệu chứng mất ngủ, học trước quên sau? Đây là các kỹ thuật tâm lý học để reset lại não bộ cực kỳ hiệu quả:\n\n` +
      `### 1. Áp dụng kỹ thuật Pomodoro\n` +
      `Học tập trung cao độ trong 25 phút, sau đó nghỉ ngơi hoàn toàn 5 phút. Sau mỗi 4 chu kỳ như vậy, hãy nghỉ dài 15-20 phút. Điều này giữ cho não bộ không bị kiệt quệ endorphin.\n\n` +
      `### 2. Kỹ thuật thở hộp (Box Breathing)\n` +
      `Hít vào 4 giây - Nín thở 4 giây - Thở ra 4 giây - Nín thở 4 giây. Thực hiện 5 lần liên tục khi bạn cảm thấy tim đập nhanh trước phòng thi.\n\n` +
      `### 3. Ngủ đủ 6-7 tiếng trước ngày thi\n` +
      `Học thâu đêm (all-nighter) là sai lầm nguy hại nhất của sinh viên. Giấc ngủ chính là thời gian não bộ chuyển hóa kiến thức từ 'trí nhớ ngắn hạn' sang 'trí nhớ dài hạn'. Thiếu ngủ sẽ khiến bạn bị block tư duy khi gặp câu hỏi lạ.`
  }
];

export const initialAffiliateProducts: AffiliateProduct[] = [
  {
    id: "aff-1",
    title: "Bút Cảm Ứng Stylus GD13 Nam Châm Không Dây",
    description: "Dòng bút viết vẽ mượt mà, hỗ trợ chống tì tay hoàn hảo cho iPad. Thích hợp cho sinh viên ghi chép slide bài giảng, vẽ sơ đồ tư duy tiện lợi.",
    price: 320000,
    imageUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400",
    affiliateLink: "https://shopee.vn/search?keyword=GD13%20stylus",
    rating: 4.8
  },
  {
    id: "aff-2",
    title: "Kệ Đỡ Laptop Đa Năng Hợp Kim Nhôm Chống Cận",
    description: "Gấp gọn tiện lợi mang lên thư viện, nâng hạ 6 cấp độ giúp cột sống luôn thẳng, hạn chế mỏi cổ vai gáy khi ngồi viết code hay làm tiểu luận thâu đêm.",
    price: 115000,
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400",
    affiliateLink: "https://shopee.vn/search?keyword=gia%20do%20laptop%20nhom",
    rating: 4.6
  },
  {
    id: "aff-3",
    title: "Sổ Tay Kế Hoạch Đóng Gáy Lò Xo A5 Bullet Journal",
    description: "Ruột giấy bám mực cực tốt, thiết kế chấm dot grid tinh tế. Phù hợp thiết lập thời gian biểu cá nhân, quản lý deadline học tập thông minh.",
    price: 45000,
    imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=400",
    affiliateLink: "https://shopee.vn/search?keyword=so%20tay%20bullet%20journal%20a5",
    rating: 4.9
  },
  {
    id: "aff-4",
    title: "Đèn Bàn Học Chống Cận Thị Ba Chế Độ Sáng Khác Nhau",
    description: "Ánh sáng tự nhiên không nhấp nháy bảo vệ mắt, sạc pin USB tiện lợi kèm hộc cắm bút, kệ điện thoại siêu tiện lợi cho góc học tập.",
    price: 189000,
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=400",
    affiliateLink: "https://shopee.vn/search?keyword=den%20hoc%20chong%20can%20ba%20che%20do",
    rating: 4.7
  }
];

export const initialTransactions: Transaction[] = [
  {
    id: "tx-1",
    docId: "doc-2",
    docTitle: "Cẩm nang Cấu trúc Dữ liệu & Giải thuật (Java/C++ Visualized)",
    price: 49000,
    customerName: "Nguyễn Minh Đức",
    customerEmail: "duc.nm240@sinhvien.edu.vn",
    qrContent: "SVHB_doc-2_14389",
    date: "2026-06-03T18:32:00Z",
    status: "success"
  },
  {
    id: "tx-2",
    docId: "doc-3",
    docTitle: "Bí kíp luyện thi TOEIC 750+ phần Ngữ pháp & Từ vựng cốt lõi",
    price: 39000,
    customerName: "Hoàng Thanh Mai",
    customerEmail: "mai.ht@gmail.com",
    qrContent: "SVHB_doc-3_98274",
    date: "2026-06-04T00:15:00Z",
    status: "success"
  }
];

export const initialCustomers: Customer[] = [
  {
    id: "cust-1",
    name: "Nguyễn Minh Đức",
    email: "duc.nm240@sinhvien.edu.vn",
    purchasedDocs: ["Cẩm nang Cấu trúc Dữ liệu & Giải thuật (Java/C++ Visualized)"],
    totalSpent: 49000,
    joinedAt: "2026-06-03"
  },
  {
    id: "cust-2",
    name: "Hoàng Thanh Mai",
    email: "mai.ht@gmail.com",
    purchasedDocs: ["Bí kíp luyện thi TOEIC 750+ phần Ngữ pháp & Từ vựng cốt lõi"],
    totalSpent: 39000,
    joinedAt: "2026-06-04"
  }
];
