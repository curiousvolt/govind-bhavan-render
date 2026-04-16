import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';

export const About = () => {
  const team = [
    { name: "Raunak Kumar",      role: "BHAWAN SECRETARY",      img: "https://picsum.photos/200/200?random=40", email: "raunak@iitr.ac.in",    phone: "+91 9876543210" },
    { name: "Yash Gehlot",       role: "MESS SECRETARY",         img: "https://picsum.photos/200/200?random=41", email: "yash@iitr.ac.in",      phone: "+91 9876543211" },
    { name: "Abhishek Mittal",   role: "MAINTENANCE SECRETARY",  img: "https://picsum.photos/200/200?random=42", email: "abhishek@iitr.ac.in",  phone: "+91 9876543212" },
    { name: "Lakshay Data",      role: "TECHNICAL SECRETARY",    img: "https://picsum.photos/200/200?random=43", email: "lakshay@iitr.ac.in",   phone: "+91 9876543213" },
    { name: "Dinesh Choudhary",  role: "SPORTS SECRETARY",       img: "https://picsum.photos/200/200?random=44", email: "dinesh@iitr.ac.in",    phone: "+91 9876543214" },
    { name: "Aditya Verma",      role: "WELLNESS SECRETARY",     img: "https://picsum.photos/200/200?random=45", email: "aditya@iitr.ac.in",    phone: "+91 9876543215" },
    { name: "Mahendra Prajapati",role: "CULTURAL SECRETARY",     img: "https://picsum.photos/200/200?random=46", email: "mahendra@iitr.ac.in",  phone: "+91 9876543216" },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#fafafa] dark:bg-[#161616]">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Intro */}
        <FadeIn className="text-center max-w-3xl mx-auto mb-32">
          <span className="text-primary-600 dark:text-primary-400 text-xs font-mono tracking-widest uppercase mb-4 block">Our Story</span>
          <h1 className="text-5xl md:text-6xl font-serif font-medium text-gray-900 dark:text-white mb-6">About Govind Bhavan</h1>
          <div className="w-24 h-0.5 bg-primary-500 mx-auto mb-8" />
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Discover the rich history, values, and the people who make Govind Bhavan a home away from home.
          </p>
        </FadeIn>

        {/* Timeline */}
        <section className="mb-32">
          <FadeIn>
            <h2 className="text-3xl font-serif font-medium text-gray-900 dark:text-white mb-16 text-center">A Journey Through Time</h2>
          </FadeIn>
          
          <div className="relative max-w-4xl mx-auto px-4 md:px-0">
            {/* Center Line */}
            <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800" />

            <div className="space-y-16 md:space-y-24">
              {/* Item 1 */}
              <FadeIn direction="right" className="relative flex flex-col md:flex-row items-start md:items-center justify-between w-full">
                <div className="w-full md:w-5/12 pl-16 md:pl-0 md:pr-8 md:text-right order-2 md:order-1">
                  <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      The foundation stone was laid by Shrimati Durgabhai Deshmukh, Chairman, Social Welfare Board on 25th April, 1957.
                    </p>
                  </div>
                </div>
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 top-6 md:top-1/2 md:-translate-y-1/2 w-3 h-3 rounded-full bg-primary-500 ring-4 ring-[#fafafa] dark:ring-[#161616] z-10" />
                <div className="hidden md:block md:w-5/12 order-3" />
              </FadeIn>

              {/* Item 2 */}
              <FadeIn direction="left" className="relative flex flex-col md:flex-row items-start md:items-center justify-between w-full">
                <div className="hidden md:block md:w-5/12 order-1" />
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 top-6 md:top-1/2 md:-translate-y-1/2 w-3 h-3 rounded-full bg-primary-500 ring-4 ring-[#fafafa] dark:ring-[#161616] z-10" />
                <div className="w-full md:w-5/12 pl-16 md:pl-8 order-2 md:order-3">
                  <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <span className="text-primary-600 dark:text-primary-400 font-medium mb-2 block">1958</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Inauguration</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Govind Bhawan was subsequently opened by Shri Hafiz Muhammed Ibrahim, Union Minister of Irrigation and Power on April 16, 1958.
                    </p>
                  </div>
                </div>
              </FadeIn>

              {/* Item 3 */}
              <FadeIn direction="right" className="relative flex flex-col md:flex-row items-start md:items-center justify-between w-full">
                <div className="w-full md:w-5/12 pl-16 md:pl-0 md:pr-8 md:text-right order-2 md:order-1">
                  <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <span className="text-primary-600 dark:text-primary-400 font-medium mb-2 block">Legacy</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Pandit Govind Ballabh Pant</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Named after the renowned freedom fighter born on September 10, 1887, in Khut village, Almora. His grandfather, Bandri Dutt Joshi, played a significant part in moulding his political views.
                    </p>
                  </div>
                </div>
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 top-6 md:top-1/2 md:-translate-y-1/2 w-3 h-3 rounded-full bg-primary-500 ring-4 ring-[#fafafa] dark:ring-[#161616] z-10" />
                <div className="hidden md:block md:w-5/12 order-3" />
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-32 text-center">
          <FadeIn>
            <p className="text-gray-500 dark:text-gray-400 mb-12">The principles that guide our community.</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <FadeIn delay={0.1}>
              <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white mb-3">Brotherhood</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Fostering lifelong bonds and mutual support among residents.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white mb-3">Excellence</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Striving for the highest standards in academics and extracurriculars.</p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Administration */}
        <section className="mb-32">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-medium text-gray-900 dark:text-white mb-2">Bhawan Administration</h2>
              <p className="text-gray-500 dark:text-gray-400">Meet the team dedicated to your welfare.</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <FadeIn delay={0.1}>
              <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col items-center text-center">
                <img src="https://picsum.photos/200/200?random=20" alt="Chief Warden" className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-primary-50 dark:ring-primary-900/20" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Bishnu Prasad Das</h3>
                <span className="text-xs font-mono text-primary-600 dark:text-primary-400 mt-1 uppercase tracking-wider">Chief Warden</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col items-center text-center">
                <img src="https://picsum.photos/200/200?random=21" alt="Warden" className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-primary-50 dark:ring-primary-900/20" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Neetesh Kumar</h3>
                <span className="text-xs font-mono text-primary-600 dark:text-primary-400 mt-1 uppercase tracking-wider">Warden</span>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Student Council */}
        <section className="mb-20">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-medium text-gray-900 dark:text-white mb-2">Student Council</h2>
              <p className="text-gray-500 dark:text-gray-400">The student representatives of Govind Bhawan.</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={i}>
                <FadeIn delay={i * 0.05}>
                  <div className="group relative bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col items-center text-center overflow-hidden">
                    <img src={member.img} alt={member.name} className="w-20 h-20 rounded-full object-cover mb-4 ring-4 ring-gray-50 dark:ring-white/5 transition-transform duration-500 group-hover:scale-110" />
                    <h4 className="font-bold text-gray-900 dark:text-white">{member.name}</h4>
                    <span className="text-xs font-mono text-primary-600 dark:text-primary-400 mt-2 uppercase tracking-wider">{member.role}</span>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4">{member.name}</h4>
                      <div className="space-y-3 w-full">
                        <a href={`mailto:${member.email}`} className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                          <Mail size={16} />
                          <span className="truncate">{member.email}</span>
                        </a>
                        <a href={`tel:${member.phone}`} className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                          <Phone size={16} />
                          <span>{member.phone}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
