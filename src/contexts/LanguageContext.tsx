import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'ro' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define the translation keys type
type TranslationKeys = {
  // Dashboard
  'dashboard.title': string;
  'dashboard.overview': string;
  'dashboard.users': string;
  'dashboard.appointments': string;
  'dashboard.logout': string;
  
  // Metrics
  'metrics.totalUsers': string;
  'metrics.clients': string;
  'metrics.administrators': string;
  'metrics.newThisMonth': string;
  'metrics.totalAppointments': string;
  'metrics.todaysAppointments': string;
  'metrics.thisWeek': string;
  'metrics.completed': string;
  
  // Appointment Status
  'status.scheduled': string;
  'status.completed': string;
  'status.cancelled': string;
  'status.noShow': string;
  'status.breakdown': string;
  
  // Users Table
  'users.name': string;
  'users.email': string;
  'users.role': string;
  'users.status': string;
  'users.createdAt': string;
  'users.active': string;
  'users.inactive': string;
  'users.client': string;
  'users.admin': string;
  
  // Appointments Table
  'appointments.patient': string;
  'appointments.doctor': string;
  'appointments.date': string;
  'appointments.time': string;
  'appointments.status': string;
  'appointments.notes': string;
  
  // Auth
  'auth.login': string;
  'auth.email': string;
  'auth.password': string;
  'auth.createAccount': string;
  'auth.alreadyHaveAccount': string;
  'auth.dontHaveAccount': string;
  'auth.welcomeBack': string;
  'auth.invalidCredentials': string;
  
  // Common
  'common.search': string;
  'common.actions': string;
  'common.loading': string;
  'common.error': string;
  'common.success': string;
  
  // Client Dashboard
  'client.dashboard.title': string;
  'client.appointments': string;
  'client.bookAppointment': string;
  'client.myAppointments': string;
  'client.doctorReviews': string;
  'client.leaveReview': string;
  
  // Appointment Booking
  'booking.selectDoctor': string;
  'booking.selectDate': string;
  'booking.selectTime': string;
  'booking.reason': string;
  'booking.book': string;
  'booking.cancel': string;
  'booking.slotTaken': string;
  'booking.success': string;
  'booking.error': string;
  
  // Reviews
  'reviews.rating': string;
  'reviews.comment': string;
  'reviews.submit': string;
  'reviews.averageRating': string;
  'reviews.noReviews': string;
  'reviews.stars': string;
};

