import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { User, Mail, Phone, Hash, BookOpen, GraduationCap, Edit2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProfileTab = ({ searchQuery = '' }: { searchQuery?: string }) => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [mobile, setMobile] = useState(user?.mobile || '');

  const handleSave = async () => {
    if (mobile.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    try {
      await updateUser({ mobile });
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const InfoItem = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
      <div className="w-8 h-8 rounded-lg bg-white dark:bg-black/20 flex items-center justify-center text-gray-500 dark:text-gray-400 shrink-0 border border-gray-200 dark:border-white/5">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-white/5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-3xl font-bold text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-white/10 shrink-0">
            {user?.name?.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{user?.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center justify-center sm:justify-start gap-2">
              <Mail size={14} /> {user?.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <InfoItem icon={Hash} label="Enrollment Number" value={user?.enrollmentNo} />
          <InfoItem icon={BookOpen} label="Branch" value={user?.branch} />
          <InfoItem icon={GraduationCap} label="Year" value={user?.year} />
          
          <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 sm:col-span-2 lg:col-span-3">
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-black/20 flex items-center justify-center text-gray-500 dark:text-gray-400 shrink-0 border border-gray-200 dark:border-white/5">
              <Phone size={16} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">Mobile Number</p>
                <button 
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
                >
                  {isEditing ? <><Check size={12}/> Save</> : <><Edit2 size={12}/> Edit</>}
                </button>
              </div>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">+91</span>
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="flex-1 bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-md px-3 py-1.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                    autoFocus
                    placeholder="Enter 10-digit number"
                  />
                </div>
              ) : (
                <p className="text-sm font-medium text-gray-900 dark:text-white">+91 {mobile}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
