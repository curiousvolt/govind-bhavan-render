import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as rebateApi from '../api/rebates';
import { useAuth } from './AuthContext';

export interface MessRebate {
  _id?: string;
  id: string;
  studentId?: string;
  student: string;
  room: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedOn: string;
}

interface MessRebateContextType {
  rebates: MessRebate[];
  addRebate: (rebate: Omit<MessRebate, 'id' | '_id' | 'status' | 'submittedOn'>) => Promise<void>;
  updateRebateStatus: (id: string, status: 'Approved' | 'Rejected') => Promise<void>;
}

const MessRebateContext = createContext<MessRebateContextType | undefined>(undefined);

const normalize = (r: any): MessRebate => ({ ...r, id: r._id || r.id });

export const MessRebateProvider = ({ children }: { children: ReactNode }) => {
  const [rebates, setRebates] = useState<MessRebate[]>([]);
  const { user, role } = useAuth();

  useEffect(() => {
    if (!user) { setRebates([]); return; }
    const studentId = role === 'student' && user?._id ? user._id : undefined;
    rebateApi.getRebates(studentId).then(data => setRebates(data.map(normalize))).catch(console.error);
  }, [user]);

  const addRebate = async (rebateData: Omit<MessRebate, 'id' | '_id' | 'status' | 'submittedOn'>) => {
    const created = await rebateApi.createRebate({
      studentId: rebateData.studentId || user?._id,
      student: rebateData.student,
      room: rebateData.room,
      fromDate: rebateData.fromDate,
      toDate: rebateData.toDate,
      reason: rebateData.reason,
    });
    setRebates(prev => [normalize(created), ...prev]);
  };

  const updateRebateStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    const updated = await rebateApi.updateRebateStatus(id, status);
    setRebates(prev => prev.map(r => (r._id === id || r.id === id) ? normalize(updated) : r));
  };

  return (
    <MessRebateContext.Provider value={{ rebates, addRebate, updateRebateStatus }}>
      {children}
    </MessRebateContext.Provider>
  );
};

export const useMessRebate = () => {
  const context = useContext(MessRebateContext);
  if (context === undefined) throw new Error('useMessRebate must be used within a MessRebateProvider');
  return context;
};
