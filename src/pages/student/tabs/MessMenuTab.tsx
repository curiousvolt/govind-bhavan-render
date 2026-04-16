import React, { useState } from 'react';
import { Calendar, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useMessMenu } from '../../../context/MessMenuContext';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

export const MessMenuTab = ({ searchQuery = '' }: { searchQuery?: string }) => {
  const { getMenuForDay, getVotesForDate, voteMenu } = useMessMenu();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const dateObj = new Date(selectedDate);
  const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = DAYS_OF_WEEK[dateObj.getDay()];

  const menu = getMenuForDay(dayOfWeek);
  const votes = getVotesForDate(selectedDate);
  const userVote = votes.userVote;

  const handleVote = async (type: 'up' | 'down') => {
    if (!user) return;
    try {
      await voteMenu(selectedDate, type);
    } catch (err) {
      toast.error('Failed to cast vote');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Mess Menu</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">View and vote on daily meals</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-48">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 p-8 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
        {menu ? (
          <div className="space-y-8">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white">{dayOfWeek}'s Menu</h4>
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 p-2 rounded-xl">
                <button
                  onClick={() => handleVote('up')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    userVote === 'up' 
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' 
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  <ThumbsUp size={16} />
                  <span className="text-xs font-bold">{votes.upvotes}</span>
                </button>
                <div className="w-px h-4 bg-gray-200 dark:bg-white/10" />
                <button
                  onClick={() => handleVote('down')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    userVote === 'down' 
                      ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  <ThumbsDown size={16} />
                  <span className="text-xs font-bold">{votes.downvotes}</span>
                </button>
              </div>
            </div>

            {(['breakfast', 'lunch', 'snacks', 'dinner'] as const).map((meal) => (
              <div key={meal} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-50 dark:border-white/5 last:border-0 last:pb-0">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white capitalize mb-2">{meal}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{menu[meal]}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-gray-200 dark:text-white/5 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 italic">Menu not available for this date.</p>
          </div>
        )}
      </div>
    </div>
  );
};
