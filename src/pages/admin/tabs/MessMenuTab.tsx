import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Save, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useMessMenu } from '../../../context/MessMenuContext';
import { format, addDays, startOfWeek, parseISO } from 'date-fns';
import { getWeekVotes } from '../../../api/messmenu';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS = ['breakfast', 'lunch', 'snacks', 'dinner'] as const;

function getWeekDates(weekStart: string) {
  const monday = parseISO(weekStart);
  return DAYS.map((day, i) => ({
    day,
    date: format(addDays(monday, i), 'yyyy-MM-dd'),
  }));
}

function getMonday(date: Date): string {
  return format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
}

export const MessMenuTab = ({ searchQuery = '' }: { searchQuery?: string }) => {
  const { currentWeek, upsertWeek, loadWeekByDate } = useMessMenu();
  const [weekStart, setWeekStart] = useState(getMonday(new Date()));
  const [weekDates, setWeekDates] = useState(getWeekDates(getMonday(new Date())));
  const [form, setForm] = useState<Record<string, Record<string, string>>>({});
  const [voteStats, setVoteStats] = useState<Record<string, { upvotes: number; downvotes: number }>>({});
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'reviews'>('edit');

  // On weekStart change — load week from DB and fetch vote stats
  useEffect(() => {
    const dates = getWeekDates(weekStart);
    setWeekDates(dates);
    loadWeekByDate(weekStart).catch(console.error);
    getWeekVotes(weekStart).then(stats => {
      const map: Record<string, { upvotes: number; downvotes: number }> = {};
      stats.forEach((s: any) => { map[s.date] = { upvotes: s.upvotes, downvotes: s.downvotes }; });
      setVoteStats(map);
    }).catch(console.error);
  }, [weekStart]);

  // When currentWeek changes (from context), repopulate form
  useEffect(() => {
    if (currentWeek && currentWeek.weekStart === weekStart) {
      const filled: Record<string, Record<string, string>> = {};
      weekDates.forEach(({ day, date }) => {
        const dayData = currentWeek.days.find(d => d.day === day);
        filled[day] = {
          breakfast: dayData?.breakfast || '',
          lunch: dayData?.lunch || '',
          snacks: dayData?.snacks || '',
          dinner: dayData?.dinner || '',
        };
      });
      setForm(filled);
    } else if (!currentWeek) {
      const empty: Record<string, Record<string, string>> = {};
      DAYS.forEach(day => { empty[day] = { breakfast: '', lunch: '', snacks: '', dinner: '' }; });
      setForm(empty);
    }
  }, [currentWeek, weekStart, weekDates]);

  const handleSaveWeek = async () => {
    setSaving(true);
    try {
      const days = weekDates.map(({ day, date }) => ({
        day, date, ...(form[day] || { breakfast: '', lunch: '', snacks: '', dinner: '' })
      }));
      await upsertWeek(weekStart, days);
      toast.success(`Week menu saved! (${currentWeek?.weekLabel || weekStart})`);
    } catch (err) {
      toast.error('Failed to save menu');
    } finally {
      setSaving(false);
    }
  };

  const shiftWeek = (dir: number) => {
    const date = parseISO(weekStart);
    setWeekStart(format(addDays(date, dir * 7), 'yyyy-MM-dd'));
  };

  const weekLabel = currentWeek?.weekLabel || `Week of ${format(parseISO(weekStart), 'dd MMM')} – ${format(addDays(parseISO(weekStart), 6), 'dd MMM yyyy')}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Weekly Mess Menu</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Set the entire week's menu at once · stored with dates</p>
          </div>
          {/* Week Navigation */}
          <div className="flex items-center gap-3">
            <button onClick={() => shiftWeek(-1)} className="p-2 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-500/20">
              <Calendar size={14} className="text-primary-600 dark:text-primary-400" />
              <span className="text-xs font-bold text-primary-700 dark:text-primary-400 whitespace-nowrap">{weekLabel}</span>
            </div>
            <button onClick={() => shiftWeek(1)} className="p-2 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mt-6 p-1 bg-gray-100 dark:bg-white/5 rounded-xl w-fit">
          {(['edit', 'reviews'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'
              }`}>
              {tab === 'edit' ? 'Edit Menu' : 'Daily Reviews'}
            </button>
          ))}
        </div>
      </div>

      {/* EDIT MODE */}
      {activeTab === 'edit' && (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
          {/* Responsive table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5">
                  <th className="text-left px-5 py-3.5 text-[10px] font-mono text-gray-400 uppercase tracking-widest w-36">Day / Date</th>
                  {MEALS.map(m => (
                    <th key={m} className="text-left px-3 py-3.5 text-[10px] font-mono text-gray-400 uppercase tracking-widest capitalize">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weekDates.map(({ day, date }) => (
                  <tr key={day} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/3 transition-colors align-top">
                    <td className="px-5 py-3">
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{day}</p>
                      <p className="text-[10px] font-mono text-gray-400 mt-0.5">{date}</p>
                    </td>
                    {MEALS.map(meal => (
                      <td key={meal} className="px-3 py-3">
                        <textarea
                          rows={2}
                          value={form[day]?.[meal] || ''}
                          onChange={e => setForm(prev => ({ ...prev, [day]: { ...prev[day], [meal]: e.target.value } }))}
                          placeholder={`${meal} items…`}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-xs resize-none transition-all"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-5 border-t border-gray-50 dark:border-white/5 flex justify-end">
            <button onClick={handleSaveWeek} disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary-600/20 disabled:opacity-60">
              <Save size={16} />
              {saving ? 'Saving…' : 'Save Entire Week'}
            </button>
          </div>
        </div>
      )}

      {/* REVIEWS MODE */}
      {activeTab === 'reviews' && (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5">
                  <th className="text-left px-5 py-3.5 text-[10px] font-mono text-gray-400 uppercase tracking-widest">Day</th>
                  <th className="text-left px-5 py-3.5 text-[10px] font-mono text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="text-left px-5 py-3.5 text-[10px] font-mono text-gray-400 uppercase tracking-widest">Upvotes</th>
                  <th className="text-left px-5 py-3.5 text-[10px] font-mono text-gray-400 uppercase tracking-widest">Downvotes</th>
                  <th className="text-left px-5 py-3.5 text-[10px] font-mono text-gray-400 uppercase tracking-widest">Rating</th>
                </tr>
              </thead>
              <tbody>
                {weekDates.map(({ day, date }) => {
                  const stats = voteStats[date] || { upvotes: 0, downvotes: 0 };
                  const total = stats.upvotes + stats.downvotes;
                  const pct = total > 0 ? Math.round((stats.upvotes / total) * 100) : null;
                  return (
                    <tr key={day} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/3 transition-colors">
                      <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">{day}</td>
                      <td className="px-5 py-4 font-mono text-xs text-gray-500">{date}</td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                          <ThumbsUp size={14} /> {stats.upvotes}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5 text-red-500 dark:text-red-400 font-bold">
                          <ThumbsDown size={14} /> {stats.downvotes}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {pct !== null ? (
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-100 dark:bg-white/10 rounded-full h-2">
                              <div className={`h-2 rounded-full transition-all ${pct >= 60 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-400' : 'bg-red-400'}`}
                                style={{ width: `${pct}%` }} />
                            </div>
                            <span className={`text-xs font-bold ${pct >= 60 ? 'text-emerald-600' : pct >= 40 ? 'text-amber-500' : 'text-red-500'}`}>{pct}%</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No votes yet</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
