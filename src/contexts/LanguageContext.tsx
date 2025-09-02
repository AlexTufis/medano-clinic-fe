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
  'dashboard.loadingData': string;
  
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
  'users.dateOfBirth': string;
  'users.active': string;
  'users.inactive': string;
  'users.client': string;
  'users.admin': string;
  'users.doctor': string;
  'users.loadingUsers': string;
  
  // Appointments Table
  'appointments.patient': string;
  'appointments.doctor': string;
  'appointments.date': string;
  'appointments.time': string;
  'appointments.status': string;
  'appointments.notes': string;
  'appointments.loadingAppointments': string;
  
  // Auth
  'auth.login': string;
  'auth.loggingIn': string;
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
  'common.welcome': string;
  'common.cancel': string;
  'common.total': string;
  
  // User Management
  'userManagement.changeRole': string;
  'userManagement.user': string;
  'userManagement.currentRole': string;
  'userManagement.newRole': string;
  'userManagement.selectRole': string;
  'userManagement.confirmChange': string;
  'userManagement.roleUpdateSuccess': string;
  'userManagement.roleUpdateError': string;
  
  // Client Dashboard
  'client.dashboard.title': string;
  'client.appointments': string;
  'client.bookAppointment': string;
  'client.myAppointments': string;
  'client.doctorReviews': string;
  'client.leaveReview': string;
  'client.doctorRating': string;
  'client.loadingAppointments': string;
  'client.loadingReviews': string;
  
  // Doctor Dashboard
  'doctor.dashboard.title': string;
  'doctor.appointments': string;
  'doctor.reviews': string;
  'doctor.myAppointments': string;
  'doctor.myReviews': string;
  'doctor.noAppointments': string;
  'doctor.noReviews': string;
  'doctor.loadingAppointments': string;
  'doctor.loadingReviews': string;
  'doctor.specialization': string;
  'doctor.specializationPlaceholder': string;
  'doctor.phone': string;
  'doctor.phonePlaceholder': string;
  
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
  'reviews.reviewSingular': string;
  'reviews.reviewPlural': string;
  
  // Status Management
  'status.changeStatus': string;
  'status.selectStatus': string;
  'status.statusUpdateSuccess': string;
  'status.statusUpdateError': string;
  
  // Medical Reports
  'medicalReport.title': string;
  'medicalReport.create': string;
  'medicalReport.createReport': string;
  'medicalReport.antecedente': string;
  'medicalReport.simptome': string;
  'medicalReport.clinice': string;
  'medicalReport.paraclinice': string;
  'medicalReport.diagnostic': string;
  'medicalReport.recomandari': string;
  'medicalReport.save': string;
  'medicalReport.cancel': string;
  'medicalReport.success': string;
  'medicalReport.error': string;
  'medicalReport.appointmentCompleted': string;
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
    'dashboard.loadingData': 'Se încarcă datele...',
    
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
    'users.dateOfBirth': 'Data Nașterii',
    'users.active': 'Activ',
    'users.inactive': 'Inactiv',
    'users.client': 'Client',
    'users.admin': 'Administrator',
    'users.doctor': 'Doctor',
    'users.loadingUsers': 'Se încarcă utilizatorii...',
    
    // Appointments Table
    'appointments.patient': 'Pacient',
    'appointments.doctor': 'Doctor',
    'appointments.date': 'Data',
    'appointments.time': 'Ora',
    'appointments.status': 'Status',
    'appointments.notes': 'Notițe',
    'appointments.loadingAppointments': 'Se încarcă programările...',
    
    // Auth
    'auth.login': 'Conectare',
    'auth.loggingIn': 'Se conectează...',
    'auth.email': 'Email',
    'auth.password': 'Parolă',
    'auth.createAccount': 'Creează Cont',
    'auth.alreadyHaveAccount': 'Ai deja un cont?',
    'auth.dontHaveAccount': 'Nu ai un cont?',
    'auth.welcomeBack': 'Medano Clinic',
    'auth.invalidCredentials': 'Date de conectare invalide',
    
    // Common
    'common.search': 'Căutare',
    'common.actions': 'Acțiuni',
    'common.loading': 'Se încarcă...',
    'common.error': 'Eroare',
    'common.success': 'Succes',
    'common.welcome': 'Bine ai venit',
    'common.cancel': 'Anulează',
    'common.total': 'Total',
    
    // User Management
    'userManagement.changeRole': 'Schimbă Rolul',
    'userManagement.user': 'Utilizator',
    'userManagement.currentRole': 'Rol Curent',
    'userManagement.newRole': 'Rol Nou',
    'userManagement.selectRole': 'Selectează Rolul',
    'userManagement.confirmChange': 'Confirmă Schimbarea',
    'userManagement.roleUpdateSuccess': 'Rolul utilizatorului a fost actualizat cu succes',
    'userManagement.roleUpdateError': 'Eroare la actualizarea rolului utilizatorului',
    
    // Client Dashboard
    'client.dashboard.title': 'Panou Client',
    'client.appointments': 'Programări',
    'client.bookAppointment': 'Rezervă Programare',
    'client.myAppointments': 'Programările Mele',
    'client.doctorReviews': 'Recenzii Doctori',
    'client.leaveReview': 'Lasă o Recenzie',
    'client.doctorRating': 'Evaluarea Doctorului',
    'client.loadingAppointments': 'Se încarcă programările...',
    'client.loadingReviews': 'Se încarcă recenziile...',
    
    // Doctor Dashboard
    'doctor.dashboard.title': 'Panou Doctor',
    'doctor.appointments': 'Programări',
    'doctor.reviews': 'Recenzii',
    'doctor.myAppointments': 'Programările Mele',
    'doctor.myReviews': 'Recenziile Mele',
    'doctor.noAppointments': 'Nu aveți programări',
    'doctor.noReviews': 'Nu aveți recenzii',
    'doctor.loadingAppointments': 'Se încarcă programările...',
    'doctor.loadingReviews': 'Se încarcă recenziile...',
    'doctor.specialization': 'Specializarea',
    'doctor.specializationPlaceholder': 'Ex: Cardiologie, Dermatologie, etc.',
    'doctor.phone': 'Telefon',
    'doctor.phonePlaceholder': 'Ex: +40 123 456 789',
    
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
    'reviews.reviewSingular': 'recenzie',
    'reviews.reviewPlural': 'recenzii',
    
    // Status Management
    'status.changeStatus': 'Schimbă Status',
    'status.selectStatus': 'Selectează Status',
    'status.statusUpdateSuccess': 'Statusul programării a fost actualizat cu succes',
    'status.statusUpdateError': 'Eroare la actualizarea statusului programării',
    
    // Medical Reports
    'medicalReport.title': 'Raport Medical',
    'medicalReport.create': 'Creează Raport',
    'medicalReport.createReport': 'Creează Raport Medical',
    'medicalReport.antecedente': 'Antecedente',
    'medicalReport.simptome': 'Simptome',
    'medicalReport.clinice': 'Examen Clinic',
    'medicalReport.paraclinice': 'Examen Paraclinic',
    'medicalReport.diagnostic': 'Diagnostic',
    'medicalReport.recomandari': 'Recomandări',
    'medicalReport.save': 'Salvează Raport',
    'medicalReport.cancel': 'Anulează',
    'medicalReport.success': 'Raportul medical a fost creat cu succes',
    'medicalReport.error': 'Eroare la crearea raportului medical',
    'medicalReport.appointmentCompleted': 'Programarea este finalizată - Se poate crea raport medical',
  },
  en: {
    // Dashboard
    'dashboard.title': 'Admin Dashboard',
    'dashboard.overview': 'Overview',
    'dashboard.users': 'Users',
    'dashboard.appointments': 'Appointments',
    'dashboard.logout': 'Logout',
    'dashboard.loadingData': 'Loading data...',
    
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
    'users.dateOfBirth': 'Date of Birth',
    'users.active': 'Active',
    'users.inactive': 'Inactive',
    'users.client': 'Client',
    'users.admin': 'Administrator',
    'users.doctor': 'Doctor',
    'users.loadingUsers': 'Loading users...',
    
    // Appointments Table
    'appointments.patient': 'Patient',
    'appointments.doctor': 'Doctor',
    'appointments.date': 'Date',
    'appointments.time': 'Time',
    'appointments.status': 'Status',
    'appointments.notes': 'Notes',
    'appointments.loadingAppointments': 'Loading appointments...',
    
    // Auth
    'auth.login': 'Login',
    'auth.loggingIn': 'Logging in...',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.createAccount': 'Create Account',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.welcomeBack': 'Medano Clinic',
    'auth.invalidCredentials': 'Invalid credentials',
    
    // Common
    'common.search': 'Search',
    'common.actions': 'Actions',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.welcome': 'Welcome',
    'common.cancel': 'Cancel',
    'common.total': 'Total',
    
    // User Management
    'userManagement.changeRole': 'Change Role',
    'userManagement.user': 'User',
    'userManagement.currentRole': 'Current Role',
    'userManagement.newRole': 'New Role',
    'userManagement.selectRole': 'Select Role',
    'userManagement.confirmChange': 'Confirm Change',
    'userManagement.roleUpdateSuccess': 'User role updated successfully',
    'userManagement.roleUpdateError': 'Error updating user role',
    
    // Client Dashboard
    'client.dashboard.title': 'Client Dashboard',
    'client.appointments': 'Appointments',
    'client.bookAppointment': 'Book Appointment',
    'client.myAppointments': 'My Appointments',
    'client.doctorReviews': 'Doctor Reviews',
    'client.leaveReview': 'Leave Review',
    'client.doctorRating': 'Doctor Rating',
    'client.loadingAppointments': 'Loading appointments...',
    'client.loadingReviews': 'Loading reviews...',
    
    // Doctor Dashboard
    'doctor.dashboard.title': 'Doctor Dashboard',
    'doctor.appointments': 'Appointments',
    'doctor.reviews': 'Reviews',
    'doctor.myAppointments': 'My Appointments',
    'doctor.myReviews': 'My Reviews',
    'doctor.noAppointments': 'No appointments found',
    'doctor.noReviews': 'No reviews yet',
    'doctor.loadingAppointments': 'Loading appointments...',
    'doctor.loadingReviews': 'Loading reviews...',
    'doctor.specialization': 'Specialization',
    'doctor.specializationPlaceholder': 'e.g. Cardiology, Dermatology, etc.',
    'doctor.phone': 'Phone',
    'doctor.phonePlaceholder': 'e.g. +1 123 456 7890',
    
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
    'reviews.reviewSingular': 'review',
    'reviews.reviewPlural': 'reviews',
    
    // Status Management
    'status.changeStatus': 'Change Status',
    'status.selectStatus': 'Select Status',
    'status.statusUpdateSuccess': 'Appointment status updated successfully',
    'status.statusUpdateError': 'Error updating appointment status',
    
    // Medical Reports
    'medicalReport.title': 'Medical Report',
    'medicalReport.create': 'Create Report',
    'medicalReport.createReport': 'Create Medical Report',
    'medicalReport.antecedente': 'Medical History',
    'medicalReport.simptome': 'Symptoms',
    'medicalReport.clinice': 'Clinical Findings',
    'medicalReport.paraclinice': 'Paraclinical Findings',
    'medicalReport.diagnostic': 'Diagnosis',
    'medicalReport.recomandari': 'Recommendations',
    'medicalReport.save': 'Save Report',
    'medicalReport.cancel': 'Cancel',
    'medicalReport.success': 'Medical report created successfully',
    'medicalReport.error': 'Error creating medical report',
    'medicalReport.appointmentCompleted': 'Appointment is completed - Medical report can be created',
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
