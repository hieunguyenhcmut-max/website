import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SystemConfig,
  PaymentConfig,
  DocumentItem,
  SharePost,
  AffiliateProduct,
  Transaction,
  Customer,
  Feedback
} from './types';
import {
  initialSystemConfig,
  initialPaymentConfig,
  initialDocuments,
  initialSharePosts,
  initialAffiliateProducts,
  initialTransactions,
  initialCustomers
} from './initialData';

interface AppContextType {
  systemConfig: SystemConfig;
  updateSystemConfig: (config: SystemConfig) => void;
  paymentConfig: PaymentConfig;
  updatePaymentConfig: (config: PaymentConfig) => void;
  documents: DocumentItem[];
  addDocument: (doc: Omit<DocumentItem, 'id' | 'rating' | 'feedbackList'>) => void;
  updateDocument: (id: string, updatedDoc: Partial<DocumentItem>) => void;
  deleteDocument: (id: string) => void;
  addFeedbackToDoc: (docId: string, feedback: Omit<Feedback, 'id' | 'date'>) => void;
  sharePosts: SharePost[];
  addSharePost: (post: Omit<SharePost, 'id' | 'date'>) => void;
  updateSharePost: (id: string, updatedPost: Partial<SharePost>) => void;
  deleteSharePost: (id: string) => void;
  affiliateProducts: AffiliateProduct[];
  addAffiliateProduct: (product: Omit<AffiliateProduct, 'id'>) => void;
  updateAffiliateProduct: (id: string, updatedProduct: Partial<AffiliateProduct>) => void;
  deleteAffiliateProduct: (id: string) => void;
  transactions: Transaction[];
  createTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => string; // returns transaction content
  updateTransactionStatus: (id: string, status: 'success' | 'pending') => void;
  customers: Customer[];
  addCustomer: (cust: Omit<Customer, 'id' | 'joinedAt'>) => void;
  isAdminLoggedIn: boolean;
  loginAdmin: (username: string, pass: string) => boolean;
  logoutAdmin: () => void;
  adminPassword: string;
  updateAdminPassword: (newPass: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider(props: { children: React.ReactNode }) {
  // Load from localStorage or fallback
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(() => {
    const saved = localStorage.getItem('sv_system_config');
    return saved ? JSON.parse(saved) : initialSystemConfig;
  });

  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(() => {
    const saved = localStorage.getItem('sv_payment_config');
    return saved ? JSON.parse(saved) : initialPaymentConfig;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('sv_documents');
    return saved ? JSON.parse(saved) : initialDocuments;
  });

  const [sharePosts, setSharePosts] = useState<SharePost[]>(() => {
    const saved = localStorage.getItem('sv_share_posts');
    return saved ? JSON.parse(saved) : initialSharePosts;
  });

  const [affiliateProducts, setAffiliateProducts] = useState<AffiliateProduct[]>(() => {
    const saved = localStorage.getItem('sv_affiliate_products');
    return saved ? JSON.parse(saved) : initialAffiliateProducts;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('sv_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('sv_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('sv_admin_logged') === 'true';
  });

  // Save to localStorage on state changes
  useEffect(() => {
    localStorage.setItem('sv_system_config', JSON.stringify(systemConfig));
  }, [systemConfig]);

  useEffect(() => {
    localStorage.setItem('sv_payment_config', JSON.stringify(paymentConfig));
  }, [paymentConfig]);

  useEffect(() => {
    localStorage.setItem('sv_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('sv_share_posts', JSON.stringify(sharePosts));
  }, [sharePosts]);

  useEffect(() => {
    localStorage.setItem('sv_affiliate_products', JSON.stringify(affiliateProducts));
  }, [affiliateProducts]);

  useEffect(() => {
    localStorage.setItem('sv_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('sv_customers', JSON.stringify(customers));
  }, [customers]);

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('sv_admin_password') || '123';
  });

  const updateAdminPassword = (newPass: string) => {
    setAdminPassword(newPass);
    localStorage.setItem('sv_admin_password', newPass);
  };

  // Admin auth
  const loginAdmin = (username: string, pass: string): boolean => {
    if (username === 'admin' && pass === adminPassword) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('sv_admin_logged', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.setItem('sv_admin_logged', 'false');
  };

  // Systems configs setters
  const updateSystemConfig = (config: SystemConfig) => setSystemConfig(config);
  const updatePaymentConfig = (config: PaymentConfig) => setPaymentConfig(config);

  // Document management
  const addDocument = (doc: Omit<DocumentItem, 'id' | 'rating' | 'feedbackList'>) => {
    const newDoc: DocumentItem = {
      ...doc,
      id: `doc-${Date.now()}`,
      rating: 5,
      feedbackList: []
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const updateDocument = (id: string, updatedFields: Partial<DocumentItem>) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === id) {
        const merged = { ...doc, ...updatedFields };
        if (updatedFields.feedbackList) {
          const totalRating = updatedFields.feedbackList.reduce((sum, fb) => sum + fb.rating, 0);
          merged.rating = updatedFields.feedbackList.length > 0
            ? Number((totalRating / updatedFields.feedbackList.length).toFixed(1))
            : 5;
        }
        return merged;
      }
      return doc;
    }));
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const addFeedbackToDoc = (docId: string, feedback: Omit<Feedback, 'id' | 'date'>) => {
    const dateStr = new Date().toISOString().split('T')[0];
    const newFb: Feedback = {
      ...feedback,
      id: `fb-${Date.now()}`,
      date: dateStr
    };

    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        const newList = [newFb, ...doc.feedbackList];
        const totalRating = newList.reduce((sum, item) => sum + item.rating, 0);
        const avg = Number((totalRating / newList.length).toFixed(1));
        return {
          ...doc,
          feedbackList: newList,
          rating: avg
        };
      }
      return doc;
    }));
  };

  // Blog management
  const addSharePost = (post: Omit<SharePost, 'id' | 'date'>) => {
    const dateStr = new Date().toISOString().split('T')[0];
    const newPost: SharePost = {
      ...post,
      id: `post-${Date.now()}`,
      date: dateStr
    };
    setSharePosts(prev => [newPost, ...prev]);
  };

  const updateSharePost = (id: string, updatedFields: Partial<SharePost>) => {
    setSharePosts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const deleteSharePost = (id: string) => {
    setSharePosts(prev => prev.filter(p => p.id !== id));
  };

  // Affiliate management
  const addAffiliateProduct = (product: Omit<AffiliateProduct, 'id'>) => {
    const newProd: AffiliateProduct = {
      ...product,
      id: `aff-${Date.now()}`
    };
    setAffiliateProducts(prev => [newProd, ...prev]);
  };

  const updateAffiliateProduct = (id: string, updatedFields: Partial<AffiliateProduct>) => {
    setAffiliateProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const deleteAffiliateProduct = (id: string) => {
    setAffiliateProducts(prev => prev.filter(p => p.id !== id));
  };

  // Checkout system
  const createTransaction = (tx: Omit<Transaction, 'id' | 'date'>): string => {
    const txId = `tx-${Date.now()}`;
    const dateStr = new Date().toISOString();
    
    const newTx: Transaction = {
      ...tx,
      id: txId,
      date: dateStr
    };

    setTransactions(prev => [newTx, ...prev]);
    return newTx.qrContent;
  };

  const updateTransactionStatus = (id: string, status: 'success' | 'pending') => {
    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        // If status is transitioning to success, let's also capture customer and add book
        if (status === 'success' && t.status !== 'success') {
          addCustomer({
            name: t.customerName,
            email: t.customerEmail,
            purchasedDocs: [t.docTitle],
            totalSpent: t.price
          });
        }
        return { ...t, status };
      }
      return t;
    }));
  };

  // Customer Management
  const addCustomer = (custData: Omit<Customer, 'id' | 'joinedAt'>) => {
    const dateStr = new Date().toISOString().split('T')[0];
    
    setCustomers(prev => {
      const existing = prev.find(c => c.email.toLowerCase() === custData.email.toLowerCase());
      if (existing) {
        // Update customer
        const updatedDocs = Array.from(new Set([...existing.purchasedDocs, ...custData.purchasedDocs]));
        return prev.map(c => c.id === existing.id ? {
          ...c,
          purchasedDocs: updatedDocs,
          totalSpent: c.totalSpent + custData.totalSpent
        } : c);
      } else {
        const newCust: Customer = {
          id: `cust-${Date.now()}`,
          name: custData.name,
          email: custData.email,
          purchasedDocs: custData.purchasedDocs,
          totalSpent: custData.totalSpent,
          joinedAt: dateStr
        };
        return [newCust, ...prev];
      }
    });
  };

  return (
    <AppContext.Provider
      value={{
        systemConfig,
        updateSystemConfig,
        paymentConfig,
        updatePaymentConfig,
        documents,
        addDocument,
        updateDocument,
        deleteDocument,
        addFeedbackToDoc,
        sharePosts,
        addSharePost,
        updateSharePost,
        deleteSharePost,
        affiliateProducts,
        addAffiliateProduct,
        updateAffiliateProduct,
        deleteAffiliateProduct,
        transactions,
        createTransaction,
        updateTransactionStatus,
        customers,
        addCustomer,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        adminPassword,
        updateAdminPassword
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
