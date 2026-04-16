export const MOCK_STUDENT = {
  name: "Aman Kumar",
  room: "S-37",
  email: "aman_k1@ee.iitr.ac.in",
  branch: "Electrical Engineering",
  year: "2nd Year",
  mobile: "9034692930",
  enrollmentNo: "22116037"
};

export const MOCK_ADMIN = {
  name: "Govind Bhavan",
  email: "govindbhavan@iitr.ac.in"
};

export const VALID_OTP = "123456";

export const MOCK_NOTICES = [
  { id: 1, title: "Inter-Bhavan Cricket Tournament", category: "Sports", date: "2026-04-20", description: "Join us for the annual cricket tournament.", pinned: true },
  { id: 2, title: "Mess Committee Meeting", category: "General", date: "2026-04-16", description: "Monthly meeting to discuss menu changes.", pinned: false },
  { id: 3, title: "Guest Room Booking Rules Updated", category: "General", date: "2026-04-14", description: "Please review the new guest room booking guidelines.", pinned: true },
  { id: 4, title: "Water Supply Maintenance", category: "Maintenance", date: "2026-04-15", description: "Water supply will be interrupted from 10 AM to 2 PM.", pinned: false },
  { id: 5, title: "Quiz Night: Bhavan Trivia", category: "Event", date: "2026-04-18", description: "Test your knowledge about Govind Bhavan history.", pinned: false }
];

export const MOCK_COMPLAINTS = [
  { id: "C001", student: "Aman Kumar", room: "S-37", category: "Electrical", description: "Fan not working", date: "2026-04-10", status: "Open", resolveBy: "2026-04-12" },
  { id: "C002", student: "Rahul Singh", room: "S-12", category: "Water Issue", description: "Tap leaking", date: "2026-04-09", status: "In Progress", resolveBy: "2026-04-11" },
  { id: "C003", student: "Vikash", room: "G-05", category: "Internet", description: "LAN port broken", date: "2026-04-08", status: "Resolved", resolveBy: "2026-04-10" }
];

export const MOCK_REBATES = [
  { id: "R001", student: "Aman Kumar", room: "S-37", fromDate: "2026-04-20", toDate: "2026-04-25", reason: "Going home", submittedOn: "2026-04-12", status: "Pending" },
  { id: "R002", student: "Rahul Singh", room: "S-12", fromDate: "2026-04-15", toDate: "2026-04-18", reason: "Hackathon", submittedOn: "2026-04-10", status: "Approved" }
];

export const MOCK_GUEST_BOOKINGS = [
  { id: "G001", student: "Aman Kumar", guestName: "Rajesh Kumar", relation: "Parent", checkIn: "2026-04-20", checkOut: "2026-04-22", roomType: "AC", total: 1000, status: "Confirmed" }
];

export const MOCK_STUDENTS = [
  MOCK_STUDENT,
  { name: "Rahul Singh", room: "S-12", email: "rahul_s@cs.iitr.ac.in", branch: "Computer Science", year: "3rd Year", mobile: "9876543210", enrollmentNo: "21114055" },
  { name: "Vikash", room: "G-05", email: "vikash@me.iitr.ac.in", branch: "Mechanical Engineering", year: "1st Year", mobile: "9988776655", enrollmentNo: "23115099" }
];

export const MOCK_EVENTS = [
  { id: "E001", title: "Quiz Night: Bhawan Trivia", date: "2026-04-18", category: "Event", status: "Upcoming", maxRegistrations: 50, registrations: 12 },
  { id: "E002", title: "Inter-Bhawan Cricket Tournament", date: "2026-04-20", category: "Sports", status: "Upcoming", maxRegistrations: 100, registrations: 45 }
];
