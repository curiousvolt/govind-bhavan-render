import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import { Student } from './models/Student';
import { Admin } from './models/Admin';
import { Notice } from './models/Notice';
import { Complaint } from './models/Complaint';
import { MessRebate } from './models/MessRebate';
import { GuestBooking } from './models/GuestBooking';
import { Event } from './models/Event';
import { WeekMenu, MessVote } from './models/MessMenu';

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('✅ MongoDB connected');

  // Drop existing data
  await Promise.all([
    Student.deleteMany({}),
    Admin.deleteMany({}),
    Notice.deleteMany({}),
    Complaint.deleteMany({}),
    MessRebate.deleteMany({}),
    GuestBooking.deleteMany({}),
    Event.deleteMany({}),
    WeekMenu.deleteMany({}),
    MessVote.deleteMany({}),
  ]);
  console.log('🗑️  Cleared all collections');

  // --- ADMIN ---
  const admin = await Admin.create({
    name: 'Govind Bhawan Admin',
    email: 'govindbhavan@iitr.ac.in',
  });
  console.log('👤 Admin created:', admin.email);

  // --- STUDENTS ---
  const studentsData = [
    { name: 'Aman Kumar',    email: 'aman_k1@ee.iitr.ac.in',    enrollmentNo: '24115016', room: 'S-37', branch: 'Electrical Engineering',       year: '2nd Year', mobile: '9034692930' },
    { name: 'Rohit Singh',   email: 'rohit_s@ee.iitr.ac.in',    enrollmentNo: '24115124', room: 'S-54', branch: 'Electrical Engineering',       year: '2nd Year', mobile: '9466123456' },
    { name: 'Vikram Mehta',  email: 'vikram_m@cs.iitr.ac.in',   enrollmentNo: '24113042', room: 'G-12', branch: 'Computer Science & Engg.',    year: '2nd Year', mobile: '9812345678' },
    { name: 'Priya Sharma',  email: 'priya_s@me.iitr.ac.in',    enrollmentNo: '23114018', room: 'N-08', branch: 'Mechanical Engineering',       year: '3rd Year', mobile: '9711234567' },
    { name: 'Arjun Yadav',   email: 'arjun_y@ce.iitr.ac.in',    enrollmentNo: '23112055', room: 'G-21', branch: 'Civil Engineering',           year: '3rd Year', mobile: '8800987654' },
    { name: 'Dev Patel',     email: 'dev_p@ch.iitr.ac.in',      enrollmentNo: '24116088', room: 'S-19', branch: 'Chemical Engineering',        year: '2nd Year', mobile: '9988776655' },
    { name: 'Saurabh Gupta', email: 'saurabh_g@bt.iitr.ac.in',  enrollmentNo: '23118031', room: 'G-33', branch: 'Biotechnology',              year: '3rd Year', mobile: '9123456780' },
  ];

  const students = await Student.insertMany(studentsData);
  console.log(`👨‍🎓 ${students.length} students created`);

  const aman   = students.find(s => s.email === 'aman_k1@ee.iitr.ac.in')!;
  const rohit  = students.find(s => s.email === 'rohit_s@ee.iitr.ac.in')!;
  const vikram = students.find(s => s.email === 'vikram_m@cs.iitr.ac.in')!;
  const priya  = students.find(s => s.email === 'priya_s@me.iitr.ac.in')!;
  const arjun  = students.find(s => s.email === 'arjun_y@ce.iitr.ac.in')!;
  const dev    = students.find(s => s.email === 'dev_p@ch.iitr.ac.in')!;

  // --- NOTICES ---
  await Notice.insertMany([
    {
      title: 'Inter-Bhawan Cricket Championship',
      category: 'Sports',
      date: '2026-04-20',
      description: 'Govind Bhawan will be hosting the inter-bhawan cricket championship this season. All interested students can register with the Sports Secretary.',
      pinned: true,
    },
    {
      title: 'End-Semester Examination Schedule Released',
      category: 'Academic',
      date: '2026-04-15',
      description: 'The end-semester examination timetable has been released on the institute portal. Students are advised to check their schedules and plan accordingly.',
      pinned: false,
    },
    {
      title: 'Water Supply Interruption Notice',
      category: 'Maintenance',
      date: '2026-04-14',
      description: 'Due to essential maintenance work, water supply will be interrupted from 9 AM to 1 PM on 18th April. Students are advised to store water in advance.',
      pinned: false,
    },
    {
      title: 'Annual Cultural Night – Rangman 2026',
      category: 'Event',
      date: '2026-04-25',
      description: 'Govind Bhawan\'s annual cultural evening Rangman 2026 is scheduled for April 25th. Music, dance, and drama performances by residents. All are welcome!',
      pinned: true,
    },
    {
      title: 'Library Book Return Deadline',
      category: 'General',
      date: '2026-04-12',
      description: 'All students who have borrowed books from the bhawan library are requested to return them before April 30th to avoid any late fees.',
      pinned: false,
    },
  ]);
  console.log('📋 5 notices created');

  // --- COMPLAINTS ---
  const complaintData = [
    { complaintId: 'D2001', studentId: aman._id,   student: aman.name,   room: aman.room,   category: 'Electrical',  description: 'The tube light in my room has been flickering for the past 3 days.',        date: '2026-04-10', status: 'Open'        },
    { complaintId: 'D2002', studentId: rohit._id,  student: rohit.name,  room: rohit.room,  category: 'Water Issue', description: 'The washroom tap in room S-54 is leaking continuously. Need urgent repair.', date: '2026-04-11', status: 'In Progress' },
    { complaintId: 'D2003', studentId: vikram._id, student: vikram.name, room: vikram.room, category: 'Internet',    description: 'Wi-Fi signal is extremely weak on the ground floor.',                        date: '2026-04-09', status: 'Resolved'    },
    { complaintId: 'D3001', studentId: priya._id,  student: priya.name,  room: priya.room,  category: 'Furniture',   description: 'The study table chair leg is broken making it unusable for studying.',       date: '2026-04-13', status: 'Open'        },
    { complaintId: 'D4002', studentId: arjun._id,  student: arjun.name,  room: arjun.room,  category: 'Cleanliness', description: 'The common washroom on 2nd floor has not been cleaned for 3 days.',          date: '2026-04-22', status: 'In Progress' },
  ];
  await Complaint.insertMany(complaintData);
  console.log('📝 5 complaints created');


  // --- MESS REBATES ---
  await MessRebate.insertMany([
    {
      studentId: aman._id,
      student: aman.name,
      room: aman.room,
      fromDate: '2026-04-18',
      toDate: '2026-04-25',
      reason: 'Going home for summer vacation during exam break week.',
      status: 'Pending',
      submittedOn: '2026-04-14',
    },
    {
      studentId: vikram._id,
      student: vikram.name,
      room: vikram.room,
      fromDate: '2026-04-01',
      toDate: '2026-04-07',
      reason: 'Attended a national hackathon at IIT Delhi. Mess food not availed.',
      status: 'Approved',
      submittedOn: '2026-03-28',
    },
    {
      studentId: dev._id,
      student: dev.name,
      room: dev.room,
      fromDate: '2026-04-10',
      toDate: '2026-04-12',
      reason: 'Was hospitalised briefly. Mess food not consumed.',
      status: 'Rejected',
      submittedOn: '2026-04-11',
    },
  ]);
  console.log('🍽️  3 mess rebates created');

  // --- GUEST BOOKINGS ---
  await GuestBooking.insertMany([
    {
      studentId: rohit._id,
      student: rohit.name,
      guestName: 'Mr. Harish Singh',
      relation: 'Father',
      checkIn: '2026-04-20',
      checkOut: '2026-04-22',
      roomType: 'AC',
      guestsCount: 2,
      total: 2000,
      status: 'Confirmed',
      submittedOn: '2026-04-13',
    },
    {
      studentId: priya._id,
      student: priya.name,
      guestName: 'Mrs. Sunita Sharma',
      relation: 'Mother',
      checkIn: '2026-04-28',
      checkOut: '2026-04-30',
      roomType: 'Non-AC',
      guestsCount: 1,
      total: 600,
      status: 'Pending',
      submittedOn: '2026-04-14',
    },
  ]);
  console.log('🏠 2 guest bookings created');

  // --- EVENTS ---
  const events = await Event.insertMany([
    {
      title: 'Inter-Bhawan Cricket Championship',
      date: '2026-04-20',
      category: 'Sports',
      status: 'Upcoming',
      maxRegistrations: 30,
      registeredStudents: [aman._id, rohit._id, vikram._id],
    },
    {
      title: 'Annual Cultural Night – Rangman 2026',
      date: '2026-04-25',
      category: 'Cultural',
      status: 'Upcoming',
      maxRegistrations: 100,
      registeredStudents: [aman._id, priya._id, arjun._id, dev._id],
    },
    {
      title: 'Technical Symposium: Bhawan-Tech 2026',
      date: '2026-05-05',
      category: 'Technical',
      status: 'Upcoming',
      maxRegistrations: 50,
      registeredStudents: [vikram._id, rohit._id],
    },
  ]);
  console.log(`🎉 ${events.length} events created`);

  // --- MESS MENU (week-based) ---
  // Seed the current week starting Monday April 14, 2026
  const weekStart = '2026-04-14'; // Monday
  await WeekMenu.create({
    weekStart,
    weekEnd: '2026-04-20',
    weekLabel: 'Week of 14 Apr – 20 Apr 2026',
    days: [
      { day: 'Monday',    date: '2026-04-14', breakfast: 'Poha, Jalebi, Boiled Eggs, Tea/Coffee, Milk',              lunch: 'Dal Makhani, Jeera Rice, Roti, Salad, Curd, Papad',          snacks: 'Samosa (2 pcs), Tomato Sauce, Tea/Coffee',               dinner: 'Paneer Butter Masala, Roti, Steamed Rice, Dal Tadka, Gulab Jamun' },
      { day: 'Tuesday',   date: '2026-04-15', breakfast: 'Idli (4 pcs), Sambar, Coconut Chutney, Tea/Coffee, Banana',  lunch: 'Chhole, Bhature, Rice, Raita, Pickle',                       snacks: 'Bread Pakora, Green Chutney, Tea/Coffee',                 dinner: 'Rajma, Roti, Rice, Mix Veg, Kheer' },
      { day: 'Wednesday', date: '2026-04-16', breakfast: 'Aloo Paratha (2 pcs), Curd, Pickle, Tea/Coffee, Milk',       lunch: 'Kadhi Pakora, Rice, Roti, Salad, Buttermilk',               snacks: 'Pav Bhaji, Tea/Coffee',                                  dinner: 'Palak Paneer, Roti, Rice, Dal Fry, Halwa' },
      { day: 'Thursday',  date: '2026-04-17', breakfast: 'Upma, Coconut Chutney, Boiled Eggs, Tea/Coffee, Milk',       lunch: 'Aloo Matar, Roti, Rice, Salad, Curd',                       snacks: 'Vada Pav, Tea/Coffee',                                   dinner: 'Paneer Tikka Masala, Roti, Rice, Dal, Raita' },
      { day: 'Friday',    date: '2026-04-18', breakfast: 'Paratha, Curd, Jalebi, Tea/Coffee, Banana',                  lunch: 'Rajma Chawal, Roti, Salad, Papad, Pickle',                  snacks: 'Kachori, Chai',                                          dinner: 'Dal Makhani, Shahi Paneer, Roti, Rice, Ice Cream' },
      { day: 'Saturday',  date: '2026-04-19', breakfast: 'Chola Bhatura, Lassi/Buttermilk, Tea/Coffee',               lunch: 'Mix Veg Pulao, Raita, Roti, Salad, Papad',                  snacks: 'Maggi/Noodles, Tea/Coffee',                              dinner: 'Special: Veg Biryani, Raita, Salad, Shahi Tukda' },
      { day: 'Sunday',    date: '2026-04-20', breakfast: 'Aloo Puri (2 pcs), Chutney, Boiled Eggs, Tea/Coffee, Milk', lunch: 'Dal Tadka, Jeera Rice, Roti, Salad, Curd, Papad',          snacks: 'Bread Butter, Jam, Tea/Coffee',                          dinner: 'Paneer Dish, Roti, Rice, Dal, Rasmalai' },
    ],
  });
  console.log('🥘 Week menu created for Apr 14–20 2026');

  console.log('\n✅ Seed complete!\n');
  await mongoose.disconnect();
};

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
