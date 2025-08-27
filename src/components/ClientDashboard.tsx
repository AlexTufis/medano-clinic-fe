import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import Toast from './Toast';
import { 
  User, 
  Doctor, 
  Appointment, 
  CreateAppointmentDto,
  CreateReviewDto,
  ReviewDto,
  AppointmentHourDto
} from '../types/dto';
import { getDoctors, createAppointment, getClientAppointments, createReview, getReviews, getDoctorAppointmentHoursByDay } from '../api/client';
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
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [appointmentReason, setAppointmentReason] = useState<string>('');
  const [appointmentHours, setAppointmentHours] = useState<AppointmentHourDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [appointmentsLoading, setAppointmentsLoading] = useState<boolean>(false);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info', message: string, isVisible: boolean }>({ type: 'info', message: '', isVisible: false });
  const [selectedAppointmentForReview, setSelectedAppointmentForReview] = useState<Appointment | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>('');

  useEffect(() => {
    // Load appointments from API and other initial data
    const loadInitialData = async () => {
      try {
        setAppointmentsLoading(true);
        // Load appointments from API
        const appointmentsData = await getClientAppointments();
        // Convert AppointmentResponseDto to Appointment format
        const convertedAppointments: Appointment[] = appointmentsData.map(dto => ({
          id: dto.id,
          clientId: dto.clientId,
          clientName: dto.clientName,
          doctorId: dto.doctorId,
          doctorName: dto.doctorName,
          doctorSpecialization: dto.doctorSpecialization,
          appointmentDate: dto.appointmentDate,
          appointmentTime: dto.appointmentTime,
          status: dto.status as 'scheduled' | 'completed' | 'cancelled' | 'no-show',
          reason: dto.reason,
          notes: dto.notes,
          createdAt: dto.createdAt
        }));
        setAppointments(convertedAppointments);
        
      } catch (error) {
        console.error('Error loading appointments:', error);
        setMessage({ type: 'error', text: 'Failed to load appointments' });
        // Set empty appointments on error
        setAppointments([]);
        // Set empty reviews on error
        setReviews([]);
      } finally {
        setAppointmentsLoading(false);
      }
    };

    loadInitialData();
  }, [currentUser]);

  // Separate effect to load doctors when book or reviews tab is active
  useEffect(() => {
    if (activeTab === 'book' || activeTab === 'reviews') {
      const loadDoctors = async () => {
        try {
          setLoading(true);
          const doctorsData = await getDoctors();
          // Convert DoctorDto to Doctor format
          const convertedDoctors: Doctor[] = doctorsData.map(dto => ({
            id: dto.id.toString(),
            firstName: dto.firstName,
            lastName: dto.lastName,
            specialization: dto.specialization,
            email: dto.email,
            phone: dto.phone || '',
            isActive: dto.isActive,
            averageRating: dto.averageRating,
            totalReviews: dto.totalReviews
          }));
          setDoctors(convertedDoctors);
        } catch (error) {
          console.error('Error loading doctors:', error);
          setMessage({ type: 'error', text: 'Failed to load doctors' });
          // Set empty doctors array on error
          setDoctors([]);
        } finally {
          setLoading(false);
        }
      };

      // Only load if doctors array is empty
      if (doctors.length === 0) {
        loadDoctors();
      }
    }
  }, [activeTab, doctors.length]);

  // Load appointment hours when doctor and date are selected
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const loadAppointmentHours = async () => {
        try {
          setLoading(true);
          const date = new Date(selectedDate);
          const dayOfWeek = getDayOfWeekString(date);
          const hours = await getDoctorAppointmentHoursByDay(selectedDoctor, dayOfWeek);
          setAppointmentHours(hours);
        } catch (error) {
          console.error('Error loading appointment hours:', error);
          setMessage({ type: 'error', text: 'Failed to load appointment hours' });
          setAppointmentHours([]);
        } finally {
          setLoading(false);
        }
      };

      loadAppointmentHours();
    } else {
      setAppointmentHours([]);
    }
  }, [selectedDoctor, selectedDate]);

  // Helper function to get day of week as string
  const getDayOfWeekString = (date: Date): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  // Function to load reviews from API
  const loadReviews = async () => {
    try {
      setReviewsLoading(true);
      const reviewsData = await getReviews();
      console.log(reviewsData)
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setMessage({ type: 'error', text: 'Failed to load reviews' });
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Helper function to show toast notifications
  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message, isVisible: true });
  };

  // Separate effect to load reviews only when reviews tab is active
  useEffect(() => {
    if (activeTab === 'reviews') {
      loadReviews();
    }
  }, [activeTab]);

    const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !appointmentReason.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    setLoading(true);
    
    try {
      // Create appointment via API
      const appointmentData: CreateAppointmentDto = {
        doctorId: selectedDoctor,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        reason: appointmentReason,
        notes: ''
      };

      const createdAppointment = await createAppointment(appointmentData);
      
      // Convert API response to local Appointment format
      const newAppointment: Appointment = {
        id: createdAppointment.id,
        clientId: createdAppointment.clientId,
        clientName: createdAppointment.clientName,
        doctorId: createdAppointment.doctorId,
        doctorName: createdAppointment.doctorName,
        doctorSpecialization: createdAppointment.doctorSpecialization,
        appointmentDate: createdAppointment.appointmentDate,
        appointmentTime: createdAppointment.appointmentTime,
        status: createdAppointment.status as 'scheduled' | 'completed' | 'cancelled' | 'no-show',
        reason: createdAppointment.reason,
        notes: createdAppointment.notes,
        createdAt: createdAppointment.createdAt
      };

      setAppointments(prev => [...prev, newAppointment]);
      
      // Refresh appointment hours to show updated availability
      if (selectedDoctor && selectedDate) {
        const date = new Date(selectedDate);
        const dayOfWeek = getDayOfWeekString(date);
        const hours = await getDoctorAppointmentHoursByDay(selectedDoctor, dayOfWeek);
        setAppointmentHours(hours);
      }

      // Show success toast notification
      showToast('success', t('booking.success'));
      setSelectedDoctor('');
      setSelectedDate('');
      setSelectedTime('');
      setAppointmentReason('');
      setActiveTab('appointments');
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      let errorMessage = t('booking.error');
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const getAvailableTimeSlots = () => {
    if (!selectedDoctor || !selectedDate) return [];
    
    // Return only active appointment hours that are available
    return appointmentHours
      .filter(hour => hour.isActive)
      .map(hour => ({
        time: hour.hour,
        available: true, // The backend determines availability
        doctorId: hour.doctorId
      }));
  };

  const getDoctorById = (doctorId: string): Doctor | undefined => {
    return doctors.find(doctor => doctor.id === doctorId);
  };

  const getAverageRating = (doctorId: string): number => {
    const doctor = getDoctorById(doctorId);
    return doctor?.averageRating || 0;
  };

  const getTotalReviews = (doctorId: string): number => {
    const doctor = getDoctorById(doctorId);
    return doctor?.totalReviews || 0;
  };

  const handleLeaveReview = (appointment: Appointment) => {
    setSelectedAppointmentForReview(appointment);
    setReviewRating(0);
    setReviewComment('');
    setActiveTab('reviews');
  };

  const handleSubmitReview = async () => {
    if (!selectedAppointmentForReview || reviewRating === 0) {
      setMessage({ type: 'error', text: 'Te rugăm să selectezi o evaluare.' });
      return;
    }

    try {
      setLoading(true);
      
      // Create review via API
      const reviewData: CreateReviewDto = {
        doctorId: selectedAppointmentForReview.doctorId,
        appointmentId: selectedAppointmentForReview.id,
        rating: reviewRating,
        comment: reviewComment.trim()
      };

      await createReview(reviewData);
      
      // Reload all reviews from database to show updated data
      await loadReviews();
      showToast('success', 'Recenzia a fost trimisă cu succes!');
      
      // Reset form
      setSelectedAppointmentForReview(null);
      setReviewRating(0);
      setReviewComment('');
      
    } catch (error: any) {
      console.error('Error submitting review:', error);
      let errorMessage = 'Eroare la trimiterea recenziei.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onStarClick?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span 
        key={i} 
        className={`star ${i < rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
        onClick={interactive && onStarClick ? () => onStarClick(i + 1) : undefined}
        style={interactive ? { cursor: 'pointer' } : {}}
      >
        ⭐
      </span>
    ));
  };

  const renderAppointments = () => (
    <div className="appointments-section">
      <h3>{t('client.myAppointments')}</h3>
      {appointmentsLoading ? (
        <div className="loading">Loading appointments...</div>
      ) : appointments.length === 0 ? (
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
              {(appointment.status === 'completed' || appointment.status === 'scheduled') && (
                <button className="review-btn" onClick={() => handleLeaveReview(appointment)}>
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
            <h4>{t('client.doctorRating')}: {getAverageRating(selectedDoctor).toFixed(1)} {renderStars(Math.round(getAverageRating(selectedDoctor)))} ({getTotalReviews(selectedDoctor)} {getTotalReviews(selectedDoctor) === 1 ? t('reviews.reviewSingular') : t('reviews.reviewPlural')})</h4>
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
      
      {reviewsLoading && <div className="loading-message">Loading reviews...</div>}
      
      {/* Review Form - shown when user clicks "Leave Review" */}
      {selectedAppointmentForReview && (
        <div className="review-form-section">
          <h4>Lasă o recenzie pentru {selectedAppointmentForReview.doctorName}</h4>
          <div className="review-form">
            <div className="form-group">
              <label>Evaluare:</label>
              <div className="star-rating">
                {renderStars(reviewRating, true, setReviewRating)}
              </div>
            </div>
            
            <div className="form-group">
              <label>Comentariu:</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Spune-ne despre experiența ta cu doctorul..."
                rows={4}
              />
            </div>
            
            <div className="form-actions">
              <button 
                className="submit-review-btn"
                onClick={handleSubmitReview}
                disabled={loading || reviewRating === 0}
              >
                {loading ? t('common.loading') : 'Trimite Recenzia'}
              </button>
              <button 
                className="cancel-review-btn"
                onClick={() => {
                  setSelectedAppointmentForReview(null);
                  setReviewRating(0);
                  setReviewComment('');
                }}
              >
                Anulează
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Existing Reviews Display */}
      {doctors.map(doctor => {
        const doctorReviews = reviews.filter(r => r.doctorId === doctor.id);
        console.log(`Doctor ${doctor.id} reviews:`, doctorReviews);
        const avgRating = getAverageRating(doctor.id);
        const totalReviews = getTotalReviews(doctor.id);
        
        return (
          <div key={doctor.id} className="doctor-reviews">
            <div className="doctor-header">
              <h4>{doctor.firstName} {doctor.lastName}</h4>
              <p className="specialization">{doctor.specialization}</p>
              <div className="rating-summary">
                {avgRating > 0 ? (
                  <>
                    <span className="avg-rating">{avgRating.toFixed(1)}</span>
                    {renderStars(Math.round(avgRating))}
                    <span className="review-count">({totalReviews} {totalReviews === 1 ? t('reviews.reviewSingular') : t('reviews.reviewPlural')})</span>
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
          <button className="logout-btn-client-dashboard" onClick={onLogout}>
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

      {/* Toast notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default ClientDashboard;
