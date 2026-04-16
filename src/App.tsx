import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NoticeProvider } from './context/NoticeContext';
import { ComplaintProvider } from './context/ComplaintContext';
import { EventProvider } from './context/EventContext';
import { MessMenuProvider } from './context/MessMenuContext';
import { GuestRoomProvider } from './context/GuestRoomContext';
import { MessRebateProvider } from './context/MessRebateContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Home } from './pages/Home';
import { About } from './pages/About';
import { Facilities } from './pages/Facilities';
import { Noticeboard } from './pages/Noticeboard';
import { Login } from './pages/Login';
import { StudentDashboard } from './pages/student/Dashboard';
import { AdminDashboard } from './pages/admin/Dashboard';

const AppContent = () => {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-[#161616] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {!isDashboard && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/noticeboard" element={<Noticeboard />} />
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NoticeProvider>
          <ComplaintProvider>
            <EventProvider>
              <MessMenuProvider>
                <GuestRoomProvider>
                  <MessRebateProvider>
                    <BrowserRouter>
                      <AppContent />
                      <Toaster 
                        position="top-right"
                        toastOptions={{
                          className: 'dark:bg-[#1A1A2E] dark:text-white dark:border dark:border-white/10',
                          style: {
                            borderRadius: '12px',
                            background: '#fff',
                            color: '#333',
                          },
                        }} 
                      />
                    </BrowserRouter>
                  </MessRebateProvider>
                </GuestRoomProvider>
              </MessMenuProvider>
            </EventProvider>
          </ComplaintProvider>
        </NoticeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

