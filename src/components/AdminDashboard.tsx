import React, { useState, useEffect } from 'react';
import { AdminDashboardDto, UserDto, AppointmentResponseDto } from '../types/dto';
import { getAdminDashboardStats, getAllUsers, getAllAppointments } from '../api/admin';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
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
                <tr key={user.id}>
                  <td>{user.displayName}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role.toLowerCase()}`}>
                      {user.role === 'Client' ? t('users.client') : t('users.admin')}
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
            <span>Total: {appointments.length}</span>
            <span>Scheduled: {appointmentsByStatus.scheduled.length}</span>
            <span>Completed: {appointmentsByStatus.completed.length}</span>
            <span>Cancelled: {appointmentsByStatus.cancelled.length}</span>
            <span>No-show: {appointmentsByStatus['no-show'].length}</span>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="appointments-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Client</th>
                <th>Doctor</th>
                <th>Reason</th>
                <th>Status</th>
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
                      {appointment.status}
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
    </div>
  );
};

export default AdminDashboard;
