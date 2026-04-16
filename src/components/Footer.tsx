import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, MapPin, Phone, Instagram, Facebook, Twitter, Linkedin, ArrowUpRight } from 'lucide-react';
import { Logo } from './Logo';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#111111] border-t border-gray-100 dark:border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <Logo size="md" className="group-hover:scale-110 transition-transform shadow-lg shadow-primary-600/20" />
              <span className=" font-bold text-xl tracking-tight dark:text-white">Govind Bhawan</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs leading-relaxed text-base">
              A legacy of excellence and brotherhood at the Indian Institute of Technology Roorkee. Since 1957.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Facebook, label: 'Facebook' },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3 }}
                  className="w-9 h-9 rounded-full border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-600/30 transition-colors bg-gray-50/50 dark:bg-white/5"
                  aria-label={social.label}
                >
                  <social.icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-mono text-[10px] font-bold tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-6 uppercase">Navigation</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'About Us', path: '/about' },
                  { name: 'Facilities', path: '/facilities' },
                  { name: 'Noticeboard', path: '/noticeboard' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1 group">
                      {link.name}
                      <ArrowUpRight size={10} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-[10px] font-bold tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-6 uppercase">Resources</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Student Login', path: '/login' },
                  { name: 'Complaints', path: '/login' },
                  { name: 'Mess Rebate', path: '/login' },
                  { name: 'Guest Rooms', path: '/login' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1 group">
                      {link.name}
                      <ArrowUpRight size={10} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h3 className="font-mono text-[10px] font-bold tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-6 uppercase">Contact</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Govind Bhavan, IIT Roorkee<br />Uttarakhand 247667
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                    <Mail size={16} />
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 break-all">
                    govindbhawan@iitr.ac.in
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
            © {currentYear} Govind Bhawan, IIT Roorkee.
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium flex items-center gap-2">
            Developed with <span className="text-red-500">♥</span> by Team Govind
          </p>
        </div>
      </div>
    </footer>
  );
};
