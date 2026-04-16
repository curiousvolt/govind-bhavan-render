import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, Coffee, Moon, Dumbbell, Trophy, BookOpen, Users, Medal, ThumbsUp, ThumbsDown } from 'lucide-react';
import { FacilityCard } from '../components/FacilityCard';
import { FadeIn } from '../components/FadeIn';
import { cn } from '../utils/cn';
import { useMessMenu } from '../context/MessMenuContext';

export const Facilities = () => {
  const [activeTab, setActiveTab] = useState('mess');
  const [activeGalleryFilter, setActiveGalleryFilter] = useState('All');
  const { getMenuForToday, getVotesForDate } = useMessMenu();
  const todayMenu = getMenuForToday();
  const todayVotes = getVotesForDate(new Date().toISOString().split('T')[0]);

  const tabs = [
    { id: 'mess', label: 'Mess', icon: Utensils },
    { id: 'canteen', label: 'Canteens', icon: Coffee },
    { id: 'sports', label: 'Sports & Gym', icon: Trophy },
    { id: 'study', label: 'Study & Common', icon: BookOpen },
  ];

  const galleryFilters = ['All', 'Sports', 'Cultural', 'Events'];
  
  const galleryImages = [
    { src: 'https://picsum.photos/600/400?random=30', category: 'Sports', title: 'Inter-Bhawan Cricket Champions' },
    { src: 'https://picsum.photos/400/600?random=31', category: 'Cultural', title: 'Diwali Celebration 2024' },
    { src: 'https://picsum.photos/600/600?random=32', category: 'Events', title: 'Alumni Meet' },
    { src: 'https://picsum.photos/400/400?random=33', category: 'Sports', title: 'Volleyball Tournament' },
    { src: 'https://picsum.photos/600/400?random=34', category: 'Cultural', title: "Fresher's Party" },
    { src: 'https://picsum.photos/400/600?random=35', category: 'Sports', title: 'Athletics Meet' },
  ];

  const filteredGallery = activeGalleryFilter === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeGalleryFilter);

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#fafafa] dark:bg-[#161616]">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <FadeIn className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-primary-600 dark:text-primary-400 text-xs font-mono tracking-widest uppercase mb-4 block">Active Living</span>
          <h1 className="text-5xl md:text-6xl font-serif font-medium text-gray-900 dark:text-white mb-6">Facilities & Lifestyle</h1>
          <div className="w-24 h-0.5 bg-primary-500 mx-auto mb-8" />
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            State-of-the-art facilities to keep you active, competitive, and healthy, ensuring a comfortable stay at Govind Bhavan.
          </p>
        </FadeIn>

        {/* Tabs */}
        <FadeIn delay={0.1} className="flex overflow-x-auto pb-4 mb-12 hide-scrollbar justify-start md:justify-center">
          <div className="flex gap-2 p-1.5 bg-white dark:bg-[#1e1e1e] rounded-full border border-gray-200 dark:border-white/5 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                  activeTab === tab.id ? "text-white" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="facility-tab"
                    className="absolute inset-0 bg-primary-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <tab.icon size={16} />
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Content */}
        <div className="min-h-[400px] mb-32">
          <AnimatePresence mode="wait">
            {activeTab === 'mess' && (
              <motion.div
                key="mess"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <FacilityCard 
                  title="Main Mess" 
                  description="Spacious dining hall serving nutritious meals four times a day. Features a diverse menu catering to different regional tastes."
                  icon={Utensils}
                  timing="Breakfast: 7:30-9:30 AM | Lunch: 12:30-2:30 PM | Dinner: 7:30-9:30 PM"
                  image="https://picsum.photos/seed/mess/800/400"
                />
                <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Today's Menu</h3>
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-full">
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <ThumbsUp size={14} />
                        <span className="text-xs font-bold">{todayVotes.upvotes}</span>
                      </div>
                      <div className="w-px h-3 bg-gray-200 dark:bg-white/10" />
                      <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                        <ThumbsDown size={14} />
                        <span className="text-xs font-bold">{todayVotes.downvotes}</span>
                      </div>
                    </div>
                  </div>
                  {todayMenu ? (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/5 pb-4">
                        <span className="font-medium text-gray-900 dark:text-gray-200">Breakfast</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm text-right max-w-[60%]">{todayMenu.breakfast}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/5 pb-4">
                        <span className="font-medium text-gray-900 dark:text-gray-200">Lunch</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm text-right max-w-[60%]">{todayMenu.lunch}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/5 pb-4">
                        <span className="font-medium text-gray-900 dark:text-gray-200">Snacks</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm text-right max-w-[60%]">{todayMenu.snacks}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900 dark:text-gray-200">Dinner</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm text-right max-w-[60%]">{todayMenu.dinner}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400 italic">Menu not updated for today yet.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'canteen' && (
              <motion.div
                key="canteen"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <FacilityCard 
                  title="Day Canteen" 
                  description="Perfect spot for quick bites between classes. Offers a variety of snacks, beverages, and light meals."
                  icon={Coffee}
                  timing="8:00 AM - 10:00 PM"
                  image="https://picsum.photos/seed/canteen/800/400"
                  delay={0.1}
                />
                <FacilityCard 
                  title="Night Canteen" 
                  description="Your savior during late-night study sessions. Serves hot noodles, parathas, sandwiches, and beverages."
                  icon={Moon}
                  timing="10:00 PM - 2:00 AM"
                  image="https://picsum.photos/seed/nightcanteen/800/400"
                  delay={0.2}
                />
              </motion.div>
            )}

            {activeTab === 'sports' && (
              <motion.div
                key="sports"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                <FacilityCard 
                  title="Gymnasium" 
                  description="Fully equipped modern gym with cardio machines, free weights, and strength training equipment."
                  icon={Dumbbell}
                  timing="6:00 AM - 9:00 PM"
                  delay={0.1}
                />
                <FacilityCard 
                  title="Indoor Sports" 
                  description="Facilities for Table Tennis, Badminton, Chess, and Carrom. Equipment available at the sports room."
                  icon={Trophy}
                  timing="24/7 Access"
                  delay={0.2}
                />
                <FacilityCard 
                  title="Outdoor Courts" 
                  description="Well-maintained Basketball and Volleyball courts with floodlights for evening play."
                  icon={Users}
                  timing="6:00 AM - 10:00 PM"
                  delay={0.3}
                />
              </motion.div>
            )}

            {activeTab === 'study' && (
              <motion.div
                key="study"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <FacilityCard 
                  title="Study Rooms" 
                  description="Two air-conditioned, quiet study rooms with comfortable seating and high-speed Wi-Fi. Capacity of 20 students each."
                  icon={BookOpen}
                  timing="24/7 Access"
                  image="https://picsum.photos/seed/study/800/400"
                  delay={0.1}
                />
                <FacilityCard 
                  title="Common Room" 
                  description="Relaxation area with a large TV, comfortable sofas, daily newspapers, and magazines."
                  icon={Users}
                  timing="8:00 AM - 12:00 AM"
                  image="https://picsum.photos/seed/common/800/400"
                  delay={0.2}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Achievements & Gallery */}
        <section className="mb-20">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl font-serif font-medium text-gray-900 dark:text-white mb-4">Life At Govind Bhawan</h2>
            <p className="text-gray-500 dark:text-gray-400">A glimpse into our vibrant community and proud achievements.</p>
          </FadeIn>


          {/* Achievements Strip */}
          <FadeIn delay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { label: 'Total Trophies', value: '24+', icon: Trophy, colorClass: 'text-yellow-500', bgClass: 'bg-yellow-50 dark:bg-yellow-900/20' },
              { label: 'Gold Medals', value: '12', icon: Medal, colorClass: 'text-yellow-500', bgClass: 'bg-yellow-50 dark:bg-yellow-900/20' },
              { label: 'Silver Medals', value: '8', icon: Medal, colorClass: 'text-slate-400', bgClass: 'bg-slate-50 dark:bg-slate-800/50' },
              { label: 'Bronze Medals', value: '15', icon: Medal, colorClass: 'text-orange-500', bgClass: 'bg-orange-50 dark:bg-orange-900/20' },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-full ${stat.bgClass} flex items-center justify-center mb-3 ${stat.colorClass}`}>
                  <stat.icon size={24} />
                </div>
                <h3 className={`text-4xl font-serif font-bold mb-1 ${stat.colorClass}`}>{stat.value}</h3>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </FadeIn>

          {/* Gallery Filters */}
          <FadeIn delay={0.2} className="flex flex-wrap justify-center gap-4 mb-10">
            {galleryFilters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveGalleryFilter(filter)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-colors border",
                  activeGalleryFilter === filter 
                    ? "bg-primary-600 text-white border-primary-600" 
                    : "bg-transparent text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary-600 dark:hover:border-primary-500"
                )}
              >
                {filter}
              </button>
            ))}
          </FadeIn>

          {/* Gallery Grid */}
          <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
            <AnimatePresence>
              {filteredGallery.map((img, i) => (
                <motion.div
                  key={img.src}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative group rounded-2xl overflow-hidden break-inside-avoid"
                >
                  <img src={img.src} alt={img.title} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-primary-400 text-xs font-mono uppercase tracking-wider mb-2">{img.category}</span>
                    <h3 className="text-white font-medium text-lg">{img.title}</h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

      </div>
    </div>
  );
};
