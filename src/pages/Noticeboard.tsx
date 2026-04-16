import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { NoticeCard } from '../components/NoticeCard';
import { useNotice } from '../context/NoticeContext';
import { FadeIn } from '../components/FadeIn';
import { cn } from '../utils/cn';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';

export const Noticeboard = () => {
  const { notices } = useNotice();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const categories = ['All', 'Event', 'Academic', 'Sports', 'Maintenance', 'General'];

  const filteredNotices = useMemo(() => {
    return notices.filter(notice => {
      const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            notice.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || notice.category === activeCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [notices, searchQuery, activeCategory]);

  // Calendar logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday
  const endDate = new Date(monthEnd);
  if (endDate.getDay() !== 6) {
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // End on Saturday
  }

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Find days with events
  const daysWithEvents = notices.map(n => new Date(n.date).toDateString());

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#fafafa] dark:bg-[#161616]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <FadeIn className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-primary-600 dark:text-primary-400 text-xs font-mono tracking-widest uppercase mb-4 block">Stay Informed</span>
          <h1 className="text-5xl md:text-6xl font-serif font-medium text-gray-900 dark:text-white mb-6">Noticeboard</h1>
          <div className="w-24 h-0.5 bg-primary-500 mx-auto mb-8" />
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Important updates, announcements, and events for the residents of Govind Bhavan.
          </p>
        </FadeIn>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Notices */}
          <div className="lg:w-2/3">
            {/* Filters & Search */}
            <FadeIn delay={0.1} className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
              <div className="flex overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      "px-5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap border",
                      activeCategory === category 
                        ? "bg-primary-600 text-white border-primary-600" 
                        : "bg-white dark:bg-[#1e1e1e] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/5 hover:border-primary-500"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search notices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1e1e1e] dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
                />
              </div>
            </FadeIn>

            {/* Notices Grid */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {filteredNotices.map((notice, i) => (
                  <div key={notice.id}>
                    <FadeIn delay={i * 0.05}>
                      <NoticeCard notice={notice} />
                    </FadeIn>
                  </div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredNotices.length === 0 && (
              <FadeIn className="text-center py-20 bg-white dark:bg-[#1e1e1e] rounded-3xl border border-gray-100 dark:border-white/5 mt-6">
                <p className="text-gray-500 dark:text-gray-400">No notices found matching your criteria.</p>
              </FadeIn>
            )}
          </div>

          {/* Right Column: Calendar */}
          <div className="lg:w-1/3">
            <FadeIn delay={0.2} className="sticky top-32">
              <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-serif font-medium text-gray-900 dark:text-white">
                    {format(currentMonth, 'MMMM yyyy')}
                  </h2>
                  <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-600 dark:text-gray-300">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-600 dark:text-gray-300">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-y-4 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-400 dark:text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-y-2">
                  {calendarDays.map((day, i) => {
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const hasEvent = daysWithEvents.includes(day.toDateString());
                    const isTodayDate = isToday(day);

                    return (
                      <div key={i} className="flex justify-center">
                        <div className={cn(
                          "w-8 h-8 flex items-center justify-center rounded-full text-sm relative",
                          !isCurrentMonth ? "text-gray-300 dark:text-gray-700" : "text-gray-700 dark:text-gray-300",
                          isTodayDate && "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-bold",
                          hasEvent && !isTodayDate && "font-bold text-gray-900 dark:text-white"
                        )}>
                          {format(day, 'd')}
                          {hasEvent && (
                            <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary-500" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Upcoming Events</h3>
                  <div className="space-y-4">
                    {notices.filter(n => new Date(n.date) >= new Date()).slice(0, 3).map(notice => (
                      <div key={notice.id} className="flex gap-4 items-start">
                        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 shrink-0">
                          <span className="text-xs font-medium text-primary-600 dark:text-primary-400">{format(new Date(notice.date), 'MMM')}</span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white leading-none">{format(new Date(notice.date), 'dd')}</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{notice.title}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{notice.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </FadeIn>
          </div>
        </div>

      </div>
    </div>
  );
};
