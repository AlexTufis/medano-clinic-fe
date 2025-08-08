import React, { FC, useState, FormEvent } from 'react';
import { login } from '../api/auth';
import { LoginDto } from '../types/dto';

interface Props {
  onLogin: () => void;
}

const LoginForm: FC<Props> = ({ onLogin }) => {
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
      onLogin();
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Welcome Back</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          placeholder="Enter your password"
        />
      </div>
      <button type="submit">Sign In</button>
    </form>
  );
};

export default LoginForm;