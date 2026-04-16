import React, { createContext, useContext, useState, useEffect } from 'react';
import * as eventApi from '../api/events';

export interface Event {
  _id?: string;
  id: string;
  title: string;
  date: string;
  category: string;
  status: string;
  maxRegistrations: number;
  registeredStudents: string[]; // student names (for display compatibility)
  registeredStudentDetails?: any[]; // full populated student objects
}

interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | '_id' | 'status' | 'registeredStudents' | 'registeredStudentDetails'>) => Promise<void>;
  editEvent: (id: string, event: Partial<Event>) => Promise<void>;
  registerForEvent: (eventId: string, studentId: string) => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const normalize = (e: any): Event => ({ ...e, id: e._id?.toString() || e.id });

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    eventApi.getEvents().then(data => setEvents(data.map(normalize))).catch(console.error);
  }, []);

  const addEvent = async (eventData: Omit<Event, 'id' | '_id' | 'status' | 'registeredStudents' | 'registeredStudentDetails'>) => {
    const created = await eventApi.createEvent(eventData as any);
    setEvents(prev => [normalize(created), ...prev]);
  };

  const editEvent = async (id: string, eventData: Partial<Event>) => {
    const updated = await eventApi.updateEvent(id, eventData as any);
    setEvents(prev => prev.map(e => (e._id === id || e.id === id) ? normalize(updated) : e));
  };

  const registerForEvent = async (eventId: string, studentId: string) => {
    const updated = await eventApi.toggleRegistration(eventId, studentId);
    setEvents(prev => prev.map(e => (e._id === eventId || e.id === eventId) ? normalize(updated) : e));
  };

  return (
    <EventContext.Provider value={{ events, addEvent, editEvent, registerForEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) throw new Error('useEvent must be used within an EventProvider');
  return context;
};