// Translation keys and values
const translations: Record<Language, TranslationKeys> = {
  ro: {
    // Dashboard
    'dashboard.title': 'Panou Administrativ',
    'dashboard.overview': 'Prezentare Generală',
    'dashboard.users': 'Utilizatori',
    'dashboard.appointments': 'Programări',
    'dashboard.logout': 'Deconectare',
    
    // Metrics
    'metrics.totalUsers': 'Total Utilizatori',
    'metrics.clients': 'Clienți',
    'metrics.administrators': 'Administratori',
    'metrics.newThisMonth': 'Noi Luna Aceasta',
    'metrics.totalAppointments': 'Total Programări',
    'metrics.todaysAppointments': 'Programările de Astăzi',
    'metrics.thisWeek': 'Săptămâna Aceasta',
    'metrics.completed': 'Finalizate',
    
    // Appointment Status
    'status.scheduled': 'Programate',
    'status.completed': 'Finalizate',
    'status.cancelled': 'Anulate',
    'status.noShow': 'Nu s-au Prezentat',
    'status.breakdown': 'Clasificarea Programărilor după Status',
    
    // Users Table
    'users.name': 'Nume',
    'users.email': 'Email',
    'users.role': 'Rol',
    'users.status': 'Status',
    'users.createdAt': 'Creat la',
    'users.active': 'Activ',
    'users.inactive': 'Inactiv',
    'users.client': 'Client',
    'users.admin': 'Administrator',
    
    // Appointments Table
    'appointments.patient': 'Pacient',
    'appointments.doctor': 'Doctor',
    'appointments.date': 'Data',
    'appointments.time': 'Ora',
    'appointments.status': 'Status',
    'appointments.notes': 'Notițe',
    
    // Auth
    'auth.login': 'Conectare',
    'auth.email': 'Email',
    'auth.password': 'Parolă',
    'auth.createAccount': 'Creează Cont',
    'auth.alreadyHaveAccount': 'Ai deja un cont?',
    'auth.dontHaveAccount': 'Nu ai un cont?',
    'auth.welcomeBack': 'Bun venit înapoi',
    'auth.invalidCredentials': 'Date de conectare invalide',
    
    // Common
    'common.search': 'Căutare',
    'common.actions': 'Acțiuni',
    'common.loading': 'Se încarcă...',
    'common.error': 'Eroare',
    'common.success': 'Succes',
    
    // Client Dashboard
    'client.dashboard.title': 'Panou Client',
    'client.appointments': 'Programări',
    'client.bookAppointment': 'Rezervă Programare',
    'client.myAppointments': 'Programările Mele',
    'client.doctorReviews': 'Recenzii Doctori',
    'client.leaveReview': 'Lasă o Recenzie',
    
    // Appointment Booking
    'booking.selectDoctor': 'Selectează Doctorul',
    'booking.selectDate': 'Selectează Data',
    'booking.selectTime': 'Selectează Ora',
    'booking.reason': 'Motivul Consultației',
    'booking.book': 'Rezervă',
    'booking.cancel': 'Anulează',
    'booking.slotTaken': 'Această oră este ocupată. Te rugăm să alegi o altă oră.',
    'booking.success': 'Programarea a fost creată cu succes!',
    'booking.error': 'Eroare la crearea programării. Te rugăm să încerci din nou.',
    
    // Reviews
    'reviews.rating': 'Evaluare',
    'reviews.comment': 'Comentariu',
    'reviews.submit': 'Trimite Recenzia',
    'reviews.averageRating': 'Evaluare Medie',
    'reviews.noReviews': 'Nu există recenzii încă',
    'reviews.stars': 'stele',
  },
  en: {
    // Dashboard
    'dashboard.title': 'Admin Dashboard',
    'dashboard.overview': 'Overview',
    'dashboard.users': 'Users',
    'dashboard.appointments': 'Appointments',
    'dashboard.logout': 'Logout',
    
    // Metrics
    'metrics.totalUsers': 'Total Users',
    'metrics.clients': 'Clients',
    'metrics.administrators': 'Administrators',
    'metrics.newThisMonth': 'New This Month',
    'metrics.totalAppointments': 'Total Appointments',
    'metrics.todaysAppointments': "Today's Appointments",
    'metrics.thisWeek': 'This Week',
    'metrics.completed': 'Completed',
    
    // Appointment Status
    'status.scheduled': 'Scheduled',
    'status.completed': 'Completed',
    'status.cancelled': 'Cancelled',
    'status.noShow': 'No Show',
    'status.breakdown': 'Appointment Status Breakdown',
    
    // Users Table
    'users.name': 'Name',
    'users.email': 'Email',
    'users.role': 'Role',
    'users.status': 'Status',
    'users.createdAt': 'Created At',
    'users.active': 'Active',
    'users.inactive': 'Inactive',
    'users.client': 'Client',
    'users.admin': 'Administrator',
    
    // Appointments Table
    'appointments.patient': 'Patient',
    'appointments.doctor': 'Doctor',
    'appointments.date': 'Date',
    'appointments.time': 'Time',
    'appointments.status': 'Status',
    'appointments.notes': 'Notes',
    
    // Auth
    'auth.login': 'Login',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.createAccount': 'Create Account',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.welcomeBack': 'Welcome Back',
    'auth.invalidCredentials': 'Invalid credentials',
    
    // Common
    'common.search': 'Search',
    'common.actions': 'Actions',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    
    // Client Dashboard
    'client.dashboard.title': 'Client Dashboard',
    'client.appointments': 'Appointments',
    'client.bookAppointment': 'Book Appointment',
    'client.myAppointments': 'My Appointments',
    'client.doctorReviews': 'Doctor Reviews',
    'client.leaveReview': 'Leave Review',
    
    // Appointment Booking
    'booking.selectDoctor': 'Select Doctor',
    'booking.selectDate': 'Select Date',
    'booking.selectTime': 'Select Time',
    'booking.reason': 'Reason for Visit',
    'booking.book': 'Book',
    'booking.cancel': 'Cancel',
    'booking.slotTaken': 'This time slot is taken. Please choose another time.',
    'booking.success': 'Appointment created successfully!',
    'booking.error': 'Error creating appointment. Please try again.',
    
    // Reviews
    'reviews.rating': 'Rating',
    'reviews.comment': 'Comment',
    'reviews.submit': 'Submit Review',
    'reviews.averageRating': 'Average Rating',
    'reviews.noReviews': 'No reviews yet',
    'reviews.stars': 'stars',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ro'); // Romanian as default

  const t = (key: string): string => {
    const translationKey = key as keyof TranslationKeys;
    return translations[language][translationKey] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
