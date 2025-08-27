import React, { useState, useEffect } from 'react';
import { ReviewDto, AppointmentResponseDto, User } from '../types/dto';
import { getDoctorReviews, getDoctorAppointments } from '../api/doctor';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import Toast from './Toast';
import './DoctorDashboard.css';

interface DoctorDashboardProps {
  onLogout: () => void;
  currentUser: User;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onLogout, currentUser }) => {
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState<AppointmentResponseDto[]>([]);
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState<boolean>(false);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'appointments' | 'reviews'>('appointments');
  
  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  // Function to show toast messages
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  // Function to hide toast
  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Fetch appointments when appointments tab is activated
  useEffect(() => {
    const fetchAppointments = async () => {
      if (activeTab === 'appointments') {
        try {
          setAppointmentsLoading(true);
          setError('');
          const appointmentsData = await getDoctorAppointments();
          setAppointments(appointmentsData);
        } catch (err) {
          console.error('Error fetching appointments:', err);
          setError('Failed to load appointments data');
          showToast('Failed to load appointments', 'error');
        } finally {
          setAppointmentsLoading(false);
        }
      }
    };

    fetchAppointments();
  }, [activeTab]);

  // Fetch reviews when reviews tab is activated
  useEffect(() => {
    const fetchReviews = async () => {
      if (activeTab === 'reviews') {
        try {
          setReviewsLoading(true);
          setError('');
          const reviewsData = await getDoctorReviews();
          setReviews(reviewsData);
        } catch (err) {
          console.error('Error fetching reviews:', err);
          setError('Failed to load reviews data');
          showToast('Failed to load reviews', 'error');
        } finally {
          setReviewsLoading(false);
        }
      }
    };

    fetchReviews();
  }, [activeTab]);

  // Helper function to get translated status
  const getTranslatedStatus = (status: string): string => {
    switch (status) {
      case 'scheduled':
        return t('status.scheduled');
      case 'completed':
        return t('status.completed');
      case 'cancelled':
        return t('status.cancelled');
      case 'no-show':
        return t('status.noShow');
      default:
        return status;
    }
  };

  // Render star rating
  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star full">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return <div className="star-rating">{stars}</div>;
  };

  const renderAppointments = () => {
    if (appointmentsLoading) {
      return <div className="loading">Loading appointments data...</div>;
    }

    if (appointments.length === 0) {
      return (
        <div className="no-data">
          <p>{t('doctor.noAppointments')}</p>
        </div>
      );
    }

    // Group appointments by status
    const appointmentsByStatus = {
      scheduled: appointments.filter(apt => apt.status === 'scheduled'),
      completed: appointments.filter(apt => apt.status === 'completed'),
      cancelled: appointments.filter(apt => apt.status === 'cancelled'),
      'no-show': appointments.filter(apt => apt.status === 'no-show')
    };

    return (
      <div className="appointments-content">
        <div className="content-header">
          <h3>{t('doctor.myAppointments')}</h3>
          <div className="appointment-stats">
            <span>{t('common.total')}: {appointments.length}</span>
            <span>{t('status.scheduled')}: {appointmentsByStatus.scheduled.length}</span>
            <span>{t('status.completed')}: {appointmentsByStatus.completed.length}</span>
            <span>{t('status.cancelled')}: {appointmentsByStatus.cancelled.length}</span>
            <span>{t('status.noShow')}: {appointmentsByStatus['no-show'].length}</span>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="appointments-table">
          <table>
            <thead>
              <tr>
                <th>{t('appointments.date')}</th>
                <th>{t('appointments.time')}</th>
                <th>{t('appointments.patient')}</th>
                <th>{t('booking.reason')}</th>
                <th>{t('appointments.status')}</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(appointment => (
                <tr key={appointment.id}>
                  <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                  <td>{appointment.appointmentTime}</td>
                  <td>{appointment.clientName}</td>
                  <td>{appointment.reason}</td>
                  <td>
                    <span className={`status-badge status-${appointment.status}`}>
                      {getTranslatedStatus(appointment.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderReviews = () => {
    if (reviewsLoading) {
      return <div className="loading">Loading reviews data...</div>;
    }

    if (reviews.length === 0) {
      return (
        <div className="no-data">
          <p>{t('doctor.noReviews')}</p>
        </div>
      );
    }

    // Calculate average rating
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    return (
      <div className="reviews-content">
        <div className="content-header">
          <h3>{t('doctor.myReviews')}</h3>
          <div className="reviews-stats">
            <div className="average-rating">
              <span className="rating-label">{t('reviews.averageRating')}:</span>
              {renderStarRating(averageRating)}
              <span className="rating-number">({averageRating.toFixed(1)})</span>
            </div>
            <span>{t('common.total')}: {reviews.length} {reviews.length === 1 ? t('reviews.reviewSingular') : t('reviews.reviewPlural')}</span>
          </div>
        </div>

        {/* Reviews List */}
        <div className="reviews-list">
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="patient-info">
                  <strong>{review.clientName}</strong>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="review-rating">
                  {renderStarRating(review.rating)}
                  <span className="rating-number">({review.rating})</span>
                </div>
              </div>
              <div className="review-comment">
                <p>{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-header">
        <h1>{t('doctor.dashboard.title')}</h1>
        <div className="header-right">
          <LanguageSwitcher />
          <button className="logout-btn-doctor" onClick={onLogout}>
            {t('dashboard.logout')}
          </button>
        </div>
      </div>

      <div className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          📅 {t('doctor.appointments')}
        </button>
        <button 
          className={`nav-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          ⭐ {t('doctor.reviews')}
        </button>
      </div>

      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}
        {activeTab === 'appointments' && renderAppointments()}
        {activeTab === 'reviews' && renderReviews()}
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default DoctorDashboard;
