export interface SystemConfig {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  zaloLink: string;
  facebookLink: string;
  contactEmail: string;
  contactPhone: string;
  footerText?: string;
}

export interface PaymentConfig {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  qrMemoTemplate: string; // e.g., 'SVDOC_'
  useCustomQr?: boolean;
  customQrImage?: string;
}

export interface Feedback {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  price: number; // 0 for free
  fileUrl: string; // URL to download the document
  rating: number; // calculated from feedbackList
  feedbackList: Feedback[];
  year: number; // e.g. 1, 2, 3, 4
  category: string; // e.g., 'Công nghệ thông tin', 'Kinh tế', 'Y dược', 'Đại cương'
}

export interface SharePost {
  id: string;
  title: string;
  author: string;
  content: string;
  category: string; // e.g., 'Kinh nghiệm học tập', 'Học bổng', 'Mẹo thi cử'
  readTime: string; // e.g., '5 phút đọc'
  date: string;
}

export interface AffiliateProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string; // URL or placeholder image
  affiliateLink: string;
  rating: number;
}

export interface Transaction {
  id: string;
  docId: string;
  docTitle: string;
  price: number;
  customerName: string;
  customerEmail: string;
  qrContent: string;
  date: string;
  status: 'success' | 'pending';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  purchasedDocs: string[]; // List of document titles or IDs
  totalSpent: number;
  joinedAt: string;
}
