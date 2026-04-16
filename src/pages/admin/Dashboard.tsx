import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useComplaint } from '../../context/ComplaintContext';
import { useNotice } from '../../context/NoticeContext';
import { LayoutDashboard, Users, AlertCircle, FileText, Home, Bell, Calendar, LogOut, Menu, X, HelpCircle, Globe, Info, Building, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useTheme } from '../../hooks/useTheme';
import { Logo } from '../../components/Logo';

// Tabs
import { OverviewTab } from './tabs/OverviewTab';
import { StudentsTab } from './tabs/StudentsTab';
import { ComplaintsTab } from './tabs/ComplaintsTab';
import { MessRebatesTab } from './tabs/MessRebatesTab';
import { GuestRoomsTab } from './tabs/GuestRoomsTab';
import { NoticesTab } from './tabs/NoticesTab';
import { EventsTab } from './tabs/EventsTab';
import { MessMenuTab } from './tabs/MessMenuTab';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { complaints } = useComplaint();
  const { notices } = useNotice();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { isDarkMode, toggleTheme } = useTheme();

  const recentNotifications = [
    ...complaints.map(c => ({ ...c, type: 'complaint' as const, date: c.date })),
    ...notices.map(n => ({ ...n, type: 'notice' as const, date: n.date }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'complaints', label: 'Complaints', icon: AlertCircle },
    { id: 'rebates', label: 'Mess Rebates', icon: FileText },
    { id: 'guestrooms', label: 'Guest Rooms', icon: Home },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'messmenu', label: 'Mess Menu', icon: FileText },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab searchQuery={searchQuery} />;
      case 'students': return <StudentsTab searchQuery={searchQuery} />;
      case 'complaints': return <ComplaintsTab searchQuery={searchQuery} />;
      case 'rebates': return <MessRebatesTab searchQuery={searchQuery} />;
      case 'guestrooms': return <GuestRoomsTab searchQuery={searchQuery} />;
      case 'notices': return <NoticesTab searchQuery={searchQuery} />;
      case 'events': return <EventsTab searchQuery={searchQuery} />;
      case 'messmenu': return <MessMenuTab searchQuery={searchQuery} />;
      default: return <OverviewTab searchQuery={searchQuery} />;
    }
  };

  const getTabTitle = () => {
    const tab = navItems.find(t => t.id === activeTab);
    return tab ? tab.label : 'Dashboard';
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-gray-50 dark:bg-[#121212] font-[family-name:var(--font-dashboard)]">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#1a1a1a] border-r border-gray-200 dark:border-white/5 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0",
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo area */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-white/5 shrink-0">
          <Logo size="sm" />
          <span className="ml-3 font-semibold text-lg text-gray-900 dark:text-white tracking-tight">Govind Bhawan</span>
          <button className="ml-auto lg:hidden text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 p-1.5 rounded-lg" onClick={() => setIsMobileSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 hide-scrollbar">
          <div className="px-3 mb-6">
            <p className="px-3 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Dashboard</p>
            <nav className="flex flex-col gap-0.5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsMobileSidebarOpen(false); }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    activeTab === item.id 
                      ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <item.icon size={18} className={cn(
                    "shrink-0",
                    activeTab === item.id ? "text-primary-600 dark:text-primary-400" : "text-gray-400 dark:text-gray-500"
                  )} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="px-3">
            <p className="px-3 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Quick Links</p>
            <nav className="flex flex-col gap-0.5">
              <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                <Globe size={18} className="text-gray-400 dark:text-gray-500 shrink-0" /> Home
              </Link>
              <Link to="/about" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                <Info size={18} className="text-gray-400 dark:text-gray-500 shrink-0" /> About
              </Link>
              <Link to="/facilities" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                <Building size={18} className="text-gray-400 dark:text-gray-500 shrink-0" /> Facilities
              </Link>
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-white/5 shrink-0">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors w-full"
          >
            <LogOut size={18} className="shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50 dark:bg-[#121212]">
        {/* Header */}
        <header className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-gray-200 dark:border-white/5 shrink-0 bg-white dark:bg-[#121212]">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors" onClick={() => setIsMobileSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <h1 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white tracking-tight">{getTabTitle()}</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors relative"
              >
                <Bell size={18} />
                {recentNotifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#121212]"></span>
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-lg border border-gray-200 dark:border-white/10 overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-gray-100 dark:border-white/5">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto hide-scrollbar">
                      {recentNotifications.length > 0 ? (
                        recentNotifications.map((item, idx) => (
                          <div key={item.id || idx} className="p-3 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="flex items-start gap-3">
                              <div className={cn(
                                "p-1.5 rounded-md shrink-0",
                                item.type === 'complaint' ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" : "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                              )}>
                                {item.type === 'complaint' ? <AlertCircle size={14} /> : <Bell size={14} />}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{new Date(item.date).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                          No recent activity
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <div className="h-6 w-px bg-gray-200 dark:bg-white/10 mx-1" />
            
            <div className="flex items-center gap-2.5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-none">Administrator</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400 flex items-center justify-center font-bold text-sm shrink-0">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 hide-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-5xl mx-auto"
            >
              {renderTab()}
              {/* Spacer to ensure bottom padding is respected by all browsers */}
              <div className="h-24 w-full shrink-0" />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
