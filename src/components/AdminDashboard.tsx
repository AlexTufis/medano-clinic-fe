import React, { useState, useEffect } from 'react';
import { AdminDashboardDto, UserDto, AppointmentResponseDto, UpdateUserRoleDto } from '../types/dto';
import { getAdminDashboardStats, getAllUsers, getAllAppointments, updateUserRole } from '../api/admin';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import Toast from './Toast';
import './AdminDashboard.css';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { t } = useLanguage();
  const [dashboardData, setDashboardData] = useState<AdminDashboardDto | null>(null);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [appointments, setAppointments] = useState<AppointmentResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [appointmentsLoading, setAppointmentsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'appointments'>('overview');
  
  // Modal state for user role management
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [newRole, setNewRole] = useState<string>('');
  const [specialization, setSpecialization] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  
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

  const renderOverview = () => {
    if (loading) {
      return <div className="loading">Loading dashboard data...</div>;
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
      return <div className="loading">Loading users data...</div>;
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
      return <div className="loading">Loading appointments data...</div>;
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
              className="btn-confirm" 
              onClick={handleRoleChange}
              disabled={
                !newRole || 
                newRole === selectedUser.role || 
                (newRole === 'Doctor' && !specialization.trim())
              }
            >
              {t('userManagement.confirmChange')}
            </button>
          </div>
        </div>
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
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'appointments' && renderAppointments()}
      </div>

      {/* Role Change Modal */}
      {renderRoleModal()}

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
