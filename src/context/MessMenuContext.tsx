import React, { createContext, useContext, useState, useEffect } from 'react';
import * as messApi from '../api/messmenu';
import { useAuth } from './AuthContext';
import { format, addDays, startOfWeek, parseISO } from 'date-fns';

export interface DayMenu {
  day: string;
  date: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

export interface WeekMenuData {
  _id?: string;
  weekStart: string;
  weekEnd: string;
  weekLabel: string;
  days: DayMenu[];
}

export interface DailyVotes {
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
}

interface MessMenuContextType {
  currentWeek: WeekMenuData | null;
  allWeeks: WeekMenuData[];
  getMenuForDay: (day: string) => DayMenu | undefined;
  getMenuForToday: () => DayMenu | undefined;
  upsertWeek: (weekStart: string, days: DayMenu[]) => Promise<void>;
  loadWeekByDate: (date: string) => Promise<void>;
  getVotesForDate: (date: string) => DailyVotes;
  voteMenu: (date: string, voteType: 'up' | 'down') => Promise<void>;
  // Legacy compat for student MessMenuTab
  weeklyMenu: { day: string; breakfast: string; lunch: string; snacks: string; dinner: string }[];
  updateMenu: (day: string, menuData: any) => Promise<void>;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const MessMenuContext = createContext<MessMenuContextType | undefined>(undefined);

export const MessMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentWeek, setCurrentWeek] = useState<WeekMenuData | null>(null);
  const [allWeeks, setAllWeeks] = useState<WeekMenuData[]>([]);
  const [dailyVotes, setDailyVotes] = useState<Record<string, DailyVotes>>({});
  const { user } = useAuth();

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    Promise.all([
      messApi.getWeeklyMenu(today),
      messApi.getAllWeeks(),
    ]).then(([week, all]) => {
      setCurrentWeek(week);
      setAllWeeks(all);
    }).catch(console.error);
  }, []);

  const loadWeekByDate = async (date: string) => {
    const week = await messApi.getWeeklyMenu(date);
    setCurrentWeek(week);
  };

  const getMenuForDay = (day: string): DayMenu | undefined => {
    return currentWeek?.days.find(d => d.day === day);
  };

  const getMenuForToday = (): DayMenu | undefined => {
    const todayName = DAY_NAMES[new Date().getDay()];
    return getMenuForDay(todayName);
  };

  const upsertWeek = async (weekStart: string, days: DayMenu[]) => {
    const updated = await messApi.upsertWeekMenu(weekStart, days);
    setCurrentWeek(updated);
    setAllWeeks(prev => {
      const idx = prev.findIndex(w => w.weekStart === weekStart);
      if (idx >= 0) { const next = [...prev]; next[idx] = updated; return next; }
      return [updated, ...prev];
    });
  };

  const fetchVotes = async (date: string) => {
    const result = await messApi.getVotes(date, user?._id);
    setDailyVotes(prev => ({ ...prev, [date]: result }));
  };

  const getVotesForDate = (date: string): DailyVotes => {
    if (!dailyVotes[date]) {
      fetchVotes(date);
      return { upvotes: 0, downvotes: 0, userVote: null };
    }
    return dailyVotes[date];
  };

  const voteMenu = async (date: string, voteType: 'up' | 'down') => {
    if (!user?._id) return;
    const result = await messApi.castVote(date, user._id, voteType);
    setDailyVotes(prev => ({ ...prev, [date]: result }));
  };

  // Legacy compat for student MessMenuTab
  const weeklyMenu = (currentWeek?.days ?? DAYS.map(day => ({
    day, date: '', breakfast: '', lunch: '', snacks: '', dinner: ''
  }))).map(d => ({ day: d.day, breakfast: d.breakfast, lunch: d.lunch, snacks: d.snacks, dinner: d.dinner }));

  const updateMenu = async (day: string, menuData: any) => {
    if (!currentWeek) return;
    const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekStart = format(monday, 'yyyy-MM-dd');
    const updatedDays = currentWeek.days.map(d => d.day === day ? { ...d, ...menuData } : d);
    await upsertWeek(weekStart, updatedDays);
  };

  return (
    <MessMenuContext.Provider value={{ currentWeek, allWeeks, getMenuForDay, getMenuForToday, upsertWeek, loadWeekByDate, getVotesForDate, voteMenu, weeklyMenu, updateMenu }}>
      {children}
    </MessMenuContext.Provider>
  );
};

export const useMessMenu = () => {
  const ctx = useContext(MessMenuContext);
  if (!ctx) throw new Error('useMessMenu must be used within a MessMenuProvider');
  return ctx;
};
