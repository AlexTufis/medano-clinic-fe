import React, { FC, useState, FormEvent } from 'react';
import { login } from '../api/auth';
import { LoginRequestDto } from '../types/dto';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  onLogin: (email: string, role: string) => void;
}

const LoginForm: FC<Props> = ({ onLogin }) => {
  const { t } = useLanguage();
  const [form, setForm] = useState<LoginRequestDto>({ email: '', password: '' });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setError('');
      const response = await login(form);
      console.log('Login response:', response); // Debug log
      console.log('Calling onLogin with:', form.email, response.role); // Debug log
      onLogin(form.email, response.role);
    } catch (error) {
      console.error('Login error:', error); // Debug log
      setError('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{t('auth.welcomeBack')}</h2>
      {error && <p style={{ color: 'red' }}>{t('auth.invalidCredentials')}</p>}
      <div>
        <label htmlFor="email">{t('auth.email')}</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder={t('auth.email')}
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="password">{t('auth.password')}</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          placeholder={t('auth.password')}
          disabled={isLoading}
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? t('auth.loggingIn') : t('auth.login')}
      </button>
    </form>
  );
};

export default LoginForm;