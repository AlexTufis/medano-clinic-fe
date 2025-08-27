import React, { FC, useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import ClientCreateForm from './components/ClientCreateForm';
import AdminDashboard from './components/AdminDashboard';
import ClientDashboard from './components/ClientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import SessionTimer from './components/SessionTimer';
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
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  // Check for existing valid token on app startup
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        const tokenData = TokenStorage.getTokenData();
        
        if (tokenData && TokenStorage.isTokenValid()) {
          // Create user object from stored token data
          const user: User = {
            id: Date.now().toString(), // Temporary ID until proper user data comes from API
            userName: tokenData.email,
            email: tokenData.email,
            firstName: 'User', // These would come from API in real implementation
            lastName: 'User',
            displayName: 'User',
            role: tokenData.role as "Admin" | "Client" | "Doctor",
            createdAt: new Date().toISOString(),
            isActive: true
          };
          
          setCurrentUser(user);
          setCurrentView('dashboard');
          
          console.log('Auto-login successful with stored token');
        }
      } catch (error) {
        console.error('Error checking existing auth:', error);
        TokenStorage.clearToken();
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkExistingAuth();
  }, []);

  // Set up token expiration timer and auth event listener
  useEffect(() => {
    if (!currentUser) return;

    const checkTokenExpiration = () => {
      if (!TokenStorage.isTokenValid()) {
        handleLogout();
        alert('Your session has expired. Please log in again.');
      }
    };

    const handleAuthExpired = () => {
      handleLogout();
      alert('Your session has expired. Please log in again.');
    };

    // Extend session on user activity
    const handleUserActivity = () => {
      if (TokenStorage.isTokenValid()) {
        // Only extend if more than half the time has passed
        const remaining = TokenStorage.getRemainingTime();
        const halfTime = 3 * 60 * 1000 / 2; // Half of 3 minutes
        
        if (remaining < halfTime) {
          TokenStorage.extendToken(3); // Extend by 3 minutes
          console.log('Session extended due to user activity');
        }
      }
    };

    // Check token validity every 30 seconds
    const interval = setInterval(checkTokenExpiration, 30000);
    
    // Listen for auth expired events from API calls
    window.addEventListener('auth-expired', handleAuthExpired);
    
    // Listen for user activity to extend session
    const activities = ['mousedown', 'keydown', 'scroll', 'click'];
    activities.forEach(activity => {
      document.addEventListener(activity, handleUserActivity, { passive: true });
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener('auth-expired', handleAuthExpired);
      activities.forEach(activity => {
        document.removeEventListener(activity, handleUserActivity);
      });
    };
  }, [currentUser]);

  // Show loading while checking authentication
  if (isLoadingAuth) {
    return (
      <div className="app">
        <div className="auth-container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleLogin = (email: string, role: string) => {
    // Create user object based on API response
    const user: User = {
      id: Date.now().toString(), // Temporary ID until proper user data comes from API
      userName: email,
      email: email,
      firstName: 'User', // These would come from API in real implementation
      lastName: 'User',
      displayName: 'User',
      role: role as "Admin" | "Client" | "Doctor",
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
    console.log('User logged out');
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
        } else if (currentUser.role === 'Doctor') {
          return <DoctorDashboard onLogout={handleLogout} currentUser={currentUser} />;
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
      {currentUser && (
        <SessionTimer 
          onSessionExpired={handleLogout}
          warningThresholdMinutes={1}
        />
      )}
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