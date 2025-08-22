import React, { FC, useState } from 'react';
import LoginForm from './components/LoginForm';
import ClientCreateForm from './components/ClientCreateForm';
import AdminDashboard from './components/AdminDashboard';
import ClientDashboard from './components/ClientDashboard';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import LanguageSwitcher from './components/LanguageSwitcher';
import { User } from './types/dto';
import TokenStorage from './utils/tokenStorage';
import './App.css';

type ViewType = 'login' | 'register' | 'dashboard';

const AppContent: FC = () => {
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState<ViewType>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (email: string, role: string) => {
    // Create user object based on API response
    const user: User = {
      id: Date.now().toString(), // Temporary ID until proper user data comes from API
      userName: email,
      email: email,
      firstName: 'User', // These would come from API in real implementation
      lastName: 'User',
      displayName: 'User',
      role: role as "Admin" | "Client",
      createdAt: new Date().toISOString(),
      isActive: true
    };
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleRegistrationSuccess = () => {
    setCurrentView('login');
  };

  const handleLogout = () => {
    TokenStorage.clearToken(); // Clear the authentication token
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
        if (currentUser.role === 'Admin') {
          return <AdminDashboard onLogout={handleLogout} />;
        } else {
          return <ClientDashboard onLogout={handleLogout} currentUser={currentUser} />;
        }
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