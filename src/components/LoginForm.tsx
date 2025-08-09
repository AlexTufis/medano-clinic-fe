import React, { FC, useState, FormEvent } from 'react';
import { login } from '../api/auth';
import { LoginDto } from '../types/dto';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  onLogin: (email: string) => void;
}

const LoginForm: FC<Props> = ({ onLogin }) => {
  const { t } = useLanguage();
  const [form, setForm] = useState<LoginDto>({ email: '', password: '' });
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await login(form);
      onLogin(form.email);
    } catch {
      setError('Invalid credentials');
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
        />
      </div>
      <button type="submit">{t('auth.login')}</button>
    </form>
  );
};

export default LoginForm;