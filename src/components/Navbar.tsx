import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../utils/cn';
import { Logo } from './Logo';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Notices', path: '/noticeboard' },
  ];

  return (
    <motion.nav
      layout
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={cn(
        'fixed top-6 z-50 w-[95%] max-w-6xl inset-x-0 mx-auto',
        'backdrop-blur-xl border',
        isMobileMenuOpen ? 'rounded-[2rem]' : 'rounded-full',
        isDarkMode ? 'bg-[#1a1a1a]/80 border-white/10' : 'bg-white/80 border-gray-200 shadow-sm'
      )}
    >
      <div className="px-6 md:px-8 py-2.5 md:py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Logo size="md" />
          <span className=" font-bold text-xl tracking-tight dark:text-white hidden sm:block">Govind Bhavan</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => cn(
                'relative text-sm font-medium transition-colors',
                isActive 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              {({ isActive }) => (
                <>
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="active-dot"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <div className="hidden md:block">
            {isAuthenticated ? (
              <Link
                to={role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                className="flex items-center gap-2 px-5 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <User size={16} />
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2 text-gray-600 dark:text-gray-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden rounded-b-[2rem]"
          >
            <div className="px-6 py-5 flex flex-col gap-2 bg-white dark:bg-[#1a1a1a] border-t border-gray-100 dark:border-white/5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    'px-5 py-2.5 rounded-2xl text-sm font-medium transition-all',
                    isActive 
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                  )}
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="pt-1">
                {isAuthenticated ? (
                  <Link
                    to={role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-sm font-medium"
                  >
                    <User size={16} />
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center px-5 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-sm font-medium"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
