import React, { FC, useState } from 'react';
import LoginForm from './components/LoginForm';
import ClientCreateForm from './components/ClientCreateForm';
import './App.css';

type ViewType = 'login' | 'register' | 'admin';

const App: FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('login');

  const handleLogin = () => {
    setCurrentView('admin');
  };

  const handleRegistrationSuccess = () => {
    setCurrentView('login');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return (
          <div className="auth-container">
            <LoginForm onLogin={handleLogin} />
            <div className="auth-switch">
              <p>Don't have an account?</p>
              <button 
                className="switch-btn"
                onClick={() => setCurrentView('register')}
              >
                Create Account
              </button>
            </div>
          </div>
        );
      case 'register':
        return (
          <div className="auth-container">
            <ClientCreateForm onSuccess={handleRegistrationSuccess} />
            <div className="auth-switch">
              <p>Already have an account?</p>
              <button 
                className="switch-btn"
                onClick={() => setCurrentView('login')}
              >
                Login
              </button>
            </div>
          </div>
        );
      case 'admin':
        return (
          <div className="admin-container">
            <div className="admin-header">
              <h1>Admin Dashboard</h1>
              <button 
                className="logout-btn"
                onClick={() => setCurrentView('login')}
              >
                Logout
              </button>
            </div>
            <div style={{ padding: '30px' }}>
              <h2>Welcome to the Admin Panel</h2>
              <p>You are now logged in as an administrator.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      {renderCurrentView()}
    </div>
  );
};

export default App;