export interface LoginDto {
  email: string;
  password: string;
  role: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  email: string;
  role: string;
  token?: string;
}

export interface AdminDashboardDto {
  totalUsers: number;
  clientUsers: number;
  adminUsers: number;
  doctorUsers: number;
  newUsersThisMonth: number;
  totalAppointments: number;
  todayAppointments: number;
  weeklyAppointments: number;
  appointmentsByStatus: AppointmentsByStatus;
}

export interface AppointmentsByStatus {
  scheduled: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

export interface UserDto {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  dateOfBirth?: string;
  gender?: number;
  role: "Admin" | "Client";
  createdAt: string;
  isActive: boolean;
}

export interface RegisterDto {
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  displayName: string;
  dateOfBirth?: string; // Using string for date input (YYYY-MM-DD format)
  gender?: number; // Gender enum: 0 = Male, 1 = Female, 2 = Other
}

export interface User {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  dateOfBirth?: string;
  gender?: number;
  role: "Admin" | "Client";
  createdAt: string;
  isActive: boolean;
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  email: string;
  phone?: string;
  isActive: boolean;
}

// DTO for getting doctors from backend
export interface DoctorDto {
  id: number;
  firstName: string;
  lastName: string;
  specialization: string;
  email: string;
  phone?: string;
  isActive: boolean;
}

// DTO for creating appointments
export interface CreateAppointmentDto {
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  notes?: string;
}

// Response DTO for created appointments
export interface AppointmentResponseDto {
  id: string;
  clientId: string;
  clientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  reason: string;
  notes?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  appointmentDate: string;
  appointmentTime: string;
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  reason: string;
  notes?: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalUsers: number;
  totalClients: number;
  totalAdmins: number;
  newUsersThisMonth: number;
  totalAppointments: number;
  appointmentsToday: number;
  appointmentsThisWeek: number;
  appointmentsByStatus: {
    scheduled: number;
    completed: number;
    cancelled: number;
    noShow: number;
  };
}

export interface Review {
  id: string;
  doctorId: string;
  clientId: string;
  clientName: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: string;
  appointmentId: string;
}

export interface TimeSlot {
  time: string; // Format: "HH:MM"
  available: boolean;
  doctorId: string;
}

export interface DoctorSchedule {
  doctorId: string;
  date: string; // Format: "YYYY-MM-DD"
  timeSlots: TimeSlot[];
}

export interface CreateAppointmentDto {
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
}

export interface CreateReviewDto {
  doctorId: string;
  appointmentId: string;
  rating: number;
  comment: string;
}

export interface ReviewDto {
  id: string;
  doctorId: string;
  clientId: string;
  clientName: string;
  appointmentId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
