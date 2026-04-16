import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';
import { useNotice } from '../context/NoticeContext';

export const Home = () => {
  const heritageRef = useRef<HTMLDivElement>(null);
  const { notices } = useNotice();


  const scrollToHeritage = () => {
    heritageRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#161616]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden pt-32 pb-20">
        <div className="max-w-4xl mx-auto z-10">
          <FadeIn delay={0.2}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium text-gray-900 dark:text-white mb-8 md:mb-10 leading-[1.1] tracking-tight">
              Where Excellence<br />Finds Its Home.
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-10 md:mb-14 max-w-lg mx-auto leading-relaxed">
              Est. 1957 tradition, modern living. A legacy of brotherhood and academic brilliance.
            </p>
          </FadeIn>

          <FadeIn delay={0.6} className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
            <Link to="/facilities" className="w-full sm:w-auto px-10 py-4 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-medium transition-all hover:scale-105 shadow-lg shadow-primary-600/20">
              Explore Bhawan
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-10 py-4 rounded-full border border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 text-gray-900 dark:text-white font-medium transition-all hover:scale-105">
              Student Login
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Heritage Section */}
      <section ref={heritageRef} className="py-24 md:py-40 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <FadeIn direction="right" className="flex justify-center lg:justify-start">
            <div className="relative isolate max-w-sm md:max-w-md lg:max-w-lg w-full">
              {/* Decorative border offset */}
              <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-full h-full border border-primary-500/30 rounded-[1.5rem] md:rounded-[2.5rem] -z-10" />
              <img 
                src="https://picsum.photos/800/800?random=10" 
                alt="Govind Bhawan Heritage" 
                className="w-full h-auto rounded-[1.5rem] md:rounded-[2rem] object-cover shadow-2xl relative z-10"
              />
            </div>
          </FadeIn>
          
          <FadeIn direction="left">
            <div className="max-w-lg">
              <span className="text-primary-600 dark:text-primary-400 text-[10px] font-mono tracking-[0.3em] uppercase mb-4 md:mb-6 block">Our Heritage</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-gray-900 dark:text-white mb-8 md:mb-10 leading-tight">
                A Legacy of Brotherhood
              </h2>
              <div className="space-y-6 md:space-y-8">
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  Govind Bhavan is one of the oldest hostels in the campus with its foundation stone laid by Shrimati Durgabhai Deshmukh on 25th April, 1957. Named after the renowned freedom fighter Pandit Govind Ballabh Pant, it has been home to generations of IIT Roorkee's brightest minds.
                </p>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  We pride ourselves on maintaining a perfect balance between academic rigor and extracurricular excellence, fostering an environment where every resident can thrive.
                </p>
              </div>
              <Link to="/about" className="inline-flex items-center gap-3 px-8 py-3 rounded-full border border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all text-gray-900 dark:text-white font-medium mt-10 md:mt-12 group">
                Read Full History <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Latest Notices & Gallery Section */}
      <section className="py-24 md:py-40 px-6 bg-white dark:bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          
          {/* Latest Notices */}
          <div className="lg:col-span-5">
            <FadeIn>
              <div className="flex items-center justify-between mb-12 md:mb-16">
                <h2 className="text-2xl md:text-3xl font-serif font-medium text-gray-900 dark:text-white">Latest Notices</h2>
              </div>
              <div className="relative pl-8 space-y-10 md:space-y-12">
                {/* Vertical Line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-100 dark:bg-gray-800" />
                
                {notices.slice(0, 3).map((notice, i) => (
                  <div key={notice.id} className="group cursor-pointer relative">
                    {/* Dot */}
                    <div className="absolute -left-[31px] top-1.5 w-[15px] h-[15px] rounded-full bg-white dark:bg-[#1a1a1a] border-2 border-primary-500 z-10 group-hover:scale-125 transition-transform" />
                    
                    <div className="flex items-center gap-3 text-primary-600 dark:text-primary-400 text-[10px] font-mono tracking-widest uppercase mb-3">
                      {new Date(notice.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{notice.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">{notice.description}</p>
                  </div>
                ))}
                
                <Link to="/noticeboard" className="inline-flex items-center gap-3 px-8 py-3 rounded-full border border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all text-gray-900 dark:text-white font-medium mt-6 group">
                  View All Notices <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Life at Govind Gallery */}
          <div className="lg:col-span-7">
            <FadeIn delay={0.2}>

              <div className="flex items-center justify-between mb-12 md:mb-16">
                <h2 className="text-2xl md:text-3xl font-serif font-medium text-gray-900 dark:text-white">Life at Govind</h2>
                <Link to="/facilities" className="text-primary-600 dark:text-primary-400 hover:scale-110 transition-transform">
                  <ArrowRight size={20} />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-8">
                <div className="col-span-1">
                  <img src="https://picsum.photos/800/1000?random=11" alt="Life 1" className="w-full h-full object-cover rounded-[1.5rem] md:rounded-[2rem] shadow-lg" />
                </div>
                <div className="col-span-1 flex flex-col gap-4 md:gap-8">
                  <div className="h-1/2">
                    <img src="https://picsum.photos/800/600?random=12" alt="Life 2" className="w-full h-full object-cover rounded-[1.5rem] md:rounded-[2rem] shadow-lg" />
                  </div>
                  <div className="h-1/2">
                    <img src="https://picsum.photos/800/600?random=13" alt="Life 3" className="w-full h-full object-cover rounded-[1.5rem] md:rounded-[2rem] shadow-lg" />
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

        </div>
      </section>
    </div>
  );
};
