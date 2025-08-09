import React, { useState, useEffect } from 'react';
import { User, Doctor, Appointment, DashboardMetrics } from '../types/dto';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import './AdminDashboard.css';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors] = useState<Doctor[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    totalClients: 0,
    totalAdmins: 0,
    newUsersThisMonth: 0,
    totalAppointments: 0,
    appointmentsToday: 0,
    appointmentsThisWeek: 0,
    appointmentsByStatus: {
      scheduled: 0,
      completed: 0,
      cancelled: 0,
      noShow: 0
    }
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'appointments'>('overview');

  // Dummy data
  const dummyUsers: User[] = [
    {
      id: '1',
      userName: 'john_doe',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe',
      dateOfBirth: '1985-03-15',
      gender: 0,
      role: 'client',
      createdAt: '2024-01-15T10:30:00Z',
      isActive: true
    },
    {
      id: '2',
      userName: 'jane_smith',
      email: 'jane@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      displayName: 'Jane Smith',
      dateOfBirth: '1990-07-22',
      gender: 1,
      role: 'client',
      createdAt: '2024-02-10T14:20:00Z',
      isActive: true
    },
    {
      id: '3',
      userName: 'admin_mike',
      email: 'mike@medanoclinic.com',
      firstName: 'Mike',
      lastName: 'Johnson',
      displayName: 'Mike Johnson',
      dateOfBirth: '1982-11-05',
      gender: 0,
      role: 'admin',
      createdAt: '2023-12-01T09:00:00Z',
      isActive: true
    },
    {
      id: '4',
      userName: 'sarah_wilson',
      email: 'sarah@example.com',
      firstName: 'Sarah',
      lastName: 'Wilson',
      displayName: 'Sarah Wilson',
      dateOfBirth: '1988-05-12',
      gender: 1,
      role: 'client',
      createdAt: '2024-08-01T16:45:00Z',
      isActive: true
    },
    {
      id: '5',
      userName: 'bob_brown',
      email: 'bob@example.com',
      firstName: 'Bob',
      lastName: 'Brown',
      displayName: 'Bob Brown',
      dateOfBirth: '1975-09-30',
      gender: 0,
      role: 'client',
      createdAt: '2024-07-20T11:15:00Z',
      isActive: false
    }
  ];

  const dummyDoctors: Doctor[] = [
    {
      id: 'doc1',
      firstName: 'Dr. Emily',
      lastName: 'Rodriguez',
      specialization: 'Cardiology',
      email: 'emily.rodriguez@medanoclinic.com',
      phone: '+1-555-0101'
    },
    {
      id: 'doc2',
      firstName: 'Dr. Michael',
      lastName: 'Chen',
      specialization: 'Dermatology',
      email: 'michael.chen@medanoclinic.com',
      phone: '+1-555-0102'
    },
    {
      id: 'doc3',
      firstName: 'Dr. Lisa',
      lastName: 'Thompson',
      specialization: 'General Practice',
      email: 'lisa.thompson@medanoclinic.com',
      phone: '+1-555-0103'
    }
  ];

  const dummyAppointments: Appointment[] = [
    {
      id: 'app1',
      clientId: '1',
      clientName: 'John Doe',
      doctorId: 'doc1',
      doctorName: 'Dr. Emily Rodriguez',
      doctorSpecialization: 'Cardiology',
      appointmentDate: '2025-08-09',
      appointmentTime: '10:00',
      status: 'scheduled',
      reason: 'Regular checkup',
      createdAt: '2025-08-05T14:30:00Z'
    },
    {
      id: 'app2',
      clientId: '2',
      clientName: 'Jane Smith',
      doctorId: 'doc2',
      doctorName: 'Dr. Michael Chen',
      doctorSpecialization: 'Dermatology',
      appointmentDate: '2025-08-09',
      appointmentTime: '14:30',
      status: 'scheduled',
      reason: 'Skin consultation',
      createdAt: '2025-08-06T09:15:00Z'
    },
    {
      id: 'app3',
      clientId: '4',
      clientName: 'Sarah Wilson',
      doctorId: 'doc3',
      doctorName: 'Dr. Lisa Thompson',
      doctorSpecialization: 'General Practice',
      appointmentDate: '2025-08-08',
      appointmentTime: '09:00',
      status: 'completed',
      reason: 'Annual physical',
      notes: 'All tests normal',
      createdAt: '2025-08-01T16:45:00Z'
    },
    {
      id: 'app4',
      clientId: '1',
      clientName: 'John Doe',
      doctorId: 'doc1',
      doctorName: 'Dr. Emily Rodriguez',
      doctorSpecialization: 'Cardiology',
      appointmentDate: '2025-08-07',
      appointmentTime: '11:30',
      status: 'cancelled',
      reason: 'Heart palpitations',
      notes: 'Cancelled by patient',
      createdAt: '2025-08-02T10:20:00Z'
    },
    {
      id: 'app5',
      clientId: '5',
      clientName: 'Bob Brown',
      doctorId: 'doc2',
      doctorName: 'Dr. Michael Chen',
      doctorSpecialization: 'Dermatology',
      appointmentDate: '2025-08-06',
      appointmentTime: '15:00',
      status: 'no-show',
      reason: 'Mole examination',
      createdAt: '2025-08-01T12:00:00Z'
    },
    {
      id: 'app6',
      clientId: '2',
      clientName: 'Jane Smith',
      doctorId: 'doc3',
      doctorName: 'Dr. Lisa Thompson',
      doctorSpecialization: 'General Practice',
      appointmentDate: '2025-08-12',
      appointmentTime: '16:00',
      status: 'scheduled',
      reason: 'Follow-up consultation',
      createdAt: '2025-08-08T11:30:00Z'
    }
  ];

  useEffect(() => {
    // Load dummy data
    setUsers(dummyUsers);
    setAppointments(dummyAppointments);

    // Calculate metrics
    const totalUsers = dummyUsers.length;
    const totalClients = dummyUsers.filter(user => user.role === 'client').length;
    const totalAdmins = dummyUsers.filter(user => user.role === 'admin').length;
    
    // Users created this month (August 2025)
    const newUsersThisMonth = dummyUsers.filter(user => 
      new Date(user.createdAt).getMonth() === 7 && 
      new Date(user.createdAt).getFullYear() === 2025
    ).length;

    const totalAppointments = dummyAppointments.length;
    
    // Appointments today (2025-08-09)
    const appointmentsToday = dummyAppointments.filter(apt => 
      apt.appointmentDate === '2025-08-09'
    ).length;

    // Appointments this week (rough calculation)
    const appointmentsThisWeek = dummyAppointments.filter(apt => {
      const aptDate = new Date(apt.appointmentDate);
      const today = new Date('2025-08-09');
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      return aptDate >= weekStart && aptDate <= weekEnd;
    }).length;

    const appointmentsByStatus = {
      scheduled: dummyAppointments.filter(apt => apt.status === 'scheduled').length,
      completed: dummyAppointments.filter(apt => apt.status === 'completed').length,
      cancelled: dummyAppointments.filter(apt => apt.status === 'cancelled').length,
      noShow: dummyAppointments.filter(apt => apt.status === 'no-show').length
    };

    setMetrics({
      totalUsers,
      totalClients,
      totalAdmins,
      newUsersThisMonth,
      totalAppointments,
      appointmentsToday,
      appointmentsThisWeek,
      appointmentsByStatus
    });
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'status-scheduled';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      case 'no-show':
        return 'status-no-show';
      default:
        return '';
    }
  };

  const renderOverview = () => (
    <div className="overview-content">
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-info">
            <h3>{metrics.totalUsers}</h3>
            <p>{t('metrics.totalUsers')}</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">👤</div>
          <div className="metric-info">
            <h3>{metrics.totalClients}</h3>
            <p>{t('metrics.clients')}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⭐</div>
          <div className="metric-info">
            <h3>{metrics.totalAdmins}</h3>
            <p>{t('metrics.administrators')}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-info">
            <h3>{metrics.newUsersThisMonth}</h3>
            <p>{t('metrics.newThisMonth')}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📅</div>
          <div className="metric-info">
            <h3>{metrics.totalAppointments}</h3>
            <p>{t('metrics.totalAppointments')}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📍</div>
          <div className="metric-info">
            <h3>{metrics.appointmentsToday}</h3>
            <p>{t('metrics.todaysAppointments')}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-info">
            <h3>{metrics.appointmentsThisWeek}</h3>
            <p>{t('metrics.thisWeek')}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-info">
            <h3>{metrics.appointmentsByStatus.completed}</h3>
            <p>{t('metrics.completed')}</p>
          </div>
        </div>
      </div>

      <div className="status-breakdown">
        <h3>{t('status.breakdown')}</h3>
        <div className="status-grid">
          <div className="status-item">
            <span className="status-badge status-scheduled">{t('status.scheduled')}</span>
            <span className="status-count">{metrics.appointmentsByStatus.scheduled}</span>
          </div>
          <div className="status-item">
            <span className="status-badge status-completed">{t('status.completed')}</span>
            <span className="status-count">{metrics.appointmentsByStatus.completed}</span>
          </div>
          <div className="status-item">
            <span className="status-badge status-cancelled">{t('status.cancelled')}</span>
            <span className="status-count">{metrics.appointmentsByStatus.cancelled}</span>
          </div>
          <div className="status-item">
            <span className="status-badge status-no-show">{t('status.noShow')}</span>
            <span className="status-count">{metrics.appointmentsByStatus.noShow}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
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
              <th>{t('users.createdAt')}</th>
              <th>{t('users.status')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.displayName}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role}`}>
                    {user.role === 'client' ? t('users.client') : t('users.admin')}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
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

  const renderAppointments = () => (
    <div className="appointments-content">
      <div className="content-header">
        <h3>{t('dashboard.appointments')}</h3>
        <div className="appointment-stats">
          <span>Total: {appointments.length}</span>
          <span>{t('metrics.todaysAppointments')}: {metrics.appointmentsToday}</span>
          <span>{t('metrics.thisWeek')}: {metrics.appointmentsThisWeek}</span>
        </div>
      </div>
      
      <div className="appointments-table">
        <table>
          <thead>
            <tr>
              <th>{t('appointments.patient')}</th>
              <th>{t('appointments.doctor')}</th>
              <th>{t('appointments.date')} & {t('appointments.time')}</th>
              <th>{t('appointments.notes')}</th>
              <th>{t('appointments.status')}</th>
              <th>{t('users.createdAt')}</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
              <tr key={appointment.id}>
                <td>{appointment.clientName}</td>
                <td>
                  <div className="doctor-info">
                    <div>{appointment.doctorName}</div>
                    <small>{appointment.doctorSpecialization}</small>
                  </div>
                </td>
                <td>
                  <div className="datetime-info">
                    <div>{formatDate(appointment.appointmentDate)}</div>
                    <small>{appointment.appointmentTime}</small>
                  </div>
                </td>
                <td>{appointment.reason}</td>
                <td>
                  <span className={`status-badge ${getStatusBadgeClass(appointment.status)}`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </td>
                <td>{formatDateTime(appointment.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

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
