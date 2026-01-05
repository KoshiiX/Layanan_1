import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Submission {
  id: string;
  userId: string;
  userName: string;
  serviceType: string;
  description: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected';
  submittedDate: string;
  completedDate?: string;
  documentUrl?: string;
  attachments?: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  image: string;
  date: string;
  description: string;
}

interface DataContextType {
  submissions: Submission[];
  news: NewsItem[];
  addSubmission: (submission: Omit<Submission, 'id' | 'submittedDate' | 'status'>) => void;
  updateSubmission: (id: string, data: Partial<Submission>) => void;
  addNews: (news: Omit<NewsItem, 'id'>) => void;
  updateNews: (id: string, data: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Pelayanan Administrasi Kini Lebih Cepat',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    date: '2026-01-03',
    description: 'Proses administrasi kini dipercepat dengan sistem digital'
  },
  {
    id: '2',
    title: 'Pendaftaran Online Sudah Dibuka',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
    date: '2026-01-02',
    description: 'Masyarakat dapat mengajukan permohonan secara online'
  },
  {
    id: '3',
    title: 'Jam Operasional Baru Kelurahan',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
    date: '2026-01-01',
    description: 'Kelurahan kini buka Senin-Jumat 08:00-16:00'
  }
];

const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: '1',
    userId: '2',
    userName: 'John Doe',
    serviceType: 'KTP',
    description: 'Pembuatan KTP Baru',
    status: 'approved',
    submittedDate: '2025-12-20',
    completedDate: '2025-12-25',
    documentUrl: 'https://example.com/ktp-1.pdf'
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS);
  const [news, setNews] = useState<NewsItem[]>(MOCK_NEWS);

  // Load data from localStorage on mount
  React.useEffect(() => {
    const savedSubmissions = localStorage.getItem('submissions');
    const savedNews = localStorage.getItem('news');
    
    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions));
    } else {
      localStorage.setItem('submissions', JSON.stringify(MOCK_SUBMISSIONS));
    }
    
    if (savedNews) {
      setNews(JSON.parse(savedNews));
    } else {
      localStorage.setItem('news', JSON.stringify(MOCK_NEWS));
    }
  }, []);

  // Save submissions to localStorage whenever they change
  React.useEffect(() => {
    if (submissions.length > 0) {
      localStorage.setItem('submissions', JSON.stringify(submissions));
    }
  }, [submissions]);

  // Save news to localStorage whenever they change
  React.useEffect(() => {
    if (news.length > 0) {
      localStorage.setItem('news', JSON.stringify(news));
    }
  }, [news]);

  const addSubmission = (submission: Omit<Submission, 'id' | 'submittedDate' | 'status'>) => {
    const newSubmission: Submission = {
      ...submission,
      id: Date.now().toString(),
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setSubmissions([...submissions, newSubmission]);
  };

  const updateSubmission = (id: string, data: Partial<Submission>) => {
    setSubmissions(submissions.map(s => 
      s.id === id ? { ...s, ...data } : s
    ));
  };

  const addNews = (newsItem: Omit<NewsItem, 'id'>) => {
    const newNews: NewsItem = {
      ...newsItem,
      id: Date.now().toString()
    };
    setNews([newNews, ...news]);
  };

  const updateNews = (id: string, data: Partial<NewsItem>) => {
    setNews(news.map(n => 
      n.id === id ? { ...n, ...data } : n
    ));
  };

  const deleteNews = (id: string) => {
    setNews(news.filter(n => n.id !== id));
  };

  return (
    <DataContext.Provider value={{ 
      submissions, 
      news, 
      addSubmission, 
      updateSubmission,
      addNews,
      updateNews,
      deleteNews
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}