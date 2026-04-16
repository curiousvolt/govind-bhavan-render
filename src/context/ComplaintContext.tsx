import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as complaintApi from '../api/complaints';
import { useAuth } from './AuthContext';

export interface Complaint {
  _id?: string;
  id: string;
  studentId?: string;
  student: string;
  room: string;
  category: string;
  description: string;
  date: string;
  status: 'Open' | 'In Progress' | 'Resolved';
}

interface ComplaintContextType {
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | '_id' | 'date' | 'status'>) => Promise<void>;
  updateComplaintStatus: (id: string, status: 'Open' | 'In Progress' | 'Resolved') => Promise<void>;
  refreshComplaints: () => Promise<void>;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

const normalize = (c: any): Complaint => ({ ...c, id: c._id || c.id, complaintId: c.complaintId || c._id?.slice(-6) });

export const ComplaintProvider = ({ children }: { children: ReactNode }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const { user, role } = useAuth();

  const refreshComplaints = async () => {
    try {
      // Admin gets all; student gets their own
      const studentId = role === 'student' && user?._id ? user._id : undefined;
      const data = await complaintApi.getComplaints(studentId);
      setComplaints(data.map(normalize));
    } catch (err) {
      console.error('Failed to load complaints', err);
    }
  };

  useEffect(() => {
    if (user) refreshComplaints();
    else setComplaints([]);
  }, [user]);

  const addComplaint = async (complaint: Omit<Complaint, 'id' | '_id' | 'date' | 'status'>) => {
    const created = await complaintApi.createComplaint({
      studentId: complaint.studentId || user?._id,
      student: complaint.student,
      room: complaint.room,
      category: complaint.category,
      description: complaint.description,
    });
    setComplaints(prev => [normalize(created), ...prev]);
  };

  const updateComplaintStatus = async (id: string, status: 'Open' | 'In Progress' | 'Resolved') => {
    const updated = await complaintApi.updateComplaintStatus(id, status);
    setComplaints(prev => prev.map(c => (c._id === id || c.id === id) ? normalize(updated) : c));
  };

  return (
    <ComplaintContext.Provider value={{ complaints, addComplaint, updateComplaintStatus, refreshComplaints }}>
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaint = () => {
  const context = useContext(ComplaintContext);
  if (context === undefined) throw new Error('useComplaint must be used within a ComplaintProvider');
  return context;
};
