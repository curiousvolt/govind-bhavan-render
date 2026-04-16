import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CSVExportButton } from '../../../components/CSVExportButton';
import { Search, X, User, ChevronRight, Mail, Phone, Hash, BookOpen, DoorOpen, ClipboardList, Coffee, Calendar, ArrowLeft } from 'lucide-react';
import { getStudents, getStudentProfile } from '../../../api/students';
import { motion, AnimatePresence } from 'motion/react';

const LIMIT = 15;

const Badge = ({ text, color }: { text: string; color: string }) => (
  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${color}`}>{text}</span>
);

const statusColor = (s: string) =>
  s === 'Resolved' || s === 'Confirmed' || s === 'Approved'
    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
    : s === 'In Progress' || s === 'Pending'
    ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400';

export const StudentsTab = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchStudents = useCallback(async (s: string, p: number) => {
    setLoading(true);
    try {
      const res = await getStudents({ search: s || undefined, page: p, limit: LIMIT });
      setStudents(prev => p === 1 ? (res.students || []) : [...prev, ...(res.students || [])]);
      setTotalPages(res.totalPages ?? 1);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    debounceRef.current && clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 350);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [search]);

  useEffect(() => { fetchStudents(debouncedSearch, page); }, [debouncedSearch, page, fetchStudents]);

  const handleViewProfile = async (id: string) => {
    setProfileLoading(true);
    try {
      const profile = await getStudentProfile(id);
      setSelectedProfile(profile);
    } finally {
      setProfileLoading(false);
    }
  };

  if (selectedProfile) {
    const { student, complaints, rebates, bookings, events } = selectedProfile;
    return (
      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
        <button onClick={() => setSelectedProfile(null)} className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:underline mb-2 font-medium">
          <ArrowLeft size={16} /> Back to Students
        </button>

        {/* Student Header */}
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl font-serif font-bold shrink-0">
            {student.name?.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{student.name}</h2>
            <div className="flex flex-wrap gap-4 mt-2">
              {[
                { icon: Mail, v: student.email },
                { icon: Hash, v: student.enrollmentNo },
                { icon: DoorOpen, v: `Room ${student.room}` },
                { icon: BookOpen, v: student.branch },
                { icon: Phone, v: student.mobile },
              ].map(({ icon: Icon, v }) => (
                <span key={v} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-mono">
                  <Icon size={12} /> {v}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Complaints */}
        <ProfileSection icon={ClipboardList} title="Complaints" count={complaints.length}>
          {complaints.length === 0 ? <EmptyRow text="No complaints filed" /> : complaints.map((c: any) => (
            <div key={c._id} className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-b border-gray-50 dark:border-white/5 last:border-0 text-sm">
              <div><p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">ID</p><p className="font-mono font-bold text-gray-900 dark:text-white">{c.complaintId || c._id?.slice(-6)}</p></div>
              <div><p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Category</p><p className="text-gray-700 dark:text-gray-300">{c.category}</p></div>
              <div className="sm:col-span-2"><p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Description</p><p className="text-gray-700 dark:text-gray-300 truncate">{c.description}</p></div>
              <div><Badge text={c.status} color={statusColor(c.status)} /></div>
              <div className="text-xs text-gray-400 font-mono">{c.date}</div>
            </div>
          ))}
        </ProfileSection>

        {/* Events Registered */}
        <ProfileSection icon={Calendar} title="Events Registered" count={events.length}>
          {events.length === 0 ? <EmptyRow text="No event registrations" /> : events.map((e: any) => (
            <div key={e._id} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-white/5 last:border-0">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{e.title}</p>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{e.date} · {e.category}</p>
              </div>
              <Badge text={e.status} color={statusColor(e.status)} />
            </div>
          ))}
        </ProfileSection>

        {/* Guest Bookings */}
        <ProfileSection icon={DoorOpen} title="Guest Room Bookings" count={bookings.length}>
          {bookings.length === 0 ? <EmptyRow text="No guest room bookings" /> : bookings.map((b: any) => (
            <div key={b._id} className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-b border-gray-50 dark:border-white/5 last:border-0 text-sm">
              <div><p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Guest</p><p className="font-semibold text-gray-900 dark:text-white">{b.guestName}</p><p className="text-xs text-gray-500">{b.relation}</p></div>
              <div><p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Room Type</p><p>{b.roomType}</p></div>
              <div><p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Check-in → Out</p><p className="font-mono text-xs">{b.checkIn} → {b.checkOut}</p></div>
              <div><Badge text={b.status} color={statusColor(b.status)} /></div>
            </div>
          ))}
        </ProfileSection>

        {/* Mess Rebates */}
        <ProfileSection icon={Coffee} title="Mess Rebate Requests" count={rebates.length}>
          {rebates.length === 0 ? <EmptyRow text="No rebate requests" /> : rebates.map((r: any) => (
            <div key={r._id} className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-b border-gray-50 dark:border-white/5 last:border-0 text-sm">
              <div><p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Period</p><p className="font-mono text-xs">{r.fromDate} → {r.toDate}</p></div>
              <div className="sm:col-span-2"><p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Reason</p><p className="text-gray-700 dark:text-gray-300">{r.reason}</p></div>
              <div><Badge text={r.status} color={statusColor(r.status)} /></div>
            </div>
          ))}
        </ProfileSection>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text" placeholder="Search by name, enrollment, room…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm"
          />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={14} /></button>}
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{students.length} shown</span>
          <CSVExportButton data={students} filename="students_list" />
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-max">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/5">
              {['Name', 'Enrollment', 'Room', 'Branch', 'Year', 'Email', 'Mobile', ''].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-[10px] font-mono text-gray-400 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-5 py-3 font-semibold text-gray-900 dark:text-white whitespace-nowrap">{s.name}</td>
                <td className="px-5 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{s.enrollmentNo}</td>
                <td className="px-5 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">{s.room}</td>
                <td className="px-5 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">{s.branch}</td>
                <td className="px-5 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap">{s.year}</td>
                <td className="px-5 py-3 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">{s.email}</td>
                <td className="px-5 py-3 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">{s.mobile}</td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <button onClick={() => handleViewProfile(s._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 text-xs font-bold hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">
                    <User size={12} /> Profile <ChevronRight size={12} />
                  </button>
                </td>
              </tr>
            ))}
            {loading && (
              <tr><td colSpan={8} className="py-8 text-center text-sm text-gray-400">Loading...</td></tr>
            )}
            {!loading && students.length === 0 && (
              <tr><td colSpan={8} className="py-16 text-center text-sm text-gray-400">No students found.</td></tr>
            )}
          </tbody>
        </table>

        {page < totalPages && (
          <div className="p-4 text-center border-t border-gray-50 dark:border-white/5">
            <button onClick={() => setPage(p => p + 1)} disabled={loading}
              className="px-6 py-2 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition-all disabled:opacity-60">
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>

      {profileLoading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-8 text-gray-900 dark:text-white font-semibold">Loading profile…</div>
        </div>
      )}
    </div>
  );
};

const ProfileSection = ({ icon: Icon, title, count, children }: any) => (
  <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 p-6 shadow-sm">
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400"><Icon size={16} /></div>
      <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
      <span className="ml-auto text-[10px] font-mono text-gray-400 uppercase tracking-widest">{count} records</span>
    </div>
    {children}
  </div>
);

const EmptyRow = ({ text }: { text: string }) => (
  <p className="text-sm text-gray-400 italic py-4 text-center">{text}</p>
);
