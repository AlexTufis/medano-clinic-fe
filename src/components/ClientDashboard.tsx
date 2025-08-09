import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { 
  User, 
  Doctor, 
  Appointment, 
  Review, 
  DoctorSchedule, 
  CreateAppointmentDto,
  CreateReviewDto 
} from '../types/dto';
import './ClientDashboard.css';

interface ClientDashboardProps {
  onLogout: () => void;
  currentUser: User; // In a real app, this would come from authentication
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ onLogout, currentUser }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'appointments' | 'book' | 'reviews'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [appointmentReason, setAppointmentReason] = useState<string>('');
  const [doctorSchedules, setDoctorSchedules] = useState<DoctorSchedule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Dummy data for development
  const dummyDoctors: Doctor[] = [
    {
      id: '1',
      firstName: 'Dr. Maria',
      lastName: 'Popescu',
      specialization: 'Cardiologie',
      email: 'maria.popescu@clinic.ro',
      phone: '+40721234567'
    },
    {
      id: '2',
      firstName: 'Dr. Ion',
      lastName: 'Ionescu',
      specialization: 'Neurologie',
      email: 'ion.ionescu@clinic.ro',
      phone: '+40721234568'
    },
    {
      id: '3',
      firstName: 'Dr. Ana',
      lastName: 'Dumitrescu',
      specialization: 'Dermatologie',
      email: 'ana.dumitrescu@clinic.ro',
      phone: '+40721234569'
    }
  ];

  const dummyAppointments: Appointment[] = [
    {
      id: '1',
      clientId: currentUser.id,
      clientName: currentUser.displayName,
      doctorId: '1',
      doctorName: 'Dr. Maria Popescu',
      doctorSpecialization: 'Cardiologie',
      appointmentDate: '2025-08-15',
      appointmentTime: '10:00',
      status: 'scheduled',
      reason: 'Consultație de rutină',
      createdAt: '2025-08-05T09:00:00Z'
    },
    {
      id: '2',
      clientId: currentUser.id,
      clientName: currentUser.displayName,
      doctorId: '2',
      doctorName: 'Dr. Ion Ionescu',
      doctorSpecialization: 'Neurologie',
      appointmentDate: '2025-08-10',
      appointmentTime: '14:30',
      status: 'completed',
      reason: 'Dureri de cap frecvente',
      createdAt: '2025-08-01T11:00:00Z'
    }
  ];

  const dummyReviews: Review[] = [
    {
      id: '1',
      doctorId: '1',
      clientId: 'other-client',
      clientName: 'Alexandru M.',
      rating: 5,
      comment: 'Doctor foarte profesionist și empatic. Recomand cu încredere!',
      createdAt: '2025-08-01T15:00:00Z',
      appointmentId: 'app-123'
    },
    {
      id: '2',
      doctorId: '2',
      clientId: 'other-client-2',
      clientName: 'Raluca S.',
      rating: 4,
      comment: 'Consultație detaliată, explicații clare. Timpul de așteptare a fost puțin mai mare.',
      createdAt: '2025-07-28T16:30:00Z',
      appointmentId: 'app-124'
    }
  ];

  // Generate dummy schedules for the next 7 days
  const generateDummySchedules = (): DoctorSchedule[] => {
    const schedules: DoctorSchedule[] = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      dummyDoctors.forEach(doctor => {
        const timeSlots = [
          '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
          '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
        ].map(time => ({
          time,
          available: Math.random() > 0.3, // 70% chance of being available
          doctorId: doctor.id
        }));

        schedules.push({
          doctorId: doctor.id,
          date: dateStr,
          timeSlots
        });
      });
    }
    
    return schedules;
  };

  useEffect(() => {
    // Simulate API calls
    setDoctors(dummyDoctors);
    setAppointments(dummyAppointments);
    setReviews(dummyReviews);
    setDoctorSchedules(generateDummySchedules());
  }, []);

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !appointmentReason.trim()) {
      setMessage({ type: 'error', text: 'Te rugăm să completezi toate câmpurile.' });
      return;
    }

    setLoading(true);
    
    try {
      // Check if slot is available
      const schedule = doctorSchedules.find(
        s => s.doctorId === selectedDoctor && s.date === selectedDate
      );
      const timeSlot = schedule?.timeSlots.find(ts => ts.time === selectedTime);
      
      if (!timeSlot?.available) {
        setMessage({ type: 'error', text: t('booking.slotTaken') });
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const doctor = doctors.find(d => d.id === selectedDoctor);
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        clientId: currentUser.id,
        clientName: currentUser.displayName,
        doctorId: selectedDoctor,
        doctorName: `${doctor?.firstName} ${doctor?.lastName}`,
        doctorSpecialization: doctor?.specialization || '',
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        status: 'scheduled',
        reason: appointmentReason,
        createdAt: new Date().toISOString()
      };

      setAppointments(prev => [...prev, newAppointment]);
      
      // Mark slot as unavailable
      setDoctorSchedules(prev => prev.map(schedule => {
        if (schedule.doctorId === selectedDoctor && schedule.date === selectedDate) {
          return {
            ...schedule,
            timeSlots: schedule.timeSlots.map(slot => 
              slot.time === selectedTime ? { ...slot, available: false } : slot
            )
          };
        }
        return schedule;
      }));

      setMessage({ type: 'success', text: t('booking.success') });
      setSelectedDoctor('');
      setSelectedDate('');
      setSelectedTime('');
      setAppointmentReason('');
      setActiveTab('appointments');
    } catch (error) {
      setMessage({ type: 'error', text: t('booking.error') });
    } finally {
      setLoading(false);
    }
  };

  const getAvailableTimeSlots = () => {
    if (!selectedDoctor || !selectedDate) return [];
    
    const schedule = doctorSchedules.find(
      s => s.doctorId === selectedDoctor && s.date === selectedDate
    );
    
    return schedule?.timeSlots.filter(slot => slot.available) || [];
  };

  const getAverageRating = (doctorId: string): number => {
    const doctorReviews = reviews.filter(r => r.doctorId === doctorId);
    if (doctorReviews.length === 0) return 0;
    
    const sum = doctorReviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / doctorReviews.length) * 10) / 10;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
        ⭐
      </span>
    ));
  };

  const renderAppointments = () => (
    <div className="appointments-section">
      <h3>{t('client.myAppointments')}</h3>
      {appointments.length === 0 ? (
        <p className="no-data">Nu aveți programări încă.</p>
      ) : (
        <div className="appointments-list">
          {appointments.map(appointment => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-header">
                <h4>{appointment.doctorName}</h4>
                <span className={`status-badge status-${appointment.status}`}>
                  {appointment.status === 'scheduled' && 'Programată'}
                  {appointment.status === 'completed' && 'Finalizată'}
                  {appointment.status === 'cancelled' && 'Anulată'}
                </span>
              </div>
              <div className="appointment-details">
                <p><strong>Specializare:</strong> {appointment.doctorSpecialization}</p>
                <p><strong>Data:</strong> {new Date(appointment.appointmentDate).toLocaleDateString('ro-RO')}</p>
                <p><strong>Ora:</strong> {appointment.appointmentTime}</p>
                <p><strong>Motiv:</strong> {appointment.reason}</p>
              </div>
              {appointment.status === 'completed' && (
                <button className="review-btn" onClick={() => setActiveTab('reviews')}>
                  {t('client.leaveReview')}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBookAppointment = () => (
    <div className="booking-section">
      <h3>{t('client.bookAppointment')}</h3>
      
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="booking-form">
        <div className="form-group">
          <label>{t('booking.selectDoctor')}</label>
          <select 
            value={selectedDoctor} 
            onChange={(e) => {
              setSelectedDoctor(e.target.value);
              setSelectedTime(''); // Reset time when doctor changes
            }}
          >
            <option value="">Selectează un doctor</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.firstName} {doctor.lastName} - {doctor.specialization}
              </option>
            ))}
          </select>
        </div>

        {selectedDoctor && (
          <div className="doctor-info">
            <h4>Evaluare Doctor: {getAverageRating(selectedDoctor).toFixed(1)} {renderStars(Math.round(getAverageRating(selectedDoctor)))}</h4>
          </div>
        )}

        <div className="form-group">
          <label>{t('booking.selectDate')}</label>
          <input
            type="date"
            value={selectedDate}
            min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Tomorrow
            max={new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]} // 7 days from now
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime(''); // Reset time when date changes
            }}
          />
        </div>

        {selectedDate && selectedDoctor && (
          <div className="form-group">
            <label>{t('booking.selectTime')}</label>
            <div className="time-slots">
              {getAvailableTimeSlots().map(slot => (
                <button
                  key={slot.time}
                  className={`time-slot ${selectedTime === slot.time ? 'selected' : ''}`}
                  onClick={() => setSelectedTime(slot.time)}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="form-group">
          <label>{t('booking.reason')}</label>
          <textarea
            value={appointmentReason}
            onChange={(e) => setAppointmentReason(e.target.value)}
            placeholder="Descrieți motivul consultației..."
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button 
            className="book-btn"
            onClick={handleBookAppointment}
            disabled={loading || !selectedDoctor || !selectedDate || !selectedTime || !appointmentReason.trim()}
          >
            {loading ? t('common.loading') : t('booking.book')}
          </button>
        </div>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="reviews-section">
      <h3>{t('client.doctorReviews')}</h3>
      
      {doctors.map(doctor => {
        const doctorReviews = reviews.filter(r => r.doctorId === doctor.id);
        const avgRating = getAverageRating(doctor.id);
        
        return (
          <div key={doctor.id} className="doctor-reviews">
            <div className="doctor-header">
              <h4>{doctor.firstName} {doctor.lastName}</h4>
              <p className="specialization">{doctor.specialization}</p>
              <div className="rating-summary">
                {avgRating > 0 ? (
                  <>
                    <span className="avg-rating">{avgRating}</span>
                    {renderStars(Math.round(avgRating))}
                    <span className="review-count">({doctorReviews.length} recenzii)</span>
                  </>
                ) : (
                  <span className="no-reviews">{t('reviews.noReviews')}</span>
                )}
              </div>
            </div>
            
            <div className="reviews-list">
              {doctorReviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <span className="reviewer-name">{review.clientName}</span>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString('ro-RO')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="client-dashboard">
      <div className="dashboard-header">
        <h1>{t('client.dashboard.title')}</h1>
        <div className="header-right">
          <span className="welcome-user">Bun venit, {currentUser.displayName}!</span>
          <LanguageSwitcher />
          <button className="logout-btn" onClick={onLogout}>
            {t('dashboard.logout')}
          </button>
        </div>
      </div>

      <div className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          📅 {t('client.myAppointments')}
        </button>
        <button 
          className={`nav-btn ${activeTab === 'book' ? 'active' : ''}`}
          onClick={() => setActiveTab('book')}
        >
          ➕ {t('client.bookAppointment')}
        </button>
        <button 
          className={`nav-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          ⭐ {t('client.doctorReviews')}
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'appointments' && renderAppointments()}
        {activeTab === 'book' && renderBookAppointment()}
        {activeTab === 'reviews' && renderReviews()}
      </div>
    </div>
  );
};

export default ClientDashboard;
