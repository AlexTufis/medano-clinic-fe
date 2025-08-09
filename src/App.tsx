import React, { FC, useState } from 'react';
import LoginForm from './components/LoginForm';
import ClientCreateForm from './components/ClientCreateForm';
import AdminDashboard from './components/AdminDashboard';
import ClientDashboard from './components/ClientDashboard';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import LanguageSwitcher from './components/LanguageSwitcher';
import { User } from './types/dto';
import './App.css';

type ViewType = 'login' | 'register' | 'dashboard';

const AppContent: FC = () => {
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState<ViewType>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Dummy users for testing role-based access
  const dummyUsers: User[] = [
    {
      id: '1',
      userName: 'admin@clinic.ro',
      email: 'admin@clinic.ro',
      firstName: 'Admin',
      lastName: 'User',
      displayName: 'Administrator',
      role: 'admin',
      createdAt: '2025-01-01T00:00:00Z',
      isActive: true
    },
    {
      id: '2',
      userName: 'client@clinic.ro',
      email: 'client@clinic.ro',
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe',
      role: 'client',
      createdAt: '2025-01-01T00:00:00Z',
      isActive: true
    }
  ];

  const handleLogin = (email: string) => {
    // In a real app, this would come from the login API response
    const user = dummyUsers.find(u => u.email === email) || dummyUsers[1]; // Default to client
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleRegistrationSuccess = () => {
    setCurrentView('login');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return (
          <div className="auth-container">
            <div className="auth-header">
              <LanguageSwitcher />
            </div>
            <LoginForm onLogin={handleLogin} />
            <div className="auth-switch">
              <p>{t('auth.dontHaveAccount')}</p>
              <button 
                className="switch-btn"
                onClick={() => setCurrentView('register')}
              >
                {t('auth.createAccount')}
              </button>
            </div>
          </div>
        );
      case 'register':
        return (
          <div className="auth-container">
            <div className="auth-header">
              <LanguageSwitcher />
            </div>
            <ClientCreateForm onSuccess={handleRegistrationSuccess} />
            <div className="auth-switch">
              <p>{t('auth.alreadyHaveAccount')}</p>
              <button 
                className="switch-btn"
                onClick={() => setCurrentView('login')}
              >
                {t('auth.login')}
              </button>
            </div>
          </div>
        );
      case 'dashboard':
        if (!currentUser) return null;
        
        // Role-based dashboard rendering
        if (currentUser.role === 'admin') {
          return <AdminDashboard onLogout={handleLogout} />;
        } else if (currentUser.role === 'client') {
          return <ClientDashboard onLogout={handleLogout} currentUser={currentUser} />;
        }
        
        return null;
      default:
        return null;
    }
  };

  return (
    <div className={currentView === 'dashboard' ? 'app-fullscreen' : 'app'}>
      {renderCurrentView()}
    </div>
  );
};

const App: FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;