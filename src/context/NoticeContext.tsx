import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as noticeApi from '../api/notices';

export interface Notice {
  _id?: string;
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  pinned?: boolean;
}

interface NoticeContextType {
  notices: Notice[];
  addNotice: (notice: Omit<Notice, 'id' | '_id'>) => Promise<void>;
  deleteNotice: (id: string) => Promise<void>;
  editNotice: (id: string, notice: Partial<Notice>) => Promise<void>;
}

const NoticeContext = createContext<NoticeContextType | undefined>(undefined);

const normalize = (n: any): Notice => ({ ...n, id: n._id || n.id });

export const NoticeProvider = ({ children }: { children: ReactNode }) => {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    noticeApi.getNotices().then(data => setNotices(data.map(normalize))).catch(console.error);
  }, []);

  const addNotice = async (notice: Omit<Notice, 'id' | '_id'>) => {
    const created = await noticeApi.createNotice(notice as any);
    setNotices(prev => [normalize(created), ...prev]);
  };

  const deleteNotice = async (id: string) => {
    await noticeApi.deleteNotice(id);
    setNotices(prev => prev.filter(n => n._id !== id && n.id !== id));
  };

  const editNotice = async (id: string, noticeData: Partial<Notice>) => {
    const updated = await noticeApi.updateNotice(id, noticeData as any);
    setNotices(prev => prev.map(n => (n._id === id || n.id === id) ? normalize(updated) : n));
  };

  return (
    <NoticeContext.Provider value={{ notices, addNotice, deleteNotice, editNotice }}>
      {children}
    </NoticeContext.Provider>
  );
};

export const useNotice = () => {
  const context = useContext(NoticeContext);
  if (context === undefined) throw new Error('useNotice must be used within a NoticeProvider');
  return context;
};
