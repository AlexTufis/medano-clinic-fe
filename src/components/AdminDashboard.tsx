import React, { useState, useEffect } from 'react';
import { AdminDashboardDto, UserDto, AppointmentResponseDto, UpdateUserRoleDto, ReviewDto } from '../types/dto';
import { getAdminDashboardStats, getAllUsers, getAllAppointments, updateUserRole, updateAppointmentStatus } from '../api/admin';
import { getReviews } from '../api/client';
import { useLanguage } from '../contexts/LanguageContext';
import { generateMedicalReportWord } from '../utils/documentGenerator';
import LanguageSwitcher from './LanguageSwitcher';
import Toast from './Toast';
import LoadingSpinner from './LoadingSpinner';
import './AdminDashboard.css';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { t } = useLanguage();
  const [dashboardData, setDashboardData] = useState<AdminDashboardDto | null>(null);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [appointments, setAppointments] = useState<AppointmentResponseDto[]>([]);
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [appointmentsLoading, setAppointmentsLoading] = useState<boolean>(false);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);
  const [roleUpdateLoading, setRoleUpdateLoading] = useState<boolean>(false);
  const [appointmentStatusUpdating, setAppointmentStatusUpdating] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'appointments' | 'reviews'>('overview');
  
  // Modal state for user role management
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [newRole, setNewRole] = useState<string>('');
  const [specialization, setSpecialization] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  
  // Medical Reports Modal state
  const [showMedicalReportsModal, setShowMedicalReportsModal] = useState<boolean>(false);
  const [selectedUserForReports, setSelectedUserForReports] = useState<UserDto | null>(null);
  
  // Print Modal state
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [selectedReportForPrint, setSelectedReportForPrint] = useState<any>(null);
  
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAdminDashboardStats();
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch users when users tab is activated
  useEffect(() => {
    const fetchUsers = async () => {
      if (activeTab === 'users') {
        try {
          setUsersLoading(true);
          const usersData = await getAllUsers();
          setUsers(usersData);
        } catch (err) {
          console.error('Error fetching users:', err);
          setError('Failed to load users data');
        } finally {
          setUsersLoading(false);
        }
      }
    };

    fetchUsers();
  }, [activeTab]);

  // Fetch appointments when appointments tab is activated
  useEffect(() => {
    const fetchAppointments = async () => {
      if (activeTab === 'appointments') {
        try {
          setAppointmentsLoading(true);
          const appointmentsData = await getAllAppointments();
          setAppointments(appointmentsData);
        } catch (err) {
          console.error('Error fetching appointments:', err);
          setError('Failed to load appointments data');
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
          const reviewsData = await getReviews();
          setReviews(reviewsData);
        } catch (err) {
          console.error('Error fetching reviews:', err);
          setError('Failed to load reviews data');
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

  // Handle user row click (only for non-admin users)
  const handleUserClick = (user: UserDto) => {
    // Only allow clicking on Client and Doctor users, not Admin users
    if (user.role === 'Client' || user.role === 'Doctor') {
      setSelectedUser(user);
      setNewRole(''); // Start with empty selection
      setSpecialization(''); // Reset specialization
      setPhone(''); // Reset phone
      setShowRoleModal(true);
    }
  };

  // Handle role change confirmation
  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;
    
    // Validate specialization is required when changing to Doctor
    if (newRole === 'Doctor' && !specialization.trim()) {
      showToast('Specialization is required when changing role to Doctor', 'error');
      return;
    }
    
    try {
      setRoleUpdateLoading(true);
      // Call the API to update user role
      const updateDto: UpdateUserRoleDto = {
        userId: selectedUser.id,
        roleName: newRole,
        ...(newRole === 'Doctor' && { 
          specialization: specialization.trim(),
          phone: phone.trim() || undefined 
        })
      };

      await updateUserRole(updateDto);
      
      // Update local state on success
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser.id 
            ? { ...user, role: newRole as "Admin" | "Client" | "Doctor" }
            : user
        )
      );
      
      // Close modal
      setShowRoleModal(false);
      setSelectedUser(null);
      setNewRole('');
      setSpecialization('');
      setPhone('');
      
      // Show success toast
      showToast(t('userManagement.roleUpdateSuccess'), 'success');
      
    } catch (error) {
      console.error('Error updating user role:', error);
      // Show error toast
      showToast(t('userManagement.roleUpdateError'), 'error');
    } finally {
      setRoleUpdateLoading(false);
    }
  };

  // Handle appointment status change
  const handleAppointmentStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      setAppointmentStatusUpdating(prev => new Set(prev).add(appointmentId));
      
      let adminNotes = '';
      switch (newStatus) {
        case 'no-show':
          adminNotes = 'Client did not show up for appointment';
          break;
        case 'completed':
          adminNotes = 'Appointment completed';
          break;
        case 'cancelled':
          adminNotes = 'Appointment cancelled';
          break;
        case 'scheduled':
          adminNotes = 'Appointment rescheduled or status updated';
          break;
        default:
          adminNotes = `Status changed to ${newStatus}`;
      }
      
      const updatedAppointment = await updateAppointmentStatus(appointmentId, {
        status: newStatus,
        adminNotes
      });
      
      // Update local appointments state
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, status: updatedAppointment.status }
            : appointment
        )
      );
      
      // Show success toast
      showToast(t('status.statusUpdateSuccess'), 'success');
      
    } catch (error) {
      console.error('Error updating appointment status:', error);
      showToast(t('status.statusUpdateError'), 'error');
    } finally {
      setAppointmentStatusUpdating(prev => {
        const newSet = new Set(prev);
        newSet.delete(appointmentId);
        return newSet;
      });
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowRoleModal(false);
    setSelectedUser(null);
    setNewRole('');
    setSpecialization('');
    setPhone('');
  };

  // Medical Reports Modal handlers
  const handleOpenMedicalReportsModal = (user: UserDto) => {
    setSelectedUserForReports(user);
    setShowMedicalReportsModal(true);
  };

  const handleCloseMedicalReportsModal = () => {
    setShowMedicalReportsModal(false);
    setSelectedUserForReports(null);
  };

  // Download medical report as Word document
  const handleDownloadReport = async (report: any) => {
    try {
      await generateMedicalReportWord(report, t);
      showToast(t('medicalReport.downloadSuccess'), 'success');
    } catch (error) {
      console.error('Error downloading report:', error);
      showToast(t('medicalReport.downloadError'), 'error');
    }
  };

  // Download all medical reports for a user as a single Word document
  const handleDownloadAllReports = async (user: UserDto) => {
    if (!user.medicalReports || user.medicalReports.length === 0) return;
    
    try {
      // For now, we'll download each report separately
      // In a real application, you might want to combine them into one document
      for (let i = 0; i < user.medicalReports.length; i++) {
        const report = user.medicalReports[i];
        await generateMedicalReportWord(report, t);
        // Add small delay between downloads to prevent browser blocking
        if (i < user.medicalReports.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      showToast(t('medicalReport.downloadSuccess'), 'success');
    } catch (error) {
      console.error('Error downloading reports:', error);
      showToast(t('medicalReport.downloadError'), 'error');
    }
  };

  // Print medical report
  const handlePrintReport = (report: any) => {
    setSelectedReportForPrint(report);
    setShowPrintModal(true);
  };

  // Close print modal
  const handleClosePrintModal = () => {
    setShowPrintModal(false);
    setSelectedReportForPrint(null);
  };

  const renderOverview = () => {
    if (loading) {
      return (
        <div className="loading-container" style={{ textAlign: 'center', padding: '40px' }}>
          <LoadingSpinner size="large" />
          <p>{t('dashboard.loadingData')}</p>
        </div>
      );
    }

    if (error) {
      return <div className="error">Error: {error}</div>;
    }

    if (!dashboardData) {
      return <div className="no-data">No dashboard data available</div>;
    }

    return (
    <div className="overview-content">
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-info">
            <h3>{dashboardData.totalUsers}</h3>
            <p>{t('metrics.totalUsers')}</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">👤</div>
          <div className="metric-info">
            <h3>{dashboardData.clientUsers}</h3>
            <p>{t('metrics.clients')}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⭐</div>
          <div className="metric-info">
            <h3>{dashboardData.adminUsers}</h3>
            <p>{t('metrics.administrators')}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-info">
            <h3>{dashboardData.newUsersThisMonth}</h3>
            <p>{t('metrics.newThisMonth')}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📅</div>
          <div className="metric-info">
            <h3>{dashboardData.totalAppointments}</h3>
            <p>{t('metrics.totalAppointments')}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📍</div>
          <div className="metric-info">
            <h3>{dashboardData.todayAppointments}</h3>
            <p>{t('metrics.todaysAppointments')}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-info">
            <h3>{dashboardData.weeklyAppointments}</h3>
            <p>{t('metrics.thisWeek')}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-info">
            <h3>{dashboardData.appointmentsByStatus.completed}</h3>
            <p>{t('metrics.completed')}</p>
          </div>
        </div>
      </div>

      <div className="status-breakdown">
        <h3>{t('status.breakdown')}</h3>
        <div className="status-grid">
          <div className="status-item">
            <span className="status-badge status-scheduled">{t('status.scheduled')}</span>
            <span className="status-count">{dashboardData.appointmentsByStatus.scheduled}</span>
          </div>
          <div className="status-item">
            <span className="status-badge status-completed">{t('status.completed')}</span>
            <span className="status-count">{dashboardData.appointmentsByStatus.completed}</span>
          </div>
          <div className="status-item">
            <span className="status-badge status-cancelled">{t('status.cancelled')}</span>
            <span className="status-count">{dashboardData.appointmentsByStatus.cancelled}</span>
          </div>
          <div className="status-item">
            <span className="status-badge status-no-show">{t('status.noShow')}</span>
            <span className="status-count">{dashboardData.appointmentsByStatus.noShow}</span>
          </div>
        </div>
      </div>
    </div>
    );
  };

  const renderUsers = () => {
    if (usersLoading) {
      return (
        <div className="loading-container" style={{ textAlign: 'center', padding: '40px' }}>
          <LoadingSpinner size="medium" />
          <p>{t('users.loadingUsers')}</p>
        </div>
      );
    }

    return (
      <div className="users-content">
        <div className="content-header">
          <h3>{t('dashboard.users')}</h3>
          <div className="user-stats">
            <span>Total: {users.length}</span>
            <span>{t('users.active')}: {users.filter(u => u.isActive).length}</span>
            <span>{t('users.inactive')}: {users.filter(u => !u.isActive).length}</span>
          </div>
        </div>
        
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>{t('users.name')}</th>
                <th>{t('users.email')}</th>
                <th>{t('users.role')}</th>
                <th>{t('users.dateOfBirth')}</th>
                <th>{t('users.status')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr 
                  key={user.id}
                  className={user.role === 'Client' || user.role === 'Doctor' ? 'clickable-row' : 'non-clickable-row'}
                  onClick={() => handleUserClick(user)}
                  style={{
                    cursor: user.role === 'Client' || user.role === 'Doctor' ? 'pointer' : 'default',
                    opacity: user.role === 'Admin' ? 0.7 : 1
                  }}
                >
                  <td>{user.displayName}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role.toLowerCase()}`}>
                      {user.role === 'Client' ? t('users.client') : 
                       user.role === 'Admin' ? t('users.admin') : 
                       t('users.doctor')}
                    </span>
                  </td>
                  <td>{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <span className={`status-badge ${user.isActive ? 'status-active' : 'status-inactive'}`}>
                      {user.isActive ? t('users.active') : t('users.inactive')}
                    </span>
                  </td>
                  <td>
                    {user.role === 'Client' && user.medicalReports && user.medicalReports.length > 0 ? (
                      <button
                        className="view-reports-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenMedicalReportsModal(user);
                        }}
                        title={`${t('medicalReport.viewReports')} (${user.medicalReports.length})`}
                      >
                        {t('medicalReport.view')} ({user.medicalReports.length})
                      </button>
                    ) : (
                      <span className="no-reports">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderAppointments = () => {
    if (appointmentsLoading) {
      return (
        <div className="loading-container" style={{ textAlign: 'center', padding: '40px' }}>
          <LoadingSpinner size="medium" />
          <p>{t('appointments.loadingAppointments')}</p>
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
          <h3>{t('dashboard.appointments')}</h3>
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
                <th>{t('appointments.doctor')}</th>
                <th>{t('booking.reason')}</th>
                <th>{t('appointments.status')}</th>
                <th>{t('status.changeStatus')}</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(appointment => (
                <tr key={appointment.id}>
                  <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                  <td>{appointment.appointmentTime}</td>
                  <td>{appointment.clientName}</td>
                  <td>
                    {appointment.doctorName}
                    <br />
                    <small style={{ color: '#666' }}>{appointment.doctorSpecialization}</small>
                  </td>
                  <td>{appointment.reason}</td>
                  <td>
                    <span className={`status-badge status-${appointment.status}`}>
                      {getTranslatedStatus(appointment.status)}
                    </span>
                  </td>
                  <td>
                    <div className="status-change-container">
                      <select
                        value={appointment.status}
                        onChange={(e) => handleAppointmentStatusChange(appointment.id, e.target.value)}
                        disabled={appointmentStatusUpdating.has(appointment.id)}
                        className="status-select"
                        title={t('status.selectStatus')}
                      >
                        <option value="scheduled">{t('status.scheduled')}</option>
                        <option value="completed">{t('status.completed')}</option>
                        <option value="cancelled">{t('status.cancelled')}</option>
                        <option value="no-show">{t('status.noShow')}</option>
                      </select>
                      {appointmentStatusUpdating.has(appointment.id) && (
                        <LoadingSpinner size="small" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Role Change Modal Component
  const renderRoleModal = () => {
    if (!showRoleModal || !selectedUser) return null;

    return (
      <div className="modal-overlay" onClick={handleCloseModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{t('userManagement.changeRole')}</h3>
            <button className="modal-close" onClick={handleCloseModal}>
              ×
            </button>
          </div>
          
          <div className="modal-body">
            <div className="user-info">
              <p><strong>{t('userManagement.user')}:</strong> {selectedUser.displayName}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>{t('userManagement.currentRole')}:</strong> 
                <span className={`role-badge role-${selectedUser.role.toLowerCase()}`}>
                  {selectedUser.role === 'Client' ? t('users.client') : 
                   selectedUser.role === 'Admin' ? t('users.admin') : 
                   t('users.doctor')}
                </span>
              </p>
            </div>
            
            <div className="role-selection">
              <label htmlFor="role-select">{t('userManagement.newRole')}:</label>
              <select 
                id="role-select"
                value={newRole} 
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="">{t('userManagement.selectRole')}</option>
                {selectedUser.role !== 'Client' && (
                  <option value="Client">{t('users.client')}</option>
                )}
                {selectedUser.role !== 'Admin' && (
                  <option value="Admin">{t('users.admin')}</option>
                )}
                {selectedUser.role !== 'Doctor' && (
                  <option value="Doctor">{t('users.doctor')}</option>
                )}
              </select>
            </div>

            {/* Doctor-specific fields */}
            {newRole === 'Doctor' && (
              <div className="doctor-fields">
                <div className="form-group">
                  <label htmlFor="specialization">
                    {t('doctor.specialization')} <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="specialization"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder={t('doctor.specializationPlaceholder')}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">{t('doctor.phone')}</label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('doctor.phonePlaceholder')}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="modal-footer">
            <button className="btn-cancel" onClick={handleCloseModal}>
              {t('common.cancel')}
            </button>
            <button 
              className="btn-confirm btn-loading" 
              onClick={handleRoleChange}
              disabled={
                roleUpdateLoading ||
                !newRole || 
                newRole === selectedUser.role || 
                (newRole === 'Doctor' && !specialization.trim())
              }
            >
              {roleUpdateLoading ? (
                <>
                  <LoadingSpinner size="small" />
                  {t('common.loading')}
                </>
              ) : (
                t('userManagement.confirmChange')
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderReviews = () => {
    if (reviewsLoading) {
      return (
        <div className="loading-container" style={{ textAlign: 'center', padding: '40px' }}>
          <LoadingSpinner size="medium" />
          <p>{t('reviews.loadingReviews') || 'Loading reviews...'}</p>
        </div>
      );
    }

    return (
      <div className="reviews-content">
        <div className="content-header">
          <h3>All Reviews</h3>
          <div className="review-stats">
            <span>Total: {reviews.length}</span>
            <span>
              Average Rating: {
                reviews.length > 0
                  ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
                  : 'N/A'
              }
            </span>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="no-data">
            <p>No reviews found</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-rating">
                    <span className="rating-stars">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </span>
                    <span className="rating-number">({review.rating}/5)</span>
                  </div>
                </div>
                
                <div className="review-content">
                  {review.comment && <p className="review-comment">{review.comment}</p>}
                </div>
                
                <div className="review-footer">
                  <div className="review-people">
                    <div className="client-info">
                      <strong>Client:</strong> {review.clientName}
                    </div>
                    <div className="doctor-info">
                      <strong>Doctor:</strong> {review.doctorName}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>{t('dashboard.title')}</h1>
        <div className="header-right">
          <LanguageSwitcher />
          <button className="logout-btn-admin" onClick={onLogout}>
            {t('dashboard.logout')}
          </button>
        </div>
      </div>

      <div className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 {t('dashboard.overview')}
        </button>
        <button 
          className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 {t('dashboard.users')}
        </button>
        <button 
          className={`nav-btn ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          📅 {t('dashboard.appointments')}
        </button>
        <button 
          className={`nav-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          ⭐ Reviews
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'appointments' && renderAppointments()}
        {activeTab === 'reviews' && renderReviews()}
      </div>

      {/* Role Change Modal */}
      {renderRoleModal()}

      {/* Medical Reports Modal */}
      {showMedicalReportsModal && selectedUserForReports && (
        <div className="modal-overlay" onClick={handleCloseMedicalReportsModal}>
          <div className="modal-content medical-reports-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t('medicalReport.viewReports')} - {selectedUserForReports.displayName}</h3>
              <button 
                className="modal-close" 
                onClick={handleCloseMedicalReportsModal}
                aria-label={t('common.close')}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {selectedUserForReports.medicalReports && selectedUserForReports.medicalReports.length > 0 ? (
                <div className="medical-reports-list">
                  {selectedUserForReports.medicalReports.map((report, index) => (
                    <div key={index} className="medical-report-item">
                      <div className="medical-report-header">
                        <h4>{t('medicalReport.title')} #{index + 1}</h4>
                        <span className="report-date">
                          {t('medicalReport.createdAt')}: {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="medical-report-content">
                        <div className="report-section">
                          <h5>{t('medicalReport.medicalHistory')}</h5>
                          <p>{report.antecedente || t('medicalReport.noData')}</p>
                        </div>
                        <div className="report-section">
                          <h5>{t('medicalReport.symptoms')}</h5>
                          <p>{report.simptome || t('medicalReport.noData')}</p>
                        </div>
                        <div className="report-section">
                          <h5>{t('medicalReport.clinicalExam')}</h5>
                          <p>{report.clinice || t('medicalReport.noData')}</p>
                        </div>
                        <div className="report-section">
                          <h5>{t('medicalReport.paraclinicalExam')}</h5>
                          <p>{report.paraclinice || t('medicalReport.noData')}</p>
                        </div>
                        <div className="report-section">
                          <h5>{t('medicalReport.diagnosis')}</h5>
                          <p>{report.diagnostic || t('medicalReport.noData')}</p>
                        </div>
                        <div className="report-section">
                          <h5>{t('medicalReport.recommendations')}</h5>
                          <p>{report.recomandari || t('medicalReport.noData')}</p>
                        </div>
                      </div>
                      <div className="medical-report-actions">
                        <button
                          className="btn-download"
                          onClick={() => handleDownloadReport(report)}
                          title={t('medicalReport.download')}
                        >
                          📄 {t('medicalReport.download')}
                        </button>
                        <button
                          className="btn-print"
                          onClick={() => handlePrintReport(report)}
                          title={t('medicalReport.print')}
                        >
                          🖨️ {t('medicalReport.print')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-reports">{t('medicalReport.noReports')}</p>
              )}
            </div>
            <div className="modal-footer">
              {selectedUserForReports.medicalReports && selectedUserForReports.medicalReports.length > 1 && (
                <button 
                  type="button" 
                  className="btn-download-all" 
                  onClick={() => handleDownloadAllReports(selectedUserForReports)}
                >
                  📄 {t('medicalReport.download')} ({selectedUserForReports.medicalReports.length})
                </button>
              )}
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={handleCloseMedicalReportsModal}
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Modal */}
      {showPrintModal && selectedReportForPrint && (
        <div className="modal-overlay" onClick={handleClosePrintModal}>
          <div className="modal-content print-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t('medicalReport.print')} - {selectedReportForPrint.patientName}</h3>
              <button 
                className="modal-close" 
                onClick={handleClosePrintModal}
                aria-label={t('common.close')}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="print-preview">
                <p>{t('medicalReport.title')} #{(selectedUserForReports?.medicalReports && selectedReportForPrint ? selectedUserForReports.medicalReports.indexOf(selectedReportForPrint) + 1 : 1)}</p>
                <p><strong>{t('appointments.patient')}:</strong> {selectedReportForPrint?.patientName}</p>
                <p><strong>{t('appointments.date')}:</strong> {selectedReportForPrint ? new Date(selectedReportForPrint.appointmentDate).toLocaleDateString() : ''}</p>
                <p><strong>{t('appointments.doctor')}:</strong> {selectedReportForPrint?.doctorName}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={handleClosePrintModal}
              >
                {t('common.cancel')}
              </button>
              <button 
                type="button" 
                className="btn-print-action" 
                onClick={handleClosePrintModal}
              >
                🖨️ {t('medicalReport.print')}
              </button>
            </div>
          </div>
        </div>
      )}

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

export default AdminDashboard;
